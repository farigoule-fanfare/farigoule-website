const db = require('./databaseService');


module.exports = {
  /**
   * Récupère tous les fanfarons
   * @returns {Promise<Array>} liste des fanfarons
   */
  getAllFanfarons: () =>
    new Promise((resolve, reject) => {
      db.all('SELECT id, surnom, instrument, promo, bureau, description, photo FROM fanfarons', (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    }),

  /**
   * Récupère tous les fanfarons avec toutes leurs infos pour la page admin et annuaire
   * @returns {Promise<Array>} liste des fanfarons
   */
  getAllFanfaronsAnnuaire: () =>
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
        nom,
        prenom,
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
         (surnom,nom,prenom, instrument, promo, bureau, email, tel, description, photo)
         VALUES (?, ?,?,?, ?, ?, ?, ?, ?, ?)`
      );
      stmt.run(
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
        nom,
        prenom,
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
             nom = ?,
             prenom = ?,
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
