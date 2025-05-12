const db = require('../database');


module.exports = {
  /**
   * Récupère tous les fanfarons
   * @returns {Promise<Array>} liste des fanfarons
   */
  getAllFanfarons: () =>
    new Promise((resolve, reject) => {
      db.all('SELECT * FROM fanfarons', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  /**
   * Crée un nouveau fanfaron
   * @param {Object} data - champs du fanfaron
   * @returns {Promise<Object>} fanfaron inséré (avec id)
   */
  createFanfarons: data =>
    new Promise((resolve, reject) => {
      const {
        surnom,
        instrument,
        promo,
        bureau,
        email,
        tel,
        description,
        photo
      } = data;
      const stmt = db.prepare(
        `INSERT INTO fanfarons
         (surnom, instrument, promo, bureau, email, tel, description, photo)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      );
      stmt.run(
        surnom,
        instrument,
        promo,
        bureau,
        email,
        tel,
        description,
        photo,
        function(err) {
          if (err) return reject(err);
          const newF = db.prepare('SELECT * FROM fanfarons WHERE id = ?').get(this.lastID);
          resolve(newF);
        }
      );
    }),

  /**
   * Met à jour un fanfaron existant
   * @param {number|string} id - identifiant du fanfaron
   * @param {Object} data - champs à mettre à jour
   * @returns {Promise<Object>} fanfaron mis à jour
   */
  updateFanfarons: (id, data) =>
    new Promise((resolve, reject) => {
      const {
        surnom,
        instrument,
        promo,
        bureau,
        email,
        tel,
        description,
        photo
      } = data;
      const stmt = db.prepare(
        `UPDATE fanfarons
         SET surnom = ?,
             instrument = ?,
             promo = ?,
             bureau = ?,
             email = ?,
             tel = ?,
             description = ?,
             photo = COALESCE(?, photo)
         WHERE id = ?`
      );
      stmt.run(
        surnom,
        instrument,
        promo,
        bureau,
        email,
        tel,
        description,
        photo,
        id,
        function(err) {
          if (err) return reject(err);
          const updated = db.prepare('SELECT * FROM fanfarons WHERE id = ?').get(id);
          resolve(updated);
        }
      );
    }),

  /**
   * Supprime un fanfaron par son identifiant
   * @param {number|string} id - identifiant du fanfaron
   * @returns {Promise<void>}
   */
  deleteFanfarons: id =>
    new Promise((resolve, reject) => {
      const stmt = db.prepare('DELETE FROM fanfarons WHERE id = ?');
      stmt.run(id, function(err) {
        if (err) reject(err);
        else resolve();
      });
    })
};
