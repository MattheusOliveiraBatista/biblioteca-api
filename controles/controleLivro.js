let livros = [
    { id: 1, titulo: 'O Senhor dos Anéis', autor: 'J.R.R. Tolkien', disponivel: true },
    { id: 2, titulo: '1984', autor: 'George Orwell', disponivel: true }
  ];
  
  // Listar todos os livros
  const listarLivros = (req, res) => {
    res.json(livros);
  };
  
  // Buscar um livro por ID
  const buscarLivroPorId = (req, res) => {
    const id = parseInt(req.params.id);
    const livro = livros.find(l => l.id === id);
    if (!livro) return res.status(404).json({ erro: 'Livro não encontrado' });
    res.json(livro);
  };
  
  // Cadastrar um novo livro
  const cadastrarLivro = (req, res) => {
    const novoLivro = { id: livros.length + 1, ...req.body, disponivel: true };
    livros.push(novoLivro);
    res.status(201).json(novoLivro);
  };
  
  // Atualizar um livro existente
  const atualizarLivro = (req, res) => {
    const id = parseInt(req.params.id);
    const index = livros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Livro não encontrado' });
  
    livros[index] = { id, ...req.body };
    res.json(livros[index]);
  };
  
  // Deletar um livro
  const deletarLivro = (req, res) => {
    const id = parseInt(req.params.id);
    const index = livros.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ erro: 'Livro não encontrado' });
  
    livros.splice(index, 1);
    res.status(204).send();
  };
  
  module.exports = {
    listarLivros,
    buscarLivroPorId,
    cadastrarLivro,
    atualizarLivro,
    deletarLivro
  };
  