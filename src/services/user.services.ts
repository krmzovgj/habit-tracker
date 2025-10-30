import { prisma } from "../prisma";
import { badRequest, notFound } from "../utils/api-error";

// @return User object by id

export const getUserById = async (userId: number) => {
    if (!userId) {
        throw badRequest("User id is required");
    }

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            password: false,
        },
    });

    if (!user) {
        throw notFound("User not found");
    }

    return user;
};

// @return Updated user object

export const updateUser = async (
    userId: number,
    firstName: string,
    lastName: string,
    email: string
) => {

    if(!userId) {
        throw badRequest("User id is required")
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: {
            firstName,
            lastName,
            email,
        },
    });

    if(!user) {
        throw notFound("User not found")
    }

    return user
};

// @returns Delete confirmation

export const deleteUser = async (userId: number, reqUserId: number) => {
    if(!userId) {
        throw badRequest("User id is required")
    }

    if(userId !== reqUserId) {
        throw badRequest("Unauthorized")
    }

    const deleted = await prisma.user.delete({
        where: {
            id: userId
        }
    })

    if(!deleted) {
        throw notFound("User not found")
    }

    return deleteUser
}
