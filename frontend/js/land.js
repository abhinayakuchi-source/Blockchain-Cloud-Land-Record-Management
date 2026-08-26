const API_URL = "http://localhost:5000/api";


// ==========================================
// ADD LAND RECORD
// ==========================================

const landForm = document.getElementById("landForm");

if (landForm) {

    landForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const message =
            document.getElementById("message");

        try {

            const landData = {

                ownerName:
                    document.getElementById("ownerName").value.trim(),

                ownerId:
                    document.getElementById("ownerId").value.trim(),

                surveyNumber:
                    document.getElementById("surveyNumber").value.trim(),

                location:
                    document.getElementById("location").value.trim(),

                landArea:
                    Number(
                        document.getElementById("landArea").value
                    ),

                landType:
                    document.getElementById("landType").value,

                documentNumber:
                    document.getElementById("documentNumber").value.trim(),

                registrationDate:
                    document.getElementById("registrationDate").value,

                ownershipStatus:
                    document.getElementById("ownershipStatus").value
            };


            console.log(
                "Sending land record:",
                landData
            );


            const response =
                await fetch(
                    `${API_URL}/land-records`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body:
                            JSON.stringify(landData)
                    }
                );


            const result =
                await response.json();


            console.log(
                "Server response:",
                result
            );


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Failed to create land record"
                );

            }


            message.className =
                "success-message";


            if (result.blockchain) {

                message.innerHTML = `

                    ✅ Land record created successfully!

                    <br><br>

                    <strong>🔗 Blockchain Verification</strong>

                    <br><br>

                    Block Index:
                    ${result.blockchain.blockIndex}

                    <br>

                    Transaction:
                    ${result.blockchain.transaction.transactionType}

                    <br>

                    Timestamp:
                    ${result.blockchain.timestamp}

                    <br>

                    Current Hash:
                    ${result.blockchain.hash}

                    <br>

                    Previous Hash:
                    ${result.blockchain.previousHash}

                `;

            } else {

                message.textContent =
                    "✅ Land record created successfully.";

            }


            landForm.reset();


        } catch (error) {

            console.error(
                "Add land error:",
                error
            );


            message.className =
                "error-message";


            message.textContent =
                "❌ " + error.message;

        }

    });

}