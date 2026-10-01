export const ROLLING_PERIOD_DAYS = 90;

export const RANKS = {
  bronce: { name: 'Bronce', commission: 20, salesNeeded: 0, type: 'auto' },
  plata: { name: 'Plata', commission: 18, salesNeeded: 50, type: 'auto' },
  oro: { name: 'Oro', commission: 15, salesNeeded: 200, type: 'auto' },
  platino: { name: 'Platino', commission: 12, salesNeeded: null, type: 'manual' },
  diamante: { name: 'Diamante', commission: 10, salesNeeded: null, type: 'manual' },
};

export const AUTO_RANKS = ['bronce', 'plata', 'oro'];
export const MANUAL_RANKS = ['platino', 'diamante'];

export function getRankInfo(rank) {
  return RANKS[rank] || RANKS.bronce;
}

export function getCommissionRate(rank) {
  return getRankInfo(rank).commission;
}

export function determineRank(salesCount) {
  if (salesCount >= RANKS.oro.salesNeeded) return 'oro';
  if (salesCount >= RANKS.plata.salesNeeded) return 'plata';
  return 'bronce';
}

export function getNextRank(rank) {
  const progression = { bronce: 'plata', plata: 'oro' };
  const nextKey = progression[rank];
  if (!nextKey) return null;
  return { key: nextKey, ...RANKS[nextKey] };
}
