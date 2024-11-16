import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { myPrisma } from "../config/db.config";
import { PerencanaanManualService } from "../service/rencana-manual.service";
import { PerencanaanOtomatisService } from "../service/rencana-otomatis.service";
import json from "../utility/json.utility";

export const Stats = async (req: Request, res: Response) => {
    const userService = new UserService(myPrisma);
    const perencanaanManualService = new PerencanaanManualService(myPrisma);
    const perencanaanOtomatisService = new PerencanaanOtomatisService(myPrisma);

    const user_total = await userService.total({});
    const perencanaan_manual_total = await perencanaanManualService.total({});
    const perencanaan_otomatis_total = await perencanaanOtomatisService.total({});
    res.send({
        user_total: user_total.total,
        perencanaan_manual_total: perencanaan_manual_total.total,
        perencanaan_otomatis_total: perencanaan_otomatis_total.total
    });
};

export const UsersChart = async (req: Request, res: Response) => {
    const userService: any = new UserService(myPrisma);
    res.send(json(await userService.chart()));
};

export const PerencanaanManualChart = async (req: Request, res: Response) => {
    const perencanaanManualService: any = new PerencanaanManualService(myPrisma);
    res.send(json(await perencanaanManualService.chart()));
};

export const PerencanaanOtomatisChart = async (req: Request, res: Response) => {
    const perencanaanOtomatisService: any = new PerencanaanOtomatisService(myPrisma);
    res.send(json(await perencanaanOtomatisService.chart()));
};