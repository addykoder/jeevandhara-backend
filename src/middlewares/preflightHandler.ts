import { NextFunction, Response } from "express";
import { customRequest } from "../utils/types";

export default async function preflightHandler(req: customRequest, res: Response, next: NextFunction) {
	if(req.method === 'OPTIONS') {
        return res.status(200).json(({
            body: "OK"
        }))
    }
	next()
}