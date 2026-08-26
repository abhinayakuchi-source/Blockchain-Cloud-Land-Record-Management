const crypto = require("crypto");
const Block = require("./block");
const BlockchainBlock = require("../models/BlockchainBlock");

class Blockchain {

    constructor() {
        this.chain = [];
        this.initialized = false;
    }

    // ==========================================
    // INITIALIZE BLOCKCHAIN FROM MONGODB
    // ==========================================

    async initialize() {

        try {

            const blocks = await BlockchainBlock
                .find()
                .sort({ index: 1 });

            // --------------------------------------
            // Existing blockchain found
            // --------------------------------------

            if (blocks.length > 0) {

                this.chain = blocks.map(block => {

                    const restoredBlock = new Block(
                        block.index,
                        block.timestamp,
                        block.data,
                        block.previousHash
                    );

                    // Use the hash stored in MongoDB
                    restoredBlock.hash = block.hash;

                    return restoredBlock;
                });

                this.initialized = true;

                console.log(
                    `Blockchain loaded from MongoDB. Blocks: ${this.chain.length}`
                );

                return true;
            }

            // --------------------------------------
            // Create Genesis Block
            // --------------------------------------

            const genesisBlock = new Block(
                0,
                new Date().toISOString(),
                {
                    transactionType: "GENESIS",
                    message:
                        "Genesis Block - Land Record Blockchain"
                },
                "0"
            );

            this.chain.push(genesisBlock);

            await BlockchainBlock.create({

                index: genesisBlock.index,

                timestamp: genesisBlock.timestamp,

                data: genesisBlock.data,

                previousHash:
                    genesisBlock.previousHash,

                hash:
                    genesisBlock.hash
            });

            this.initialized = true;

            console.log(
                "Genesis block created and saved to MongoDB."
            );

            return true;

        } catch (error) {

            console.error(
                "Blockchain initialization error:",
                error
            );

            this.initialized = false;

            throw error;
        }
    }


    // ==========================================
    // GET LATEST BLOCK
    // ==========================================

    getLatestBlock() {

        if (this.chain.length === 0) {
            return null;
        }

        return this.chain[
            this.chain.length - 1
        ];
    }


    // ==========================================
    // ADD BLOCK
    // ==========================================

    async addBlock(data) {

        // --------------------------------------
        // Make sure blockchain is initialized
        // --------------------------------------

        if (
            !this.initialized ||
            this.chain.length === 0
        ) {
            throw new Error(
                "Blockchain is not initialized."
            );
        }

        const previousBlock =
            this.getLatestBlock();

        if (!previousBlock) {
            throw new Error(
                "Previous block not found."
            );
        }

        // --------------------------------------
        // Create new block
        // --------------------------------------

        const newBlock = new Block(

            this.chain.length,

            new Date().toISOString(),

            data,

            previousBlock.hash
        );

        // --------------------------------------
        // Save block in MongoDB
        // --------------------------------------

        await BlockchainBlock.create({

            index: newBlock.index,

            timestamp: newBlock.timestamp,

            data: newBlock.data,

            previousHash:
                newBlock.previousHash,

            hash:
                newBlock.hash
        });

        // --------------------------------------
        // Add block to memory
        // --------------------------------------

        this.chain.push(newBlock);

        console.log(
            `Blockchain block saved: ${newBlock.index}`
        );

        return newBlock;
    }


    // ==========================================
    // VALIDATE BLOCKCHAIN
    // ==========================================

    isChainValid() {

        if (this.chain.length === 0) {
            return false;
        }

        // --------------------------------------
        // Validate Genesis Block
        // --------------------------------------

        const genesis =
            this.chain[0];

        if (
            genesis.previousHash !== "0"
        ) {
            return false;
        }

        if (
            genesis.hash !==
            genesis.calculateHash()
        ) {
            return false;
        }

        // --------------------------------------
        // Validate remaining blocks
        // --------------------------------------

        for (
            let i = 1;
            i < this.chain.length;
            i++
        ) {

            const currentBlock =
                this.chain[i];

            const previousBlock =
                this.chain[i - 1];

            // Check current hash

            if (
                currentBlock.hash !==
                currentBlock.calculateHash()
            ) {
                return false;
            }

            // Check chain connection

            if (
                currentBlock.previousHash !==
                previousBlock.hash
            ) {
                return false;
            }
        }

        return true;
    }
}

module.exports = Blockchain;