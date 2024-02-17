const services = require("../services/services");

const test = async (req, res) => {
    let errorReason = null
    try {

        const d = await services.test()

        return res.status(200).send({ success: true })
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