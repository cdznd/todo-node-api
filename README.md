# Basic API for a todo app
# Node.js + Express.js
# Notes
*
Express has no notion of a database. This concept is left up to third-party Node modules, allowing you to interface with nearly any database.
*
Database choosen
MongoDB + https://mongoosejs.com/
possible transition to dynamo db
*
Authentication is another opinionated area that Express does not venture into. You may use any authentication scheme you wish.
*
Authentication with JWT
User authentication/autorization system
*
Default way to return errors
"errors": [
    {
        "detail": "Authentication credentials were not provided."
    }
]
          // Desired return shape
          // "links": {
          //    "prev": null,
          //    "next": "https://rover.kubefeature.hearstapps.net/v2/content?page=2"
          //  },
          //  "meta": {
          //    "result_count": 25
          //  },
          // "data": []

# Development Steps

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
# My Node.js Express REST API Documentation
This documentation outlines the endpoints and usage of the My Node.js Express REST API.

**Base URL:** `http://example.com/api`
**Local base URL:** `http://localhost:8080`

**Authentication:** This API requires authentication via Login and JWT[API key]. Include your API key in the request headers as `Authorization: Bearer YOUR_API_KEY`.

## Endpoints

### 1. Authentication Endpoints

**Login**
- **URL:** `/login`
- **Method:** `POST`
- **Description:** Attemp to login using an email and password.
- **Parameters:** 
    email (string, required): User's Email Address
    password (string, required): User's Password

**Example Request:**
POST /login
Content-Type: application/json
{
    "email": "test@test.com",
    "password": "password"
}

**Signup**
- **URL:** `/signup`
- **Method:** `POST`
- **Description:** Creates a new user with a valid email and password.
- **Parameters:** 
    name (string, required): Name of the user.
    email (string, required, unique): User's Email Address
    password (string, required): User's Password

**Example Request:**
POST /signup
Content-Type: application/json
{
    "name": "Mr.Smith",
    "email": "test@test.com",
    "password": "password"
}
**Response**


### 2. Users Endpoints

- **URL:** `/users/{id}`
- **Method:** `GET`
- **Description:** Returns an specific user by providing the ID.

**Example Request:**
GET /users/{id}

**Response**
{
    "name": "Mr.Smith",
    "email": "test@test.com",
}

### 3. Tickets Endpoints

**Create Ticket**
- **URL:** `/tickets`
- **Method:** `POST`
- **Description:** Create a new ticket for the logged in user.
- **User Authentication Required**

**Example Request:**
POST /tickets
Content-Type: application/json
{
    "title": "",
    "category": "",
    "status": "",
    "priority": "",
}

**Get All Tickets**
- **URL:** `/tickets`
- **Method:** `GET`
- **Description:** Returns All tickets of the logged user.

**Example Request:**
GET /tickets

**Response**
[
    {
        "title": "",
        "category": "",
        "status": "",
        "priority": "",
    }
]

**Get Ticket by ID**
- **URL:** `/tickets/{id}`
- **Method:** `GET`
- **Description:** Get ticket by ID.

**Example Request:**
GET /tickets/{id}

**Response**
{
    "name": "Mr.Smith",
    "email": "test@test.com",
}

**Update Ticket**
- **URL:** `/tickets/{id}`
- **Method:** `PUT`
- **Description:** Get ticket by ID.

**Example Request:**
PUT /tickets/{id}
Content-Type: application/json
{
    "title": "",
    "category": "",
    "status": "",
    "priority": "",
}

**Delete Ticket**
- **URL:** `/tickets/{id}`
- **Method:** `DELETE`
- **Description:** Get ticket by ID.

**Example Request:**
DELETE /tickets/{id}