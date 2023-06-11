import jwt from 'jsonwebtoken';
import hapi from '@hapi/hapi';

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
