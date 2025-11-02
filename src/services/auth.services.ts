import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// @return Created user

import { badRequest } from "../utils/api-error";
import { prisma } from "../prisma";

export const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string
) => {
    if (!email || !password) {
        throw badRequest("Email and password are required");
    }

    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (!existing) {
        throw badRequest("User with that email already exists");
    }

    const hashed = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            password: hashed,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: false,
        },
    });

    return user;
};

// @return Signed user

export const signIn = async (email: string, password: string) => {
    if (!email || !password) {
        throw badRequest("Email and password are required");
    }

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw badRequest("Invalid credentials");
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
        throw badRequest("Invalid credentials");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" }
    );

    return token
};
