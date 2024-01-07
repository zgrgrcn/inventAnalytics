import request from 'supertest';
import app from '../../src/app';
import {AppDataSource, initializeDataSource} from '../../src/data-source';
import {createBook, deleteBook, deleteUserBooks} from "../helper";

let createdUserId: number;
let initialUserCount: number;
const newUser = {name: "t1-Ozgur Gurcan"};
let bookList: number[] = [];

let createdBookId: number;
let initialBookCount: number;
const newBook = {name: "t1-Necromancer"};


beforeAll(async () => {
    const connection = await initializeDataSource();
    await connection?.synchronize();
    bookList = await createBook(['t1-Gods of Jade and Shadow', 't2-Angels and Demons']);
});

afterAll(async () => {
    await deleteBook(bookList);
    await AppDataSource.destroy();
});

describe('books API', () => {
    it('GET /books - Getting initial book list', async () => {
        const response = await request(app)
            .get('/books')
            .expect('Content-Type', /json/)
            .expect(200);

        initialBookCount = response.body.length;
    });

    it('POST /books - Creating a book', async () => {
        await request(app)
            .post('/books')
            .send(newBook)
            .expect(201);
    })

    it('GET /books - Getting created Book id', async () => {
        const response = await request(app)
            .get('/books')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.length).toEqual(initialBookCount + 1);
        createdBookId = response.body[response.body.length - 1].id;
    });

    it('GET /books/:id - Getting the created book', async () => {
        await request(app)
            .get(`/books/${createdBookId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
                expect(res.body.id).toEqual(createdBookId);
                expect(res.body.name).toEqual(newBook.name);
                expect(res.body.score).toEqual(-1);
            });
    });

    it('DELETE /books/:id - Deleting the created book', async () => {
        await request(app)
            .delete(`/books/${createdBookId}`)
            .expect(204);
    });

    it('GET /books - Getting book list after deletion', async () => {
        await request(app)
            .get('/books')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
                expect(res.body).toHaveLength(initialBookCount);
            });
    });
});
describe('users API', () => {

    it('GET /users - Getting initial user list', async () => {
        const response = await request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200);
        initialUserCount = response.body.length;
    });

    it('POST /users - Creating a user', async () => {
        await request(app)
            .post('/users')
            .send(newUser)
            .expect(201);
    });

    it('GET /users - Getting created User id', async () => {
        const response = await request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200);

        expect(response.body.length).toEqual(initialUserCount + 1);
        createdUserId = response.body[response.body.length - 1].id;
    });

    it('GET /users/:id - Getting created user with no borrow history', async () => {
        await request(app)
            .get(`/users/${createdUserId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
                expect(res.body.id).toEqual(createdUserId);
                expect(res.body.name).toEqual(newUser.name);
                expect(res.body.books).toBeDefined();
                expect(res.body.books.past).toHaveLength(0);
                expect(res.body.books.present).toHaveLength(0);
            });
    });

    it('POST /users/:userId/borrow/:bookId - User borrowed a book successfully just the first time', async () => {
        await request(app)
            .post(`/users/${createdUserId}/borrow/${bookList[0]}`)
            .expect(204);

        await request(app)
            .post(`/users/${createdUserId}/borrow/${bookList[0]}`)
            .expect(400);
    });

    it('GET /users/:id - Getting a user with his past and current book borrow list', async () => {
        await request(app)
            .get(`/users/${createdUserId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
                expect(res.body.id).toEqual(createdUserId);
                expect(res.body.name).toEqual(newUser.name);
                expect(res.body.books).toBeDefined();
                expect(res.body.books.past).toHaveLength(0);
                expect(res.body.books.present).toHaveLength(1);
            });
    });

    it('POST /users/:userId/return/:bookId - User returning a book with his score', async () => {
        const score = {
            "score": 9
        };
        await request(app)
            .post(`/users/${createdUserId}/borrow/${bookList[1]}`)
            .expect(204);

        await request(app)
            .post(`/users/${createdUserId}/return/${bookList[1]}`)
            .send(score)
            .expect(204);

        await request(app)
            .post(`/users/${createdUserId}/return/${bookList[1]}`)
            .send(score)
            .expect(400);
    });

    it('DELETE /users/:id - Deleting the created user', async () => {
        await request(app)
            .delete(`/users/${createdUserId}`)
            .expect(204);
    });

    it('GET /users - Getting user list after deletion', async () => {
        await request(app)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
                expect(res.body).toHaveLength(initialUserCount);
            });
    });
});
