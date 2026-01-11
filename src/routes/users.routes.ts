import { Router } from "express";
import * as usersController from "../controllers/users.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

router.patch("/", protect, usersController.editUser);
router.delete("/", protect, usersController.deleteUser);
router.get("/:userId", usersController.getUserById);

export default router;
