#!/usr/bin/env python3
"""
cc_miner — mineur de Cerveau Cible depuis YouTube (transcriptions + commentaires).

Reconstruction du logiciel décrit par l'utilisateur : on part d'une REQUÊTE SEO que
la cible taperait elle-même, on récupère les vidéos, leurs transcriptions et leurs
commentaires, et on en extrait la matière du Cerveau Cible.

Le cœur n'est pas la collecte (yt-dlp fait ça) — c'est le TRI 1A / 1B.

    Phase 1A = ce que le prospect dit AUX AUTRES.  Public, conscient, formulé.
               -> ads MOYENNES (le prospect répond "oui je sais").
    Phase 1B = ce qu'il pense SEUL à 23h.          Privé, jamais formulé.
               -> ads WINNERS (le prospect répond "comment il sait ça sur moi").

Le scoring 1B applique littéralement FRAMEWORK_ADS.md ligne 49 :
    « dans les verbatims les plus émotionnels, les plus longs, ceux où la personne
      craque et dit ce qu'elle pense vraiment. Avis 1 étoile. Posts de forums
      nocturnes. La phrase qui fait physiquement MAL quand on la lit. »

et il est calibré par stats-terrain.md §7 :
    « les trois signés avaient tous un verbatim long et chargé au formulaire.
      Aucun lead à verbatim court n'a signé. »
    -> la LONGUEUR est un prédicteur validé sur le terrain, pas une intuition.

Aucune clé API. yt-dlp uniquement.

Usage :
    python3 cc_miner.py "pourquoi je n'arrive plus à acheter des voitures" \
        --videos 8 --comments 300 --out ./cc-negociant
    python3 cc_miner.py --queries-file requetes.txt --out ./cc-negociant
"""

from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
import unicodedata
from collections import Counter
from dataclasses import dataclass, field, asdict
from pathlib import Path

# --------------------------------------------------------------------------
# 1. LEXIQUES DE SCORING
# --------------------------------------------------------------------------
# Chaque lexique est tracé à une règle du framework. On ne met pas un marqueur
# parce qu'il "sonne émotionnel" : on le met parce qu'une règle le demande.

# --- 1B POSITIF : l'aveu. « il ne le dirait pas sans gêne à un confrère ».
#     (LOIS_COPY.md §2, test de l'aveu)
AVEU = [
    "j'ose pas", "j ose pas", "jose pas", "j'avoue", "j avoue",
    "j'ai honte", "j ai honte", "la honte", "honteux", "honteuse",
    "je l'ai jamais dit", "jamais dit a personne", "personne ne sait",
    "personne le sait", "je le dis a personne", "j'ai jamais osé",
    "je m'en veux", "je m en veux", "je culpabilise", "coupable",
    "j'arrive pas a l'avouer", "au fond de moi", "tout au fond",
    "je me sens", "j'ai l'impression d'etre", "j'ai limpression detre",
    "je fais semblant", "je fais bonne figure", "personne voit",
    "en apparence", "de l'exterieur", "de lexterieur",
]

# --- 1B POSITIF : la solitude nocturne. « ce qu'il pense SEUL à 23h ».
#     (FRAMEWORK_ADS.md ligne 42 + ligne 49 « posts de forums nocturnes »)
NUIT_SOLITUDE = [
    "la nuit", "le soir", "3h du matin", "4h du matin", "5h du matin",
    "2h du mat", "3h du mat", "j'arrive pas a dormir", "j arrive pas a dormir",
    "je dors plus", "insomnie", "je me reveille", "reveille a",
    "tout seul", "toute seule", "seul dans", "seule dans", "solitude",
    "quand je suis seul", "quand je suis seule", "personne a qui",
    "je rumine", "je repense", "ca tourne dans ma tete", "dans ma tete",
]

