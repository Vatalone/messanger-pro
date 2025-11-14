import { Op } from "sequelize";
import User from "../models/user.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";


export const getUsersForSidebar = async(req,res)=>{
	try {
		const userId = req.user.id;

		const filteredUsers = await User.findAll({
			where: {
				id: {
					[Op.ne]: userId
				}
			},
			attributes: {
				exclude: ['password']
			}
		})

		const unseenMessages = {}
		const promises = filteredUsers.map(async(user)=>{
			const messages = await Message.findAll({
				where:{
					senderId: user.id,
					receiverId: userId,
					seen: false,
				}
			})
			if(messages.length > 0){
				unseenMessages[user.id] = messages.length;
			}
		})

		await Promise.all(promises);
		res.json({success: true, users: filteredUsers, unseenMessages})
	} catch (error) {
		console.log(error.message);
		res.json({success: false, message: error.message})
	}
}

export const getMessages = async(req,res)=>{
	try {
		const { id: selectedUserId } = req.params;
		
		const myId = req.user.id;

		const messages = await Message.findAll({
			where: {
				[Op.or]: [
					{senderId: myId, receiverId: selectedUserId},
					{senderId: selectedUserId, receiverId: myId}
				]
			}
		})

		await Message.update({
			seen: true
		},{
			where: {
				senderId: selectedUserId,
				receiverId: myId,
				seen: false
			}
		})

		res.json({success: true, messages})

	} catch (error) {
		console.log(error.message);
		res.json({success: false, message: error.message})
	}
}

export const markMessageAsSeen = async(req,res)=>{
	try {
		const {id} = req.params;

		await Message.update({
			seen: true
		},{
			where: {
				id
			}
		})

		res.json({success: true})

	} catch (error) {
		console.log(error.message);
		res.json({success: false, message: error.message})
	}
}

export const sendMessage = async(req,res)=>{
	try {
		const {text, image} = req.body;
		const receiverId = req.params.id;
		const senderId = req.user.id;

		let imageUrl;
		if(image){
			const uploadResponse = await cloudinary.uploader.upload(image)
			imageUrl = uploadResponse.secure_url;
		}

		const newMessage = await Message.create({
			text,
			image: imageUrl,
			senderId,
			receiverId
		})

		const receiverSocketId = userSocketMap[receiverId];

		if(receiverSocketId){
			io.to(receiverSocketId).emit("newMessage", newMessage)
		}

		res.json({success: true, newMessage});

	} catch (error) {
		console.log(error.message);
		res.json({success: false, message: error.message})
	}
}