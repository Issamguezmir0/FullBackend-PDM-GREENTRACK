import {Request, Response} from 'express';
import Jwt from 'jsonwebtoken';
import Bcrypt from 'bcrypt';
import Nodemailer from 'nodemailer';
import {Db} from "mongodb";
import {Database} from "../database";

interface MailOptions {
    from: string;
    to: string;
    subject: string;
    html: string;
}

export const forgotPassword = async (req: Request, res: Response): Promise<Response> => {
    const db: Db = Database.getDb();

    const user = await db.collection("users").findOne({email: req.body.email});

    if (user) {
        const randomNumber = randomIntBetween(1000, 9999);

        const success = await sendEmail({
            from: process.env.GMAIL_USER!,
            to: req.body.email,
            subject: "Password reset",
            html: `<h3>You have requested to reset your password</h3><p>Your reset code is : <b style='color : #7b2bf1'>${randomNumber}</b></p>`,
        }).catch((error) => {
            console.log(error);
            return res.status(400).json({message: "Email could not be sent"});
        });

        // token creation
        const token = await generateResetToken(randomNumber, req.body.email);

        if (success) {
            return res.status(200).json({token});
        } else {
            return res.status(400).json({message: "Email could not be sent"});
        }
    } else {
        return res.status(400).json({message: "User does not exist"});
    }
};

export const verifyResetCode = async (req: Request, res: Response): Promise<Response> => {
    const {resetCode, token} = req.body;

    let verifiedToken;
    try {
        verifiedToken = Jwt.verify(token, process.env.JWT_SECRET!) as { resetCode: number, email: string };
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Could not verify code"});
    }

    if (String(verifiedToken.resetCode) === resetCode) {
        return res.status(200).json({message: "Success"});
    } else {
        return res.status(400).json({message: "Incorrect reset code"});
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const {token, plainPassword} = req.body;

    let verifiedToken;
    try {
        verifiedToken = Jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    } catch (e) {
        console.log(e);
        return res.status(500).json({message: "Could not verify code"});
    }

    try {
        const db: Db = Database.getDb();

        await db.collection("users").findOneAndUpdate(
            {email: verifiedToken.email},
            {
                $set: {
                    password: await Bcrypt.hash(plainPassword, 10),
                },
            }
        );
        return res.status(200).json({message: "Success"});
    } catch (error) {
        console.log(error)
        return res.status(400).json({message: "Error"});
    }
};

const sendEmail = async (mailOptions: MailOptions): Promise<boolean> => {
    let transporter = await Nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER!,
            pass: process.env.GMAIL_APP_PASSWORD!,
        },
    });

    await transporter.verify(function (error) {
        if (error) {
            console.log(error);
            console.log("Server not ready");
        } else {
            console.log("Server is ready to take our messages");
        }
    });

    await transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            return false;
        } else {
            console.log("Email sent: " + info.response);
            return true;
        }
    });

    return true;
};

const randomIntBetween = (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

const generateResetToken = (resetCode: number, email: string): string => {
    return Jwt.sign(
        {resetCode, email},
        process.env.JWT_SECRET!,
        {expiresIn: "100000000"} // in Milliseconds (3600000 = 1 hour)
    );
};
