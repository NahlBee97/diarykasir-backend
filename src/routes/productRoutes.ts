import { Router } from "express";

import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { productController } from "../controllers/productControllers";

const router = Router();

router.get("/", productController.getProducts);
router.get("/:id", productController.findById);
router.post("/", productController.create);
router.put("/:id", VerifyToken, RoleGuard, productController.update);
router.delete("/:id", VerifyToken, RoleGuard, productController.delete);

export default router;
