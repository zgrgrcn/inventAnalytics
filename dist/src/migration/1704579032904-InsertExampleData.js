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
exports.InsertExampleData1704579032904 = void 0;
const logger_1 = __importDefault(require("../utils/logger"));
class InsertExampleData1704579032904 {
    up(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_1.default.info('Inserting example data');
            yield queryRunner.query(`
            INSERT INTO "user" (name) VALUES
            ('Eray Aslan'),
            ('Enes Faruk Meniz'),
            ('Sefa Eren Şahin'),
            ('Kadir Mutlu');
            
            INSERT INTO "book" (title) VALUES
            ('The Hitchhiker''s Guide to the Galaxy'),
            ('I, Robot'),
            ('Dune'),
            ('1984'),
            ('Brave New World');

            -- Assuming 'Enes Faruk Meniz' has id=2, adjust as necessary
            INSERT INTO "user_book" (userid, bookid, score, status) VALUES
            (2, 1, 10, 'past'), -- The Hitchhiker's Guide to the Galaxy
            (2, 2, 5, 'past'), -- I, Robot
            (2, 5, NULL, 'present'); -- Brave New World
        `);
        });
    }
    down(queryRunner) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.query(`
            DELETE FROM "user_book";
            DELETE FROM "book";
            DELETE FROM "user";
        `);
        });
    }
}
exports.InsertExampleData1704579032904 = InsertExampleData1704579032904;
