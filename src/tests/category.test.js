const request = require('supertest')
const app = require('../app');


let token;
let id;

beforeAll(async () => {
    const credentias = {
        email: 'test@gmail.com',
        password: '123456'
    }
    const res = await request(app).post('/users/login').send(credentias);
    token = res.body.token
})




test('GET /categories brings all categorories', async () => {
    const res = await request(app).get('/categories');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST /categories  create a new category', async () => {
    const newCategory = {
        name: 'Smart TV'
    }
    const res = await request(app).post('/categories').send(newCategory).set('Authorization', `Bearer ${token}`);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.name).toBe(newCategory.name);
});

test('PUT /categories/:id update a category ', async () => {
    const category = {
        name : 'Smart TV updated '
    }
    const res = await request(app).put(`/categories/${id}`).send(category).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(category.name)
});

test('DELETE /categories/:id delete a category ', async () => {
    const res = await request(app).delete(`/categories/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204);
    
});