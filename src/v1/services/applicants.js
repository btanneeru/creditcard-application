const { ApplicantORM, ApplicationsORM } = require("../orm");
const CODE = require("../utils/httpResponseCode");
const _ = require("lodash");
const mongoose = require("mongoose");
const { calculateApproveLimit, checkIsAtLeast18 } = require("../utils/commonFunctions");

exports.getAllApplicants = (req, res) => {
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
        ApplicantORM.getAllApplicants(query, limit, page, sort)
        .then(async(result) => {
            res.status(CODE.EVERYTHING_IS_OK).json({
                current_page: page,
                total_record: result.totalCount,
                per_page: limit,
                previous_page: page - 1 > 0 ? page - 1 : undefined,
                last_page: Math.ceil(result.totalCount / limit),
                next_page: result.totalCount > limit * page ? page + 1 : undefined,
                applicants: result.docs,
            });
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        return res.status(CODE.INTERNAL_SERVER_ERROR).send({err: error, message: `Something Went wrong in API`});
    }
};

exports.createApplicant = async (req, res) => {
    try {
        if (req.body.fullName === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments fullName required!" });
        }
        if (req.body.email === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments email required!" });
        }
        if (req.body.dob === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments dob required!" });
        }
        if (req.body.pan === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments pan required!" });
        }
        if (req.body.mobile === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments mobile required!" });
        }
        if (req.body.annualIncome === undefined) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Invalid Arguments annualIncome is required !" });
        }
        const isAtLeast18 = checkIsAtLeast18(req.body.dob);
        if (!isAtLeast18) {
            return res.status(CODE.BAD_REQUEST).json({ message: "Applicant must be at least 18 years old!" });
        }
        console.log(req.body.email)
        ApplicantORM.getApplicantByEmail(req.body.email).then(async(existingApplicant) => {
            const now = new Date();
            const sixMonthsAgo = new Date();
            sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
            if(existingApplicant && existingApplicant._id){ 
                    const condition = {
                        applicantId: existingApplicant._id,
                        status: { $in: ["approved", "rejected"] },
                        appliedOn: { $gte: sixMonthsAgo, $lt: now }
                    }
                const existingApplicantionData = await ApplicationsORM.getApplicantByCondition(existingApplicant._id);
                if(existingApplicantionData && existingApplicantionData.appliedOn){
                    return res.status(CODE.BAD_REQUEST).json({ message: "User Already Applied for Creditcard in last 6 months!" });
                }
            }
        });
        ApplicantORM.addApplicant({
            fullName: req.body.fullName,
            email: req.body.email,
            dob: req.body.dob,
            pan: req.body.pan,
            mobile: req.body.mobile,
            annualIncome: req.body.annualIncome,
            address: req.body.address,
        })
        .then(async (doc) => {
            let bodyApplication = {};
            let creditLimit = await calculateApproveLimit(req.body.annualIncome);
            if(creditLimit == "Income above 5L requires manual assessment"){
               bodyApplication.manualAssessmentRequired = true;
            }
        
            bodyApplication.userId = doc._id;
            bodyApplication.status = "submitted";
            bodyApplication.approvedAmount = 0;
            bodyApplication.creditLimit = bodyApplication.manualAssessmentRequired ? 0 : creditLimit;
            bodyApplication.appliedOn = new Date();
            const applicationData = await ApplicationsORM.addApplication(bodyApplication);
            res
            .status(CODE.NEW_RESOURCE_CREATED)
            .json({ message: `Applicantion created successfully!`, applicant: doc, applicationData: applicationData });
        })
        .catch((err) => {
            res.status(CODE.INTERNAL_SERVER_ERROR).json({ error: err.message });
        });
    } catch (error) {
        console.log(error)
        return res.status(CODE.INTERNAL_SERVER_ERROR).send({err: error, message: `Something Went wrong in CMS`});
    }
};

exports.getApplicant = (req, res) => {
    try {
        if (
            req.params.applicantId !== undefined && !mongoose.isValidObjectId(req.params.applicantId)
        ) {
            return res.status(CODE.NOT_FOUND).json({ message: MESSAGE.INVALID_VALUE });
        }
        const id = new mongoose.Types.ObjectId(req.params.applicantId);
        ApplicantORM.getApplicantById(id)
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

exports.updateApplicant = (req, res) => {
    try {
        const id = req.params.applicantId;
        if (_.isEmpty(req.body)) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid Arguments" });
        }
        ApplicantORM.getApplicantById(id)
        .then((doc) => {
            if (doc) {
            let updateOps = {};
            
            ApplicantORM.updateApplicant(id, updateOps)
                .then((doc) => {
                    res.status(CODE.EVERYTHING_IS_OK)
                    .json({ message: `Applicant updated successfully!` });
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

exports.deleteApplicant = (req, res) => {
    try {
        const id = req.params.applicantId;
        if (_.isEmpty(req.params.applicantId)) {
            return res.status(CODE.NOT_FOUND).json({ message: "Invalid Arguments" });
        }
        ApplicantORM.getApplicantById(id)
        .then((doc) => {
            if (doc) {
                ApplicantORM.deleteApplicationById(id)
                    .then((doc) => {
                        res.status(CODE.EVERYTHING_IS_OK)
                        .json({ message: `Applicant Deleted successfully!` });
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
