const db = require('../services/databaseService');

const fanfaronRepository = {
  /** Sélection légère pour l’affichage public */
  findAll() {
    const sql = `
      SELECT id, surnom, instrument, promo, bureau, description, photo
      FROM fanfarons
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)))
    );
  },

  /** Sélection complète (page admin / annuaire) */
  findAllAnnuaire() {
    const sql = `SELECT id,surnom, nom, prenom, instrument, promo, bureau, tel, email, photo FROM fanfarons`;
    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)))
    );
  },

  /** Insertion */
  create(data) {
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

    return new Promise((resolve, reject) => {
      db.run(
        insertSql,
        [surnom, nom, prenom, instrument, promo, bureau, email, tel, description, photo],
        function (err) {
          if (err) return reject(err);
          const newId = this.lastID;
          const row = db
            .prepare('SELECT * FROM fanfarons WHERE id = ?')
            .get(newId);
          resolve(row);
        }
      );
    });
  },

  /** Mise à jour */
  update(id, data) {
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
      UPDATE fanfarons
      SET surnom = ?,
          nom = ?,
          prenom = ?,
          instrument = ?,
          promo = ?,
          bureau = ?,
          email = ?,
          tel = ?,
          description = ?,
          photo = COALESCE(?, photo)
      WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
      db.run(
        updateSql,
        [
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
        ],
        function (err) {
          if (err) return reject(err);
          const updated = db
            .prepare('SELECT * FROM fanfarons WHERE id = ?')
            .get(id);
          resolve(updated);
        }
      );
    });
  },

  /** Suppression */
  remove(id) {
    const sql = `DELETE FROM fanfarons WHERE id = ?`;
    return new Promise((resolve, reject) =>
      db.run(sql, [id], function (err) {
        if (err) reject(err);
        else resolve();
      })
    );
  },
};

module.exports = fanfaronRepository;
