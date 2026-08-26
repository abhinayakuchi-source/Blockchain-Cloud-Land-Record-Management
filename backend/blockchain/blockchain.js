const crypto = require("crypto");
const BlockchainBlock = require("../models/BlockchainBlock");

class Block {

    constructor(index, timestamp, data, previousHash = "0") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash("sha256")
            .update(
                this.index +
                this.timestamp +
                JSON.stringify(this.data) +
                this.previousHash
            )
            .digest("hex");
    }
}


class Blockchain {

    constructor() {
        this.chain = [];
    }


    async initialize() {

        console.log("Initializing blockchain...");

        const blocks = await BlockchainBlock
            .find()
            .sort({ index: 1 });


        if (blocks.length > 0) {

            this.chain = blocks.map(block => {

                const newBlock = new Block(
                    block.index,
                    block.timestamp,
                    block.data,
                    block.previousHash
                );

                newBlock.hash = block.hash;

                return newBlock;
            });


            console.log(
                `Blockchain loaded from MongoDB: ${this.chain.length} blocks`
            );

        } else {

            const genesis = new Block(
                0,
                new Date().toISOString(),
                {
                    message:
                        "Genesis Block - Land Record Blockchain"
                },
                "0"
            );


            this.chain.push(genesis);


            await BlockchainBlock.create({

                index: genesis.index,

                timestamp: genesis.timestamp,

                data: genesis.data,

                previousHash: genesis.previousHash,

                hash: genesis.hash

            });


            console.log(
                "Genesis block created and saved to MongoDB."
            );
        }
    }


    getLatestBlock() {
        return this.chain[
            this.chain.length - 1
        ];
    }


    async addBlock(data) {

        const previousBlock =
            this.getLatestBlock();


        if (!previousBlock) {

            throw new Error(
                "Blockchain is not initialized."
            );
        }


        const newBlock = new Block(

            this.chain.length,

            new Date().toISOString(),

            data,

            previousBlock.hash

        );


        this.chain.push(newBlock);


        await BlockchainBlock.create({

            index: newBlock.index,

            timestamp: newBlock.timestamp,

            data: newBlock.data,

            previousHash: newBlock.previousHash,

            hash: newBlock.hash

        });


        console.log(
            `Blockchain block saved: ${newBlock.index}`
        );


        return newBlock;
    }


    isChainValid() {

        for (
            let i = 1;
            i < this.chain.length;
            i++
        ) {

            const currentBlock =
                this.chain[i];

            const previousBlock =
                this.chain[i - 1];


            if (
                currentBlock.hash !==
                currentBlock.calculateHash()
            ) {

                return false;
            }


            if (
                currentBlock.previousHash !==
                previousBlock.hash
            ) {

                return false;
            }


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


const landBlockchain =
    new Blockchain();


module.exports =
    landBlockchain;