const citationRepo = require('../repositories/citationRepository');

module.exports = {
  list() { return citationRepo.findAll();  },
  random() { return citationRepo.findRandom(); },
  addCitation(data)      { return citationRepo.create(data);  },
  updateCitation(id, d ) { return citationRepo.update(id, d); },
  deleteCitation(id)     { return citationRepo.remove(id);    }
};
