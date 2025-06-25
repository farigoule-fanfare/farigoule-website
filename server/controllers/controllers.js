const services = require("../services/services");
const { getAllCitationsWithAuthors } = require('../services/citationService');
const { getAllFanfarons } = require('../services/fanfaronService');
const diapoService = require('../services/diapoService');
const contratService = require('../services/contratService');

// This file is where you test for authorization when needed
const test = async (req, res) => {
    let errorReason = null
    try {

        const d = await services.test()

        if (!d?.success) {
            errorReason = d?.errorReason
            throw new Error(d?.error)
        }

        return res.status(200).send({ success: true, data: d?.data })
    }
    catch (e) {
        if (["invalidToken"].includes(errorReason)) {
            return res.status(400).send({ success: false, errorReason })
        }
        return res.status(500).send({ success: false, error: e, errorReason: errorReason })
    }
}

const controller = {
    getApi: (req, res) => {
        res.json({
            message: "Hello from server!",
            user: req.user
        });
    },
    postApi: (req, res) => {
        res.send(
            `I received your POST request. This is what you sent me: ${req.body.post}`,
        );
    },

    // New controller function for fetching citations
    getCitationsApi: async (req, res) => {
        try {
            const citations = await getAllCitationsWithAuthors();

            return res.status(200).send({ success: true, data: citations })
        } catch (error) {
            console.error("API Error fetching citations:", error);
            res.status(500).json({ error: "Failed to fetch citations" });
        }
    },

    // Controller for latest diapos
    getLatestDiaposApi: async (req, res) => {
        try {
            const limit = parseInt(req.query.limit, 10) || 5;
            const diapos = await diapoService.getLatestDiapos(limit);
            const diaposWithUrls = diapos.map(d => ({
                ...d,
                imageUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/carousel/${d.fichier}`
            }));
            res.status(200).json({ success: true, data: diaposWithUrls });
        } catch (error) {
            console.error("Failed to get latest diapos:", error);
            res.status(500).json({ success: false, message: 'Failed to retrieve diapos' });
        }
    },

    // Controller for random diapo
    getRandomDiapoApi: async (req, res) => {
        try {
            const diapo = await diapoService.getRandomDiapo();
            if (!diapo) {
                return res.status(404).json({ success: false, message: 'No diapos found.' });
            }
            // Prepend the base URL for static files to the fichier name
            const diapoWithUrl = {
                ...diapo,
                imageUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/carousel/${diapo.fichier}`
            };
            res.status(200).json({ success: true, data: diapoWithUrl });
        } catch (error) {
            console.error("Failed to get random diapo:", error);
            res.status(500).json({ success: false, message: 'Failed to retrieve random diapo' });
        }
    },

    // Controller for all diapos
    getAllDiaposApi: async (req, res) => {
        try {
            const diapos = await diapoService.getAllDiapos();
            // Prepend the base URL for static files to the fichier names
            const diaposWithUrls = diapos.map(d => ({
                ...d,
                imageUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/carousel/${d.fichier}`
            }));
            res.status(200).json({ success: true, data: diaposWithUrls });
        } catch (error) {
            console.error("Failed to get all diapos:", error);
            res.status(500).json({ success: false, message: 'Failed to retrieve all diapos' });
        }
    },

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

module.exports = {
    test,
    ...controller
}