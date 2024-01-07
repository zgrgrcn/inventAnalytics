import request from "supertest";
import app from "../src/app";
import logger from "../src/utils/logger";

const createBook = async (bookList: string[]): Promise<number[]> => {
    const bookIdList: number[] = [];
    for (const bookName of bookList) {
        await request(app)
            .post('/books')
            .send({name: bookName})
            .expect(201);
    }
    const response = await request(app)
        .get('/books')
        .expect('Content-Type', /json/)
        .expect(200);
    //bookList  count get last element
    for (let i = 0; i < bookList.length; i++) {
        bookIdList.push(response.body[response.body.length - bookList.length + i].id);
    }
    return bookIdList;
}
const deleteBook = async (bookList: number[]): Promise<void> => {
    logger.info(`Deleting books: ${bookList}`);
    for (const bookId of bookList) {
        await request(app)
            .delete(`/books/${bookId}`)
            .expect(204);
    }
}

const deleteUserBooks = async (userId: number): Promise<void> => {
    logger.info(`Deleting user: ${userId}`);
    await request(app)
        .delete(`/users/${userId}`)
        .expect(204);
}

export {createBook, deleteBook, deleteUserBooks};
