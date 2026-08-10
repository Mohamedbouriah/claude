// ============================================================================
//  WF3 — node "Parse déterministe bulletins"   (remplace Extrait PDF + Sonnet)
//  Entrée  : sortie du node "Extract From File" (operation = Extract From PDF)
//            -> chaque item porte $json.text  (texte brut du PDF)
//  Sortie  : un item par bulletin, prêt pour l'Upsert Airtable
//            + _valide / _motif : les items invalides partent en fallback LLM
//
//  ZÉRO appel LLM. Format ACD/Comptapilote, stable et vérifié sur 44 bulletins
//  (déc 2025, jan 2026, mars 2026).
// ============================================================================
const num = s => s == null ? null
  : parseFloat(String(s).replace(/\s|\u00A0/g, '').replace(',', '.'));
const r2 = n => Math.round(n * 100) / 100;

// --- 1. Decoupage en bulletins ---------------------------------------------
function decouper(texte) {
  const t = texte.replace(/\u00A0/g, ' ');
  const RE_ENTETE = /Employ[ée]{1,2}\s*N°\s*(\d+)/i;   // couvre Employé ET Employée

  // Voie normale : un saut de page par bulletin.
  let blocs = t.split('\f').filter(p => p.trim());
  // Si le PDF n'a pas de saut de page, on retombe sur l'en-tete.
  if (blocs.length < 2) {
    blocs = t.split(/(?=Employ[ée]{1,2}\s*N°\s*\d+)/i).filter(p => RE_ENTETE.test(p));
  }
  // Une page sans en-tete est une page 2 (cadres) : on la recolle a la precedente.
  const out = [];
  for (const b of blocs) {
    if (RE_ENTETE.test(b)) out.push(b);
    else if (out.length) out[out.length - 1] += '\n' + b;
  }
  return out;
}

// --- 2. Bloc bas : payees / travaillees / sup ------------------------------
// Les libelles sont groupes, les valeurs arrivent apres le pied de page.
function blocBas(b) {
  const lignes = b.split('\n');
  const i = lignes.findIndex(l => /H\.\s*Pay[ée]es/i.test(l));
  if (i === -1) return {};

  // CAS 1 — texte AVEC layout (pdftotext -layout) : la valeur est sur la meme
  // ligne que le libelle.   "H. Payées        154,00     1 903,97"
  //                          ^libelle          ^bulletin  ^annee
  const surLigne = l => {
    const m = String(l).match(/H\.\s*(?:Pay[ée]es|Travaill[ée]es)\s+(-?[\d\s]*\d,\d{2})/i);
    return m ? num(m[1]) : null;
  };
  const hpL = surLigne(lignes[i]);
  if (hpL != null) {
    const jTr = lignes.findIndex((l, k) => k > i && /H\.\s*Travaill[ée]es/i.test(l));
    const htL = jTr !== -1 ? surLigne(lignes[jTr]) : null;
    if (htL != null) return { heures_payees: hpL, heures_travaillees: htL };
  }

  // CAS 2 — texte SANS layout (pdf-parse / Extract From File) : les libelles
  // sont groupes, les valeurs arrivent plus bas apres le pied de page.
  const vals = [];
  for (let k = i + 1; k < lignes.length && vals.length < 3; k++) {
    const m = lignes[k].trim().match(/^(\d[\d\s]*,\d{2})$/);
    if (m) vals.push(num(m[1]));
  }
  return { heures_payees: vals[0] ?? null, heures_travaillees: vals[1] ?? null };
}

// --- Alignement libelles / valeurs du bloc "Designation" -------------------
function blocDesignation(b) {
  const L = b.split('\n').map(l => l.trim());
  const iDes = L.findIndex(l => /^D[ée]signation$/i.test(l));
  const iCot = L.findIndex((l, k) => k > iDes && /Cotisations et contributions/i.test(l));
  if (iDes === -1 || iCot === -1) return [];

  // libelles : jusqu'a "Total Brut" exclu (cette ligne n'a pas de valeur Base)
  const libelles = [];
  for (let k = iDes + 1; k < iCot; k++) {
    const l = L[k];
    if (!l) continue;
    if (/^Total\s+Brut$/i.test(l)) break;
    libelles.push(l);
  }
  // valeurs : premier bloc de nombres apres "Montant"
  const iMontant = L.findIndex((l, k) => k > iCot && /^Montant$/i.test(l));
  if (iMontant === -1) return [];
  const valeurs = [];
  for (let k = iMontant + 1; k < L.length; k++) {
    const l = L[k];
    if (!l) continue;
    const m = l.match(/^(-?[\d\s]*\d,\d{2})$/);
    if (m) valeurs.push(num(m[1]));
    else break;                       // fin du bloc Base
  }
  return libelles.map((libelle, i) => ({ libelle, base: valeurs[i] ?? null }));
}

