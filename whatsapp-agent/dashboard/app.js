// Console de supervision : liste live, fil de discussion, reprise en main.
const $ = (s) => document.querySelector(s);
const etat = { convId: null, conversations: [], filtre: 'toutes', recherche: '', medias: [], token: localStorage.getItem('token') || '' };

// ---------- Reseau ----------
async function api(chemin, options = {}) {
  const entetes = { 'content-type': 'application/json', ...(options.headers || {}) };
  if (etat.token) entetes['x-token'] = etat.token;
  const rep = await fetch(`/api${chemin}`, { ...options, headers: entetes });
  if (rep.status === 401) {
    const t = prompt('Token du dashboard :');
    if (t) { etat.token = t; localStorage.setItem('token', t); return api(chemin, options); }
    throw new Error('Non autorise');
  }
  const donnees = await rep.json().catch(() => ({}));
  if (!rep.ok) throw new Error(donnees.erreur || `HTTP ${rep.status}`);
  return donnees;
}

function toast(message, type = '') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.textContent = message;
  $('#toasts').append(el);
  setTimeout(() => el.remove(), 4000);
}

// ---------- Rendu ----------
const heure = (iso) => iso ? new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
const dateHeure = (iso) => iso ? new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '';
const echapper = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

function rendreListe() {
  const cible = $('#conversations');
  if (!etat.conversations.length) {
    cible.innerHTML = '<p class="petit" style="padding:16px">Aucune conversation. Lance le simulateur à droite.</p>';
    return;
  }
  cible.innerHTML = etat.conversations.map((c) => `
    <div class="conv ${c.id === etat.convId ? 'actif' : ''}" data-id="${echapper(c.id)}">
      <div class="conv-tete">
        <span class="conv-nom">${echapper(c.nom || c.wa_id)}</span>
        <span class="conv-heure">${heure(c.dernier_message_at)}</span>
      </div>
      <div class="conv-apercu">${c.dernier_auteur && c.dernier_auteur !== 'prospect' ? '↩ ' : ''}${echapper(c.apercu || c.wa_id)}</div>
      <div class="conv-bas">
        <span class="puce ${c.mode}">${c.mode === 'ia' ? 'IA' : 'humain'}</span>
        <span class="puce ${c.etape}">${echapper(c.etape)}</span>
        ${c.score ? `<span class="puce">${c.score}/100</span>` : ''}
        ${c.non_lus ? `<span class="badge">${c.non_lus}</span>` : ''}
      </div>
    </div>`).join('');
  cible.querySelectorAll('.conv').forEach((el) => el.addEventListener('click', () => ouvrir(el.dataset.id)));
}

function gabaritMessage(m) {
  const classe = m.auteur === 'prospect' ? 'in' : m.auteur;
  const piece = m.type !== 'text' && m.type !== 'event'
    ? `<div class="piece">${m.type}${m.media_cle ? ` · ${echapper(m.media_cle)}` : ''}</div>` : '';
  const statut = m.statut === 'echec' ? ' · échec d\'envoi' : m.statut === 'lu' ? ' · lu' : '';
  const signature = m.auteur === 'humain' ? ' · toi' : m.auteur === 'ia' ? ' · IA' : '';
  return `<div class="msg ${classe} ${m.statut === 'echec' ? 'echec' : ''}">
    ${piece}${echapper(m.contenu)}
    <div class="meta">${heure(m.cree_at)}${signature}${statut}</div>
  </div>`;
}

function rendreMessages(messages) {
  $('#messages').innerHTML = messages.map(gabaritMessage).join('');
  $('#messages').scrollTop = $('#messages').scrollHeight;
}

function ajouterMessage(m) {
  $('#messages').insertAdjacentHTML('beforeend', gabaritMessage(m));
  $('#messages').scrollTop = $('#messages').scrollHeight;
}

function rendreFiche(c, relances) {
  $('#fil-nom').textContent = c.nom || c.wa_id;
  $('#fil-sous').textContent = `${c.wa_id} · ${c.etape} · ${c.mode === 'ia' ? 'pilotée par l\'IA' : 'reprise en main'}${c.raison_escalade ? ` · ${c.raison_escalade}` : ''}`;
  $('#bascule-ia').checked = c.mode === 'ia';
  $('#champ-etape').value = c.etape;
  $('#champ-score').value = c.score;
  $('#valeur-score').textContent = `${c.score}/100`;
  $('#champ-note').value = c.note_interne || '';

  let qualif = {};
  try { qualif = JSON.parse(c.qualification || '{}'); } catch {}
  $('#qualification').innerHTML = Object.keys(qualif).length
    ? `<h3 style="margin-top:14px">Ce que l'IA a appris</h3>` + Object.entries(qualif)
        .map(([k, v]) => `<div class="paire"><span>${echapper(k)}</span><span>${echapper(typeof v === 'object' ? JSON.stringify(v) : v)}</span></div>`).join('')
    : '<p class="petit">Aucune info collectée pour l\'instant.</p>';

  $('#relances').innerHTML = relances.length
    ? relances.map((r) => `<div class="relance"><b>${dateHeure(r.du_at)}</b><br>${echapper(r.instruction || 'relance libre')}</div>`).join('')
    : '<p class="petit">Aucune relance programmée.</p>';

  ['#bloc-fiche', '#bloc-medias', '#bloc-relances'].forEach((s) => { $(s).hidden = false; });
}

