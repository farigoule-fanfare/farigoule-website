const citationRepo = require('../repositories/citationRepository');

const citationService = {
  /** Citations en ordre aléatoire */
  listRandom() {
    return citationRepo.findAllWithAuthors('random');
  },

  /** Citations triées alphabétiquement */
  listAlphabetic() {
    return citationRepo.findAllWithAuthors('alpha');
  },

  /** Création d'une citation */
  addCitation(data) {
    // data attendu : { citation: string, auteur_id: number | null }
    return citationRepo.create(data);
  },

  /** Mise à jour directe */
  updateCitation(id, data) {
    return citationRepo.update(id, data);
  },

  /** Suppression directe */
  deleteCitation(id) {
    return citationRepo.remove(id);
  },
};

module.exports = citationService;
