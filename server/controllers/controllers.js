const services = require("../services/services");

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

module.exports = {
    test
}