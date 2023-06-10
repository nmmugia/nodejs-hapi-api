import authController from "../controllers/auth"

const auth: any[] = [
    {
        method: 'POST',
        path: '/login',
        handler:  authController
    },
];

export default auth