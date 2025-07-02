const db = require('../services/databaseService');

const SELECT_LIGHT = `
  SELECT id, surnom, instrument, promo, bureau, description, photo
    FROM fanfarons
`;

const SELECT_FULL = `
  SELECT id, surnom, nom, prenom, instrument, promo, bureau,
         tel, email, photo, description
    FROM fanfarons
`;

const fanfaronRepository = {
  /** Sélection légère pour l’affichage public */
  async findAll() {
    return db.prepare(SELECT_LIGHT).all();
  },

  /** Sélection complète (page admin / annuaire) */
  async findAllAnnuaire() {
    return db.prepare(SELECT_FULL).all();
  },

  /** Insertion d’un fanfaron et retour de la ligne créée */
  async create(data) {
    const {
      surnom,
      nom,
      prenom,
      instrument,
      promo,
      bureau,
      email,
      tel,
      description,
      photo,
    } = data;

    const insertSql = `
      INSERT INTO fanfarons
        (surnom, nom, prenom, instrument, promo, bureau, email, tel, description, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const { lastInsertRowid } = db
      .prepare(insertSql)
      .run(
        surnom,
        nom,
        prenom,
        instrument,
        promo,
        bureau,
        email,
        tel,
        description,
        photo,
      );

    return db
      .prepare(
        `SELECT surnom, nom, prenom, instrument, promo, bureau,
                email, tel, description, photo
           FROM fanfarons WHERE id = ?`
      )
      .get(lastInsertRowid);
  },

  /** Mise à jour d’un fanfaron et retour de la ligne modifiée */
  async update(id, data) {
    const {
      surnom,
      nom,
      prenom,
      instrument,
      promo,
      bureau,
      email,
      tel,
      description,
      photo,
    } = data;

    const updateSql = `
      UPDATE fanfarons SET
        surnom       = ?,
        nom          = ?,
        prenom       = ?,
        instrument   = ?,
        promo        = ?,
        bureau       = ?,
        email        = ?,
        tel          = ?,
        description  = ?,
        photo        = COALESCE(?, photo)
      WHERE id = ?
    `;

    db.prepare(updateSql).run(
      surnom,
      nom,
      prenom,
      instrument,
      promo,
      bureau,
      email,
      tel,
      description,
      photo,
      id,
    );

    return db
      .prepare(
        `SELECT surnom, nom, prenom, instrument, promo, bureau, email, tel, description, photo
           FROM fanfarons WHERE id = ?`
      )
      .get(id);
  },

  /** Suppression ; renvoie le nombre de lignes supprimées */
  async remove(id) {
    const { changes } = db.prepare('DELETE FROM fanfarons WHERE id = ?').run(id);
    return { deleted: changes };
  },
};

module.exports = fanfaronRepository;
