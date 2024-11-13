import { Router, Request, Response } from "express";
import { AuthenticatedUser, Login, Logout, Register, SendPasswordToken, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { CreateProvinsi, DeleteProvinsi, GetProvinsi, UpdateProvinsi } from "./controllers/provinsi.controller";
import { CreateCategoryWisata, DeleteCategoryWisata, GetCategoryWisata, UpdateCategoryWisata } from "./controllers/category-wisata.controller";

export const routes = (router: Router) => {
    // * Health Check
    router.get('/', (req: Request, res: Response) => { res.status(200).send({ status: "Status Server Ok 👍" }); });

    // * Authentication
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/logout', AuthMiddleware, Logout);
    router.put('/api/user/info', AuthMiddleware, UpdateInfo);
    router.post('/api/user/send-password-token', AuthMiddleware, SendPasswordToken);
    router.put('/api/user/password', AuthMiddleware, UpdatePassword);

    // * Provinsi
    router.post('/api/provinsi', CreateProvinsi);
    router.get('/api/provinsi/:id', GetProvinsi);
    router.put('/api/provinsi/:id', UpdateProvinsi);
    router.delete('/api/provinsi/:id', DeleteProvinsi);

    // * Category Wisata
    router.post('/api/category-wisata', CreateCategoryWisata);
    router.get('/api/category-wisata/:id', GetCategoryWisata);
    router.put('/api/category-wisata/:id', UpdateCategoryWisata);
    router.delete('/api/category-wisata/:id', DeleteCategoryWisata);
};