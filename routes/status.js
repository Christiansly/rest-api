const express = require("express");
const statusController = require("../controllers/status");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/status", isAuth, statusController.getStatus);
router.put(
  "/status",
  isAuth,
//   [body("status").trim().not().isEmpty()],
  statusController.updateStatus
);

module.exports = router;
