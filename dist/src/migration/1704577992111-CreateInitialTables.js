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
exports.CreateInitialTables1704577992111 = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class CreateInitialTables1704577992111 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('Creating initial tables');
            yield queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "name" VARCHAR NOT NULL
            );
            CREATE TABLE "book" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR NOT NULL
            );
            CREATE TABLE "user_book" (
                "id" SERIAL PRIMARY KEY,
                "userid" INTEGER REFERENCES "user"(id),
                "bookid" INTEGER REFERENCES "book"(id),
                "score" INTEGER,
                "status" VARCHAR NOT NULL
            );
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DROP TABLE "user_book";
            DROP TABLE "book";
            DROP TABLE "user";
        `);
        });
    }
}
exports.CreateInitialTables1704577992111 = CreateInitialTables1704577992111;
