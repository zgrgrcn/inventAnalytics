"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDataSource = exports.AppDataSource = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./entity/user.entity");
const logger_1 = __importDefault(require("./utils/logger"));
const book_entity_1 = require("./entity/book.entity");
const userBook_entity_1 = require("./entity/userBook.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432"),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "postgres",
    entities: [user_entity_1.User, book_entity_1.Book, userBook_entity_1.UserBook],
    migrations: ["src/migration/*.ts"],
    migrationsRun: true,
    synchronize: process.env.NODE_ENV === 'development',
    logging: false,
});
function initializeDataSource() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dataSource = yield exports.AppDataSource.initialize();
            logger_1.default.info("Data Source has been initialized!");
            return dataSource;
        }
        catch (error) {
            logger_1.default.error("Error during Data Source initialization", error);
            throw error;
        }
    });
}
exports.initializeDataSource = initializeDataSource;
