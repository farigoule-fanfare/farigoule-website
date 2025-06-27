const citationRepo = require('../repositories/citationRepository');

module.exports = {
  list(filters) {
    return citationRepo.findAll(filters);   // {order, author, search}
  },
  addCitation(data)      { return citationRepo.create(data);  },
  updateCitation(id, d ) { return citationRepo.update(id, d); },
  deleteCitation(id)     { return citationRepo.remove(id);    }
};
