import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/api-error";

export interface CustomError extends Error {
    status: number;
}

export const errorHandler = (
    err: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message });
    }
    return res.status(500).json({ message: "Internal Error" });
};
