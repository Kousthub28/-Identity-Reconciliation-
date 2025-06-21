# Identity Reconciliation Backend

This is a backend web service built to solve identity duplication challenges — like linking multiple contact details (emails, phone numbers) belonging to the same user across multiple purchases or sessions. Inspired by a fictional use case from Zamazon.com, this project consolidates contact information into unified customer profiles.

## Tech Stack

- Node.js with Express.js – Web server and routing  
- PostgreSQL – Relational database to store contacts  
- Prisma ORM – Clean and type-safe database access  
- Postman – Used for API testing

## Folder Structure

identity-reconciliation/
├── prisma/
│   └── schema.prisma     # Prisma DB schema
├── src/
│   ├── app.js            # Express app setup
│   ├── controllers/
│   │   └── contactController.js
│   ├── services/
│   │   └── contactService.js
│   └── routes/
│       └── identify.js   # API route
├── .env                  # Environment variables
├── package.json
├── README.md

## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/Kousthub28/-Identity-Reconciliation-.git  
cd identity-reconciliation

### 2. Install Dependencies

npm install

### 3. Setup the Environment

Create a `.env` file in the root directory:

DATABASE_URL="postgresql://postgres:1234@localhost:5432/identitydb"  
PORT=3000

Make sure PostgreSQL is running locally and `identitydb` database exists.

### 4. Run Migrations

npx prisma migrate dev --name init

This creates the `Contact` table in the database.

### 5. Start the Server

node src/app.js

The server will start at http://localhost:3000

## API Endpoint

### POST /identify

Request Body:

{
  "email": "doc@zamazon.com",
  "phoneNumber": "9876543210"
}

Response Example:

{
  "contact": {
    "primaryContactId": 1,
    "emails": ["doc@zamazon.com"],
    "phoneNumbers": ["9876543210"],
    "secondaryContactIds": []
  }
}

## Contact Linking Logic

- New Email + Phone → Create new primary contact  
- Existing Email or Phone → Create secondary contact linked to existing  
- Both Existing, Different Primaries → Merge into one (oldest is primary)

## Features

- Handles identity linking across multiple data points  
- Supports email or phone-only matching  
- Merges overlapping contact chains intelligently  
- Prisma ensures type-safe DB operations  
- Fully tested via Postman

## Testing

Use Postman or curl to test the /identify route.

## Deployment

This app can be easily deployed on platforms like:
- Railway
- Render
- Vercel (API layer)
- Supabase (PostgreSQL)

Just update the `DATABASE_URL` in `.env` for production.

## Author

Kousthub Danda  
https://github.com/Kousthub28

