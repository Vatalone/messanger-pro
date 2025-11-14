import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const User = sequelize.define('User', {
	id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
  },
	fullName: {
		type: DataTypes.STRING
	},
	email:{
		type: DataTypes.STRING,
		unique: true,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	profilePic: {
		type: DataTypes.STRING,
		defaultValue: '',
	},
	bio: {
		type: DataTypes.STRING,
	}
}, {
	tableName: 'users',
	timestamps: true
})

export default User;