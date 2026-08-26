const mongoose = require("mongoose");

const landRecordSchema = new mongoose.Schema(
    {
        ownerName: {
            type: String,
            required: true
        },

        ownerId: {
            type: String,
            required: true
        },

        surveyNumber: {
            type: String,
            required: true,
            unique: true
        },

        location: {
            type: String,
            required: true
        },

        landArea: {
            type: Number,
            required: true
        },

        landType: {
            type: String,
            required: true
        },

        documentNumber: {
            type: String,
            required: true
        },

        registrationDate: {
            type: Date,
            required: true
        },

        // New field
        ownershipStatus: {
            type: String,
            default: "Active"
        }
    },

    {
        timestamps: true
    }
);

module.exports =
    mongoose.model(
        "LandRecord",
        landRecordSchema
    );