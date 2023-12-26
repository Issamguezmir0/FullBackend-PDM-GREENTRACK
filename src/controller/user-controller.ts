import {Request, Response} from "express";
import User from "../models/user";

export const getAll = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.getAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const getById = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await User.getById(req.params.id);

        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const update = async (req: Request, res: Response): Promise<void> => {
    try {
        const {body, file} = req;

        const fullname = body.fullname.replace(/"/g, '');
        const email = body.email.replace(/"/g, '');
        const num_tel = body.num_tel.replace(/"/g, '');

        await User.update(req.params.id, {
            ...body,
            img: file ? file.filename : null,
            fullname,
            email,
            num_tel,
        })

        res.status(200).json({});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error || "Internal Server Error"});
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        await User.delete(req.params.id);

        res.status(200).json({message: "User deleted successfully"});
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"});
    }
};

export const validateUniqueEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const email = req.body.email;

        if (await User.userExist(email)) {
            res.status(409).json({ message: "Email is already in use" });
        } else {
            res.status(200).json({ message: "Email is unique" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

