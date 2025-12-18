// services/contratService.js
const contratRepo = require('../repositories/contratRepository');

// Helper : YYYY-MM-DD (fuseau du serveur)
function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function deriveFilters({ scope, since, until, order, limit }) {
  const today = todayIso();

  // 1) Plage de dates déduite du scope
  if (!since && !until && scope) {
    if (scope === 'upcoming') since = today;   // futurs
    else if (scope === 'past') until = today;  // passés
  }

  // 2) Ordre par défaut – **past → DESC**, upcoming → ASC
  if (!order) {
    order = scope === 'upcoming' ? 'asc' : 'desc';
  }

  // 3) Limite par défaut : 3 contrats pour past/upcoming
  if (!limit && (scope === 'upcoming' || scope === 'past')) {
    limit = 3;
  }

  return { since, until, order, limit };
}

function isValidIsoDate(value) {
  if (typeof value !== 'string') return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return false;
  const [y, m, da] = value.split('-').map(Number);
  return d.getUTCFullYear() === y && d.getUTCMonth() + 1 === m && d.getUTCDate() === da;
}

const contratService = {
  list(filters) {
    const derived = deriveFilters(filters);
    return contratRepo.find(derived);
  },

  addContrat(data) {
    const { date } = data;
    if (!isValidIsoDate(date)) {
      throw new Error('date must be a valid ISO date (YYYY-MM-DD)');
    }
    return contratRepo.create(data);
  },

  async updateContrat(id, data) {
    const { date } = data;
    if (!isValidIsoDate(date)) {
      throw new Error('date must be a valid ISO date (YYYY-MM-DD)');
    }
    await contratRepo.update(id, data);
    return { id, ...data };
  },

  deleteContrat(id) {
    return contratRepo.remove(id);
  },
};

module.exports = contratService;