function rendreMedias() {
  $('#medias').innerHTML = etat.medias.length
    ? etat.medias.map((m) => `
      <div class="media">
        <div><b>${echapper(m.cle)}</b><div class="petit">${echapper(m.type)} — ${echapper(m.description || '')}</div></div>
        <button class="secondaire" data-cle="${echapper(m.cle)}">Envoyer</button>
      </div>`).join('')
    : '<p class="petit">Bibliothèque vide (media/library.json).</p>';
  $('#medias').querySelectorAll('button').forEach((b) => b.addEventListener('click', async () => {
    if (!etat.convId) return;
    try { await api(`/conversations/${encodeURIComponent(etat.convId)}/media`, { method: 'POST', body: JSON.stringify({ cle: b.dataset.cle }) }); toast('Média envoyé', 'ok'); }
    catch (e) { toast(e.message, 'err'); }
  }));
}

function rendreStats(s, infos) {
  $('#stats').innerHTML = `
    <span><b>${s.conversations}</b> conversations</span>
    <span><b>${s.enIA}</b> pilotées IA</span>
    <span><b>${s.enHumain}</b> à reprendre</span>
    <span><b>${s.rdvPris}</b> RDV pris</span>
    <span><b>${s.messages24h}</b> messages 24h</span>
    <span><b>${s.relancesEnAttente}</b> relances en attente</span>`;
  $('#bloc-config').innerHTML = `<h3>Configuration</h3>
    <div class="paire"><span>Canal</span><span>${echapper(infos.canal)}</span></div>
    <div class="paire"><span>Modèle</span><span>${echapper(infos.modele)}</span></div>
    <div class="paire"><span>Clé Anthropic</span><span>${infos.cleConfiguree ? 'OK' : 'manquante'}</span></div>
    <div class="paire"><span>Agent</span><span>${echapper(infos.business.agent)}</span></div>
    <div class="paire"><span>Lien RDV</span><span>${infos.business.lienRdv ? 'configuré' : '—'}</span></div>`;
}

// ---------- Actions ----------
async function chargerListe() {
  const p = new URLSearchParams({ filtre: etat.filtre });
  if (etat.recherche) p.set('q', etat.recherche);
  const { conversations } = await api(`/conversations?${p}`);
  etat.conversations = conversations;
  rendreListe();
}

async function chargerEtat() {
  const infos = await api('/etat');
  rendreStats(infos.stats, infos);
}

// Bandeau de mise en route : visible tant que la configuration n'est pas finie.
async function chargerMiseEnRoute() {
  const mer = await api('/miseenroute');
  const bloc = $('#bloc-miseenroute');
  if (mer.faites >= mer.total) { bloc.hidden = true; return; }
  bloc.hidden = false;
  bloc.innerHTML = `<h3>Mise en route — ${mer.faites}/${mer.total}</h3>
    <div class="mer-barre"><span style="width:${Math.round((mer.faites / mer.total) * 100)}%"></span></div>
    ${mer.etapes.map((e) => `<div class="mer-ligne ${e.fait ? 'fait' : ''}"><span class="mer-rond">${e.fait ? '✓' : ''}</span>${echapper(e.titre)}</div>`).join('')}
    <a href="/bienvenue">Reprendre la configuration →</a>`;
}

async function ouvrir(id) {
  etat.convId = id;
  const { conversation, messages, relances } = await api(`/conversations/${encodeURIComponent(id)}`);
  $('#fil-vide').hidden = true;
  $('#fil-contenu').hidden = false;
  rendreFiche(conversation, relances);
  rendreMessages(messages);
  rendreListe();
  chargerEtat();
}

async function patcher(champs) {
  if (!etat.convId) return;
  await api(`/conversations/${encodeURIComponent(etat.convId)}`, { method: 'PATCH', body: JSON.stringify(champs) });
}

