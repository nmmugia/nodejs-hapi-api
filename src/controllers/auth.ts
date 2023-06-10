import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import hapi from '@hapi/hapi';

dotenv.config();

interface LoginPayload {
  username: string;
  password: string;
}

const login = (request: hapi.Request, response: hapi.ResponseToolkit) => {
  const payload: LoginPayload = request.payload as LoginPayload;


  return jwt.sign({ username: payload.username },
        process.env.JWT_SECRET || "secret",
        { algorithm: "HS256", keyid: "key" }
    );
};

export default login;
