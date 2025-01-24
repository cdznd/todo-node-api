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
<div>
  <img width="100%" height="450px" alt="image" src="https://github.com/user-attachments/assets/7d2d8b44-cc4c-4361-a6ad-aa8587a60923" />
  <hr>
  <img width="100%" height="450px" alt="image" src="https://github.com/user-attachments/assets/f85538d3-0f41-4e8a-af5c-caf42374dfb5" />
  <hr>
  <img width="100%" height="450px" alt="image" src="https://github.com/user-attachments/assets/c62be1bd-ea42-472d-a07f-356284c8bdff" />
</div>


## Installation Guide
Follow these steps to run the application locally:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v20.11.0)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Steps

1. **Clone the Repository**
   ```bash
   git clone git@github.com:cdznd/todo-node-api
   cd todo-node-api
   ```
2. **Start the MongoDB and MongoDB Express containers**
    ```bash
    docker compose up mongo-db mongo-express
    ```
2. **Update .env file**: create a .env file based on the [.env.sample](https://github.com/cdznd/todo-node-api/blob/readme-update/.env.sample) and update with the MongoDB Credentials.
3. **Install Dependencies**:
     Make sure you have Node.js v20.11.0 installed. Then, run:
    ```bash
    npm install
    npm run test
    npm start
    ```
4. **Access the API Docs**:
     Open your browser and navigate to: http://localhost:8080/api-docs

---

## development notes

### Links
- https://mongoosejs.com/
- https://owasp.org/www-community/attacks/csrf
- https://jwt.io/

### Instructions
To access the MongoDB container use the following command:
```bash
docker exec -it todo-node-api-mongo-db-1 mongosh
```

To connect with authentication use this:
```bash
mongodb://<username>:<password>@localhost:27017/<database>?authSource=<authDatabase>
mongodb://root:password@localhost:27017/todo-app?authSource=admin
```

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

### Authentication
Authentication with JWT
User authentication/autorization system using **jsonwebtoken, bcrypt and bodyparser**

JSON Web Tokens is a method for authenticating users in Web Applications. It allows you to securely transmit information between a client(usually a web browser) and a server. They are often used for user authentication and authorization.

- It’s an open standard that defines a compact and self-contained way to securely transmitting information between parties.
- This information can be verified and trusted because it’s digitally signed.
- JWTs can be signed using a **secret** or a public/private key pair.
- **Signed Tokens**

<img width="100%" height="450px" alt="image" src="https://github.com/user-attachments/assets/46cb9dc4-5190-4caa-96c9-2b4671033cf3" />

After signing the cookie to the browser, every request made from the browser will have the token, so the server now can verify the JWT token and identify the user.
Saving Token in cookies potentially opens up your site to cross-site request forgery attacks. That means that malicious sites can take a user’s authentication cookie and then make requests to our server posing as our user.
We won’t be exposing any state-changing endpoint that requires authentication.

### Token Creation
When our server is creating our JWT after the user successfully logs in. It creates the Header and the Payload and encodes them both. Then to sign the token / add the signature, it hashes the Header + Payload with the Secret stored on the server.
When those three things are hashed together it creates the token signature. and then the Token signature is added at the end of the JWT Token. And it can be sent to the browser. 

#### **Header**
It’s like metadata for the token. It tells the server what type of signature is being used (meta).
It consists of two parts
- Token Type
- Signing Algorithm

#### **Payload**
Used to identify the user (for example, it contains a user ID)
It’s data that is encoded into the JWT. It’s important that no sensitive data is stored here. as it can be decrypted by anyone who knows how.

#### Signature
Makes the token secure (like a stamp of authenticity of the server). It’s used to verify that the sender of the JWT is who it says it is and to ensure that the message wasn’t tampered with by a malicious party and that it was created by a trusted entity.
- To create the signature, you take the encoded header, the encoded payload, and a secret.
- And you use the **Signing Algorithm** specified on the **header** to create the signature.

```jsx
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

<img width="100%" height="450px" alt="image" src="https://github.com/user-attachments/assets/2e794417-208b-4517-9f66-4d69a1199254" />

- After Creating the Signature.
- Combine the Base64Url-encoded header, payload and signature using dots to the create the JWT.

### More links
- https://stackoverflow.com/questions/277044/do-i-need-to-store-the-salt-with-bcrypt
- https://stackoverflow.com/questions/42448372/typescript-mongoose-static-model-method-property-does-not-exist-on-type/45675548#45675548

### App.js Structure
- Packages imported to the file
- Initialization of express app
- Setting up Middlewares
    - express.json() → (parse the body request into a json and attach it to the req object)
- MongoDB connection
    - Setup connection string + moongose connect method.
    - Connect method returns a Promise.
    - OBS, don’t start listening the app before moongose is connected to the DB. As moongose connect returns a Promise you can start the server if the function is succeeded.
- Routes

### Auth routes
- **/signup** POST create a new user in DB
- **/login** POST authenticate a existent user
- **/logout** GET log out current user
- **/refresh** GET to get a new access token

**Express specific**
- Extract routes into a separate folder.
- Import express’s **Router**.
- Export extracted routes as **Router**.
- Use the extracted router as a middleware in the app.
- Link to the AuthController methods.

### User Model
Create a user model with **moongose**.
- Setup model **schema**. creating a new **moongose** Schema object.
- Create a model based on the schema.

**Compiling our schema into a model**

```jsx
mongoose.model('Article', ArticleSchema)
```

### Mongoose Validation
validate field in a schema.
Validator package to validate custom fields in schema
create a function to handle all erros in the controller

### Mongoose Hooks
- **Post** → Fire a function **after** a doc is saved to db.
- **Pre** → Fire a function **before** a doc is saved to db.
- next(); → to go to the next middleware in the stack.

### Future Updates
Creating versioning of endpoint
/v2/
/v1/ 
