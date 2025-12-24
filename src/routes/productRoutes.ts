import { Router } from "express";

import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { productController } from "../controllers/productControllers";
import { upload } from "../utils/multer";

const router = Router();

router.get("/", productController.getProducts);
router.get("/top", productController.getTopProducts);
router.get("/low", productController.getLowStockProducts);
router.get("/:id", productController.findById);
router.post("/", upload.single("file"), productController.create);
router.put(
  "/:id",
  VerifyToken,
  RoleGuard,
  upload.single("file"),
  productController.update
);
router.delete("/:id", VerifyToken, RoleGuard, productController.delete);

export default router;
