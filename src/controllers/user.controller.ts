import { Request, Response } from "express";
import * as userService from "../services/user.services";

interface UserRequest extends Request {
    user?: {
        id: number
    }
}

// @desc Get user by id
// @route GET /me

export const getCurrentUser = async (req: UserRequest, res: Response) => {
    const userId = req.user?.id!;

    try {
        const user = await userService.getUserById(userId);

        res.status(200).json(user);
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({
                message: error.message,
            });
        }
    }
};

// @desc Update user
// @route PUT /:id

export const updateUser = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.id);
    const { firstName, lastName, email } = req.body;

    try {
        const user = await userService.updateUser(
            userId,
            firstName,
            lastName,
            email
        );

        res.status(200).json(user);
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({ message: error.message });
        }
    }
};

// @desc Delete user
// @route DELETE /:id

export const deleteUser = async (req: UserRequest, res: Response) => {
    const userId = parseInt(req.params.id);
    const reqUserId = req.user?.id

    try {
        await userService.deleteUser(userId, reqUserId!);

        res.status(200).json({
            message: "User deleted",
        });
    } catch (error: any) {
        if (error.message) {
            return res.status(error.status).json({ message: error.message });
        }
    }
};
