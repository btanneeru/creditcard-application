const { PanInfoORM } = require("../orm");
const CODE = require("../utils/httpResponseCode");
const _ = require("lodash");

exports.getCreditScore = (req, res) => {
    try {
        if (
            req.params.panNumber == undefined
        ) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid panNumber" });
        }
        const id = req.params.panNumber;
        PanInfoORM.getPanInfoByPanNumber(id)
        .then(async (doc) => {
            if (!_.isEmpty(doc)) {
                res.status(CODE.EVERYTHING_IS_OK).json(doc);
            } else {
                res.status(CODE.NOT_FOUND).json({ message: "No record found" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(CODE.INTERNAL_SERVER_ERROR).send({err: error, message: `Something Went wrong in API`});
    }
};

