import { Request, Response } from "express";
import Eco_point from "../models/eco_point";
import { validationResult } from "express-validator";

export const getAllEco_points = async (req: Request, res: Response) => {
  try {
    const eco_points = await Eco_point.getEco_points();
    res.status(200).json({ message: "Successfully loaded", todos: eco_points });
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const addEco_point = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty todo" });
    return;
  }
  console.log();

  const { nbrPoint, description, favoris, localisation } = req.body;

  try {
    const eco_point = new Eco_point(
      nbrPoint,
      description,
      favoris,
      localisation
    );
    const eco_points = await eco_point.createEco_point();
    res.status(200).json({ message: "Successfully added", todos: eco_points });
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const updateEco_point = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty eco_point" });
    return;
  }

  const { eco_pointId } = req.params;
  const { nbrPoint, description, favoris } = req.body;
  const eco_point = new Eco_point(nbrPoint, description, favoris, eco_pointId);
  try {
    const eco_points = await eco_point.updateEco_point();
    res
      .status(200)
      .json({ message: "Successfully updated", todos: eco_points });
  } catch (error) {
    res.status(400).json({ message: "failed to edit" });
  }
};

export const deleteEco_point = async (req: Request, res: Response) => {
  const { eco_pointId } = req.params;
  try {
    const todos = await Eco_point.deleteEco_point(eco_pointId);
    res
      .status(200)
      .json({ message: "Successfully deleted", eco_points: eco_pointId });
  } catch (error) {
    res.status(400).json({ message: "failed to delete" });
  }
};
