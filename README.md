# todo-node-api
API developed for a Todo Project Management Tool.
# Stack -> Node.js + Express.js + MongoDB
The Stack used is Node.js with Express using Typescript, on the database I decided to use the non-relational mongoDb database.

https://mongoosejs.com/
# Authentication
Authentication with JWT
User authentication/autorization system using **jsonwebtoken, bcrypt and bodyparser**

# Instructions
To access the MongoDB container use the following command:
docker exec -it todo-node-api-mongo-db-1 mongosh

To connect with authentication use this:
mongodb://<username>:<password>@localhost:27017/<database>?authSource=<authDatabase>
mongodb://root:password@localhost:27017/todo-app?authSource=admin

# Mongosh useful commands
Choose the database
- use <db_name>
List all collections in the selected database
- show collections
To view data in a specific collection
- db.<collection_name>.find().pretty()
- - db.tickets.find().pretty()
- - db.categories.find().pretty()
- - db.users.find().pretty()

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

# TODO
Creating versioning of endpoint
/v2/
/v1/ 
