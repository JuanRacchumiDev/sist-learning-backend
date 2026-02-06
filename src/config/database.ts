import { Sequelize } from "sequelize"
import dotenv from "dotenv"
import path from "path"

dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env

if (!DB_HOST || !DB_USER || !DB_NAME) {
    console.error("Faltan:", { DB_HOST, DB_USER, DB_NAME });
    throw new Error('No se encontraron algunas variables de entorno')
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    dialect: 'mysql',
    logging: false
});

export default sequelize