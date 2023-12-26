import { Router } from "express";
import * as videoController from "../controller/video-controller";
import { body } from "express-validator";
import { getAllVideosFromAssets } from "../controller/video-controller";
import { displayAllVideos } from "../controller/video-controller";

const router = Router();
const videoValidator = body("title").trim().notEmpty().isLength({ min: 3 });

router.get("/videos", videoController.getAllVideos);
router.get("/videos/name", videoController.getAllVideoNames);
router.get("/videos/names", videoController.getAllVideoNamesWithLinks);

router.get("/videos/names/:videoName", videoController.streamVideo);
router.patch("/videos/:videoId", videoController.updateVideos);
router.delete("/videos/:videoId", videoController.deleteVideos);

router.post("/add", videoController.addVideo);

router.post("/video", videoValidator, videoController.addVideos);
router.patch("/:videoId", videoValidator, videoController.updateVideo);
router.delete("/:videoId", videoController.deleteVideo);
router.get("/links", videoController.getMultipleLinks);
router.get("/videos/all", displayAllVideos);
router.post("/:videoId/like", videoController.addLike);

router.get("/video/names", (req, res) => {
  const videoNames = getAllVideosFromAssets();

  if (videoNames.length > 0) {
    res.status(200).json({ videoNames });
  } else {
    res.status(404).json({ message: "No videos found" });
  }
});

export default router;
