import express from "express";
import {
  createPharmacist,
  getAllPharmacists,
  updatePharmacist,
  deletePharmacist,
} from "../controllers/adminController.js";
import { verifyAdmin } from "../middleware/auth.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Admin routes working!" });
});

// Email test route
import { testEmail } from "../controllers/emailTestController.js";
router.get("/test-email", testEmail);

// All admin routes require admin authentication
router.post("/pharmacists", verifyAdmin, createPharmacist);
router.get("/pharmacists", verifyAdmin, getAllPharmacists);
router.put("/pharmacists/:id", verifyAdmin, updatePharmacist);
router.delete("/pharmacists/:id", verifyAdmin, deletePharmacist);

export default router;