# --- 1B POSITIF : l'état SUBI (nommer) par opposition à l'action (décrire).
#     (LOIS_COPY.md §2 — test du planning)
ETAT_SUBI = [
    "j'y arrive plus", "j y arrive plus", "je n'y arrive plus",
    "j'en peux plus", "j en peux plus", "je tiens plus", "je supporte plus",
    "je sais plus", "je comprends plus", "je me reconnais plus",
    "j'ai perdu", "je suis coince", "je suis coincee", "coince",
    "je subis", "je suis oblige", "je suis obligee", "obligé",
    "malgre moi", "sans m'en rendre compte", "sans men rendre compte",
    "je peux pas m'empecher", "je peux pas m empecher",
    "c'est plus fort que moi", "c est plus fort que moi",
    "j'ai beau", "meme si je", "a chaque fois que",
    "je fais que", "je passe mon temps a", "je finis toujours par",
]

# --- 1B POSITIF : la douleur brute nommée.
DOULEUR = [
    "ca me bouffe", "ca me ronge", "ca me detruit", "ca me tue",
    "j'ai mal", "ca fait mal", "epuise", "epuisee", "vide", "a bout",
    "au bout du rouleau", "craque", "j'ai craque", "j ai craque",
    "depression", "deprime", "angoisse", "peur", "terrifie",
    "desespere", "perdu", "perdue", "noye", "noyee", "etouffe",
]

# --- 1B NÉGATIF : le conseil. Quelqu'un qui conseille ne se confesse pas.
#     (FRAMEWORK_ADS.md — « Tu ne CONSEILLES jamais »)
CONSEIL = [
    "tu dois", "vous devez", "il faut que tu", "il faut que vous",
    "je te conseille", "je vous conseille", "mon conseil",
    "essaie de", "essayez de", "tu devrais", "vous devriez",
    "la solution c'est", "la cle c'est", "le secret c'est",
    "voici comment", "voila comment", "il suffit de", "y'a qu'a", "yaka",
    "regarde ma", "abonne toi", "abonnez vous", "lien en bio",
    "je propose", "contactez moi", "dm moi", "mp moi",
]

# --- 1B NÉGATIF : le déclaratif public / jargon (Phase 1A pure).
DECLARATIF = [
    "merci pour cette video", "merci beaucoup", "super video", "excellente video",
    "tres interessant", "tres bonne video", "bravo", "top video", "genial",
    "premier", "first", "qui est la en", "like si",
]

# Marqueurs de première personne — la confession parle de SOI.
JE = [" je ", " j'", " moi ", " mon ", " ma ", " mes ", " me ", " m'"]
TU_IMPERATIF = [" tu ", " vous ", " ton ", " votre "]


def strip_accents(s: str) -> str:
    return "".join(c for c in unicodedata.normalize("NFD", s)
                   if unicodedata.category(c) != "Mn")


def norm(s: str) -> str:
    """Normalise pour le matching de lexique : minuscules, sans accents, espacé."""
    s = strip_accents(s.lower())
    s = re.sub(r"[^\w'\s]", " ", s)
    s = re.sub(r"\s+", " ", s)
    return f" {s.strip()} "


_RE_CACHE: dict[str, re.Pattern] = {}


def _marker_re(marker: str) -> re.Pattern:
    """
    Marqueur compilé avec frontières de mots.

    BUG CORRIGÉ (vu en inspectant une vraie sortie) : le matching en simple
    sous-chaîne produisait des signaux FANTÔMES — « vide » matchait dans
    « évidemment », « peur » dans « peureux », « craque » dans « craquelé ».
    Un verbatim se retrouvait crédité de deux marqueurs de douleur absents,
    ce qui gonfle le score et fait passer le GATE à tort.

    Les frontières \\b tiennent compte de l'apostrophe : « j'ose pas » est
    encadré correctement une fois les accents retirés.
    """
    if marker not in _RE_CACHE:
        # On échappe CHAQUE MOT séparément puis on les rejoint par \s+.
        # Piège : re.escape() échappe l'espace (« a b » -> « a\ b »), donc
        # remplacer les espaces après coup laisse un backslash parasite et le
        # motif ne matche plus jamais. Constaté : tous les marqueurs composés
        # (« je m'en veux », « j'y arrive plus ») étaient morts silencieusement.
        mots = strip_accents(marker.lower()).split()
        corps = r"\s+".join(re.escape(w) for w in mots)
        _RE_CACHE[marker] = re.compile(rf"(?<![\w']){corps}(?![\w'])")
    return _RE_CACHE[marker]


