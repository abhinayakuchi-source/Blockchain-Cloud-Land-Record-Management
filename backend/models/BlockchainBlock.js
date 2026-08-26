const mongoose = require("mongoose");


const blockchainBlockSchema =
    new mongoose.Schema(

        {

            index: {
                type: Number,
                required: true,
                unique: true
            },


            timestamp: {
                type: String,
                required: true
            },


            data: {
                type: Object,
                required: true
            },


            previousHash: {
                type: String,
                required: true
            },


            hash: {
                type: String,
                required: true
            }

        },

        {
            timestamps: true
        }

    );


module.exports =
    mongoose.model(
        "BlockchainBlock",
        blockchainBlockSchema
    );