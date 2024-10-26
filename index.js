const express = require('express');
const app = express();
const livroRoutes = require('./rotas/rotaLivro');
const usuarioRoutes = require('./rotas/rotaUsuario');
const { autenticarToken, autorizarAdmin } = require('./controles/controleUsuario');
const PORT = 3000;

// Middleware para interpretar JSON
app.use(express.json());

// Rota principal
app.get('/', (req, res) => {
  res.send('Bem-vindo à API da Biblioteca!');
});

// Rotas de usuários (registro e login)
app.use('/usuarios', usuarioRoutes);

// Rotas de livros (protegidas por autenticação)
app.use('/livros', autenticarToken, livroRoutes);

// Exemplo: rota protegida para administradores
app.get('/admin', autenticarToken, autorizarAdmin, (req, res) => {
  res.send('Bem-vindo à área administrativa!');
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
