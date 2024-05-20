const { Router } = require('express');
const handler = require('./handler');
const router = Router();

router.get("/", handler.getUser);
router.post("/", handler.addUser);
router.get("/:id", handler.getUserById);
router.put("/:id", handler.updateUser)
router.delete("/:id", handler.deleteUser);

module.exports = router;