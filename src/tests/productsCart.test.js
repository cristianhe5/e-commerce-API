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
    const res = await request(app).get('/productsCarts').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
});

test('POST ', async () => {
    const product = {
        quantity:5
    }
    const res = await request(app).post('/productsCarts').send(product).set('Authorization', `Bearer ${token}`);
    console.log(res.body);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.quantity).toBe(product.quantity);
});

test('PUT ', async () => {
    const product = {
        quantity: 8,
        
    }
    const res = await request(app).put(`/productsCarts/${id}`).send(product).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.quantity).toBe(product.quantity);
});

test('DELETE ', async () => {
    const res = await request(app).delete(`/productsCarts/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204)
});