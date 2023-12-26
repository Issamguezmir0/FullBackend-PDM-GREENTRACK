import { Database } from "../database";
import { ObjectId, Db } from "mongodb";
import fs from "fs";
import path from "path";

class Video {
  static updateVideos(videoId: string, title: any, url: any, likes: any) {
    throw new Error("Method not implemented.");
  }
  id?: string;
  title: string;
  url: string;
  likes: number = 0;

  constructor(title: string, url: string, likes: number, id?: string) {
    this.id = id;
    this.title = title;
    this.url = url;
    this.likes = likes;
  }

  async addLike() {
    try {
      const db: Db = Database.getDb();

      console.log("Updating likes for video with ID:", this.id);

      await db
        .collection("video")
        .updateOne({ _id: new ObjectId(this.id) }, { $inc: { likes: 1 } });

      const videos = await Video.getVideos();
      console.log("Successfully updated likes. Updated videos:", videos);

      return videos;
    } catch (error) {
      console.error("Failed to update likes:", error);
      throw error;
    }
  }

  async createVideo() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("video").insertOne({ ...this });
    const videos = await Video.getVideos();
    return videos;
  }

  static async getVideos() {
    const db: Db = Database.getDb();
    const documents = await db.collection("video").find().toArray();

    const videos: Video[] = documents.map(
      (doc) => new Video(doc.title, doc.url, doc.likes, doc._id.toString())
    );
    return videos;
  }

  static async getVideosFromAssets() {
    // List all files in the "assets" folder
    const assetFolder = path.join(__dirname, "..", "assets");
    const videoFiles = fs.readdirSync(assetFolder);

    // Map video file names to Video objects
    const videos = videoFiles.map((filename) => {
      return new Video(filename, `/assets/${filename}`, 0);
    });

    return videos;
  }

  async updateVideo() {
    const db: Db = Database.getDb();
    await db
      .collection("video")
      .updateOne(
        { _id: new ObjectId(this.id) },
        { $set: { title: this.title, url: this.url } }
      );

    const videos = await Video.getVideos();
    return videos;
  }
  static async findById(videoId: string): Promise<Video | null> {
    try {
      const db: Db = Database.getDb();

      const video = await db
        .collection("video")
        .findOne({ _id: new ObjectId(videoId) });

      if (video) {
        return new Video(
          video.title,
          video.url,
          video.likes,
          video._id.toString()
        );
      }

      return null;
    } catch (error) {
      console.error("Failed to find video by ID:", error);
      throw error;
    }
  }

  static async deleteVideo(todoId: string) {
    const db: Db = Database.getDb();
    await db.collection("video").deleteOne({ _id: new ObjectId(todoId) });

    const videos = await Video.getVideos();
    return videos;
  }
  static async findOneByTitle(title: string) {
    const db: Db = Database.getDb();
    const video = await db.collection("video").findOne({ title });
    if (video) {
      return new Video(
        video.title,
        video.url,
        video.likes,
        video._id.toString()
      );
    }
    return null; // Or handle appropriately if no video found with the given title
  }

  async save() {
    const db: Db = Database.getDb();
    delete this.id;
    await db.collection("video").insertOne({ ...this });
  }

  async updateVideos(
    videoId: string,
    title: string,
    url: string,
    likes: number
  ): Promise<Video | null> {
    try {
      const db: Db = Database.getDb();

      // Find the video by ID
      const existingVideo = await db
        .collection("video")
        .findOne({ _id: new ObjectId(videoId) });

      // If the video doesn't exist, return null
      if (!existingVideo) {
        return null;
      }

      // Update the video details
      await db
        .collection("video")
        .updateOne(
          { _id: new ObjectId(videoId) },
          { $set: { title, url, likes } }
        );

      // Return the updated video
      return new Video(title, url, likes, videoId);
    } catch (error) {
      console.error("Failed to update video:", error);
      throw error;
    }
  }

  static async deleteVideos(videoId: string): Promise<void> {
    try {
      const db: Db = Database.getDb();

      // Delete the video by ID
      await db.collection("video").deleteOne({ _id: new ObjectId(videoId) });
    } catch (error) {
      console.error("Failed to delete video:", error);
      throw error;
    }
  }
}

export default Video;