def count_hits(text_n: str, lexicon: list[str]) -> tuple[int, list[str]]:
    hits = [m for m in lexicon if _marker_re(m).search(text_n)]
    return len(hits), hits


# --------------------------------------------------------------------------
# 2. LE SCORE 1B
# --------------------------------------------------------------------------

@dataclass
class Verbatim:
    text: str
    source: str                 # "comment" | "transcript"
    video_id: str
    video_title: str
    author: str = ""
    likes: int = 0
    url: str = ""
    score_1b: float = 0.0
    phase: str = "1A"           # "1B" | "1A" | "bruit"
    signals: dict = field(default_factory=dict)
    why: list[str] = field(default_factory=list)


# --- Intention commerciale : « je veux ta formation », « c'est combien ».
#     C'est un signal d'ACHAT, pas un dialogue intérieur. Fréquent sous les
#     vidéos business, et c'est ce qui polluait le tri à la v1.
COMMERCIAL = [
    "ta formation", "votre formation", "je suis pret a payer",
    "je suis prête à payer", "c'est combien", "quel est le prix", "le tarif",
    "comment vous contacter", "votre numero", "mon numero", "whatsapp",
    "je recherche des fonds", "recherche de fonds", "un financement",
    "un investisseur", "aidez moi a demarrer", "je veux me lancer",
    "je suis interesse", "je suis interessee", "des renseignements",
]

# Poids. RÉVISION v2 après test réel : à la v1, la longueur dominait au point
# qu'un commentaire de 66 mots à la première personne franchissait le seuil
# SANS aucun marqueur d'aveu — on récoltait des demandes de financement et des
# réponses du créateur. La longueur redevient ce qu'elle est : un AMPLIFICATEUR
# d'un signal existant, jamais une preuve à elle seule.
W_LONGUEUR = 1.2        # était 3.0
W_AVEU = 3.5
W_ETAT_SUBI = 3.0
W_NUIT = 2.5
W_DOULEUR = 2.0
W_JE = 1.0
W_CONSEIL = -5.0
W_DECLARATIF = -4.0
W_COMMERCIAL = -5.0
W_QUESTION = -2.5
W_TU = -1.0

SEUIL_1B = 6.0
SEUIL_BRUIT = 1.0