// --- 3. Un bulletin --------------------------------------------------------
function parseBulletin(b, moisAttendu) {
  const g = (re, i = 1) => { const m = b.match(re); return m ? m[i] : null; };

  const matricule = g(/Employ[ée]{1,2}\s*N°\s*(\d+)/i);
  const periode   = g(/(\d{2}\/\d{2}\/\d{4})\s+au\s+\d{2}\/\d{2}\/\d{4}/);
  const mois      = periode ? periode.slice(6, 10) + '-' + periode.slice(3, 5) : moisAttendu;

  const { heures_payees: hp, heures_travaillees: ht } = blocBas(b);

  // Bloc "Designation" : libelles et valeurs alignes par index.
  const design = blocDesignation(b);
  const trouve = re => design.find(d => re.test(d.libelle))?.base ?? null;

  // Base contractuelle = valeur en regard de "Salaire de base".
  // Un cadre au forfait ("Salaire de base Mensuel") n'a pas de base horaire.
  let heures_contrat = null;
  if (!/Salaire\s+de\s+base\s+Mensuel/i.test(b)) {
    const lg = b.split('\n').find(l => /Salaire\s+de\s+base/i.test(l));
    const m  = lg && lg.match(/\s{3,}(\d{1,3},\d{2})(?=\s|$)/);
    heures_contrat = m ? num(m[1]) : trouve(/^Salaire\s+de\s+base/i);
  }
  if (heures_contrat != null && (heures_contrat < 10 || heures_contrat > 200)) heures_contrat = null;

  // Heures majorees : alignement libelle <-> valeur de la colonne Base.
  // Le texte sans layout groupe les libelles puis les valeurs, dans le MEME
  // ordre. On aligne par index, en s'arretant a "Total Brut" (pas de base).
  // Heures majorees.
  // CAS 1 — texte AVEC layout : la valeur "Base" est sur la meme ligne.
  //   " Heures supp. de 36 a 39eme Exonerees      3,90      15,2250      59,38"
  //                                               ^base     ^taux        ^montant
  // ATTENTION : ignorer "Montant net des heures compl/suppl exonerees", qui est
  // une ligne de RECAPITULATIF en euros, pas un volume horaire.
  let heures_sup = 0;
  let supTrouveSurLigne = false;
  for (const ligne of b.split('\n')) {
    if (/Montant\s+net\s+des\s+heures/i.test(ligne)) continue;
    if (!/Heures\s+(supp?\.|Compl\.)/i.test(ligne)) continue;
    // Le libelle contient lui-meme des chiffres ("de 36 a 39eme") : on ne peut
    // pas prendre "le premier nombre". La colonne Base est le premier nombre
    // ISOLE par une large gouttiere d'espaces, et a exactement 2 decimales
    // (le taux en a 4 : 15,2250).
    const m = ligne.match(/\s{3,}(\d{1,3},\d{2})(?=\s|$)/);
    if (m) { heures_sup = r2(heures_sup + num(m[1])); supTrouveSurLigne = true; }
  }
  // CAS 2 — texte SANS layout : alignement libelle/valeur par index.
  if (!supTrouveSurLigne) {
    for (const d of design) {
      if (/Heures\s+(supp?\.|Compl\.)/i.test(d.libelle) && d.base != null) heures_sup = r2(heures_sup + d.base);
    }
  }

  // Conges : lignes datees, filtrees sur le mois du bulletin
  let conges_jours = 0; const detailCP = [];
  for (const m of b.matchAll(/(\d+)\s+Jrs?\s+C\.P\.\s+du\s+(\d{2})\/(\d{2})\/(\d{2})/gi)) {
    const [, j, , mm, aa] = m;
    if (mois && `20${aa}-${mm}` !== mois) continue;      // hors periode -> ignore
    conges_jours += parseInt(j, 10);
    detailCP.push(`${j}j ${m[2]}/${mm}/${aa}`);
  }

  // Absences : en heures si possible, sinon reconstituees par difference
  let heures_absence = 0, absEnJours = null;
  const absH = g(/Heures\s+d'absence[^\n]*?(\d{1,3},\d{2})/i);
  if (absH) heures_absence = num(absH);
  else if (/Jours?\s+d'absence/i.test(b)) {
    absEnJours = num(g(/Jours?\s+d'absence[^\n]*?(\d{1,3},\d{2})/i));
    if (hp != null && ht != null) heures_absence = r2(Math.max(hp - ht, 0));
  }

  const salaire_brut  = num(g(/Total\s+Brut[^\d\-]*(-?[\d\s]+,\d{2})/i));
  const cout_employeur= num(g(/Total\s+vers[ée]\s+par\s+l'employeur[^\d\-]*(-?[\d\s]+,\d{2})/i));
  const net_a_payer   = num(g(/NET\s+A\s+PAYER\s+AU\s+SALARI[EÉ][^\d\-]*(-?[\d\s]+,\d{2})/i));

  // Conges en heures = ce qui reste apres travaillees et absences
  const conges_heures = (hp != null && ht != null)
    ? r2(Math.max(hp - ht - heures_absence, 0)) : null;

  // --- Validation comptable : payees = travaillees + absences + conges -----
  let valide = false, motif = null;
  if (hp == null || ht == null) motif = 'bloc bas illisible';
  else if (ht > hp + 0.5)       motif = `travaillées ${ht} > payées ${hp}`;
  else if (heures_contrat != null && heures_sup > 0
           && Math.abs(hp - (heures_contrat + heures_sup)) > 0.5)
    // Le bloc "Designation" aligne libelles et valeurs par index. Un libelle
    // sans valeur Base decale l'alignement -> heures_sup faux. L'equation
    // payees = contrat + sup le detecte (cas JERAK janvier 2026 : 7 lu au lieu
    // de 2,36). La ligne part en verification plutot qu'en base.
    motif = `contrat ${heures_contrat} + sup ${heures_sup} = ${r2(heures_contrat + heures_sup)} != payées ${hp}`;
  else valide = true;

  return {
    matricule,
    // Civilites reelles du PDF : "M. Prenom NOM" pour les hommes,
    // "MME PRENOM NOM" (sans point, en majuscules) pour les femmes.
    // En mode -layout, la colonne voisine ("CONVENTION COLLECTIVE") se retrouve
    // sur la meme ligne, separee par une large gouttiere : on coupe dessus.
    employe: (g(/\b(?:MME|Mme|M\.)\s+(.{2,60})/) || '').split(/\s{2,}/)[0].trim(),
    mois, periode,
    heures_contrat, heures_payees: hp, heures_travaillees: ht,
    heures_sup, heures_absence, conges_heures,
    conges_jours_brut: conges_jours,
    salaire_brut, cout_employeur, net_a_payer,
    arret_maladie: /Maladie\s+du\s+\d{2}\/\d{2}/i.test(b) || absEnJours != null,
    _valide: valide, _motif: motif,
    _detail: [detailCP.length ? 'CP ' + detailCP.join(' + ') : null,
              absEnJours ? `absence ${absEnJours} j ouvrés convertie` : null
             ].filter(Boolean).join(' | ') || null,
  };
}

function parsePDF(texte, moisAttendu) {
  const bruts = decouper(texte).map(b => parseBulletin(b, moisAttendu));
  // Un cadre peut avoir 2 pages : on garde la version la plus complete.
  const parMat = new Map();
  for (const x of bruts) {
    const cle = `${x.matricule}|${x.mois}`;
    const prec = parMat.get(cle);
    if (!prec) { parMat.set(cle, x); continue; }
    const score = o => Object.values(o).filter(v => v !== null && v !== 0 && v !== '').length;
    if (score(x) > score(prec)) parMat.set(cle, x);
  }
  return [...parMat.values()];
}


// ---------------------------------------------------------------- n8n ------
// Le champ Airtable "Service" est un singleSelect : les seules valeurs
// acceptees sont Bar / Cuisine / Direction / Support. Toute autre valeur fait
// echouer l'upsert (erreur "Invalid input for 'Service'").
// Mapping releve sur les fiches de juin 2026.
const SERVICE_MAP = {
  '9':'Direction', '29':'Direction', '33':'Direction', '114':'Direction',
  '110':'Bar', '113':'Bar', '121':'Bar', '127':'Bar', '128':'Bar', '131':'Bar',
  '115':'Cuisine', '125':'Cuisine', '130':'Cuisine', '133':'Cuisine',
  '129':'Support', '132':'Support', '134':'Support',
};

const out = [];
for (const item of items) {
  // Execute Command -> stdout ; Extract From File -> text (compat)
  const texte = item.json.stdout || item.json.text || item.json.data || '';
  if (!texte) continue;

  // Mois imposé depuis le nom du fichier (Bulletin_YYYYMM_GANAY.pdf) si présent :
  // plus fiable que la date de l'e-mail, qui peut être un renvoi.
  const nomFichier = item.json._nomFichier || item.json.fileName || '';
  const mf = nomFichier.match(/Bulletin_(\d{4})(\d{2})/);
  const moisAttendu = mf ? `${mf[1]}-${mf[2]}` : null;

  for (const b of parsePDF(texte, moisAttendu)) {
    if (!b.matricule) continue;
    out.push({ json: {
      ...b,
      service: SERVICE_MAP[b.matricule] || 'Support',   // defaut sur une option valide
      cle_paie: `${b.matricule}_${b.mois}`,
      statut: b._valide ? 'OK' : 'Vérification requise',
      notes: [b._detail, b._valide ? null : `ALERTE ${b._motif}`].filter(Boolean).join(' | ') || null,
      _source: 'parser-deterministe',
      _nomFichier: nomFichier,
    }});
  }
}
return out;
