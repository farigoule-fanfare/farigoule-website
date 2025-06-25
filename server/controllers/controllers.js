const { getAllFanfarons } = require('../services/fanfaronService');
const contratService = require('../services/contratService');

const controller = {

    // Controller for upcoming contrats
    getUpcomingContratsApi: async (req, res) => {
        try {
            const contrats = await contratService.getUpcomingContrats();
            res.status(200).json({ success: true, data: contrats });
        } catch (error) {
            console.error("Failed to get upcoming contrats:", error);
            res.status(500).json({ success: false, message: 'Failed to retrieve upcoming contrats' });
        }
    },

    // Controller for past contrats
    getPastContratsApi: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 3; // Default limit is 3
            const contrats = await contratService.getPastContrats(limit);
            res.status(200).json({ success: true, data: contrats });
        } catch (error) {
            console.error("Failed to get past contrats:", error);
            res.status(500).json({ success: false, message: 'Failed to retrieve past contrats' });
        }
    },
    getAllFanfaronsApi: async (req, res) => {
        try {
            const fanfarons = await getAllFanfarons();
            const dataWithUrls = fanfarons.map(f => ({
            ...f,
            photoUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/fanfarons/${f.photo}`
            }));
            res.json({ success: true, data: dataWithUrls });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
        }

};

module.exports = controller;