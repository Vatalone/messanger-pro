import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Message = sequelize.define('Message', {
	senderId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'users',
			key: 'id',
		},
		required: true,
	},
	receiverId: {
		type: DataTypes.INTEGER,
		allowNull: false,
		references: {
			model: 'users',
			key: 'id',
		},
		required: true,
	},
	text: {
		type: DataTypes.STRING,
	},
	image: {
		type: DataTypes.STRING,
	},
	seen: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false,
	}
}, {
	tableName: 'messages',
	timestamps: true,
})

export default Message;