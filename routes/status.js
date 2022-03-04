const express = require("express");
const { body } = require("express-validator");
const statusController = require("../controllers/status");
const router = express.Router();
const isAuth = require("../middleware/is-auth");

router.get("/status", isAuth, statusController.getStatus);
router.patch(
    '/status',
    isAuth,
    [
      body('status')
        .trim()
        .not()
        .isEmpty()
    ],
    statusController.updateStatus
  );
  
module.exports = router;
