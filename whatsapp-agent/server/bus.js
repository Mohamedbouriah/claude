// Bus d'evenements : diffuse en temps reel vers le dashboard (SSE).
const abonnes = new Set();

export function abonner(res) {
  abonnes.add(res);
  return () => abonnes.delete(res);
}

export function diffuser(type, donnees) {
  const paquet = `event: ${type}\ndata: ${JSON.stringify(donnees)}\n\n`;
  for (const res of abonnes) {
    try { res.write(paquet); } catch { abonnes.delete(res); }
  }
}

export const nbAbonnes = () => abonnes.size;
