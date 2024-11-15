import { Router, Request, Response } from "express";
import { AuthenticatedUser, Login, Logout, Register, SendPasswordToken, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { CreateProvinsi, DeleteProvinsi, GetAllProvinsi, GetProvinsi, UpdateProvinsi } from "./controllers/provinsi.controller";
import { CreateCategoryWisata, DeleteCategoryWisata, GetAllCategoryWisata, GetCategoryWisata, UpdateCategoryWisata } from "./controllers/category-wisata.controller";
import { CreateTempatWisata, DeleteTempatWisata, GetAllTempatWisata, GetAllTempatWisataCategory, GetAllTempatWisataProvinsi, GetTempatWisata, UpdateTempatWisata } from "./controllers/tempat-wisata.controller";
import { CreateRencanaManual, CreateRencanaTempatWisataManual, DeleteRencanaManual, DeleteRencanaTempatWisataManual, GetRencanaUserManual } from "./controllers/rencana-manual.controller";
import { CreateRencanaOtomatis, GetRencanaUserOtomatis, CreateRencanaTempatWisataOtomatis, DeleteRencanaOtomatis, DeleteRencanaTempatWisataOtomatis } from "./controllers/rencana-otomatis.controller";

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
    router.get('/api/user/provinsi', GetAllProvinsi);
    router.post('/api/admin/provinsi', AuthMiddleware, CreateProvinsi);
    router.get('/api/provinsi/:id', AuthMiddleware, GetProvinsi);
    router.put('/api/provinsi/:id', AuthMiddleware, UpdateProvinsi);
    router.delete('/api/provinsi/:id', AuthMiddleware, DeleteProvinsi);

    // * Category Wisata
    router.get('/api/user/category-wisata', GetAllCategoryWisata);
    router.post('/api/admin/category-wisata', AuthMiddleware, CreateCategoryWisata);
    router.get('/api/admin/category-wisata/:id', AuthMiddleware, GetCategoryWisata);
    router.put('/api/admin/category-wisata/:id', AuthMiddleware, UpdateCategoryWisata);
    router.delete('/api/admin/category-wisata/:id', AuthMiddleware, DeleteCategoryWisata);

    // * Tempat Wisata
    router.get('/api/user/tempat-wisata', GetAllTempatWisata);
    router.get('/api/user/tempat-wisata/:id', GetTempatWisata);
    router.get('/api/user/tempat-wisata/provinsi/:provinsi', GetAllTempatWisataProvinsi);
    router.get('/api/user/tempat-wisata/category/:category_wisata', GetAllTempatWisataCategory);
    router.post('/api/admin/tempat-wisata', AuthMiddleware, CreateTempatWisata);
    router.get('/api/admin/tempat-wisata/:id', AuthMiddleware, GetTempatWisata);
    router.put('/api/admin/tempat-wisata/:id', AuthMiddleware, UpdateTempatWisata);
    router.delete('/api/admin/tempat-wisata/:id', AuthMiddleware, DeleteTempatWisata);

    // * Perencanaan Manual
    router.get('/api/user/rencanaku-manual', AuthMiddleware, GetRencanaUserManual);
    router.post('/api/user/rencana-manual', AuthMiddleware, CreateRencanaManual);
    router.post('/api/user/rencana-wisata-manual', AuthMiddleware, CreateRencanaTempatWisataManual);
    router.delete('/api/user/rencana-manual/:id', AuthMiddleware, DeleteRencanaManual);
    router.delete('/api/user/rencana-wisata-manual/:id_rencana_manual/:id_tempat_wisata', AuthMiddleware, DeleteRencanaTempatWisataManual);

    // * Perencanaan Otomatis
    router.get('/api/user/rencanaku-ai', AuthMiddleware, GetRencanaUserOtomatis);
    router.post('/api/user/rencana-otomatis', AuthMiddleware, CreateRencanaOtomatis);
    router.post('/api/user/rencana-wisata-otomatis', AuthMiddleware, CreateRencanaTempatWisataOtomatis);
    router.delete('/api/user/rencana-otomatis/:id', AuthMiddleware, DeleteRencanaOtomatis);
    router.delete('/api/user/rencana-wisata-otomatis/:id_rencana_otomatis/:id_tempat_wisata', AuthMiddleware, DeleteRencanaTempatWisataOtomatis);

};