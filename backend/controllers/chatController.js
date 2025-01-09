// import Message from "../models/Message.js";
// import Group from "../models/Group.js";


// // Fetch private message history
// export const getPrivateMessages = async (req, res) => {
//   const { receiverId } = req.params;
//   const senderId = req.user._id;
//   try {
//     const messages = await Message.find({
//       $or: [
//         { sender: senderId, receiver: receiverId },
//         { sender: receiverId, receiver: senderId },
//       ],
//     }).sort({ timestamp: 1 });
//     res.json(messages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Fetch group message history
// export const getGroupMessages = async (req, res) => {
//   const { groupId } = req.params;
//   try {
//     const messages = await Message.find({ group: groupId }).sort({
//       timestamp: 1,
//     });
//     res.status(200).json(messages);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Create a new group
// export const createGroup = async (req, res) => {
//   const { name, members } = req.body;
//   const createdBy = req.user._id;
//   try {
//     const group = new Group({
//       name,
//       members: [...members, createdBy],
//       createdBy,
//     });
//     await group.save();
//     res.status(201).json(group);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const uploadFile = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.status(200).json({ fileUrl: `/uploads/${req.file.filename}` });
};

export { uploadFile }

