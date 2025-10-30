import { NextFunction, Request, Response } from "express";
import { unauthorized } from "../utils/api-error";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
    user?: {
        id: number;
        email: string;
    };
}

export const verifyToken = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const headers = req.headers.authorization;

    if (!headers) {
        throw unauthorized("No access token provided");
    }
    const token = headers?.split(" ")[1];

    if (!token) {
        throw unauthorized("Invalid token");
    }

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
            id: number;
            email: string;
        };

        req.user = decode;
        next();
    } catch (error) {
        throw unauthorized("Invalid or expired token");
    }
};
