import {MigrationInterface, QueryRunner} from "typeorm";
import logger from "../utils/logger";

export class CreateInitialTables1704577992111 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        logger.info('Creating initial tables');
        await queryRunner.query(`
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE "user_book";
            DROP TABLE "book";
            DROP TABLE "user";
        `);
    }

}
