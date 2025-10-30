import { Request, Response } from "express";
import * as authService from "../services/auth.services";

// @desc Create account
// @route POST /create-account

export const createAccount = async (req: Request, res: Response) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const user = await authService.createUser(
            firstName,
            lastName,
            email,
            password
        );

        res.status(201).json({ user });
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({ message: error.message });
        }
    }
};

// @desc Sign in
// @route POST /sign-in

export const signIn = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const token = await authService.signIn(email, password);

        res.status(200).json({ token });
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({ message: error.message });
        }
    }
};
