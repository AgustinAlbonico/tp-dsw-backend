const { PrismaClient } = require('@prisma/client');
const userClient = new PrismaClient().usuario;
const { generateToken } = require('../config/jwtToken');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./emailController');
const { hashPassword, comparePasswords } = require('../utils/hashPassword');
const { createEmailVerificationToken } = require('../utils/emailToken');
const crypto = require('crypto');

//Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Busco al usuario por email
    const user = await userClient.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      return res.status(404).json({ message: 'Usuario no encontrado' });

    //Comparo password del user y la ingresada
    const coinciden = await comparePasswords(password, user.password);

    if (coinciden && user.verificado) {
      const token = generateToken(user.id_usuario, user.email);
      res
        .cookie('access_token', token, {
          httpOnly: true,
          secure: false,
        })
        .json({ message: 'Usuario logueado con exito', user });
    } else if (!user.verificado) {
      res.status(401).json({ message: 'Usuario no verificado' });
    } else {
      res.status(401).json({ message: 'Contraseña incorrecta' });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//Register user
const registerUser = async (req, res) => {
  let { email, password, telefono } = req.body;
  try {
    //Valido que el usuario no exista
    let findUser = await userClient.findFirst({
      where: {
        OR: [{ email }, { telefono }],
      },
    });
    if (findUser) {
      return res.status(200).json({
        message: 'Ya existe un usuario asociado a ese email o telefono!',
        error: true,
      });
    }

    //Encripto password y creo token de verificacion por email
    req.body.password = await hashPassword(password);
    let { token, hashedToken } = createEmailVerificationToken();

    let newUser = { ...req.body, emailtoken: hashedToken };

    console.log(newUser);

    newUser.fecha_nacimiento = new Date();

    //Creo el usuario
    let savedUser = await userClient.create({
      data: newUser,
    });

    //Envio mail con TOKEN de confirmacion de cuenta
    const resetUrl = `Hola <h2>${savedUser.apellido}, ${savedUser.nombre}!</h2> <br> Usa este link para confirmar tu cuenta: <a href='http://localhost:5173/verify/${token}'>Haz click aqui!</a>`;
    const data = {
      to: email,
      from: '"Link para confirmar tu cuenta! " <asd@example.com>',
      subject: 'Link para confirmar tu cuenta!',
      text: 'Hola!',
      html: resetUrl,
    };
    sendEmail(data);

    res.status(200).json({
      message:
        'Usuario creado con exito. Se ha enviado un correo para verificar su cuenta!',
      savedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

//Validar email
const validateEmail = async (req, res) => {
  const token = req.params.token;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  try {
    const user = await userClient.updateMany({
      where: { emailtoken: hashedToken },
      data: { verificado: true, emailtoken: '' },
    });

    if (user.count === 0)
      return res
        .status(404)
        .json({ message: 'No se ha encontrado al usuario!' });
    return res
      .status(200)
      .json({ message: 'Usuario verificado con exito', user });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error al verificar la cuenta' });
  }
};

//Logout user
const logoutUser = (req, res) => {};

//Update user information
const updateUserInfo = async (req, res) => {};

//
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);
  try {
    const user = await userClient.findFirst({
      where: {
        email,
      },
    });

    if (!user)
      res.status(404).json({
        message: 'No se ha encontrado ningun usuario con esa direccion email',
      });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const getUsers = async (req, res) => {
  try {
    const usuarios = await userClient.findMany();
    res.status(200).json(usuarios);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

//Get user login
const getUser = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  loginUser,
  registerUser,
  validateEmail,
  logoutUser,
  forgotPassword,
  getUsers,
  getUser,
};
