FROM node:20-alpine

# Create and set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your app will run on
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
