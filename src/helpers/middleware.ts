import Hapi from '@hapi/hapi';
import redisClient from './redis';
import jwt from 'jsonwebtoken';
import Boom from "@hapi/boom";
import dotenv from 'dotenv';
dotenv.config(); 
// Middleware function to check JWT validity
const middlewareFunction = async (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
    const { authorization } = request.headers;
  
    // Check if authorization header exists
    if (!authorization) {
      throw Boom.unauthorized('Missing authorization header');
    }
  
    // Extract the token from the Authorization header
    const token = authorization.replace('Bearer ', '');
  
    try {
      // Verify the token using JWT library
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET || 'secret');
      // Check if the token exists in Redis
      const tokenExists = await redisClient.exists(token);
  
      if (!tokenExists) {
        throw Boom.unauthorized('Invalid token');
      }
  
      // Store the decoded token in request.auth.credentials
      request.auth.credentials = {decodedToken};
  
      // Pass control to the next handler
      return h.continue;
    } catch (error) {
      throw Boom.unauthorized('Invalid token');
    }
  };
  
  

export const middlewareOptions = {
    pre: [{ method: middlewareFunction }],
}
