import { Sequelize } from "sequelize";

const sequelize = new Sequelize('messenger_schema', 'root', 'Hdt@64lpomaq', {
	host: 'localhost',
	dialect: 'mysql',
})

const testConnection = async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync()
		console.log('Connection has been established successfully');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

testConnection();

export default sequelize