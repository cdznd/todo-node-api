Basic API for a todo app
NODE.js + Express.js

*
Express has no notion of a database. This concept is left up to third-party Node modules, allowing you to interface with nearly any database.

Database choosen
MongoDB + https://mongoosejs.com/
possible transition to dynamo db

*
Authentication is another opinionated area that Express does not venture into. You may use any authentication scheme you wish.
*


User authentication/autorization system

User
    email
    password
    name

Ticket CRUD
    title
    category
    status
    priority

Development Steps

install 
mongoose jsonwebtoken bcrypt bodyparser

Database
1 - database, install/configure mongoDB.
2 - Create User schema
3 - Create Ticket schema

Authentication
1 - Authentication
2 - Password Recovery
3 - Register
4 - Activation (by email...)

