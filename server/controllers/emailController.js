const emailService = require('../services/emailService');

async function handleContact(req, res) {
  const { nom, email, message, destinataire } = req.body;

  if (!nom || !email || !message || !destinataire) {
    return res.status(400).json('Champs manquants');
  }

  try {
    await emailService.send({ nom, email, message, destinataire });
    return res.status(200).json('Message envoyé');
  } catch (err) {
    console.error('[CONTACT]', err);
    return res.status(500).json('Erreur serveur lors de l’envoi');
  }
}

module.exports = { handleContact };
