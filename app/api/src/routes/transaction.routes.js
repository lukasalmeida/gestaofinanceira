    const express = require("express");

const controller = require("../controllers/transaction.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.use(authMiddleware);

router.post("/", controller.create);
router.get("/", controller.findAll);
router.get('/summary', authMiddleware, controller.summary);

router.get("/:id", controller.findById);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;