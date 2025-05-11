const db = require('../database');
module.exports.getAllFanfarons = () =>
  new Promise((resolve, reject) => {
    db.all('SELECT * FROM fanfarons', (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
