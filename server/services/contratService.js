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

const contratService = {
  list(filters) {
    const derived = deriveFilters(filters);
    return contratRepo.find(derived);
  },

  addContrat(data) {
    // data : { date, lieu, description }
    return contratRepo.create(data);
  },

  updateContrat(id, data) {
    return contratRepo.update(id, data);
  },

  deleteContrat(id) {
    return contratRepo.remove(id);
  },
};

module.exports = contratService;
