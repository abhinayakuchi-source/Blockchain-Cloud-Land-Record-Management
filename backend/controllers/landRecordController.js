const LandRecord = require("../models/LandRecord");
const landBlockchain = require("../blockchain");

// ==========================================
// CREATE LAND RECORD
// ==========================================

const createLandRecord = async (req, res) => {
    try {
        const {
            ownerName,
            ownerId,
            surveyNumber,
            location,
            landArea,
            landType,
            documentNumber,
            registrationDate,
            ownershipStatus
        } = req.body;

        // -------------------------------
        // Validate required fields
        // -------------------------------

        if (
            !ownerName ||
            !ownerId ||
            !surveyNumber ||
            !location ||
            landArea === undefined ||
            !landType ||
            !documentNumber ||
            !registrationDate
        ) {
            return res.status(400).json({
                success: false,
                message: "All required land record fields must be provided."
            });
        }

        // -------------------------------
        // Check duplicate survey number
        // -------------------------------

        const existingRecord = await LandRecord.findOne({
            surveyNumber: surveyNumber.trim()
        });

        if (existingRecord) {
            return res.status(409).json({
                success: false,
                message:
                    `Survey Number ${surveyNumber} already exists. Please use a different Survey Number.`
            });
        }

        // -------------------------------
        // Create land record in MongoDB
        // -------------------------------

        const landRecord = await LandRecord.create({
            ownerName: ownerName.trim(),
            ownerId: ownerId.trim(),
            surveyNumber: surveyNumber.trim(),
            location: location.trim(),
            landArea: Number(landArea),
            landType,
            documentNumber: documentNumber.trim(),
            registrationDate,
            ownershipStatus: ownershipStatus || "Active"
        });

        // -------------------------------
        // Check blockchain initialization
        // -------------------------------

        if (
            !landBlockchain ||
            typeof landBlockchain.addBlock !== "function"
        ) {
            // Roll back MongoDB record if blockchain unavailable
            await LandRecord.findByIdAndDelete(landRecord._id);

            return res.status(500).json({
                success: false,
                message: "Blockchain is not available."
            });
        }

        if (
            !landBlockchain.chain ||
            landBlockchain.chain.length === 0
        ) {
            await LandRecord.findByIdAndDelete(landRecord._id);

            return res.status(500).json({
                success: false,
                message: "Blockchain is not initialized."
            });
        }

        // -------------------------------
        // Add blockchain transaction
        // -------------------------------

        const block = await landBlockchain.addBlock({
            transactionType: "LAND_RECORD_CREATED",

            recordId: landRecord._id.toString(),

            ownerName: landRecord.ownerName,

            ownerId: landRecord.ownerId,

            surveyNumber: landRecord.surveyNumber,

            location: landRecord.location,

            landArea: landRecord.landArea,

            landType: landRecord.landType,

            documentNumber: landRecord.documentNumber,

            registrationDate:
                landRecord.registrationDate.toISOString(),

            ownershipStatus:
                landRecord.ownershipStatus
        });

        // -------------------------------
        // Success response
        // -------------------------------

        return res.status(201).json({
            success: true,

            message: "Land record created successfully.",

            data: landRecord,

            blockchain: {
                blockIndex: block.index,

                transaction: block.data,

                timestamp: block.timestamp,

                hash: block.hash,

                previousHash: block.previousHash
            }
        });

    } catch (error) {

        console.error(
            "Create land record error:",
            error
        );

        // MongoDB duplicate key error
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "This Survey Number already exists. Please use a unique Survey Number."
            });
        }

        return res.status(500).json({
            success: false,
            message:
                error.message || "Failed to create land record."
        });
    }
};


// ==========================================
// GET ALL LAND RECORDS
// ==========================================

