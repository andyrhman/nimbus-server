import { Router, Request, Response } from "express";

export const routes = (router: Router) => {
    router.get('/', (req: Request, res: Response) => { res.status(200).send({ status: "Status Server Ok 👍" }); });

};