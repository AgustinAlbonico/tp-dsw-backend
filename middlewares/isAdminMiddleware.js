
const { PrismaClient } = require('@prisma/client');
const userClient = new PrismaClient().usuario;

// Middleware para verificar si el usuario es administrador
const isAdminMiddleware = async (req, res, next) => {
  try {
    if (req.user && req.user.rol === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Acceso no autorizado' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al verificar el rol del usuario' });
  }
};

module.exports = {isAdminMiddleware}

  