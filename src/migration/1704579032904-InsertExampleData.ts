import {MigrationInterface, QueryRunner} from "typeorm";
import logger from "../utils/logger";

export class InsertExampleData1704579032904 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        logger.info('Inserting example data');
        await queryRunner.query(`
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
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user_book";
            DELETE FROM "book";
            DELETE FROM "user";
        `);
    }

}
