import {login, signup} from "../controllers/auth"

const auth: any[] = [
    {
        method: 'POST',
        path: '/login',
        handler:  login
    },{
        method: 'POST',
        path: '/signup',
        handler:  signup
    },
];

export default auth