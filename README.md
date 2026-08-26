# Blockchain Cloud Land Record Management

A secure and transparent **Land Record Management System** that combines **Cloud Computing, MongoDB, Node.js, Express.js, and Blockchain technology** to manage and verify land ownership records.

## 📌 Project Overview

The Blockchain Cloud Land Record Management System provides a digital platform for storing, managing, transferring, and verifying land records.

The system stores land details in **MongoDB Atlas** and records important land transactions on a **blockchain**, providing an additional layer of transparency and tamper detection.

## 🎯 Objectives

* Digitize land record management.
* Securely store land records in the cloud database.
* Maintain blockchain-based transaction records.
* Provide land ownership verification using Survey Numbers.
* Support secure ownership transfer.
* Detect unauthorized modification of blockchain records.
* Provide a simple and user-friendly web interface.

## ✨ Features

### 👤 User Authentication

* User registration
* User login
* Authentication using JWT
* User profile management

### 🏡 Land Record Management

* Add new land records
* View all land records
* View individual land details
* Update land records
* Delete land records

### 🔄 Ownership Transfer

* Transfer land ownership
* Store previous owner details
* Store new owner details
* Record ownership transfer as a blockchain transaction

### 🔍 Land Verification

Users can enter a **Survey Number** to verify a land record.

The system displays:

* Owner name
* Owner ID
* Survey number
* Location
* Land area
* Land type
* Document number
* Registration date
* Ownership status
* Blockchain transaction information

### ⛓️ Blockchain

The system maintains blockchain blocks containing:

* Block index
* Timestamp
* Transaction data
* Previous block hash
* Current block hash

The blockchain also validates the integrity of the chain.

### ☁️ Cloud Database

Land records and user information are stored using **MongoDB Atlas**, allowing the application to use a cloud-hosted database.

## 🛠️ Technologies Used

| Technology    | Purpose                    |
| ------------- | -------------------------- |
| HTML          | Frontend structure         |
| CSS           | User interface and styling |
| JavaScript    | Frontend functionality     |
| Node.js       | Backend runtime            |
| Express.js    | REST API                   |
| MongoDB Atlas | Cloud database             |
| Mongoose      | MongoDB object modeling    |
| Blockchain    | Secure transaction records |
| JWT           | User authentication        |
| CORS          | Cross-origin communication |
| dotenv        | Environment configuration  |

## 🏗️ System Architecture

```text
                    ┌──────────────────────┐
                    │      User / Admin    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Frontend Web App   │
                    │   HTML / CSS / JS    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │    Express.js API    │
                    │      Node.js         │
                    └─────────┬────────────┘
                              │
                 ┌────────────┴────────────┐
                 │                         │
                 ▼                         ▼
        ┌─────────────────┐      ┌─────────────────┐
        │  MongoDB Atlas  │      │   Blockchain    │
        │  Land Records   │      │   Transactions  │
        │  User Records   │      │   Hashes        │
        └─────────────────┘      └─────────────────┘
```

## 📂 Project Structure

```text
Blockchain-Cloud-Land-Record-Management/
│
├── backend/
│   ├── blockchain/
│   │   ├── block.js
│   │   ├── blockchain.js
│   │   └── index.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   └── landRecordController.js
│   │
│   ├── models/
│   │   ├── BlockchainBlock.js
│   │   ├── LandRecord.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── landRecordRoutes.js
│   │
│   └── server.js
│
├── blockchain/
│   ├── block.js
│   ├── blockchain.js
│   └── index.js
│
├── frontend/
│   ├── css/
│   │   ├── auth.css
│   │   ├── dashboard.css
│   │   └── style.css
│   │
│   ├── js/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   └── land.js
│   │
│   ├── pages/
│   │   ├── blockchain.html
│   │   ├── dashboard.html
│   │   ├── land-details.html
│   │   ├── land-records.html
│   │   ├── login.html
│   │   ├── my-land.html
│   │   ├── profile.html
│   │   ├── register.html
│   │   ├── transfer-ownership.html
│   │   └── verify-land.html
│   │
│   └── add-land.html
│
├── .gitignore
├── package.json
└── package-lock.json
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/Blockchain-Cloud-Land-Record-Management.git
```

### 2. Open the project

```bash
cd Blockchain-Cloud-Land-Record-Management
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the project root/backend configuration location expected by your application.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
```

**Never upload `.env` to GitHub.**

## ▶️ Running the Application

Start the backend server:

```bash
npm start
```

The backend runs on:

```text
http://localhost:5000
```

The frontend can be opened using a local web server such as **VS Code Live Server**.

## 🔗 Important API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Land Records

```text
GET    /api/land-records
GET    /api/land-records/:id
POST   /api/land-records
PUT    /api/land-records/:id
DELETE /api/land-records/:id
```

### Blockchain

```text
GET /api/blockchain
```

The blockchain endpoint provides the current chain and its validation status.

## 🔐 Security

The project uses several mechanisms to improve security:

* JWT-based authentication
* MongoDB cloud storage
* Blockchain hashing
* Previous-hash linking between blocks
* Blockchain integrity validation
* Environment variables for sensitive configuration
* CORS configuration

## 🔄 Blockchain Transaction Types

The system supports blockchain transactions for important land operations:

```text
LAND_RECORD_CREATED
LAND_RECORD_UPDATED
LAND_RECORD_DELETED
OWNERSHIP_TRANSFER
```

Each transaction is stored inside a blockchain block with its associated hash information.

## 🧪 Example Workflow

```text
1. User registers
       ↓
2. User logs in
       ↓
3. User opens Dashboard
       ↓
4. User adds a land record
       ↓
5. Land record is stored in MongoDB
       ↓
6. Blockchain transaction is created
       ↓
7. User can view the land record
       ↓
8. User can transfer ownership
       ↓
9. Ownership transaction is added to blockchain
       ↓
10. User verifies land using Survey Number
       ↓
11. Land and blockchain information are displayed
```

## 📊 Expected Output

The dashboard provides access to:

* Add Land Record
* View Land Records
* Transfer Ownership
* Verify Land
* View Blockchain
* Total Land Records
* Total Blockchain Blocks
* Blockchain Validation Status

## 🚀 Future Enhancements

* Role-based access control for government officials and citizens
* Digital document upload and verification
* Smart contract integration
* QR-based land verification
* Digital signatures
* Advanced audit history
* Cloud deployment
* Blockchain network integration
* Improved responsive UI

## 👩‍💻 Author

**Abhinaya Kuchi**

B.Tech – Artificial Intelligence and Data Science

## 📄 License

This project is developed for educational and academic purposes.

```
```
