const express = require('express');
const router = express.Router();
const livroController = require('../controles/controleLivro');
const { autenticarToken } = require('../controles/controleUsuario');

// Rotas de livros
router.get('/', livroController.listarLivros);
router.get('/:id', livroController.buscarLivroPorId);
router.post('/', livroController.cadastrarLivro);
router.put('/:id', livroController.atualizarLivro);
router.delete('/:id', livroController.deletarLivro);

// Middleware para verificar se o usuário é bibliotecário
const verificarBibliotecario = (req, res, next) => {
    if (req.usuario.perfil !== 'bibliotecario') {
      return res.status(403).json({ erro: 'Acesso restrito aos bibliotecários' });
    }
    next();
  };
  
  // Rotas de livros (apenas bibliotecários)
router.post('/emprestar', autenticarToken, verificarBibliotecario, (req, res) => {
   res.send('Livro emprestado com sucesso!');
});
  

module.exports = router;
