// controllers/fanfaronsController.js
const db = require('../database'); // ton accès SQLite
const path = require('path');
const fs = require('fs');

module.exports = {
  // GET /route/fanfarons
  async getAll(req, res) {
    const fanfarons = db.prepare('SELECT * FROM fanfarons').all();
    res.json({ success: true, data: fanfarons });
  },

  // POST /route/fanfarons
  async create(req, res) {
    const { surnom, instrument, promo, bureau, mail, tel, description } = req.body;
    let photoUrl = null;
    if (req.file) {
      const dest = path.join(__dirname, '../public/uploads/fanfarons', req.file.filename);
      fs.renameSync(req.file.path, dest);
      photoUrl = `/public/uploads/fanfarons/${req.file.filename}`;
    }
    const stmt = db.prepare(`
      INSERT INTO fanfarons (surnom, instrument, promo, bureau, mail, tel, description, photoUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(surnom, instrument, promo, bureau, mail, tel, description, photoUrl);
    const newF = db.prepare('SELECT * FROM fanfarons WHERE id = ?').get(info.lastInsertRowid);
    res.json({ success: true, data: newF });
  },

  // PUT /route/fanfarons/:id
  async update(req, res) {
    const { id } = req.params;
    const { surnom, instrument, promo, bureau, mail, tel, description } = req.body;
    let photoUrl = null;
    if (req.file) {
      const dest = path.join(__dirname, '../public/uploads/fanfarons', req.file.filename);
      fs.renameSync(req.file.path, dest);
      photoUrl = `/public/uploads/fanfarons/${req.file.filename}`;
    }
    const stmt = db.prepare(`
      UPDATE fanfarons
      SET surnom=?, instrument=?, promo=?, bureau=?, mail=?, tel=?, description=?, photoUrl=COALESCE(?, photoUrl)
      WHERE id = ?
    `);
    stmt.run(surnom, instrument, promo, bureau, mail, tel, description, photoUrl, id);
    const updated = db.prepare('SELECT * FROM fanfarons WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  },

  // DELETE /route/fanfarons/:id
  async remove(req, res) {
    const { id } = req.params;
    db.prepare('DELETE FROM fanfarons WHERE id = ?').run(id);
    res.json({ success: true, message: 'Supprimé' });
  }
};