def score_verbatim(v: Verbatim) -> Verbatim:
    t = v.text.strip()
    n = norm(t)
    words = len(t.split())

    # --- Longueur : palier, plafonné. stats-terrain §7 valide la longueur comme
    # prédicteur, mais SUR DES VERBATIMS DE FORMULAIRE — des gens qui répondent
    # déjà à une question intime. Sur YouTube, long veut souvent dire bavard.
    if words < 8:
        s_len = -2.0
    elif words < 20:
        s_len = 0.0
    elif words < 45:
        s_len = 1.0
    elif words < 90:
        s_len = 1.5
    else:
        s_len = 2.0

    n_aveu, h_aveu = count_hits(n, AVEU)
    n_subi, h_subi = count_hits(n, ETAT_SUBI)
    n_nuit, h_nuit = count_hits(n, NUIT_SOLITUDE)
    n_doul, h_doul = count_hits(n, DOULEUR)
    n_cons, h_cons = count_hits(n, CONSEIL)
    n_decl, h_decl = count_hits(n, DECLARATIF)
    n_comm, h_comm = count_hits(n, COMMERCIAL)

    # Une question interroge, elle ne se confesse pas.
    n_quest = t.count("?")

    n_je = sum(n.count(m) for m in JE)
    n_tu = sum(n.count(m) for m in TU_IMPERATIF)
    ratio_je = n_je / max(n_je + n_tu, 1)

    # === LE GATE (correctif central de la v2) ===================================
    # FRAMEWORK_ADS.md l.49 : la Phase 1B, c'est « la phrase qui fait physiquement
    # MAL ». Une telle phrase laisse toujours une trace lexicale : un aveu, un
    # état subi, une solitude, une douleur nommée. Sans AUCUNE de ces traces, le
    # commentaire peut être long, personnel et sincère — il reste du déclaratif.
    # Donc : pas de preuve lexicale, pas de 1B. La longueur n'achète pas l'aveu.
    preuve_confession = n_aveu + n_subi + n_nuit + n_doul
    gate_ok = preuve_confession >= 1
    # ==========================================================================

    score = (
        W_LONGUEUR * s_len
        + W_AVEU * min(n_aveu, 3)
        + W_ETAT_SUBI * min(n_subi, 3)
        + W_NUIT * min(n_nuit, 2)
        + W_DOULEUR * min(n_doul, 3)
        + W_JE * (ratio_je * 2.0)
        + W_CONSEIL * min(n_cons, 2)
        + W_DECLARATIF * min(n_decl, 2)
        + W_COMMERCIAL * min(n_comm, 2)
        + W_QUESTION * min(n_quest, 2)
        + W_TU * (1.0 - ratio_je) * 2.0
    )

    v.signals = {
        "mots": words, "score_longueur": s_len,
        "aveu": n_aveu, "etat_subi": n_subi, "nuit_solitude": n_nuit,
        "douleur": n_doul, "conseil": n_cons, "declaratif": n_decl,
        "commercial": n_comm, "questions": n_quest,
        "ratio_je": round(ratio_je, 2),
        "preuve_confession": preuve_confession, "gate_ok": gate_ok,
    }
    v.why = (
        [f"aveu: {x}" for x in h_aveu[:3]]
        + [f"état subi: {x}" for x in h_subi[:3]]
        + [f"nocturne: {x}" for x in h_nuit[:2]]
        + [f"douleur: {x}" for x in h_doul[:2]]
        + [f"⚠ conseil: {x}" for x in h_cons[:2]]
        + [f"⚠ commercial: {x}" for x in h_comm[:2]]
    )
    v.score_1b = round(score, 2)
    if gate_ok and score >= SEUIL_1B:
        v.phase = "1B"
    elif score >= SEUIL_BRUIT:
        v.phase = "1A"
    else:
        v.phase = "bruit"
    return v


# --------------------------------------------------------------------------
# 3. COLLECTE (yt-dlp, sans clé API)
# --------------------------------------------------------------------------

def run(cmd: list[str], timeout: int = 300) -> subprocess.CompletedProcess:
    return subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)


def check_deps() -> None:
    """
    Vérifie l'outillage AVANT de miner.

    Piège coûteux rencontré au premier test : sans runtime JS, yt-dlp extrait
    les métadonnées normalement mais renvoie **0 commentaire, sans erreur**.
    On croit que la niche est muette alors que c'est l'outil qui est aveugle.
    D'où ce garde-fou explicite.
    """
    import shutil
    if not shutil.which("yt-dlp"):
        sys.exit("✖ yt-dlp introuvable.  pip install yt-dlp")
    if not any(shutil.which(r) for r in ("deno", "node", "bun", "qjs")):
        sys.exit(
            "✖ Aucun runtime JavaScript trouvé — yt-dlp renverra 0 commentaire "
            "SANS lever d'erreur.\n"
            "  Installer :  curl -fsSL https://deno.land/install.sh | "
            "DENO_INSTALL=/usr/local sh -s -- -y"
        )


