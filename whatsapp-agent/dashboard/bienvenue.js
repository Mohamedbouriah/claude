// Mise en route : six volets, enregistrement au fil de l'eau, aperçu vivant à droite.
(() => {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const esc = (v) => String(v ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  const etat = {
    volet: 0,
    token: localStorage.getItem("token") || "",
    reglages: null,
    medias: [],
    miseEnRoute: { etapes: [], faites: 0, total: 6 },
    verdicts: {},
  };

  async function api(chemin, options = {}) {
    const entetes = { "content-type": "application/json", ...(options.headers || {}) };
    if (etat.token) entetes["x-token"] = etat.token;
    const rep = await fetch(`/api${chemin}`, { ...options, headers: entetes });
    if (rep.status === 401) {
      const t = prompt("Token du dashboard :");
      if (t) { etat.token = t; localStorage.setItem("token", t); return api(chemin, options); }
      throw new Error("Non autorisé");
    }
    const d = await rep.json().catch(() => ({}));
    if (!rep.ok) throw new Error(d.erreur || `HTTP ${rep.status}`);
    return d;
  }

  function toast(message, type = "") {
    const n = document.createElement("div");
    n.className = `toast ${type}`;
    n.textContent = message;
    $("#toasts").append(n);
    setTimeout(() => n.remove(), 3800);
  }

  let minuteurSauvegarde;
  function enregistrer(partiel, immediat = false) {
    Object.assign(etat.reglages, partiel, {
      business: { ...etat.reglages.business, ...(partiel.business || {}) },
      voix: { ...etat.reglages.voix, ...(partiel.voix || {}) },
      wa: { ...etat.reglages.wa, ...(partiel.wa || {}) },
    });
    rendreApercu();
    clearTimeout(minuteurSauvegarde);
    const envoyer = async () => {
      const d = await api("/reglages", { method: "PUT", body: JSON.stringify(etat.reglages) });
      etat.miseEnRoute = d.miseEnRoute;
      rendreRail();
    };
    if (immediat) return envoyer();
    minuteurSauvegarde = setTimeout(() => envoyer().catch((e) => toast(e.message, "err")), 500);
  }

  /* ---------------- volets ---------------- */

  const VOLETS = [
    {
      cle: "cle_ia", titre: "Le cerveau", oeil: "Étape 1",
      chapo: "L'agent tourne sur Claude. Il lui faut une clé API — c'est la seule chose qui se règle en dehors de cette page.",
      html: () => `
        <p class="chapo">Ouvre le fichier <code class="mono">.env</code> à la racine du projet et colle ta clé sur la ligne <code class="mono">ANTHROPIC_API_KEY=</code>, puis relance le serveur. Tu récupères une clé sur <span class="mono">console.anthropic.com</span>.</p>
        <div class="barre-actions" style="border:0;padding-top:18px;margin-top:14px">
          <button class="secondaire" data-verifier="ia">Vérifier la connexion</button>
        </div>
        <div id="verdict-ia"></div>`,
    },
    {
      cle: "offre", titre: "Ton offre", oeil: "Étape 2",
      chapo: "Tout ce que l'agent a le droit de dire vient d'ici. Ce qui n'y figure pas, il a interdiction de l'inventer — prix compris.",
      html: (r) => `
        <label class="champ"><span>Le nom que tu donnes à ton activité</span>
          <input type="text" id="f-nom" value="${esc(r.business.nom)}" placeholder="Ex : Méthode Reset">
        </label>
        <label class="champ"><span>Ton offre, en clair
          <span class="indice">À qui elle s'adresse, ce qu'elle change, les preuves que tu peux citer, et pour qui elle n'est pas. Plus c'est précis, moins l'agent brode.</span></span>
          <textarea id="f-offre" rows="9" placeholder="Ex : J'accompagne des coachs sportifs qui font entre 10 et 30 k€/mois…">${esc(r.business.offre)}</textarea>
        </label>
        <label class="champ"><span>Lien de réservation
          <span class="indice">Calendly, Cal.com, TidyCal… C'est ce lien que l'agent enverra une fois le diagnostic fait.</span></span>
          <input type="url" id="f-rdv" value="${esc(r.business.lienRdv)}" placeholder="https://cal.com/…">
        </label>`,
    },
    {
      cle: "voix", titre: "La voix de l'agent", oeil: "Étape 3",
      chapo: "Ces réglages se traduisent en consignes dans son prompt. L'aperçu à droite change en direct.",
      html: (r) => `
        <label class="champ"><span>Son prénom</span>
          <input type="text" id="f-prenom" value="${esc(r.business.prenomAgent)}" placeholder="Léa">
        </label>
        <div class="champ"><span>Comment il s'adresse aux gens</span>
          <div class="choix" style="margin:0">
            <button class="option" data-adresse="tu" aria-pressed="${r.voix.adresse === "tu"}"><span class="coche"></span><span><b>Il tutoie</b><span>Il s'aligne quand même sur la personne si elle vouvoie.</span></span></button>
            <button class="option" data-adresse="vous" aria-pressed="${r.voix.adresse === "vous"}"><span class="coche"></span><span><b>Il vouvoie</b><span>Systématiquement, quel que soit le ton du prospect.</span></span></button>
          </div>
        </div>
        <div class="curseur">
          <div class="curseur-tete"><span>Comment il pousse vers l'appel</span></div>
          <input type="range" id="f-insistance" min="0" max="3" step="1" value="${r.voix.insistance}">
          <div class="curseur-bornes"><span>il laisse venir</span><span>il embraye</span></div>
          <p class="effet" id="effet-insistance"></p>
        </div>
        <div class="curseur">
          <div class="curseur-tete"><span>Longueur de ses messages</span></div>
          <input type="range" id="f-longueur" min="0" max="2" step="1" value="${r.voix.longueur}">
          <div class="curseur-bornes"><span>une ligne</span><span>trois lignes</span></div>
          <p class="effet" id="effet-longueur"></p>
        </div>
        <p class="chapo" style="font-size:13px">Le reste de sa personnalité — sa trame de conversation, ses réponses aux objections — se règle dans <code class="mono">server/agent/persona.md</code>. C'est du texte, tu peux l'éditer directement.</p>`,
    },
    {
      cle: "medias", titre: "Tes vidéos", oeil: "Étape 4",
      chapo: "L'agent envoie un média quand la preuve vaut mieux qu'un paragraphe. Le champ « quand » est le plus important : c'est lui qui décide du moment.",
      html: () => `<div class="medias" id="liste-medias"></div>
        <button class="secondaire" id="ajouter-media">+ Ajouter un média</button>`,
    },
    {
      cle: "whatsapp", titre: "Brancher WhatsApp", oeil: "Étape 5",
      chapo: "Trois chemins. Commence par le simulateur si tu veux voir l'agent tourner avant de le mettre face à de vrais prospects.",
      html: (r) => {
        const choix = r.canal === "cloudapi" ? (r.wa.token ? "cloudapi" : "coexistence") : "mock";
        return `
        <div class="choix">
          <button class="option" data-canal="mock" aria-pressed="${choix === "mock"}">
            <span class="coche"></span><span><b>Je teste d'abord<span class="recommande">conseillé</span></b>
            <span>Le simulateur : tu joues le prospect depuis la console. Aucun message ne part sur WhatsApp.</span></span>
          </button>
          <button class="option" data-canal="coexistence" aria-pressed="${choix === "coexistence"}">
            <span class="coche"></span><span><b>Mon numéro est déjà sur WhatsApp Business</b>
            <span>Le mode Coexistence de Meta : ton numéro reste utilisable sur ton téléphone, et l'agent répond en parallèle.</span></span>
          </button>
          <button class="option" data-canal="cloudapi" aria-pressed="${choix === "cloudapi"}">
            <span class="coche"></span><span><b>J'ai déjà mes identifiants Cloud API</b>
            <span>Tu as créé ton app Meta et récupéré un token permanent.</span></span>
          </button>
        </div>
        <div id="detail-canal"></div>`;
      },
    },
    {
      cle: "test", titre: "Parle à ton agent", oeil: "Étape 6",
      chapo: "Écris-lui comme le ferait un de tes prospects. Sa réponse arrive dans le téléphone à droite — c'est exactement ce que verra la vraie personne.",
      html: () => `
        <label class="champ"><span>Ton message, en tant que prospect</span>
          <input type="text" id="f-test" value="Salut, j'ai vu ta pub, ça marche comment ?" placeholder="Écris comme un prospect">
        </label>
        <div class="barre-actions" style="border:0;padding-top:0;margin-top:4px">
          <button class="primaire" id="lancer-test">Envoyer à l'agent</button>
          <a href="/" class="secondaire" style="text-decoration:none;display:inline-block">Ouvrir la console</a>
        </div>
        <div id="verdict-test"></div>`,
    },
  ];

  const TEXTES_INSISTANCE = [
    "Il pose une question, il laisse venir, il ne parle de l'appel que si la personne l'évoque.",
    "Il prend le temps du diagnostic avant de proposer un créneau.",
    "Dès qu'il a compris la situation, il propose l'appel sans tourner autour.",
    "Il va vite au diagnostic et enchaîne sur deux créneaux.",
  ];
  const TEXTES_LONGUEUR = [
    "Une ligne par message. Très proche du rythme d'un vrai DM.",
    "Une à deux lignes. Le réglage le plus naturel à l'écrit.",
    "Deux à trois lignes quand il a quelque chose à expliquer.",
  ];

  /* ---------------- rendu ---------------- */

  function rendreRail() {
    const parEtape = Object.fromEntries(etat.miseEnRoute.etapes.map((e) => [e.cle, e]));
    $("#etapes").innerHTML = VOLETS.map((v, i) => {
      const e = parEtape[v.cle] || {};
      return `<li><button class="etape ${e.fait ? "fait" : ""}" data-volet="${i}" aria-current="${i === etat.volet}">
        <span class="rond">${e.fait ? "✓" : i + 1}</span>
        <span class="etape-txt"><span class="etape-titre">${v.titre}</span><span class="etape-aide">${esc(e.aide || "")}</span></span>
      </button></li>`;
    }).join("");
    const pct = Math.round((etat.miseEnRoute.faites / etat.miseEnRoute.total) * 100);
    $("#barre-remplie").style.width = pct + "%";
    $("#progres").textContent = `${etat.miseEnRoute.faites} sur ${etat.miseEnRoute.total}`;
  }

  function rendreVolet() {
    const v = VOLETS[etat.volet];
    const r = etat.reglages;
    $("#volet").innerHTML = `
      <div class="entete">
        <span class="oeil">${v.oeil}</span>
        <h2>${v.titre}</h2>
        <p class="chapo">${v.chapo}</p>
      </div>
      ${v.html(r)}
      <div class="barre-actions">
        ${etat.volet > 0 ? '<button class="secondaire" data-nav="-1">Retour</button>' : ""}
        ${etat.volet < VOLETS.length - 1
          ? '<button class="primaire" data-nav="1">Continuer</button>'
          : '<a href="/" class="primaire" style="text-decoration:none;display:inline-block">Terminer et ouvrir la console</a>'}
        <button class="fantome pousse" data-nav="1">Je fais ça plus tard</button>
      </div>`;
    brancherVolet();
    rendreRail();
  }

  function brancherVolet() {
    const cle = VOLETS[etat.volet].cle;
    const r = etat.reglages;

    if (cle === "offre") {
      $("#f-nom").oninput = (e) => enregistrer({ business: { nom: e.target.value } });
      $("#f-offre").oninput = (e) => enregistrer({ business: { offre: e.target.value } });
      $("#f-rdv").oninput = (e) => enregistrer({ business: { lienRdv: e.target.value } });
    }

    if (cle === "voix") {
      $("#f-prenom").oninput = (e) => enregistrer({ business: { prenomAgent: e.target.value } });
      document.querySelectorAll("[data-adresse]").forEach((b) => b.onclick = () => {
        document.querySelectorAll("[data-adresse]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        enregistrer({ voix: { adresse: b.dataset.adresse } });
      });
      const maj = () => {
        $("#effet-insistance").textContent = TEXTES_INSISTANCE[r.voix.insistance];
        $("#effet-longueur").textContent = TEXTES_LONGUEUR[r.voix.longueur];
      };
      $("#f-insistance").oninput = (e) => { enregistrer({ voix: { insistance: Number(e.target.value) } }); maj(); };
      $("#f-longueur").oninput = (e) => { enregistrer({ voix: { longueur: Number(e.target.value) } }); maj(); };
      maj();
    }

    if (cle === "medias") {
      rendreMedias();
      $("#ajouter-media").onclick = () => {
        etat.medias.push({ cle: "", type: "video", url: "", legende: "", description: "", quand: "" });
        rendreMedias();
      };
    }

    if (cle === "whatsapp") {
      document.querySelectorAll("[data-canal]").forEach((b) => b.onclick = () => {
        document.querySelectorAll("[data-canal]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        enregistrer({ canal: b.dataset.canal === "mock" ? "mock" : "cloudapi" });
        rendreDetailCanal(b.dataset.canal);
      });
      rendreDetailCanal(r.canal === "cloudapi" ? (r.wa.token ? "cloudapi" : "coexistence") : "mock");
    }

    if (cle === "test") $("#lancer-test").onclick = lancerTest;

    document.querySelectorAll("[data-verifier]").forEach((b) => b.onclick = () => verifier(b.dataset.verifier));
    document.querySelectorAll("[data-nav]").forEach((b) => b.onclick = () => {
      etat.volet = Math.max(0, Math.min(VOLETS.length - 1, etat.volet + Number(b.dataset.nav)));
      rendreVolet();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function rendreMedias() {
    const cible = $("#liste-medias");
    if (!cible) return;
    cible.innerHTML = etat.medias.map((m, i) => `
      <div class="media-carte" data-i="${i}">
        <input type="text" data-champ="cle" value="${esc(m.cle)}" placeholder="clé — ex : vsl">
        <select data-champ="type">
          ${["video", "image", "document", "audio"].map((t) => `<option value="${t}" ${m.type === t ? "selected" : ""}>${t}</option>`).join("")}
        </select>
        <input class="plein" type="url" data-champ="url" value="${esc(m.url)}" placeholder="URL publique du fichier">
        <input class="plein" type="text" data-champ="legende" value="${esc(m.legende)}" placeholder="Message qui accompagne l'envoi">
        <input class="plein" type="text" data-champ="quand" value="${esc(m.quand)}" placeholder="Quand l'envoyer — ex : le prospect demande des preuves">
        <button class="media-sup" data-sup="${i}">Retirer</button>
      </div>`).join("") || '<p class="chapo">Aucun média pour l\'instant.</p>';

    cible.querySelectorAll("[data-champ]").forEach((input) => {
      input.oninput = () => {
        const i = Number(input.closest("[data-i]").dataset.i);
        etat.medias[i][input.dataset.champ] = input.value;
        if (input.dataset.champ === "quand") etat.medias[i].description = input.value;
        enregistrerMedias();
      };
    });
    cible.querySelectorAll("[data-sup]").forEach((b) => b.onclick = () => {
      etat.medias.splice(Number(b.dataset.sup), 1);
      rendreMedias(); enregistrerMedias();
    });
  }

  let minuteurMedias;
  function enregistrerMedias() {
    clearTimeout(minuteurMedias);
    minuteurMedias = setTimeout(async () => {
      try {
        await api("/medias", { method: "PUT", body: JSON.stringify({ medias: etat.medias.filter((m) => m.cle && m.url) }) });
        etat.miseEnRoute = (await api("/reglages")).miseEnRoute;
        rendreRail();
      } catch (e) { toast(e.message, "err"); }
    }, 600);
  }

  function rendreDetailCanal(quel) {
    const cible = $("#detail-canal");
    if (!cible) return;
    const r = etat.reglages;
    if (quel === "mock") {
      cible.innerHTML = `<p class="chapo">Rien de plus à faire. Va à l'étape suivante, écris un message à ton agent, et regarde-le répondre dans la console.</p>`;
      return;
    }
    const racine = location.origin;
    const jeton = r.wa.verifyToken || "closerIA";
    const etapesCoex = quel === "coexistence" ? `
      <li><span class="n">1</span><span>Sur <b>developers.facebook.com</b>, crée une app de type <b>Business</b> et ajoute le produit <b>WhatsApp</b>.</span></li>
      <li><span class="n">2</span><span>Lance l'<b>Embedded Signup</b> et choisis « connecter un numéro WhatsApp Business existant ». Meta t'envoie un code à saisir sur le téléphone qui porte le numéro.</span></li>
      <li><span class="n">3</span><span>Ton numéro reste utilisable sur ton téléphone : c'est le mode <b>Coexistence</b>. L'agent répond en parallèle, et l'historique remonte dans la console.</span></li>
      <li><span class="n">4</span><span>Récupère le <b>Phone number ID</b> et un <b>token permanent</b> (par un System User, pas le token temporaire de 24 h), puis colle-les ci-dessous.</span></li>` : `
      <li><span class="n">1</span><span>Dans ton app Meta, ouvre <b>WhatsApp → Configuration de l'API</b>.</span></li>
      <li><span class="n">2</span><span>Copie le <b>Phone number ID</b> et génère un <b>token permanent</b> via un System User du Business Manager.</span></li>
      <li><span class="n">3</span><span>Récupère l'<b>App secret</b> dans Paramètres → Général : c'est lui qui permet de vérifier que les webhooks viennent bien de Meta.</span></li>`;

    cible.innerHTML = `
      <ol class="etapes-num">${etapesCoex}
        <li><span class="n">${quel === "coexistence" ? 5 : 4}</span><span>Dans <b>WhatsApp → Configuration → Webhook</b>, colle l'URL et le token ci-dessous, puis abonne-toi au champ <b>messages</b>.</span></li>
      </ol>

      <label class="champ"><span>URL de rappel à donner à Meta
        <span class="indice">Doit être joignable en HTTPS depuis l'extérieur. En local : <code class="mono">ngrok http 3000</code> ou un tunnel Cloudflare.</span></span></label>
      <div class="copiable"><code>${esc(racine)}/webhook</code><button class="secondaire" data-copier="${esc(racine)}/webhook">Copier</button></div>
      <div class="copiable"><code>${esc(jeton)}</code><button class="secondaire" data-copier="${esc(jeton)}">Copier le token de vérification</button></div>

      <label class="champ"><span>Phone number ID</span>
        <input type="text" id="w-pid" value="${esc(r.wa.phoneNumberId)}" placeholder="1234567890"></label>
      <label class="champ"><span>Token permanent</span>
        <input type="text" id="w-token" value="${esc(r.wa.token)}" placeholder="EAAG…"></label>
      <label class="champ"><span>App secret
        <span class="indice">Sans lui, la signature des webhooks n'est pas vérifiée : n'importe qui pouvant deviner ton URL peut injecter un faux message.</span></span>
        <input type="text" id="w-secret" value="${esc(r.wa.appSecret)}" placeholder="a1b2c3…"></label>
      <label class="champ"><span>Token de vérification</span>
        <input type="text" id="w-verif" value="${esc(jeton)}"></label>

      <button class="secondaire" data-verifier="whatsapp">Vérifier la connexion</button>
      <div id="verdict-whatsapp"></div>`;

    const lier = (id, champ) => { const n = $(id); if (n) n.oninput = (e) => enregistrer({ wa: { [champ]: e.target.value } }); };
    lier("#w-pid", "phoneNumberId"); lier("#w-token", "token");
    lier("#w-secret", "appSecret"); lier("#w-verif", "verifyToken");

    cible.querySelectorAll("[data-copier]").forEach((b) => b.onclick = async () => {
      try { await navigator.clipboard.writeText(b.dataset.copier); toast("Copié", "ok"); }
      catch { toast("Copie refusée par le navigateur", "err"); }
    });
    cible.querySelectorAll("[data-verifier]").forEach((b) => b.onclick = () => verifier(b.dataset.verifier));
  }

  async function verifier(quoi) {
    const cible = $(`#verdict-${quoi}`);
    if (cible) cible.innerHTML = '<div class="verdict">Vérification…</div>';
    try {
      await enregistrer({}, true);
      const d = await api("/verifier", { method: "POST", body: JSON.stringify({ quoi }) });
      if (cible) cible.innerHTML = `<div class="verdict ${d.ok ? "ok" : "ko"}">${esc(d.message)}</div>`;
      etat.miseEnRoute = (await api("/reglages")).miseEnRoute;
      rendreRail();
    } catch (e) {
      if (cible) cible.innerHTML = `<div class="verdict ko">${esc(e.message)}</div>`;
    }
  }

  /* ---------------- test en direct ---------------- */

  async function lancerTest() {
    const texte = $("#f-test").value.trim();
    if (!texte) return;
    $("#verdict-test").innerHTML = '<div class="verdict">Message envoyé. L\'agent réfléchit — il attend quelques secondes, comme avec un vrai prospect.</div>';
    try {
      const { conversationId } = await api("/simuler", {
        method: "POST",
        body: JSON.stringify({ waId: "33600000042", nom: "Test", texte }),
      });
      const debut = Date.now();
      const boucle = setInterval(async () => {
        try {
          const { messages } = await api(`/conversations/${encodeURIComponent(conversationId)}`);
          rendreFil(messages.map((m) => ({
            q: m.auteur === "prospect" ? "eux" : "nous",
            txt: m.type === "event" ? null : (m.contenu || `[${m.type}]`),
          })).filter((m) => m.txt));
          const repondu = messages.some((m) => m.auteur === "ia");
          if (repondu || Date.now() - debut > 45000) {
            clearInterval(boucle);
            $("#verdict-test").innerHTML = repondu
              ? '<div class="verdict ok">Ton agent a répondu. Regarde le téléphone à droite — c\'est ce que verra le prospect.</div>'
              : '<div class="verdict ko">Aucune réponse. Vérifie la clé Anthropic à l\'étape 1.</div>';
            etat.miseEnRoute = (await api("/reglages")).miseEnRoute;
            rendreRail();
          }
        } catch { clearInterval(boucle); }
      }, 1500);
    } catch (e) {
      $("#verdict-test").innerHTML = `<div class="verdict ko">${esc(e.message)}</div>`;
    }
  }

  /* ---------------- aperçu ---------------- */

  function filExemple() {
    const r = etat.reglages;
    const vous = r.voix.adresse === "vous";
    const t = (tu, vo) => (vous ? vo : tu);
    const prenom = r.business.prenomAgent || "Léa";
    const marque = r.business.nom || "l'équipe";
    const court = r.voix.longueur === 0;

    const accueil = t(`Salut, ${prenom} de ${marque} 👋`, `Bonjour, ${prenom} de ${marque}.`);
    const question = t("Tu fais quoi exactement en ce moment ?", "Vous faites quoi exactement en ce moment ?");

    const fil = [{ q: "eux", txt: "Salut, j'ai vu ta pub, ça marche comment votre truc ?" }];
    if (court) { fil.push({ q: "nous", txt: accueil }, { q: "nous", txt: question }); }
    else { fil.push({ q: "nous", txt: `${accueil}\n${question}` }); }

    fil.push({ q: "eux", txt: "coach sportif, j'accompagne à 1500 €" });
    fil.push({ q: "nous", txt: [
      t("Ok. Et aujourd'hui, qu'est-ce qui coince le plus pour toi ?", "D'accord. Et aujourd'hui, qu'est-ce qui coince le plus ?"),
      t("Ok. Les gens qui t'écrivent, c'est toi qui réponds ?", "D'accord. Les personnes qui vous écrivent, c'est vous qui répondez ?"),
      t("Ok. Tu réponds toi-même aux DM ?\nSi oui, je sais déjà où tu perds de l'argent.", "D'accord. Vous répondez vous-même aux messages ?\nSi oui, je sais déjà où vous perdez de l'argent."),
      t("Ok. Tu réponds toi-même aux DM ?\nSi oui on regarde ça 20 min ensemble, j'ai jeudi 14 h.", "D'accord. Vous répondez vous-même aux messages ?\nSi oui on regarde ça 20 min ensemble, j'ai jeudi 14 h."),
    ][r.voix.insistance] });
    return fil;
  }

  function rendreFil(fil) {
    $("#apercu-fil").innerHTML = fil.map((m) => `<div class="b ${m.q}">${esc(m.txt)}</div>`).join("");
    $("#apercu-fil").scrollTop = $("#apercu-fil").scrollHeight;
  }

  function rendreApercu() {
    const r = etat.reglages;
    const prenom = r.business.prenomAgent || "Léa";
    $("#apercu-nom").textContent = prenom;
    $("#apercu-initiale").textContent = prenom.charAt(0).toUpperCase();
    if (VOLETS[etat.volet].cle !== "test") rendreFil(filExemple());
  }

  /* ---------------- démarrage ---------------- */

  $("#etapes").addEventListener("click", (e) => {
    const b = e.target.closest("[data-volet]");
    if (!b) return;
    etat.volet = Number(b.dataset.volet);
    rendreVolet();
  });

  (async function demarrer() {
    try {
      const d = await api("/reglages");
      etat.reglages = d.reglages;
      etat.miseEnRoute = d.miseEnRoute;
      etat.medias = (await api("/medias")).medias;
      const premierNonFait = etat.miseEnRoute.etapes.findIndex((e) => !e.fait);
      etat.volet = premierNonFait === -1 ? 0 : premierNonFait;
      rendreVolet();
      rendreApercu();
    } catch (e) {
      $("#volet").innerHTML = `<div class="verdict ko">${esc(e.message)}</div>`;
    }
  })();
})();
