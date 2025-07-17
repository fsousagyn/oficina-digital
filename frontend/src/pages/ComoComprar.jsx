import { useState, useEffect } from 'react';
import './ComoComprar.css';
import { useCliente } from '../context/ClienteContext';
import axios from 'axios';

function ComoComprar() {
  const { cliente, loginCliente, logoutCliente } = useCliente();
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagem, setMensagem] = useState('');

  const [tipoProduto, setTipoProduto] = useState('');
  const [camposVisiveis, setCamposVisiveis] = useState({
    padrao: false,
    personalizar: false,
    novo: false,
  });

  useEffect(() => {
    setCamposVisiveis({
      padrao: tipoProduto === 'padrao',
      personalizar: tipoProduto === 'personalizar',
      novo: tipoProduto === 'novo',
    });
  }, [tipoProduto]);

  const handleCadastro = async () => {
    try {
      const resposta = await axios.post('/api/clientes', { nome, email, senha });
      loginCliente(resposta.data);
      setMensagem('');
    } catch (erro) {
      setMensagem('Erro ao cadastrar. Tente outro e-mail.');
    }
  };

  const handleLogin = async () => {
    try {
      const resposta = await axios.post('/api/clientes/login', { email, senha });
      loginCliente(resposta.data);
      setMensagem('');
    } catch (erro) {
      setMensagem('Login inválido. Verifique seus dados.');
    }
  };

  const handleLogout = () => {
    logoutCliente();
  };

  return (
    <section id="page-como-comprar" className="tela">
      <h1>Como Comprar</h1>

      {!cliente ? (
        <div className="form-login-cliente">
          <p>{modo === 'login' ? 'Faça login para solicitar orçamento:' : 'Cadastre-se para começar:'}</p>

          {modo === 'cadastro' && (
            <input
              type="text"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          )}

          <input
            type="email"
            placeholder="Seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />

          <button onClick={modo === 'login' ? handleLogin : handleCadastro}>
            {modo === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>

          <p className="alternar-modo">
            {modo === 'login' ? (
              <>Não tem conta? <button onClick={() => setModo('cadastro')}>Cadastre-se</button></>
            ) : (
              <>Já tem conta? <button onClick={() => setModo('login')}>Fazer login</button></>
            )}
          </p>

          {mensagem && <p className="mensagem-feedback">{mensagem}</p>}
        </div>
      ) : (
        <>
          <p>Olá, <strong>{cliente.nome}</strong>! Preencha os dados do seu orçamento abaixo:</p>
          <button onClick={handleLogout}>Sair</button>

          <form id="form-como-comprar">
            <fieldset>
              <legend>Cliente</legend>
              <label htmlFor="nome">Nome:</label>
              <input type="text" id="nome" defaultValue={cliente.nome} required />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" defaultValue={cliente.email} required />

              <label htmlFor="mensagem">Mensagem:</label>
              <textarea id="mensagem" required></textarea>
            </fieldset>

            <fieldset>
              <legend>Produto</legend>
              <label htmlFor="tipo-produto">Tipo de solicitação</label>
              <select
                id="tipo-produto"
                value={tipoProduto}
                onChange={(e) => setTipoProduto(e.target.value)}
                required
              >
                <option disabled value="">Selecione</option>
                <option value="padrao">Produto existente (padrão)</option>
                <option value="personalizar">Produto existente + personalização</option>
                <option value="novo">Novo projeto</option>
              </select>

              {camposVisiveis.padrao && (
                <div id="campos-padrao">
                  <label>Linha de produto</label>
                  <select id="linha-produto">
                    <option value="pet">Linha PET</option>
                    <option value="residencial">Móveis residenciais</option>
                    <option value="comercial">Expositores comerciais</option>
                    <option value="decoracao">Decoração</option>
                    <option value="utilidades">Utilidades</option>
                  </select>

                  <label>Produto</label>
                  <select id="produto-padrao">
                    <option value="">Selecione o produto</option>
                  </select>
                </div>
              )}

              {camposVisiveis.personalizar && (
                <div id="campos-personalizar">
                  <label>Produto base</label>
                  <select id="produto-base">
                    <option value="">Selecione o produto</option>
                  </select>

                  <label>Descreva a personalização</label>
                  <textarea id="personalizacao"></textarea>
                </div>
              )}

              {camposVisiveis.novo && (
                <div id="campos-novo">
                  <label>Imagem de referência (opcional)</label>
                  <input type="file" id="imagem-referencia" accept="image/*" />

                  <label htmlFor="tipo-projeto">Tipo de projeto</label>
                  <input type="text" id="tipo-projeto" />

                  <label htmlFor="estrutura">Tipo de estrutura</label>
                  <select id="estrutura">
                    <option value="madeira">Madeira</option>
                    <option value="metal">Metal</option>
                    <option value="ambos">Ambos</option>
                  </select>

                  <label htmlFor="altura">Altura (cm)</label>
                  <input type="number" id="altura" />

                  <label htmlFor="largura">Largura (cm)</label>
                  <input type="number" id="largura" />

                  <label htmlFor="profundidade">Profundidade (cm)</label>
                  <input type="number" id="profundidade" />

                  <label htmlFor="madeira">Tipo de Madeira</label>
                  <select id="madeira">
                    <option value="">Selecione</option>
                    <option value="pinus">Pinus</option>
                    <option value="mdf">MDF</option>
                    <option value="compensado">Compensado</option>
                  </select>

                  <label htmlFor="metal">Tipo de Metal</label>
                  <select id="metal">
                    <option value="">Selecione</option>
                    <option value="20x20">Metalon 20x20</option>
                    <option value="20x30">Metalon 20x30</option>
                    <option value="30x30">Metalon 30x30</option>
                  </select>

                  <label htmlFor="acabamento-madeira">Acabamento Madeira</label>
                  <select id="acabamento-madeira" multiple>
                    <option value="oleo">Óleo mineral</option>
                    <option value="seladora">Seladora</option>
                    <option value="verniz">Verniz sintético</option>
                  </select>

                  <label htmlFor="acabamento-metal">Acabamento Metal</label>
                  <select id="acabamento-metal" multiple>
                    <option value="pintura">Pintura epóxi</option>
                    <option value="inox">Inox escovado</option>
                  </select>

                  <label htmlFor="entrega">Entrega</label>
                  <select id="entrega">
                    <option value="vendedor">Pelo vendedor</option>
                    <option value="retirada">Retirada</option>
                    <option value="combinar">A combinar</option>
                  </select>

                  <label htmlFor="embalagem">Embalagem</label>
                  <input type="text" id="embalagem" />

                  <label htmlFor="observacoes">Observações adicionais</label>
                  <textarea id="observacoes" rows="3"></textarea>
                </div>
              )}
            </fieldset>

            <div className="botoes">
              <button type="button" id="visualizar">Visualizar</button>
              <button type="button" id="refazer">Refazer</button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}

export default ComoComprar;