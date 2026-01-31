const { ApplicationsORM } = require("../orm");
const CODE = require("../utils/httpResponseCode");
const _ = require("lodash");
const mongoose = require("mongoose");
const escapeRegex = require("../../utils/regex-escape");
const { nameContainsNumbersQuery } = require("../utils/commonConstants");
// Get all applications
exports.getAllApplication = (req, res) => {
    try {
        let query = {};
        let sort = {};
        // declare pagination variables
        const limit =
        req.query.limit !== undefined && parseInt(req.query.limit) > 0
            ? parseInt(req.query.limit)
            : 10;
        const page =
        req.query.page !== undefined && parseInt(req.query.page) > 0
            ? parseInt(req.query.page)
            : 1;
        
        if (req.query.sortBy !== undefined && req.query.orderBy !== undefined) {
            sort[req.query.sortBy] = req.query.orderBy === "desc" ? -1 : 1;
        } else {
            sort.modified_on = -1;
        }
        console.log(query)
        ApplicationsORM.getAllApplications(query, limit, page, sort)
        .then(async(result) => {
            res.status(CODE.EVERYTHING_IS_OK).json({
                current_page: page,
                total_record: result.totalCount,
                per_page: limit,
                previous_page: page - 1 > 0 ? page - 1 : undefined,
                last_page: Math.ceil(result.totalCount / limit),
                next_page: result.totalCount > limit * page ? page + 1 : undefined,
                applications: result.docs,
            });
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        return res.status(CODE.INTERNAL_SERVER_ERROR).send({err: error, message: `Something Went wrong in API`});
    }
};

exports.createApplication = async (req, res) => {
    try {
        if (req.body.title === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments" });
        }
        ApplicationsORM.addApplication({
            title: req.body.title,
            completed: req.body.completed,
        })
        .then((doc) => {
            res
            .status(CODE.NEW_RESOURCE_CREATED)
            .json({ message: `Application created successfully!`, application: doc });
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        return res.status(200).send({err: error, message: `Something Went wrong in CMS`});
    }
};

exports.getApplication = (req, res) => {
    try {
        if (
            req.params.applicationId !== undefined && !mongoose.isValidObjectId(req.params.applicationId)
        ) {
            return res.status(CODE.NOT_FOUND).json({ message: MESSAGE.INVALID_VALUE });
        }
        const id = new mongoose.Types.ObjectId(req.params.applicationId);
        ApplicationsORM.getApplicationById(id)
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
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};

exports.updateApplication = (req, res) => {
    try {
        const id = req.params.applicationId;
        if (_.isEmpty(req.body)) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid Arguments" });
        }
        ApplicationsORM.getApplicationById(id)
        .then((doc) => {
            if (doc) {
            let updateOps = {};
            
            ApplicationsORM.updateApplication(id, updateOps)
                .then((doc) => {
                    res.status(CODE.EVERYTHING_IS_OK)
                    .json({ message: `Application updated successfully!` });
                })
                .catch((err) => {
                    res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
                });
            } else {
            res
                .status(CODE.NOT_FOUND)
                .json({ message: "No record found!" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};

exports.deleteApplication = (req, res) => {
    try {
        const id = req.params.applicationId;
        if (_.isEmpty(req.params.applicationId)) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid Arguments" });
        }
        ApplicationsORM.getApplicationById(id)
        .then((doc) => {
            if (doc) {
                ApplicationsORM.deleteApplicationById(id)
                    .then((doc) => {
                        res.status(CODE.EVERYTHING_IS_OK)
                        .json({ message: `Application Deleted successfully!` });
                    })
                    .catch((err) => {
                        res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
                    });
            } else {
                res.status(CODE.NOT_FOUND).json({ message: "No record found!" });
            }
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(200).send({err: error, message: `Something Went wrong in API`});
    }
};
