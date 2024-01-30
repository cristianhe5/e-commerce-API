const request = require('supertest');
const app = require('../app');
require('../models')

let id;
let token;

beforeAll(async() =>{
    const credentias = {
        email:'test@gmail.com', 
        password: '123456',
    }
    const res = await request(app).post('/users/login').send(credentias);
    token = res.body.token;
})

test('GET ', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST ', async () => {
    const newProduct = {
        title: 'test',
        description: 'description test',
        brand: 'brand test',
        price: 100.00
    }
    const res = await request(app).post('/products').send(newProduct).set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.title).toBe(newProduct.title);
});

test('PUT ', async () => {
    const product = {
        title: 'test updated',
        
    }
    const res = await request(app).put(`/products/${id}`).send(product).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(product.title);
});

test('DELETE ', async () => {
    const res = await request(app).delete(`/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204)
});