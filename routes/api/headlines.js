const router = require("express").Router();
const headlineController = require("../../controllers/headline");

router.get("/", headlineController.findAll);
router.get("/:id", headlineController.findOne);