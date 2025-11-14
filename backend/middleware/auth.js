import jwt from 'jsonwebtoken'
import User from '../models/user.js';

export const auth = async (req, res, next) => {
	try{
		const token = req.headers.token;

		if(!token){
			res.json({
				success: false,
				message: "Token is required"
			})
		}

		const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
		
		const user = await User.findOne({
			where:{
				id: tokenDecoded.userId,
			},
			attributes: {
				exclude: ['password'],
			}
		})

		if(!user){
			return res.json({success: false, message: 'User not found'});
		}

		req.user = user
		
		next();
	} catch(error){
		console.log(error);
		res.json({
			success: false, 
			mes: error.message
		})
	}
}