def search_videos(query: str, n: int) -> list[dict]:
    """Recherche YouTube via yt-dlp. Retourne des métadonnées, sans télécharger."""
    cmd = ["yt-dlp", f"ytsearch{n}:{query}", "--flat-playlist",
           "--dump-json", "--no-warnings", "--ignore-errors"]
    p = run(cmd)
    out = []
    for line in p.stdout.splitlines():
        line = line.strip()
        if not line:
            continue
        try:
            d = json.loads(line)
        except json.JSONDecodeError:
            continue
        vid = d.get("id")
        if not vid:
            continue
        out.append({
            "id": vid,
            "title": d.get("title") or "",
            "channel": d.get("channel") or d.get("uploader") or "",
            "duration": d.get("duration"),
            "view_count": d.get("view_count"),
            "url": f"https://www.youtube.com/watch?v={vid}",
            "query": query,
        })
    if p.returncode != 0 and not out:
        print(f"  ⚠ recherche échouée pour « {query} » : {p.stderr.strip()[:200]}",
              file=sys.stderr)
    return out


def fetch_transcript(video_id: str, langs=("fr", "fr-FR", "en")) -> str:
    """Transcription via youtube-transcript-api (rapide, pas de download)."""
    try:
        from youtube_transcript_api import YouTubeTranscriptApi
    except ImportError:
        return ""
    try:
        api = YouTubeTranscriptApi()
        # API récente : .fetch() ; ancienne : .get_transcript()
        if hasattr(api, "fetch"):
            tr = api.fetch(video_id, languages=list(langs))
            chunks = [getattr(s, "text", "") or (s.get("text", "") if isinstance(s, dict) else "")
                      for s in tr]
        else:
            tr = YouTubeTranscriptApi.get_transcript(video_id, languages=list(langs))
            chunks = [s.get("text", "") for s in tr]
        return " ".join(c for c in chunks if c).strip()
    except Exception:
        return ""


COOKIES: str | None = None       # rempli par --cookies / --cookies-from-browser


def fetch_comments(video_id: str, max_comments: int, sort: str = "top",
                   tries: int = 3) -> list[dict]:
    """
    Commentaires via yt-dlp, sans clé API.

    sort='top' privilégie les plus likés — ceux où la niche se reconnaît
    collectivement, donc un signal de verbatim partagé.

    ⚠ LIMITE RÉELLE (constatée en test) : depuis une IP datacenter, YouTube
    répond « Sign in to confirm you're not a bot » après une rafale de
    requêtes. L'échec est INTERMITTENT — la même vidéo passe puis échoue.
    Symptôme trompeur : yt-dlp sort `null`, donc 0 commentaire SANS erreur
    visible si on ne lit pas stderr. D'où le retry + le compte-rendu explicite.
    Remède durable : passer des cookies (--cookies / --cookies-from-browser),
    ou lancer depuis une IP résidentielle.
    """
    url = f"https://www.youtube.com/watch?v={video_id}"
    base = ["yt-dlp", url, "--skip-download", "--write-comments",
            "--extractor-args",
            f"youtube:comment_sort={sort};max_comments={max_comments},all,{max_comments},10",
            "--dump-single-json", "--ignore-errors",
            "--sleep-requests", "1", "--retries", "3"]
    if COOKIES:
        base += (["--cookies-from-browser", COOKIES[8:]]
                 if COOKIES.startswith("browser:") else ["--cookies", COOKIES])

    for attempt in range(1, tries + 1):
        try:
            p = run(base, timeout=420)
        except subprocess.TimeoutExpired:
            print(f"      ⚠ timeout ({attempt}/{tries})", file=sys.stderr)
            continue
        err = p.stderr or ""
        if "not a bot" in err or "Sign in to confirm" in err:
            wait = 20 * attempt
            print(f"      ⚠ YouTube demande une authentification "
                  f"(anti-bot) — pause {wait}s puis retry {attempt}/{tries}",
                  file=sys.stderr)
            if attempt < tries:
                import time
                time.sleep(wait)
            continue
        if p.stdout.strip():
            break
    else:
        return []

    if not p.stdout.strip():
        return []
    try:
        d = json.loads(p.stdout)
    except json.JSONDecodeError:
        return []
    # yt-dlp peut renvoyer littéralement "null" (vidéo indisponible, commentaires
    # désactivés, extraction partielle) : json.loads réussit et rend None.
    if not isinstance(d, dict):
        return []
    return d.get("comments") or []


