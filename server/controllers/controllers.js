const { getAllFanfarons } = require('../services/fanfaronService');

const controller = {

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