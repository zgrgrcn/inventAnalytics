import {DataSource} from "typeorm";
import {User} from "./entity/user.entity";
import logger from "./utils/logger";
import {Book} from "./entity/book.entity";
import {UserBook} from "./entity/userBook.entity";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "postgres",
    entities: [User, Book, UserBook],
    migrations: ["src/migration/*.ts"],
    migrationsRun: true,
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
});

export async function initializeDataSource() {
    try {
        const dataSource = await AppDataSource.initialize();
        logger.info("Data Source has been initialized!");
        return dataSource;
    } catch (error) {
        logger.error("Error during Data Source initialization", error);
        throw error;
    }
}