# --------------------------------------------------------------------------
# 4. EXTRACTION DE PHRASES DEPUIS UNE TRANSCRIPTION
# --------------------------------------------------------------------------

def split_sentences(text: str) -> list[str]:
    text = re.sub(r"\s+", " ", text)
    parts = re.split(r"(?<=[.!?…])\s+|\s+(?=(?:et |mais |parce que |donc )\b)", text)
    return [p.strip() for p in parts if p and len(p.split()) >= 6]


def transcript_windows(text: str, win: int = 45, step: int = 30) -> list[str]:
    """
    Une transcription auto n'a pas de ponctuation fiable : on découpe en fenêtres
    glissantes de mots plutôt qu'en phrases, pour ne pas casser un aveu en deux.
    """
    w = text.split()
    if len(w) < win:
        return [text] if w else []
    return [" ".join(w[i:i + win]) for i in range(0, len(w) - win + 1, step)]


# --------------------------------------------------------------------------
# 5. PIPELINE
# --------------------------------------------------------------------------

def mine(queries: list[str], n_videos: int, n_comments: int,
         with_transcripts: bool, outdir: Path) -> dict:
    outdir.mkdir(parents=True, exist_ok=True)
    seen_videos: dict[str, dict] = {}
    seen_texts: set[str] = set()

    print(f"▸ {len(queries)} requête(s), {n_videos} vidéos/requête\n")
    for q in queries:
        print(f"  🔎 « {q} »")
        for v in search_videos(q, n_videos):
            seen_videos.setdefault(v["id"], v)
    print(f"\n▸ {len(seen_videos)} vidéos uniques\n")

    verbatims: list[Verbatim] = []
    for i, (vid, meta) in enumerate(seen_videos.items(), 1):
        title = meta["title"][:70]
        print(f"  [{i}/{len(seen_videos)}] {title}")

        comments = fetch_comments(vid, n_comments)
        n_skip_auteur = n_skip_dup = 0
        for c in comments:
            txt = (c.get("text") or "").strip()
            if not txt:
                continue

            # Le créateur qui répond sous sa propre vidéo donne des CONSEILS.
            # Vu au premier test : « Bonjour @yazz8986, la Suisse est un marché
            # profitable mais... » classé 1B. C'est du contenu de coach, l'exact
            # opposé d'un dialogue intérieur.
            if c.get("author_is_uploader"):
                n_skip_auteur += 1
                continue

            # Dédoublonnage : YouTube renvoie parfois deux fois le même
            # commentaire (id différent, texte identique) — vu au premier test
            # où 1B-01 et 1B-02 étaient le même homme.
            key = re.sub(r"\s+", " ", strip_accents(txt.lower())).strip()[:400]
            if key in seen_texts:
                n_skip_dup += 1
                continue
            seen_texts.add(key)

            verbatims.append(score_verbatim(Verbatim(
                text=txt, source="comment", video_id=vid,
                video_title=meta["title"], author=c.get("author") or "",
                likes=int(c.get("like_count") or 0),
                url=f"{meta['url']}&lc={c.get('id','')}",
            )))
        extra = []
        if n_skip_auteur:
            extra.append(f"−{n_skip_auteur} créateur")
        if n_skip_dup:
            extra.append(f"−{n_skip_dup} doublon")
        print(f"      💬 {len(comments)} commentaires"
              + (f"  ({', '.join(extra)})" if extra else ""))

        if with_transcripts:
            tr = fetch_transcript(vid)
            if tr:
                print(f"      📝 transcription {len(tr.split())} mots")
                for chunk in transcript_windows(tr):
                    verbatims.append(score_verbatim(Verbatim(
                        text=chunk, source="transcript", video_id=vid,
                        video_title=meta["title"], url=meta["url"],
                    )))
            else:
                print("      📝 pas de transcription")

    verbatims.sort(key=lambda v: v.score_1b, reverse=True)
    return {"videos": list(seen_videos.values()), "verbatims": verbatims}


