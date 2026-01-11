import { Router } from "express";
import * as postsController from "../controllers/posts.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.get("/:postId", postsController.getPostById);
router.get("/author/:authorId", postsController.getPostsByAuthorId);
router.post("/", protect, postsController.createPost);
router.delete("/:postId", protect, postsController.deletePost);
router.patch("/:postId", protect, postsController.editPost);

export default router;
