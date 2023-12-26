import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type tokenPayload = {
  userId: string;
  email: string;
};

const authValidator = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.get("Authorization");

  if (authHeader === undefined) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, "mySecretKey") as tokenPayload;
    if (decodedToken === null) {
      res.status(401).json({ message: " Not authenticated" });
      return;
    }

    res.locals.userId = decodedToken.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: " Not authenticated" });
  }
};

export default authValidator;
