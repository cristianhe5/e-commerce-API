const request = require("supertest")
const app = require("../app");

let id;
let token;

test('POST /users should create a new user ', async () => {
    const newUser = {
        firstName:'Esteban', 
        lastName:'Diaz', 
        email:'Estaban@gmail.com', 
        password: '123456', 
        phone: '123456789'
    }
    const res = await request(app).post('/users').send(newUser);
    id = res.body.id;
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.firstName).toBe(newUser.firstName);
});

test('POST /users/login should login an existing user ', async () => {
    const loginUser = {
        email:'Estaban@gmail.com', 
        password: '123456'
    }
    const res = await request(app).post('/users/login').send(loginUser);
    token = res.body.token;
    expect(res.status).toBe(200);
    expect(res.body.user.email).toBe(loginUser.email);
    expect(res.body.token).toBeDefined();
});

test('POST /users/login login with invalid credentias ', async () => {
    const loginUser = {
        email:'incorrecto@gmail.com', 
        password: 'incorrecto'
    }
    const res = await request(app).post('/users/login').send(loginUser);
    expect(res.status).toBe(401);
});


//protected enpoints

test('GET /users should bring all users', async () => {
    const res = await request(app).get('/users').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    

});

test('PUT /users/:id should update an user ', async () => {
    const user = {
        firstName:'Esteban Updated'
    }
    const res = await request(app).put(`/users/${id}`).send(user).set('Authorization', `Bearer ${token}`); 
    console.log(res.body);
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe(user.firstName);
});

test('DELETE /users/:id should delete or remove a user', async () => {
    const res = await request(app).delete(`/users/${id}`).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(204)
});

