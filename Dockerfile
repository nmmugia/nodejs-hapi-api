# Use the official Node.js 14 base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
RUN yarn install

# Copy the rest of the application code to the container
COPY . .

# Expose the port on which your Hapi server is listening
EXPOSE 4000

# Start the Hapi server
CMD ["yarn", "serve"]
