import { Router } from "express";

import { RoleGuard, VerifyToken } from "../middlewares/authMiddlewares";
import { productController } from "../controllers/productControllers";
import { upload } from "../utils/multer";
import { validateRequest } from "../middlewares/validationMiddleware";
import {
  createProductSchema,
  deleteProductSchema,
  findProductByIdSchema,
  getProductsSchema,
  getTopProductsSchema,
  updateProductSchema,
} from "../schemas/productSchemas";

const router = Router();

router.get(
  "/",
  validateRequest(getProductsSchema),
  productController.getProducts
);
router.get(
  "/top",
  VerifyToken,
  RoleGuard,
  validateRequest(getTopProductsSchema),
  productController.getTopProducts
);
router.get(
  "/low",
  VerifyToken,
  RoleGuard,
  productController.getLowStockProducts
);
router.get(
  "/:id",
  VerifyToken,
  RoleGuard,
  validateRequest(findProductByIdSchema),
  productController.findById
);
router.post(
  "/",
  VerifyToken,
  RoleGuard,
  validateRequest(createProductSchema),
  upload.single("file"),
  productController.create
);
router.put(
  "/:id",
  VerifyToken,
  RoleGuard,
  validateRequest(updateProductSchema),
  upload.single("file"),
  productController.update
);
router.delete(
  "/:id",
  VerifyToken,
  RoleGuard,
  validateRequest(deleteProductSchema),
  productController.delete
);

export default router;
