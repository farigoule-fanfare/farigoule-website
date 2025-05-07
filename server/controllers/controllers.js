const services = require("../services/services");
const { getAllCitationsWithAuthors } = require('../services/citationService');

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
        console.log("req", req.user);
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
    }
};

module.exports = {
    test,
    ...controller
}