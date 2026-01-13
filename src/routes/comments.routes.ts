import { Router } from "express";
import * as commentsController from "../controllers/comments.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/post/:postId", commentsController.getCommentsByPostId);
router.post("/", protect, commentsController.createComment);
router.delete("/:commentId", protect, commentsController.deleteComment);
router.patch("/:commentId", protect, commentsController.editComment);

export default router;
