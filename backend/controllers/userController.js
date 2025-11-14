import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
	try {
		const {fullName, email, password, bio} = req.body;
		if (!fullName || !email || !password || !bio) {
			return res.json({message: "All fields are required", success: false})
		}

		const user = await User.findOne({
			where: {
				email
			}
		})

		if(user){
			return res.json({success: false, message: "Account already exists"})
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await User.create({
			fullName,
			email,
			password: hashedPassword,
			bio
		});

		const token = generateToken(newUser.id)

		res.json({
			success: true, 
			userData: newUser, 
			token, 
			message: "Account created successfully"
		})
	} catch (error) {
		console.log(error.message);
		res.json({success: false, message: error.message})
	}
}

export const login = async (req, res) => {
	try {
		const {email, password} = req.body;

		if (!email || !password) {
			res.json({
				success: false,
				message: "All fields are required"
			})
		}

		const user = await User.findOne({
			where: {
				email
			}
		})

		const isPasswordCorrect = await bcrypt.compare(password, user.password);

		if(!isPasswordCorrect){
			return res.json({success: false, message: 'Invalid credentials'})
		}

		const token = generateToken(user.id)

		res.json({
			success: true, 
			userData: user, 
			token, 
			message: 'Login successful'
		})
	} catch (error) {
		console.log(error.message);
		res.json({success: false, message: error.message})
	}
}


export const checkAuth = async (req, res) => {
	res.json({success: true, user: req.user});
}

export const updateProfile = async (req, res) => {
	try {
		const {profilePic, bio, fullName } = req.body;

		const userId = req.user.id;

		const updateData = { bio, fullName };

		if (profilePic) {
			const upload = await cloudinary.uploader.upload(profilePic);
			updateData.profilePic = upload.secure_url;
		}

		await User.update(updateData, {
			where: { id: userId },
		});

		const updatedUser = await User.findOne({
			where:{
				id: userId,
			}
		}, {
			attributes: { exclude: ['password'] }
		});

		res.json({success: true, user: updatedUser})
	} catch (error) {
		console.log(error.message);
		res.json({success: false, message: error.message})
	}
}