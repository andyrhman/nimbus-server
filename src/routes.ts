import { Router, Request, Response } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { CreateProvinsi, DeleteProvinsi, GetAllProvinsi, GetProvinsi, UpdateProvinsi } from "./controllers/provinsi.controller";
import { CreateCategoryWisata, DeleteCategoryWisata, GetAllCategoryWisata, GetCategoryWisata, UpdateCategoryWisata } from "./controllers/category_wisata.controller";
import { CreateTempatWisata, DeleteTempatWisata, GetAllTempatWisata, GetAllTempatWisataCategory, GetAllTempatWisataProvinsi, GetMostPopularDestination, GetRekomendasiTerdekat, GetTempatWisata, GetTopFiveDestinasiSerupa, UpdateTempatWisata } from "./controllers/tempat_wisata.controller";
import { CreateRencanaManual, CreateRencanaTempatWisataManual, DeleteRencanaManual, DeleteRencanaTempatWisataManual, GetRencanaUserDestinasiManual, GetRencanaUserManual } from "./controllers/rencana_manual.controller";
import { CreateRencanaOtomatis, GetRencanaUserOtomatis, DeleteRencanaOtomatis, DeleteRencanaTempatWisataOtomatis, GetRencanaUserDestinasiOtomatis } from "./controllers/rencana_otomatis.controller";
import { DeleteUser, Users } from "./controllers/user.controller";
import { PerencanaanManualChart, PerencanaanOtomatisChart, Stats, UsersChart } from "./controllers/statistic.controller";

export const routes = (router: Router) => {
    // * Health Check
    router.get('/', (req: Request, res: Response) => {
        res.status(200).send({
            status: "Status Server Ok 👍(v2)",
            provinsi: "https://nimbus-dev-374190138836.asia-southeast2.run.app/api/user/provinsi",
            categoryWisata: "https://nimbus-dev-374190138836.asia-southeast2.run.app/api/user/category-wisata",
            tempatWisata: "https://nimbus-dev-374190138836.asia-southeast2.run.app/api/user/tempat-wisata",
            tempatWisataByProvinsi: "https://nimbus-dev-374190138836.asia-southeast2.run.app/api/user/tempat-wisata/provinsi/Yogyakarta",
            tempatWisataByCategory: "https://nimbus-dev-374190138836.asia-southeast2.run.app/api/user/tempat-wisata/category/Pantai"
        });
    });

    // * Authentication User
    router.post('/api/register', Register);
    router.post('/api/login', Login);
    router.get('/api/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/user/logout', AuthMiddleware, Logout);
    router.put('/api/user/info', AuthMiddleware, UpdateInfo);
    router.put('/api/user/password', AuthMiddleware, UpdatePassword);

    // * Authentication Admin
    router.post('/api/admin/login', Login);
    router.get('/api/admin', AuthMiddleware, AuthenticatedUser);
    router.post('/api/admin/logout', AuthMiddleware, Logout);
    router.put('/api/admin/info', AuthMiddleware, UpdateInfo);
    router.put('/api/admin/password', AuthMiddleware, UpdatePassword);

    // * User
    router.get("/api/admin/users", AuthMiddleware, Users);
    router.delete("/api/admin/users/:id", AuthMiddleware, DeleteUser);

    // * Provinsi
    router.get('/api/user/provinsi', GetAllProvinsi);
    router.post('/api/admin/provinsi', AuthMiddleware, CreateProvinsi);
    router.get('/api/admin/provinsi/:id', AuthMiddleware, GetProvinsi);
    router.put('/api/admin/provinsi/:id', AuthMiddleware, UpdateProvinsi);
    router.delete('/api/admin/provinsi/:id', AuthMiddleware, DeleteProvinsi);

    // * Category Wisata
    router.get('/api/user/category-wisata', GetAllCategoryWisata);
    router.post('/api/admin/category-wisata', AuthMiddleware, CreateCategoryWisata);
    router.get('/api/admin/category-wisata/:id', AuthMiddleware, GetCategoryWisata);
    router.put('/api/admin/category-wisata/:id', AuthMiddleware, UpdateCategoryWisata);
    router.delete('/api/admin/category-wisata/:id', AuthMiddleware, DeleteCategoryWisata);

    // * Tempat Wisata
    router.post('/api/user/recommend-destinations', GetRekomendasiTerdekat);
    router.post('/api/user/top-five-similar', GetTopFiveDestinasiSerupa);
    router.post('/api/user/most-popular', GetMostPopularDestination);
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
    router.get('/api/user/rencanaku-manual-destinasi/:id', AuthMiddleware, GetRencanaUserDestinasiManual);
    router.post('/api/user/rencana-manual', AuthMiddleware, CreateRencanaManual);
    router.post('/api/user/rencana-wisata-manual', AuthMiddleware, CreateRencanaTempatWisataManual);
    router.delete('/api/user/rencana-manual/:id', AuthMiddleware, DeleteRencanaManual);
    router.delete('/api/user/rencana-wisata-manual/:id_rencana_manual/:id_tempat_wisata', AuthMiddleware, DeleteRencanaTempatWisataManual);

    // * Perencanaan Otomatis
    router.get('/api/user/rencanaku-ai', AuthMiddleware, GetRencanaUserOtomatis);
    router.get('/api/user/rencanaku-ai-destinasi/:id', AuthMiddleware, GetRencanaUserDestinasiOtomatis);
    router.post('/api/user/rencana-otomatis', AuthMiddleware, CreateRencanaOtomatis);
    router.delete('/api/user/rencana-otomatis/:id', AuthMiddleware, DeleteRencanaOtomatis);
    router.delete('/api/user/rencana-wisata-otomatis/:id_rencana_otomatis/:id_tempat_wisata', AuthMiddleware, DeleteRencanaTempatWisataOtomatis);

    // * Statistic
    router.get("/api/admin/stats", AuthMiddleware, Stats);
    router.get('/api/admin/user-chart', AuthMiddleware, UsersChart);
    router.get('/api/admin/pm-chart', AuthMiddleware, PerencanaanManualChart);
    router.get('/api/admin/po-chart', AuthMiddleware, PerencanaanOtomatisChart);
};