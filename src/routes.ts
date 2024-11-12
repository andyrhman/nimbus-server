import { Router, Request, Response } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";

export const routes = (router: Router) => {
    router.get('/', (req: Request, res: Response) => { res.status(200).send({ status: "Status Server Ok 👍" }); });

    // * Authentication
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/user/info', AuthMiddleware, UpdateInfo);
    router.put('/api/user/password', AuthMiddleware, UpdatePassword);
};