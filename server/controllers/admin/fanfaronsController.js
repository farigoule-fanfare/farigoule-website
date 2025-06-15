const fanfaronService = require('../../services/fanfaronService');

module.exports = {
  // GET /route/admin
  async getAllFanfarons(req, res) {
    try {
      // Récupérer tous les fanfarons via le service
      const fanfarons = await fanfaronService.getAllFanfarons();
      // Construire les URLs des photos
      const dataWithUrls = fanfarons.map(f => ({
        ...f,
        photoUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/fanfarons/${f.photo}`
      }));
      // Renvoi du tableau prêt à l'affichage
      res.json({ success: true, data: dataWithUrls });
    } catch (error) {
      console.error('adminController.getAll error:', error);
      res.status(500).json({ success: false, message: 'Erreur serveur', error: error.message });
    }
  },

  // Autres actions d'administration (create, update, delete)
  async createFanfaron(req, res) {
    try {
      const payload = {
        ...req.body,
        photo: req.file?.filename || null
      };
      const fanfaron = await fanfaronService.createFanfarons(payload);
      res.json({ success: true, data: fanfaron });
      console.log('Fichier reçu :', req.file);

    } catch (error) {
      console.error('adminController.create error:', error);
      res.status(500).json({ success: false, message: 'Erreur création', error: error.message });
    }
  },

  async updateFanfaron(req, res) {
    try {
      const payload = {
        ...req.body,
        photo: req.file?.filename || null
      };
      const fanfaron = await fanfaronService.updateFanfarons(req.params.id, payload);
      res.json({ success: true, data: fanfaron });
    } catch (error) {
      console.error('adminController.update error:', error);
      res.status(500).json({ success: false, message: 'Erreur mise à jour', error: error.message });
    }
  },


  async removeFanfaron(req, res) {
    try {
      await fanfaronService.deleteFanfarons(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('adminController.remove error:', error);
      res.status(500).json({ success: false, message: 'Erreur suppression', error: error.message });
    }
  }
};
