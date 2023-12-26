import { Request, Response } from "express";
import Challenge from "../models/challenge";
import { validationResult } from "express-validator";
import { json } from "stream/consumers";

export const getAllChallenge = async (req: Request, res: Response) => {
  try {
    const events = await Challenge.getChallenge();
    res.status(200).json({ message: "Successfully loaded", events: events });
  } catch (error) {
    res.status(400).json({ message: "Failed to load" });
  }
};
// export const addChallenge = async (req: Request, res: Response) => {
//   const { title, description, date, location, isFree, participants, organisateurs, details,image } = req.body;
// try{
//   const challenge = new Challenge(
//       title,
//       description,
//       date,
//       location,
//       isFree,

//       participants,
//       organisateurs,
//       details,
//       `${req.protocol}://${req.get('host')}/img/${req.file.filename}`,
//  );

// }catch(error){
//   console.log(error);

//   res.status(500)
// }
// };

// export const addChallenge = async (req: Request, res: Response) => {
//   const result = validationResult(req);

//   if (!result.isEmpty()) {
//     res.status(500).json({ message: "Can't add an empty challenge" });
//     return;
//   }

//   const { image,title, description, date, location, isFree, participants, organisateurs, details } = req.body;

//   try {
//     const challenge = new Challenge(image, title, description, date, location, isFree, participants, organisateurs, details);
//     const events = await challenge.createChallenge();
//     res.status(200).json({ message: "Successfully added", events: events });
//   } catch (error) {
//     res.status(400).json({ message: "Failed to add" });
//   }
// };

export const addChallenge = async (req: Request, res: Response) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      res.status(500).json({ message: "Can't add an empty challenge" });
      return;
    }

    const json = req.body; // Removed JSON.parse

    // Extract other challenge-related data from req.body
    const {
      title,
      description,
      date,
      location,
      isFree,
      participants,
      organisateurs,
      details,
      price,
    } = json;

    // Extract image information from req.file
    const image = req.file
      ? req.file.destination.replace(".", "") + "/" + req.file.filename
      : "";

    try {
      // Create a new Challenge instance with the image path and other details
      const challenge = new Challenge(
        image,
        title,
        description,
        date,
        location,
        isFree,
        participants,
        organisateurs,
        details,
        price
      );

      // Call the method to create the challenge
      const events = await challenge.createChallenge();

      res.status(200).json({ message: "Successfully added", events: events });
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: "Failed to add" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateChallenge = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "Can't update with empty values" });
    return;
  }

  const { challengeId } = req.params;
  const {
    image,
    title,
    description,
    date,
    location,
    isFree,
    participants,
    organisateurs,
    details,
    price,
  } = req.body;

  try {
    const challenge = new Challenge(
      image,
      title,
      description,
      date,
      location,
      isFree,
      participants,
      organisateurs,
      details,
      price,
      challengeId
    );
    const events = await challenge.updateChallenge();
    res.status(200).json({ message: "Successfully updated", events: events });
  } catch (error) {
    res.status(400).json({ message: "Failed to update" });
  }
};

export const deleteChallenge = async (req: Request, res: Response) => {
  const { challengeId } = req.params;
  try {
    const events = await Challenge.deleteChallenge(challengeId);
    res.status(200).json({ message: "Successfully deleted", events: events });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete" });
  }
};
