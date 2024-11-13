import { Router, Request, Response } from "express";
import { AuthenticatedUser, Login, Logout, Register, SendPasswordToken, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { CreateProvinsi, DeleteProvinsi, GetProvinsi, UpdateProvinsi } from "./controllers/provinsi.controller";
import { CreateCategoryWisata, DeleteCategoryWisata, GetCategoryWisata, UpdateCategoryWisata } from "./controllers/category-wisata.controller";
import { CreateTempatWisata, DeleteTempatWisata, GetAllTempatWisata, GetAllTempatWisataCategory, GetAllTempatWisataProvinsi, GetTempatWisata, UpdateTempatWisata } from "./controllers/tempat-wisata.controller";

export const routes = (router: Router) => {
    // * Health Check
    router.get('/', (req: Request, res: Response) => { res.status(200).send({ status: "Status Server Ok 👍" }); });

    // * Authentication User
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/user/logout', AuthMiddleware, Logout);
    router.put('/api/user/info', AuthMiddleware, UpdateInfo);
    router.post('/api/user/send-password-token', AuthMiddleware, SendPasswordToken);
    router.put('/api/user/password', AuthMiddleware, UpdatePassword);

    // * Authentication Admin
    router.post('/api/admin/login', Login);
    router.get('/api/admin', AuthMiddleware, AuthenticatedUser);
    router.post('/api/admin/logout', AuthMiddleware, Logout);
    router.put('/api/admin/info', AuthMiddleware, UpdateInfo);
    router.post('/api/admin/send-password-token', AuthMiddleware, SendPasswordToken);
    router.put('/api/admin/password', AuthMiddleware, UpdatePassword);

    // * Provinsi
    router.get('/api/provinsi');
    router.post('/api/admin/provinsi', AuthMiddleware, CreateProvinsi);
    router.get('/api/provinsi/:id', AuthMiddleware, GetProvinsi);
    router.put('/api/provinsi/:id', AuthMiddleware, UpdateProvinsi);
    router.delete('/api/provinsi/:id', AuthMiddleware, DeleteProvinsi);

    // * Category Wisata
    router.get('/api/provinsi');
    router.post('/api/admin/category-wisata', AuthMiddleware, CreateCategoryWisata);
    router.get('/api/admin/category-wisata/:id', AuthMiddleware, GetCategoryWisata);
    router.put('/api/admin/category-wisata/:id', AuthMiddleware, UpdateCategoryWisata);
    router.delete('/api/admin/category-wisata/:id', AuthMiddleware, DeleteCategoryWisata);

    // * Tempat Wisata
    router.get('/api/tempat-wisata', GetAllTempatWisata);
    router.get('/api/tempat-wisata/:provinsi', GetAllTempatWisataProvinsi);
    router.get('/api/tempat-wisata/:category_wisata', GetAllTempatWisataCategory);
    router.post('/api/admin/tempat-wisata', AuthMiddleware, CreateTempatWisata);
    router.get('/api/admin/tempat-wisata/:id', AuthMiddleware, GetTempatWisata);
    router.put('/api/admin/tempat-wisata/:id', AuthMiddleware, UpdateTempatWisata);
    router.delete('/api/admin/tempat-wisata/:id', AuthMiddleware, DeleteTempatWisata);

};