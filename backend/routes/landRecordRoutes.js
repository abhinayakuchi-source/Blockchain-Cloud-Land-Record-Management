const express = require("express");

const {
    createLandRecord,
    getLandRecords,
    getLandRecord,
    updateLandRecord,
    deleteLandRecord,
    transferOwnership
} = require("../controllers/landRecordController");

const router = express.Router();


// ==========================================
// CREATE LAND RECORD
// ==========================================

router.post(
    "/",
    createLandRecord
);


// ==========================================
// GET ALL LAND RECORDS
// ==========================================

router.get(
    "/",
    getLandRecords
);


// ==========================================
// GET SINGLE LAND RECORD
// ==========================================

router.get(
    "/:id",
    getLandRecord
);


// ==========================================
// UPDATE LAND RECORD
// ==========================================

router.put(
    "/:id",
    updateLandRecord
);


// ==========================================
// DELETE LAND RECORD
// ==========================================

router.delete(
    "/:id",
    deleteLandRecord
);


// ==========================================
// TRANSFER LAND OWNERSHIP
// ==========================================

router.put(
    "/:id/transfer",
    transferOwnership
);


module.exports = router;