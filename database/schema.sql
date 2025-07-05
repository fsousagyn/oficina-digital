-- Estrutura inicial do banco 
CREATE DATABASE IF NOT EXISTS oficina_digital;
USE oficina_digital;

-- Tabela de clientes
CREATE TABLE clientes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  telefone VARCHAR(20),
  data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de pedidos
CREATE TABLE pedidos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cliente_id INT,
  descricao TEXT,
  status ENUM('novo', 'em_producao', 'concluido') DEFAULT 'novo',
  valor DECIMAL(10,2),
  data_pedido DATE,
  FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);

-- Tabela de produtos/catálogo
CREATE TABLE produtos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  categoria VARCHAR(50),
  preco DECIMAL(10,2),
  imagem_url VARCHAR(255),
  em_estoque BOOLEAN DEFAULT true
);

-- Tabela de inspirações
CREATE TABLE inspiracoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100),
  descricao TEXT,
  imagem_url VARCHAR(255),
  origem ENUM('cliente', 'interna') DEFAULT 'interna'
);

-- Tabela de pagamentos
CREATE TABLE pagamentos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  pedido_id INT,
  tipo_pagamento ENUM('boleto', 'pix', 'cartao'),
  valor_pago DECIMAL(10,2),
  data_pagamento DATE,
  status ENUM('pendente', 'pago', 'atrasado') DEFAULT 'pendente',
  FOREIGN KEY (pedido_id) REFERENCES pedidos(id)
);