const getLandRecords = async (req, res) => {
    try {

        const records = await LandRecord
            .find()
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: records
        });

    } catch (error) {

        console.error(
            "Get land records error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// GET SINGLE LAND RECORD
// ==========================================

const getLandRecord = async (req, res) => {
    try {

        const record = await LandRecord.findById(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Land record not found."
            });
        }

        return res.status(200).json({
            success: true,
            data: record
        });

    } catch (error) {

        console.error(
            "Get single land record error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// UPDATE LAND RECORD
// ==========================================

const updateLandRecord = async (req, res) => {
    try {

        const record = await LandRecord.findById(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Land record not found."
            });
        }

        // -------------------------------
        // Prevent duplicate survey number
        // -------------------------------

        if (req.body.surveyNumber) {

            const duplicate = await LandRecord.findOne({
                surveyNumber:
                    req.body.surveyNumber.trim(),
                _id: {
                    $ne: req.params.id
                }
            });

            if (duplicate) {
                return res.status(409).json({
                    success: false,
                    message:
                        "Another land record already uses this Survey Number."
                });
            }
        }

        // -------------------------------
        // Update MongoDB
        // -------------------------------

        Object.assign(record, req.body);

        await record.save();

        // -------------------------------
        // Blockchain transaction
        // -------------------------------

        if (
            !landBlockchain ||
            !landBlockchain.chain ||
            landBlockchain.chain.length === 0
        ) {
            return res.status(500).json({
                success: false,
                message:
                    "Land record updated, but blockchain is not initialized."
            });
        }

        const block = await landBlockchain.addBlock({

            transactionType:
                "LAND_RECORD_UPDATED",

            recordId:
                record._id.toString(),

            surveyNumber:
                record.surveyNumber,

            ownerName:
                record.ownerName,

            ownerId:
                record.ownerId,

            location:
                record.location,

            updatedAt:
                new Date().toISOString()
        });

        return res.status(200).json({

            success: true,

            message:
                "Land record updated successfully.",

            data:
                record,

            blockchain: {
                blockIndex: block.index,
                transaction: block.data,
                timestamp: block.timestamp,
                hash: block.hash,
                previousHash: block.previousHash
            }
        });

    } catch (error) {

        console.error(
            "Update land record error:",
            error
        );

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message:
                    "Survey Number already exists."
            });
        }

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// DELETE LAND RECORD
// ==========================================

const deleteLandRecord = async (req, res) => {
    try {

        const record = await LandRecord.findById(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message: "Land record not found."
            });
        }

        // -------------------------------
        // Blockchain transaction FIRST
        // -------------------------------

        if (
            !landBlockchain ||
            !landBlockchain.chain ||
            landBlockchain.chain.length === 0
        ) {
            return res.status(500).json({
                success: false,
                message:
                    "Blockchain is not initialized."
            });
        }

        const block = await landBlockchain.addBlock({

            transactionType:
                "LAND_RECORD_DELETED",

            recordId:
                record._id.toString(),

            surveyNumber:
                record.surveyNumber,

            ownerName:
                record.ownerName,

            deletedAt:
                new Date().toISOString()
        });

        // -------------------------------
        // Delete MongoDB record
        // -------------------------------

        await LandRecord.findByIdAndDelete(
            req.params.id
        );

        return res.status(200).json({

            success: true,

            message:
                "Land record deleted successfully.",

            blockchain: {
                blockIndex: block.index,
                transaction: block.data,
                timestamp: block.timestamp,
                hash: block.hash,
                previousHash: block.previousHash
            }
        });

    } catch (error) {

        console.error(
            "Delete land record error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// TRANSFER OWNERSHIP
// ==========================================

const transferOwnership = async (req, res) => {
    try {

        const {
            newOwnerName,
            newOwnerId
        } = req.body;

        // -------------------------------
        // Validate
        // -------------------------------

        if (
            !newOwnerName ||
            !newOwnerId
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "New owner name and ID are required."
            });
        }

        // -------------------------------
        // Find record
        // -------------------------------

        const record = await LandRecord.findById(
            req.params.id
        );

        if (!record) {
            return res.status(404).json({
                success: false,
                message:
                    "Land record not found."
            });
        }

        // -------------------------------
        // Check blockchain
        // -------------------------------

        if (
            !landBlockchain ||
            !landBlockchain.chain ||
            landBlockchain.chain.length === 0
        ) {
            return res.status(500).json({
                success: false,
                message:
                    "Blockchain is not initialized."
            });
        }

        // -------------------------------
        // Save previous owner
        // -------------------------------

        const previousOwnerName =
            record.ownerName;

        const previousOwnerId =
            record.ownerId;

        // -------------------------------
        // Update owner
        // -------------------------------

        record.ownerName =
            newOwnerName.trim();

        record.ownerId =
            newOwnerId.trim();

        record.ownershipStatus =
            "Transferred";

        await record.save();

        // -------------------------------
        // Blockchain transaction
        // -------------------------------

        const block = await landBlockchain.addBlock({

            transactionType:
                "OWNERSHIP_TRANSFER",

            recordId:
                record._id.toString(),

            surveyNumber:
                record.surveyNumber,

            previousOwner:
                previousOwnerName,

            previousOwnerId:
                previousOwnerId,

            newOwner:
                record.ownerName,

            newOwnerId:
                record.ownerId,

            transferDate:
                new Date().toISOString()
        });

        return res.status(200).json({

            success: true,

            message:
                "Land ownership transferred successfully.",

            data:
                record,

            blockchain: {
                blockIndex: block.index,
                transaction: block.data,
                timestamp: block.timestamp,
                hash: block.hash,
                previousHash: block.previousHash
            }
        });

    } catch (error) {

        console.error(
            "Transfer ownership error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    createLandRecord,

    getLandRecords,

    getLandRecord,

    updateLandRecord,

    deleteLandRecord,

    transferOwnership

};