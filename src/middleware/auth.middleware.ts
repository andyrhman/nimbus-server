import { Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { myPrisma } from "../config/db.config";

export const AuthMiddleware: any = async (req: Request, res: Response, next: Function) => {
    try {
        const mySession = req.cookies["user_session"];

        if (!jwt) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const { verify } = jwt;
        const payload: any = verify(mySession, process.env.JWT_SECRET_ACCESS);

        if (!payload) {
            return res.status(401).send({ message: "Unauthorized" });
        }

        const is_user = req.path.indexOf('api/user') >= 0;

        const { scope } = payload;
        
        const is_admin = scope === 'admin';

        const user = await myPrisma.user.findUnique({ where: { id: payload.id } });

        if ((is_user && (scope === 'user' || is_admin)) || (!is_user && is_admin)) {
            req["user"] = user;
            next();
        } else {
            return res.status(403).send({ message: "Forbidden" });
        }
    } catch (error) {
        return res.status(401).send({ message: "Unauthorized" });
    }
};