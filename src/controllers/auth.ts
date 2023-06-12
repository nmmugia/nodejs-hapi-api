import jwt from 'jsonwebtoken';
import hapi from '@hapi/hapi';
import Boom from '@hapi/boom';
import redisClient from '../helpers/redis';
import { encryptPassword, validatePassword } from '../helpers/encryption';

interface LoginPayload {
  username: string;
  password: string;
}

const TOKEN_EXPIRATION_TIME = 60 * 60; // 1 hour in seconds

export const login = async (request: hapi.Request, h: hapi.ResponseToolkit) => {
  try {
    const payload: LoginPayload = request.payload as LoginPayload;

    // Retrieve user data from Redis
    const userData = await redisClient.get(payload.username);
    if (!userData) {
      throw Boom.unauthorized('Invalid username or password');
    }

    // Parse the user data
    const { username, password: encryptedPassword } = JSON.parse(userData);

    // Validate the password
    const isValidPassword = await validatePassword(payload.password, encryptedPassword);
    if (!isValidPassword) {
      throw Boom.unauthorized('Invalid username or password');
    }

    // Generate a JWT token
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', {
      algorithm: 'HS256',
      keyid: 'key',
    });

    // Store the token in Redis with a TTL of 1 hour
    await redisClient.set(token, username, 'EX', TOKEN_EXPIRATION_TIME);

    return token;
  } catch (error) {
    throw new Error('Login failed');
  }
};

export const signup = async (request: hapi.Request, h: hapi.ResponseToolkit) => {
  try {
    const payload: LoginPayload = request.payload as LoginPayload;

    // Encrypt the password
    const encryptedPassword = await encryptPassword(payload.password);

    // Generate a JWT token
    const token = jwt.sign({ username: payload.username }, process.env.JWT_SECRET || 'secret', {
      algorithm: 'HS256',
      keyid: 'key',
    });

    // Store the token in Redis with a TTL of 1 hour
    await redisClient.set(token, payload.username, 'EX', TOKEN_EXPIRATION_TIME);

    // Store the user data in Redis
    const userData = JSON.stringify({ username: payload.username, password: encryptedPassword });
    await redisClient.set(payload.username, userData);

    return token;
  } catch (error) {
    throw  Boom.internal('Signup failed');
  }
};
