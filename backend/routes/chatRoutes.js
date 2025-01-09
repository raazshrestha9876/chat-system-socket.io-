import express from "express";
import upload from "../middlewares/fileUploader.js";
import { uploadFile } from "../controllers/chatController.js";
import authenticate from "../middlewares/authMiddleware.js";
// import {
//   getPrivateMessages,
//   createGroup,
//   getGroupMessages,
// } from "../controllers/chatController.js";
// import authenticate from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/upload", authenticate, upload.single("file"), uploadFile );

export { router as chatRoutes };

// // router.get('/message/:receiverId', authenticate, getPrivateMessages);
// // //Group chat routes
// // router.post('/group', authenticate, createGroup);
// // router.get('/group/:groupId/messages', authenticate, getGroupMessages);

// export { router as chatRoutes };
