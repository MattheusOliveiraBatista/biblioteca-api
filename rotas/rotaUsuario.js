const express = require('express');
const router = express.Router();
const usuarioController = require('../controles/controleUsuario');

// Rota para registrar novo usuário (apenas admin)
router.post(
  '/registrar',
  usuarioController.autenticarToken,
  usuarioController.autorizarAdmin,
  usuarioController.registrarUsuario
);

// Rota para login de usuário
router.post('/login', usuarioController.loginUsuario);

module.exports = router;