# --------------------------------------------------------------------------
# 6. SORTIE
# --------------------------------------------------------------------------

def lexique_cible(verbatims: list[Verbatim], top: int = 40) -> list[tuple[str, int]]:
    """
    Phase 7 du CC : « 10+ mots dans le langage exact du prospect ».
    On ne garde que les mots des verbatims 1B/1A (pas du bruit) et on retire
    les mots-outils.
    """
    STOP = set("""le la les un une des du de a à au aux et ou mais donc or ni car
    je tu il elle on nous vous ils elles me te se lui leur y en ce cet cette ces
    mon ton son ma ta sa mes tes ses notre votre leurs qui que quoi dont où
    est sont etait etaient ete suis es sommes etes ont as ai avons avez avait
    pas ne plus tres trop bien tout tous toute toutes meme aussi comme pour par
    sur dans avec sans sous entre vers chez si quand alors apres avant depuis
    fait faire fais dit dire va vais aller peut peux pouvoir veux veut vouloir
    c'est cest j'ai jai il y a cela ça ca celui celle ceux
    the you and that for with this have not are but was your""".split())
    cnt: Counter[str] = Counter()
    for v in verbatims:
        if v.phase == "bruit":
            continue
        for w in re.findall(r"[a-zàâäéèêëîïôöùûüç']{4,}", v.text.lower()):
            w = w.strip("'")
            if w and w not in STOP:
                cnt[w] += 1
    return cnt.most_common(top)


