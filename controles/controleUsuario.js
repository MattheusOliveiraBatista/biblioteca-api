const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Banco de dados simulado
let usuarios = [];

// Chave secreta para o JWT
const SECRET_KEY = 'minhaChaveSecreta';

// Registrar novo usuário (apenas administrador pode fazer isso)
const registrarUsuario = async (req, res) => {
  const { nome, login, senha, perfil } = req.body;

  // Verifica se o perfil é válido
  const perfisValidos = ['aluno', 'professor', 'bibliotecario', 'admin'];
  if (!perfisValidos.includes(perfil)) {
    return res.status(400).json({ erro: 'Perfil inválido' });
  }

  // Verifica se o usuário já existe
  const usuarioExistente = usuarios.find(u => u.login === login);
  if (usuarioExistente) {
    return res.status(400).json({ erro: 'Usuário já cadastrado' });
  }

  // Criptografa a senha
  const senhaCriptografada = await bcrypt.hash(senha, 10);

  // Cria e salva o novo usuário
  const novoUsuario = {
    id: usuarios.length + 1,
    nome,
    login,
    senha: senhaCriptografada,
    perfil
  };
  usuarios.push(novoUsuario);

  res.status(201).json({ mensagem: 'Usuário registrado com sucesso', usuario: novoUsuario });
};

// Login de usuário
const loginUsuario = async (req, res) => {
  const { login, senha } = req.body;

  // Verifica se o usuário existe
  const usuario = usuarios.find(u => u.login === login);
  if (!usuario) {
    return res.status(400).json({ erro: 'Usuário ou senha inválidos' });
  }

  // Verifica a senha
  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    return res.status(400).json({ erro: 'Usuário ou senha inválidos' });
  }

  // Gera o token JWT
  const token = jwt.sign(
    { id: usuario.id, login: usuario.login, perfil: usuario.perfil },
    SECRET_KEY,
    { expiresIn: '1h' }
  );

  res.json({ mensagem: 'Login realizado com sucesso', token });
};

// Middleware para verificar o token JWT e autorizar usuários por perfil
const autenticarToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ erro: 'Token não fornecido' });

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    req.usuario = payload;
    next();
  } catch (error) {
    res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar se o usuário é administrador
const autorizarAdmin = (req, res, next) => {
  if (req.usuario.perfil !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito ao administrador' });
  }
  next();
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  autenticarToken,
  autorizarAdmin
};
