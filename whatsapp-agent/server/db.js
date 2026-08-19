// Persistance : SQLite embarque (node:sqlite, aucune dependance native a compiler).
import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import config from './config.js';

mkdirSync(config.cheminData, { recursive: true });
const db = new DatabaseSync(resolve(config.cheminData, 'closer.db'));

db.exec(`
PRAGMA journal_mode = WAL;

CREATE TABLE IF NOT EXISTS conversations (
  id                TEXT PRIMARY KEY,      -- canal:numero
  canal             TEXT NOT NULL,
  wa_id             TEXT NOT NULL,
  nom               TEXT,
  mode              TEXT NOT NULL DEFAULT 'ia',      -- 'ia' | 'humain'
  etape             TEXT NOT NULL DEFAULT 'nouveau', -- nouveau|en_cours|qualifie|rdv_pris|no_show|client|perdu
  score             INTEGER NOT NULL DEFAULT 0,
  qualification     TEXT NOT NULL DEFAULT '{}',      -- JSON libre
  note_interne      TEXT NOT NULL DEFAULT '',
  raison_escalade   TEXT,
  non_lus           INTEGER NOT NULL DEFAULT 0,
  relances_envoyees INTEGER NOT NULL DEFAULT 0,
  dernier_message_at TEXT,
  cree_at           TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS messages (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  sens           TEXT NOT NULL,   -- 'in' | 'out'
  auteur         TEXT NOT NULL,   -- 'prospect' | 'ia' | 'humain' | 'systeme'
  type           TEXT NOT NULL DEFAULT 'text', -- text|video|image|audio|document|event
  contenu        TEXT NOT NULL DEFAULT '',
  media_cle      TEXT,
  wa_message_id  TEXT,
  statut         TEXT NOT NULL DEFAULT 'envoye', -- envoye|delivre|lu|echec
  cree_at        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_messages_conv ON messages(conversation_id, id);

CREATE TABLE IF NOT EXISTS relances (
  id             INTEGER PRIMARY KEY AUTOINCREMENT,
  conversation_id TEXT NOT NULL,
  du_at          TEXT NOT NULL,
  instruction    TEXT NOT NULL DEFAULT '',
  etat           TEXT NOT NULL DEFAULT 'planifiee', -- planifiee|envoyee|annulee
  cree_at        TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_relances_du ON relances(etat, du_at);

CREATE TABLE IF NOT EXISTS reglages (
  cle    TEXT PRIMARY KEY,
  valeur TEXT NOT NULL
);
`);

export const maintenant = () => new Date().toISOString();

// ---------- Conversations ----------

export function trouverOuCreerConversation({ canal, waId, nom }) {
  const id = `${canal}:${waId}`;
  const existante = db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
  if (existante) {
    if (nom && !existante.nom) {
      db.prepare('UPDATE conversations SET nom = ? WHERE id = ?').run(nom, id);
      existante.nom = nom;
    }
    return existante;
  }
  db.prepare(`INSERT INTO conversations (id, canal, wa_id, nom, cree_at, dernier_message_at)
              VALUES (?, ?, ?, ?, ?, ?)`).run(id, canal, waId, nom || null, maintenant(), maintenant());
  return db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);
}

export const getConversation = (id) => db.prepare('SELECT * FROM conversations WHERE id = ?').get(id);

export function listerConversations({ filtre = 'toutes', recherche = '' } = {}) {
  let sql = `SELECT c.*,
    (SELECT CASE WHEN m.type = 'text' THEN m.contenu ELSE '[' || m.type || ']' END
       FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS apercu,
    (SELECT m.auteur FROM messages m WHERE m.conversation_id = c.id ORDER BY m.id DESC LIMIT 1) AS dernier_auteur
    FROM conversations c`;
  const clauses = [];
  const params = [];
  if (filtre === 'humain') clauses.push("c.mode = 'humain'");
  if (filtre === 'ia') clauses.push("c.mode = 'ia'");
  if (filtre === 'non_lus') clauses.push('c.non_lus > 0');
  if (filtre === 'rdv') clauses.push("c.etape = 'rdv_pris'");
  if (recherche) { clauses.push('(c.nom LIKE ? OR c.wa_id LIKE ?)'); params.push(`%${recherche}%`, `%${recherche}%`); }
  if (clauses.length) sql += ' WHERE ' + clauses.join(' AND ');
  sql += ' ORDER BY c.dernier_message_at DESC LIMIT 300';
  return db.prepare(sql).all(...params);
}