// ---------- Temps reel ----------
function brancherFlux() {
  const url = etat.token ? `/api/stream?token=${encodeURIComponent(etat.token)}` : '/api/stream';
  const flux = new EventSource(url);

  flux.addEventListener('connecte', () => { $('#etat-flux').className = 'etat live'; $('#etat-flux').textContent = 'en direct'; });
  flux.onerror = () => { $('#etat-flux').className = 'etat hors'; $('#etat-flux').textContent = 'reconnexion…'; };

  flux.addEventListener('message', (e) => {
    const { conversationId, message } = JSON.parse(e.data);
    if (conversationId === etat.convId) ajouterMessage(message);
    chargerListe(); chargerEtat();
  });

  flux.addEventListener('conversation', () => { chargerListe(); chargerEtat(); });

  flux.addEventListener('ia_reflechit', (e) => {
    const { conversationId, actif } = JSON.parse(e.data);
    if (conversationId === etat.convId) $('#saisie-ia').hidden = !actif;
  });

  flux.addEventListener('escalade', (e) => {
    const { conversationId, raison } = JSON.parse(e.data);
    toast(`Passage à l'humain demandé : ${raison}`, 'err');
    if (conversationId === etat.convId) ouvrir(conversationId);
  });

  flux.addEventListener('erreur', (e) => toast(`Erreur IA : ${JSON.parse(e.data).message}`, 'err'));
  flux.addEventListener('statut', () => { if (etat.convId) chargerListe(); });
}

// ---------- Ecouteurs ----------
document.querySelectorAll('.filtre').forEach((b) => b.addEventListener('click', () => {
  document.querySelectorAll('.filtre').forEach((x) => x.classList.remove('actif'));
  b.classList.add('actif');
  etat.filtre = b.dataset.filtre;
  chargerListe();
}));

let minuteurRecherche;
$('#recherche').addEventListener('input', (e) => {
  clearTimeout(minuteurRecherche);
  minuteurRecherche = setTimeout(() => { etat.recherche = e.target.value.trim(); chargerListe(); }, 250);
});

$('#composer').addEventListener('submit', async (e) => {
  e.preventDefault();
  const texte = $('#champ').value.trim();
  if (!texte || !etat.convId) return;
  $('#champ').value = '';
  try { await api(`/conversations/${encodeURIComponent(etat.convId)}/message`, { method: 'POST', body: JSON.stringify({ texte }) }); await ouvrir(etat.convId); }
  catch (err) { toast(err.message, 'err'); }
});

$('#champ').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('#composer').requestSubmit(); }
});

$('#bascule-ia').addEventListener('change', async (e) => {
  try {
    await api(`/conversations/${encodeURIComponent(etat.convId)}/mode`, { method: 'POST', body: JSON.stringify({ mode: e.target.checked ? 'ia' : 'humain' }) });
    await ouvrir(etat.convId);
    toast(e.target.checked ? "L'IA reprend la main" : "Conversation en manuel", 'ok');
  } catch (err) { toast(err.message, 'err'); }
});

$('#btn-repondre').addEventListener('click', async () => {
  try { await api(`/conversations/${encodeURIComponent(etat.convId)}/repondre`, { method: 'POST' }); }
  catch (err) { toast(err.message, 'err'); }
});

$('#champ-etape').addEventListener('change', (e) => patcher({ etape: e.target.value }).then(chargerListe));
$('#champ-score').addEventListener('input', (e) => { $('#valeur-score').textContent = `${e.target.value}/100`; });
$('#champ-score').addEventListener('change', (e) => patcher({ score: Number(e.target.value) }).then(chargerListe));
let minuteurNote;
$('#champ-note').addEventListener('input', (e) => {
  clearTimeout(minuteurNote);
  minuteurNote = setTimeout(() => patcher({ note_interne: e.target.value }), 600);
});

$('#form-relance').addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!etat.convId) return;
  try {
    await api(`/conversations/${encodeURIComponent(etat.convId)}/relance`, {
      method: 'POST',
      body: JSON.stringify({ dans_minutes: Number($('#relance-minutes').value), instruction: $('#relance-instruction').value }),
    });
    $('#relance-instruction').value = '';
    await ouvrir(etat.convId);
    toast('Relance programmée', 'ok');
  } catch (err) { toast(err.message, 'err'); }
});

$('#form-simu').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const { conversationId } = await api('/simuler', {
      method: 'POST',
      body: JSON.stringify({ waId: $('#simu-numero').value, nom: $('#simu-nom').value, texte: $('#simu-texte').value }),
    });
    await chargerListe();
    await ouvrir(conversationId);
  } catch (err) { toast(err.message, 'err'); }
});

// ---------- Demarrage ----------
(async function demarrer() {
  try {
    await chargerEtat();
    await chargerMiseEnRoute();
    await chargerListe();
    const { medias } = await api('/medias');
    etat.medias = medias;
    rendreMedias();
    brancherFlux();
  } catch (e) { toast(e.message, 'err'); }
})();
