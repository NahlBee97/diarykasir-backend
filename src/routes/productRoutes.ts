import { Router } from "express";

import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { productController } from "../controllers/productControllers";
import { upload } from "../utils/multer";

const router = Router();

router.get("/", productController.getProducts);
router.get("/top", VerifyToken, RoleGuard, productController.getTopProducts);
router.get("/low", VerifyToken, RoleGuard, productController.getLowStockProducts);
router.get("/:id", VerifyToken, RoleGuard, productController.findById);
router.post("/", VerifyToken, RoleGuard, upload.single("file"), productController.create);
router.put(
  "/:id",
  VerifyToken,
  RoleGuard,
  upload.single("file"),
  productController.update
);
router.delete("/:id", VerifyToken, RoleGuard, productController.delete);

export default router;
