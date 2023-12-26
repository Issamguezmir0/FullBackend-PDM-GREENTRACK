import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import multer from "multer";

import Video from "../models/video";
import { validationResult } from "express-validator";

// videos from ../assets
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/assets"); // Store in the assets folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original filename
  },
});

const upload = multer({ storage: storage }).single("videoFile");

export const addVideo = (req: Request, res: Response) => {
  upload(req, res, async function (err) {
    if (err) {
      console.log("Error uploading file:", err);
      return res.status(500).json({ message: "Error uploading file" });
    }

    const { title, likes } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = `/assets/${file.filename}`;

    try {
      // Check if the video with this title already exists
      const existingVideo = await Video.findOneByTitle(title);
      if (existingVideo) {
        return res
          .status(400)
          .json({ message: "Video with this title already exists" });
      }

      const video = new Video(title, url, likes);
      await video.save(); // Save the video details to the database

      return res.status(200).json({ message: "Successfully added", video });
    } catch (error) {
      console.error("Failed to add video:", error);
      return res.status(500).json({ message: "Failed to add video" });
    }
  });
};

export const getAllVideoNames = async (req: Request, res: Response) => {
  try {
    const assetFolder = path.join(__dirname, "..", "assets");
    const videoFiles = fs
      .readdirSync(assetFolder)
      .filter((file) => file.endsWith(".mp4"));

    if (videoFiles.length === 0) {
      res.status(404).json({ message: "No videos found" });
      return;
    }

    res.status(200).json({ videoFiles });
  } catch (error) {
    res.status(500).json({ message: "Failed to load video metadata" });
  }
};

export const getMultipleLinks = (req: Request, res: Response) => {
  const multipleLinks = [
    "https://download.samplelib.com/mp4/sample-5s.mp4",
    "https://download.samplelib.com/mp4/sample-5s.mp4",
    "https://download.samplelib.com/mp4/sample-5s.mp4",
    // Add more links here as needed
  ];

  res.status(200).json({ links: multipleLinks });
};

// Stream an individual video
export const streamVideo = async (req: Request, res: Response) => {
  try {
    const videoName = req.params.videoName;
    const assetFolder = path.join(__dirname, "..", "assets");
    const videoPath = path.join(assetFolder, videoName);

    // Check if the requested video exists in the assets folder
    if (!fs.existsSync(videoPath)) {
      res.status(404).json({ message: "Video not found" });
      return;
    }

    // Read the video file
    const videoStream = fs.createReadStream(videoPath);
    const stat = fs.statSync(videoPath);

    // Set the appropriate headers
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Content-Length", stat.size);
    res.setHeader("Accept-Ranges", "bytes");

    // Pipe the video stream to the response
    videoStream.pipe(res);
  } catch (error) {
    res.status(400).json({ message: "Failed to stream video" });
  }
};

export const updateVideos = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(400).json({ message: "Invalid data for video update" });
    return;
  }

  const { videoId } = req.params;
  const { title, url, likes } = req.body;

  try {
    // Assuming Video.updateVideos returns void
    await Video.updateVideos(videoId, title, url, likes);

    res.status(200).json({ message: "Successfully updated" });
  } catch (error) {
    console.error("Failed to update video:", error);
    res.status(500).json({ message: "Failed to update video" });
  }
};

export const deleteVideos = async (req: Request, res: Response) => {
  const { videoId } = req.params;

  try {
    // Retrieve the video details to get the filename
    const video = await Video.findById(videoId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Delete the video file from the assets folder
    const assetFolder = path.join(__dirname, "..", "assets");

    // Check if video.url is defined before using it
    // Check if video.url is defined before using it
    const videoPath = video?.url
      ? path.join(assetFolder, video.url.split("/").pop()!)
      : undefined;

    if (videoPath && fs.existsSync(videoPath)) {
      fs.unlinkSync(videoPath);
    } else {
      console.warn("Video file not found:", videoPath);
    }

    // Delete the video from the database
    await Video.deleteVideos(videoId);

    res.status(200).json({ message: "Successfully deleted" });
  } catch (error) {
    console.error("Failed to delete video:", error);
    res.status(500).json({ message: "Failed to delete video" });
  }
};

export const getAllVideoNamesWithLinks = async (
  req: Request,
  res: Response
) => {
  try {
    const assetFolder = path.join(__dirname, "..", "assets");
    const videoFiles = fs
      .readdirSync(assetFolder)
      .filter((file) => file.endsWith(".mp4"));

    if (videoFiles.length === 0) {
      res.status(404).json({ message: "No videos found" });
      return;
    }

    // Create an array of video links
    const videoLinks = videoFiles.map((videoFile) => ({
      // name: videoFile,
      link: `/video/videos/names/${videoFile}`, // This is the link to the video streaming route
    }));

    res.status(200).json({ videoLinks });
  } catch (error) {
    res.status(500).json({ message: "Failed to load video metadata" });
  }
};

export const getAllVideosFromAssets = () => {
  const assetFolder = path.join(__dirname, "..", "assets");

  try {
    const videoFiles = fs
      .readdirSync(assetFolder)
      .filter((file) => file.endsWith(".mp4"));

    if (videoFiles.length === 0) {
      console.log("No videos found");
      return [];
    }

    return videoFiles;
  } catch (error) {
    console.error("Failed to load video metadata:", error);
    return [];
  }
};

export const displayAllVideos = (req: Request, res: Response) => {
  const videoNames = getAllVideosFromAssets();
  const videoURLs = videoNames.map((name: string) => {
    const videoURL = `/video/videos/names/${name}`;
    return {
      name,
      videoURL,
    };
  });

  if (videoURLs.length > 0) {
    res.status(200).json({ videos: videoURLs });
  } else {
    res.status(404).json({ message: "No videos found" });
  }
};

// videos CRUD

export const getAllVideos = async (req: Request, res: Response) => {
  try {
    const videos = await Video.getVideos();
    res.status(200).json({ message: "Successfully loaded", videos: videos });
    console.log("Working");
  } catch (error) {
    res.status(400).json({ message: "Failed to load" });
  }
};

export const addVideos = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "Can't add an empty video" });
    return;
  }

  const { title, url, likes } = req.body;

  try {
    const video = new Video(title, url, likes);
    const videos = await video.createVideo();
    res.status(200).json({ message: "Successfully added", videos: videos });
  } catch (error) {
    res.status(400).json({ message: "Failed to add" });
  }
};

export const addLike = async (req: Request, res: Response) => {
  const { videoId } = req.params;

  try {
    const video = new Video("", "", 0, videoId);
    const videos = await video.addLike();
    console.log("Adding like to video with ID:", videoId);
    res
      .status(200)
      .json({ message: "Successfully added like", videos: videos });
  } catch (error) {
    console.error("Failed to add like:", error);
    res.status(400).json({ message: "Failed to add like" });
  }
};

export const updateVideo = async (req: Request, res: Response) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    res.status(500).json({ message: "Can't update with empty data" });
    return;
  }

  const { videoId } = req.params;
  const { title, url, likes } = req.body;
  const video = new Video(title, url, likes, videoId);
  try {
    const videos = await video.updateVideo();
    res.status(200).json({ message: "Successfully updated", videos: videos });
  } catch (error) {
    res.status(400).json({ message: "Failed to update" });
  }
};

export const deleteVideo = async (req: Request, res: Response) => {
  const { videoId } = req.params;
  try {
    const videos = await Video.deleteVideo(videoId);
    res.status(200).json({ message: "Successfully deleted", videos: videos });
  } catch (error) {
    res.status(400).json({ message: "Failed to delete" });
  }
};
