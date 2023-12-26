import { Request, Response } from "express";
import Home from "../models/home";
import { validationResult } from "express-validator";

export const getAllHomes = async (req: Request, res: Response) => {
  try {
    const homes = await Home.getHomes();
    res.status(200).json({ message: "Successfully loaded", homes: homes });
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};

export const addHome = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty article" });
    return;
  }

  const { idUser, DescriptionArticle, image, comments, likes } = req.body;

  try {
    const home = new Home(idUser, DescriptionArticle, image, comments, likes);
    const homes = await home.createHome();
    res.status(200).json({ message: "Successfully added", homes: homes });
  } catch (error) {
    res.status(400).json({ message: "failed to load" });
  }
};
export const updateHome = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "can't add empty todo" });
    return;
  }

  const { homeId } = req.params;
  const { idUser, DescriptionArticle, image, comments, likes } = req.body;
  const home = new Home(
    idUser,
    DescriptionArticle,
    image,
    comments,
    likes,
    homeId
  );
  try {
    const homes = await home.updateHome();
    res.status(200).json({ message: "Successfully updated", homes: homes });
  } catch (error) {
    res.status(400).json({ message: "failed to edit" });
  }
};

export const deleteHome = async (req: Request, res: Response) => {
  const { homeId } = req.params;
  try {
    const homes = await Home.deleteHome(homeId);
    res.status(200).json({ message: "Successfully deleted", homes: homes });
  } catch (error) {
    res.status(400).json({ message: "failed to delete" });
  }
};
export const addComment = async (req: Request, res: Response) => {
  const { homeId } = req.params;
  const { comments } = req.body;

  try {
    const home = new Home("", "", "", [], 0); // Initialize a home instance to call the addComment method
    const homes = await home.addComment(comments, homeId);
    res
      .status(200)
      .json({ message: "Comment added successfully", homes: homes });
  } catch (error) {
    console.error(error); // Log the error to the console for debugging

    res.status(400).json({ message: "Failed to add comment" });
  }
};
// home-controller.ts

export const getComments = async (req: Request, res: Response) => {
  const { homeId } = req.params;

  try {
    const home = await Home.getComments(homeId);
    res.status(200).json({
      message: "Successfully loaded comments",
      comments: home.comments,
    });
  } catch (error) {
    res.status(400).json({ message: "Failed to load comments" });
  }
};
export const addLike = async (req: Request, res: Response) => {
  const { homeId } = req.params;

  try {
    const home = new Home("", "", "", [], 0, homeId);
    const homes = await home.addLike();
    console.log("Adding like to video with ID:", homeId);
    res.status(200).json({ message: "Successfully added like", homes: homes });
  } catch (error) {
    console.error("Failed to add like:", error);
    res.status(400).json({ message: "Failed to add like" });
  }
};