export function majConversation(id, champs) {
  const cles = Object.keys(champs);
  if (!cles.length) return getConversation(id);
  const set = cles.map((c) => `${c} = ?`).join(', ');
  db.prepare(`UPDATE conversations SET ${set} WHERE id = ?`).run(...cles.map((c) => champs[c]), id);
  return getConversation(id);
}

export function fusionnerQualification(id, ajouts) {
  const conv = getConversation(id);
  if (!conv) return null;
  let actuel = {};
  try { actuel = JSON.parse(conv.qualification || '{}'); } catch { actuel = {}; }
  const fusion = { ...actuel, ...ajouts };
  return majConversation(id, { qualification: JSON.stringify(fusion) });
}

// ---------- Messages ----------

export function ajouterMessage({ conversationId, sens, auteur, type = 'text', contenu = '', mediaCle = null, waMessageId = null, statut = 'envoye' }) {
  const info = db.prepare(`INSERT INTO messages
    (conversation_id, sens, auteur, type, contenu, media_cle, wa_message_id, statut, cree_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(conversationId, sens, auteur, type, contenu, mediaCle, waMessageId, statut, maintenant());
  db.prepare('UPDATE conversations SET dernier_message_at = ? WHERE id = ?').run(maintenant(), conversationId);
  if (sens === 'in') db.prepare('UPDATE conversations SET non_lus = non_lus + 1, relances_envoyees = 0 WHERE id = ?').run(conversationId);
  return db.prepare('SELECT * FROM messages WHERE id = ?').get(info.lastInsertRowid);
}

export const listerMessages = (conversationId, limite = 200) =>
  db.prepare('SELECT * FROM messages WHERE conversation_id = ? ORDER BY id DESC LIMIT ?')
    .all(conversationId, limite).reverse();

export const marquerLu = (conversationId) =>
  db.prepare('UPDATE conversations SET non_lus = 0 WHERE id = ?').run(conversationId);

export const majStatutMessage = (waMessageId, statut) =>
  db.prepare('UPDATE messages SET statut = ? WHERE wa_message_id = ?').run(statut, waMessageId);

// ---------- Relances ----------

export function planifierRelance({ conversationId, dansMinutes, instruction }) {
  const du = new Date(Date.now() + Math.max(1, dansMinutes) * 60_000).toISOString();
  db.prepare(`INSERT INTO relances (conversation_id, du_at, instruction, cree_at) VALUES (?, ?, ?, ?)`)
    .run(conversationId, du, instruction || '', maintenant());
  return du;
}

export const relancesDues = () =>
  db.prepare("SELECT * FROM relances WHERE etat = 'planifiee' AND du_at <= ? ORDER BY du_at LIMIT 20").all(maintenant());

export const relancesPlanifiees = (conversationId) =>
  db.prepare("SELECT * FROM relances WHERE conversation_id = ? AND etat = 'planifiee' ORDER BY du_at").all(conversationId);

export const majRelance = (id, etat) => db.prepare('UPDATE relances SET etat = ? WHERE id = ?').run(etat, id);

export const annulerRelances = (conversationId) =>
  db.prepare("UPDATE relances SET etat = 'annulee' WHERE conversation_id = ? AND etat = 'planifiee'").run(conversationId);

// ---------- Statistiques ----------

export function statistiques() {
  const q = (sql, ...p) => db.prepare(sql).get(...p)?.n ?? 0;
  return {
    conversations: q('SELECT COUNT(*) n FROM conversations'),
    enIA: q("SELECT COUNT(*) n FROM conversations WHERE mode = 'ia'"),
    enHumain: q("SELECT COUNT(*) n FROM conversations WHERE mode = 'humain'"),
    rdvPris: q("SELECT COUNT(*) n FROM conversations WHERE etape = 'rdv_pris'"),
    nonLus: q('SELECT COUNT(*) n FROM conversations WHERE non_lus > 0'),
    messages24h: q("SELECT COUNT(*) n FROM messages WHERE cree_at >= ?", new Date(Date.now() - 86400000).toISOString()),
    relancesEnAttente: q("SELECT COUNT(*) n FROM relances WHERE etat = 'planifiee'"),
  };
}

export default db;
