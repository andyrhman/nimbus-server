import { Request, Response } from "express";
import { myPrisma } from "../config/db.config";

export const Users = async (req: Request, res: Response) => {
    let user = await myPrisma.user.findMany();

    user = user.map((user: any) => {
        const { password, ...data } = user;
        return data;
    });

    if (req.query.search) {
        const search = req.query.search.toString().toLowerCase();
        user = user.filter(
            p => p.nama.toLowerCase().indexOf(search) >= 0 ||
                p.username.toLowerCase().indexOf(search) >= 0
        );
    }

    res.send(user);
};

export const DeleteUser = async (req: Request, res: Response) => {
    await myPrisma.user.delete({ where: { id: Number(req.params.id) } });

    res.status(204).send(null);
};
