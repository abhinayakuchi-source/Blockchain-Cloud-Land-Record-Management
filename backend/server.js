const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const landRecordRoutes = require("./routes/landRecordRoutes");

const landBlockchain = require("./blockchain");

// ==========================================
// LOAD ENVIRONMENT VARIABLES
// ==========================================

dotenv.config();

// ==========================================
// CREATE EXPRESS APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(cors());

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ==========================================
// API ROUTES
// ==========================================

app.use(
    "/api/auth",
    authRoutes
);

app.use(
    "/api/land-records",
    landRecordRoutes
);

// ==========================================
// BLOCKCHAIN ROUTE
// ==========================================

app.get(
    "/api/blockchain",
    (req, res) => {

        try {

            res.status(200).json({

                success: true,

                valid:
                    landBlockchain.isChainValid(),

                chain:
                    landBlockchain.chain

            });

        } catch (error) {

            console.error(
                "Blockchain API error:",
                error
            );

            res.status(500).json({

                success: false,

                message:
                    error.message

            });

        }

    }
);

// ==========================================
// ROOT ROUTE
// ==========================================

app.get(
    "/",
    (req, res) => {

        res.status(200).json({

            success: true,

            message:
                "Blockchain Cloud Land Record Management API is running."

        });

    }
);

// ==========================================
// ERROR HANDLER
// ==========================================

app.use(
    (err, req, res, next) => {

        console.error(
            "Server error:",
            err
        );

        res.status(500).json({

            success: false,

            message:
                err.message ||
                "Internal server error"

        });

    }
);

// ==========================================
// SERVER START
// ==========================================

const PORT =
    process.env.PORT || 5000;


// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {

    try {

        // --------------------------------------
        // STEP 1: CONNECT TO MONGODB
        // --------------------------------------

        await connectDB();

        console.log(
            "MongoDB connection completed."
        );


        // --------------------------------------
        // STEP 2: INITIALIZE BLOCKCHAIN
        // --------------------------------------

        await landBlockchain.initialize();

        console.log(
            "Blockchain initialization completed."
        );


        // --------------------------------------
        // STEP 3: START EXPRESS SERVER
        // --------------------------------------

        app.listen(
            PORT,
            () => {

                console.log(
                    `Server running on port ${PORT}`
                );

                console.log(
                    "Blockchain initialized successfully."
                );

            }
        );

    } catch (error) {

        console.error(
            "Server startup error:",
            error
        );

        process.exit(1);

    }

};


// ==========================================
// RUN SERVER
// ==========================================

startServer();
