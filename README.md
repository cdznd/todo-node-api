# todo-node-api
API developed for a Todo Project Management Tool.
# Stack -> Node.js + Express.js + MongoDB
The Stack used is Node.js with Express using Typescript, on the database I decided to use the non-relational mongoDb database.

https://mongoosejs.com/
# Authentication
Authentication with JWT
User authentication/autorization system using **jsonwebtoken, bcrypt and bodyparser**

# Development Steps
Database
1 - database, install/configure mongoDB.
2 - Create User schema
3 - Create Ticket schema

Authentication
1 - Authentication
2 - Password Recovery
3 - Register
4 - Activation (by email...)
# Database Schema
User
    name
    email
    password
Ticket
    title
    category
    status
    priority
    created_at
    updated_at