def write_outputs(res: dict, outdir: Path, queries: list[str]) -> None:
    vs: list[Verbatim] = res["verbatims"]
    b1 = [v for v in vs if v.phase == "1B"]
    a1 = [v for v in vs if v.phase == "1A"]

    (outdir / "raw.json").write_text(json.dumps({
        "queries": queries,
        "videos": res["videos"],
        "verbatims": [asdict(v) for v in vs],
    }, ensure_ascii=False, indent=2), encoding="utf-8")

    L = []
    L.append("# Cerveau Cible — matière brute minée sur YouTube\n")
    L.append("> Généré par `cc_miner.py`. **Rien ici n'est une ad.** C'est du matériau.")
    L.append("> Chaque verbatim garde sa source : un verbatim non sourçable ne s'écrit pas.\n")
    L.append("## Requêtes\n")
    for q in queries:
        L.append(f"- « {q} »")
    L.append(f"\n## Récolte\n")
    L.append(f"- Vidéos : **{len(res['videos'])}**")
    L.append(f"- Verbatims retenus : **{len(vs)}**")
    L.append(f"- **Phase 1B (candidats winners) : {len(b1)}**")
    L.append(f"- Phase 1A (descriptif) : {len(a1)}")
    L.append(f"- Bruit écarté : {len(vs) - len(b1) - len(a1)}\n")

    seuil = "✅ SEUIL ATTEINT" if len(b1) >= 3 else "⛔ SEUIL NON ATTEINT"
    L.append(f"### Pré-requis framework : ≥ 3 dialogues intérieurs Phase 1B — {seuil}\n")
    if len(b1) < 3:
        L.append("> RÈGLE ABSOLUE (FRAMEWORK_ADS.md l.60) : sans 3 Phase 1B, "
                 "on n'écrit pas. Élargir les requêtes ou viser des vidéos plus "
                 "confessionnelles (témoignages, « j'ai arrêté », « mon échec »).\n")

    L.append("---\n\n## PHASE 1B — le dialogue intérieur (source des winners)\n")
    L.append("*Ce qu'il pense SEUL. À utiliser en HOOK.*\n")
    for i, v in enumerate(b1[:40], 1):
        L.append(f"### 1B-{i:02d} · score {v.score_1b} · {v.signals['mots']} mots"
                 f" · 👍 {v.likes}")
        L.append(f"> {v.text.strip()}\n")
        L.append(f"- **Signaux** : {', '.join(v.why) if v.why else '—'}")
        L.append(f"- **Source** : [{v.video_title[:60]}]({v.url})\n")

    L.append("---\n\n## PHASE 1A — le déclaratif (source des ads moyennes)\n")
    L.append("*Ce qu'il dit AUX AUTRES. Utile pour la SCÈNE, jamais pour le hook.*\n")
    for i, v in enumerate(a1[:25], 1):
        L.append(f"**1A-{i:02d}** (score {v.score_1b}) — {v.text.strip()[:280]}")
        L.append(f"  ↳ [source]({v.url})\n")

    L.append("---\n\n## PHASE 7 — le langage exact du prospect\n")
    L.append("*Les mots qu'il emploie. À réutiliser tels quels ; ne jamais traduire "
             "en langage de marque.*\n")
    lex = lexique_cible(vs)
    L.append("| mot | occurrences |\n|---|---|")
    for w, c in lex:
        L.append(f"| {w} | {c} |")

    L.append("\n---\n\n## Ce qui reste à faire à la main\n")
    L.append("Le mineur produit la Phase 1A, la 1B et la 7. **Il ne produit pas** "
             "les Phases 2 (niveaux de douleur), 3 (croyance erronée), 4 (échecs "
             "passés), 5 (désirs), 8 (identité menacée) — celles-là demandent une "
             "lecture humaine des verbatims ci-dessus.\n")
    L.append("Rappel [B2] : l'exercice de compréhension des croyances se fait "
             "**sans IA**, sur papier. Le mineur fournit la matière, pas la "
             "compréhension.\n")

    (outdir / "CERVEAU_CIBLE_BRUT.md").write_text("\n".join(L), encoding="utf-8")
    print(f"\n✅ {outdir/'CERVEAU_CIBLE_BRUT.md'}")
    print(f"✅ {outdir/'raw.json'}")
    print(f"\n   Phase 1B : {len(b1)}   Phase 1A : {len(a1)}   bruit : "
          f"{len(vs)-len(b1)-len(a1)}")


def main() -> int:
    ap = argparse.ArgumentParser(
        description="Mine YouTube (transcriptions + commentaires) pour un Cerveau Cible.")
    ap.add_argument("queries", nargs="*", help="Requêtes SEO que la CIBLE taperait.")
    ap.add_argument("--queries-file", type=Path, help="Fichier, une requête par ligne.")
    ap.add_argument("--videos", type=int, default=6, help="Vidéos par requête (défaut 6).")
    ap.add_argument("--comments", type=int, default=200, help="Commentaires max/vidéo.")
    ap.add_argument("--no-transcripts", action="store_true",
                    help="Commentaires seulement (plus rapide, et souvent plus riche en 1B).")
    ap.add_argument("--out", type=Path, default=Path("./cc-mine"))
    ap.add_argument("--cookies", type=str, default=None,
                    help="Chemin d'un cookies.txt, ou 'browser:chrome' / "
                         "'browser:firefox'. Indispensable si YouTube répond "
                         "« Sign in to confirm you're not a bot ».")
    a = ap.parse_args()

    global COOKIES
    COOKIES = a.cookies

    queries = list(a.queries)
    if a.queries_file and a.queries_file.exists():
        queries += [l.strip() for l in a.queries_file.read_text(encoding="utf-8").splitlines()
                    if l.strip() and not l.startswith("#")]
    if not queries:
        ap.error("aucune requête. Passe-les en argument ou via --queries-file.")

    check_deps()
    res = mine(queries, a.videos, a.comments, not a.no_transcripts, a.out)
    write_outputs(res, a.out, queries)
    return 0


if __name__ == "__main__":
    sys.exit(main())
