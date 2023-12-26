import { Request, Response } from "express";
import { validationResult } from "express-validator";
import Consommation from "../models/Consomation";

export const addC = async (req: Request, res: Response) => {
  console.log("test");
  console.log(req.body);

  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty todo" });
    return;
  }

  const { valeur, type } = req.body;

  try {
    const cons = new Consommation(type, valeur);
    const todos = await cons.createTodo();
    res.status(200).json({ message: "Successfully added", todos: todos });
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const CalculTotal = async (req: Request, res: Response) => {
  try {
    // Get the current date
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.toISOString().split("T")[0]);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    // Create a new Consommation instance
    const cons = new Consommation("", 0);

    // Call the gettotale function to calculate the total value for today
    const total = await cons.calculateTotalForDay(startOfDay, endOfDay);

    // Log the response JSON in the terminal
    console.log("Response JSON:", { total: total });

    // Return the total value
    res.status(200).json({ total: total });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to calculate total value" });
  }
};

export const CalculTotalByType = async (req: Request, res: Response) => {
  console.log("by type ");
  console.log(req.body);

  try {
    // Get the type from the request parameters
    const { type } = req.body;

    // Create a new Consommation instance
    const cons = new Consommation(type, 0);

    // Call the calculateTotalByType function to calculate the total value for the given type
    const total = await cons.calculateTotalByType(type);

    // Log the response JSON in the terminal
    console.log("Response JSON:", { total: total });

    // Update the Consommation instance to include the total in your database
    await cons.updateTotalInDatabase(total);

    // Return only the total value
    res.status(200).json({ total: total });
  } catch (error) {
    // Handle errors
    res.status(500).json({ message: "Failed to calculate total value" });
  }
};
