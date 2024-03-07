const catchError = require('../utils/catchError');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const EmailCode = require('../models/EmailCode');
const sendEmail = require('../utils/sendEmail');

const getAll = catchError(async(req, res) => {
    const results = await User.findAll();
    return res.json(results);
});

const create = catchError(async(req, res) => {
    const {firstName, lastName, email, password, phone, url} = req.body;
    const encryptedPassword = await bcrypt.hash(password,10);
    const result = await User.create({
        firstName, 
        lastName, 
        email, 
        password: encryptedPassword, 
        phone
    });

    ////// al crear el usuro enviamos inmediatamente el condigo de verificacion
    const code = require('crypto').randomBytes(32).toString("hex");
    const link = `${url}/auth/verify_email/${code}`;

    await EmailCode.create({
        code,
        userId: result.id // viene de la variable result
    });

    await sendEmail({
        to: email,
        subject: 'Verification email',
        html:`
            <h1>Hello ${firstName} ${lastName}!!</h1>
            <p>Thanks for sing up</p>
            <b>clicks this link to verify your email</b>
            <hr>
            ${link}
        `
    })

    return res.status(201).json(result);
});

const getOne = catchError(async(req, res) => {
    const { id } = req.params;
    const result = await User.findByPk(id);
    if(!result) return res.sendStatus(404);
    return res.json(result);
});

const remove = catchError(async(req, res) => {
    const { id } = req.params;
    await User.destroy({ where: {id} });
    return res.sendStatus(204);
});

const update = catchError(async(req, res) => {
    const { id } = req.params;
    const {firstName, lastName, phone} = req.body;
    const result = await User.update({
        firstName, 
        lastName,
        phone
    },
        { where: {id}, returning: true }
    );
    if(result[0] === 0) return res.sendStatus(404);
    return res.json(result[1][0]);
});

const verifyCode = catchError(async(req, res)=>{
    const {code} = req.params // params osea que lo saca de los parametros de la url // 1 tomamos el code
    const emailCode = await EmailCode.findOne({where: {code:code}}) // extraemos el codigo guardodo en el modelo de emailcode
    if(!emailCode) return res.status(401).json({message: "invalid code"});// si no encuentra el codigo que lanze un mensaje
    const user = await User.update({ // lo que hacemos es actualizar el modelo de user en el campo isVerified para que se ponga true si anteriormente resivio el codigo
        isVerified: true}, 
        {where: {id:emailCode.userId}, returning: true // buscamos el usuario por la relacion de id entre emailcode y user y lo retornamos para que se haga efectivo
    });
     await emailCode.destroy() // tenmos que eliminar el codigo 
     return res.json(user) // retornamos el usuario verificado

})

const login = catchError( async(req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});
    if(!user) return res.status(401).json({message:"invalid credentials"});

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return res.status(401).json({message:"invalid credentials"});

    const token = jwt.sign(
        {user},
        process.env.TOKEN_SECRET,
        {expiresIn: '1d'}
    );
    return res.json({user, token})



})

module.exports = {
    getAll,
    create,
    getOne,
    remove,
    update,
    verifyCode,
    login
}