# Project Overview
This **API** serves as the backend for the [Todo React App](https://github.com/cdznd/todo-react-app). Built using **Node.js**, **Express**, and **TypeScript**, it is designed to provide a secure environment for managing tasks in a to-do list application. The API leverages **JWT (JSON Web Token)** authentication with a **refresh token mechanism**, ensuring secure access and a smooth user experience.
The application also leverages **Swagger** for **API documentation**, allowing developers to easily explore and interact with the available endpoints, making it easier to understand the structure and functionality of the API.

## Key Features:
- **JWT Authentication**: The API implements **JWT authentication** with a **refresh token** system, ensuring secure and efficient user authentication. The refresh token allows for seamless token renewal, improving security and reducing the need for users to constantly log in.
- **Swagger Documentation**: The API includes **Swagger** documentation for easy understanding and interaction with the available endpoints. It is automatically generated using **swagger-jsdoc** and **swagger-ui-express**, allowing developers and users to explore the API with ease.
- **Unit Tests**: The API features **high coverage with unit tests**, written using **Jest**. This ensures the functionality of the API is completely validated, and it is maintainable and scalable in the long run.
- **TypeScript Best Practices**: The project stick to **TypeScript best practices**, ensuring strong typing, clean code, and improved maintainability. TypeScript helps catch errors early and improves developer experience with enhanced code autocompletion and validation.
- **MongoDB**: The API integrates with **MongoDB** for data persistence, ensuring a flexible and scalable database solution. The project also includes a **Mongo Express** web-based admin interface for easy database management and monitoring through a user-friendly dashboard.

## Libraries & Tools:
- **Express**: The core web framework used for building the RESTful API.
- **Mongoose**: Provides a robust solution for interacting with MongoDB, ensuring schema validation and data consistency.
- **JWT & Bcrypt**: These libraries are used for handling authentication securely, with password hashing and token creation.
- **Swagger**: Automatically generates documentation for all available API endpoints.
- **Jest & Supertest**: Used for writing and running unit tests, ensuring the API's functionality is robust and secure.

## Overall Thoughts
This API provides a strong foundation for the Todo React App, ensuring secure user authentication, easy-to-use documentation, and high-quality code with reliable testing.

## Screenshots
Here you can see some visuals of the app in action:

## Installation Guide
Follow these steps to run the application locally:

---

## development notes

https://mongoosejs.com/

### Authentication
Authentication with JWT
User authentication/autorization system using **jsonwebtoken, bcrypt and bodyparser**

### Instructions
To access the MongoDB container use the following command:
docker exec -it todo-node-api-mongo-db-1 mongosh

To connect with authentication use this:
mongodb://<username>:<password>@localhost:27017/<database>?authSource=<authDatabase>
mongodb://root:password@localhost:27017/todo-app?authSource=admin

### Mongosh useful commands
Choose the database
- use <db_name>
List all collections in the selected database
- show collections
To view data in a specific collection
- db.<collection_name>.find().pretty()
- - db.tickets.find().pretty()
- - db.categories.find().pretty()
- - db.users.find().pretty()

### Development Steps
Database
1 - database, install/configure mongoDB.
2 - Create User schema
3 - Create Ticket schema

Authentication
1 - Authentication
2 - Password Recovery
3 - Register
4 - Activation (by email...)

### Database Schema
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

### Future Updates
Creating versioning of endpoint
/v2/
/v1/ 
