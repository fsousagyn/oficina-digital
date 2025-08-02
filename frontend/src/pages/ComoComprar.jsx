import { useState, useEffect } from 'react';
import './ComoComprar.css';
import { useCliente } from '../context/ClienteContext';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import QRCode from 'qrcode';
import html2canvas from 'html2canvas';

function ComoComprar() {
  const { cliente, loginCliente, logoutCliente } = useCliente();
  const [modo, setModo] = useState('login');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoProduto, setTipoProduto] = useState('');
  const [resumo, setResumo] = useState(null);
  const [imagemReferencia, setImagemReferencia] = useState(null);

  const [camposVisiveis, setCamposVisiveis] = useState({
    padrao: false,
    personalizar: false,
    novo: false,
  });

  const produtosPorLinha = {
    pet: ['Comedouro', 'Caminha', 'Brinquedo'],
    residencial: ['Mesa', 'Cadeira', 'Estante'],
    comercial: ['Expositor pequeno', 'Expositor médio', 'Expositor grande'],
    decoracao: ['Quadro', 'Escultura', 'Vaso'],
    utilidades: ['Organizador', 'Porta-objetos', 'Suporte'],
  };

  const produtosComPreco = {
    pet: { Comedouro: 49.9, Caminha: 129.9, Brinquedo: 19.9 },
    residencial: { Mesa: 399.9, Cadeira: 149.9, Estante: 599.9 },
    comercial: { 'Expositor pequeno': 299.9, 'Expositor médio': 499.9, 'Expositor grande': 799.9 },
    decoracao: { Quadro: 89.9, Escultura: 149.9, Vaso: 59.9 },
    utilidades: { Organizador: 39.9, 'Porta-objetos': 29.9, Suporte: 24.9 },
  };

  useEffect(() => {
    setCamposVisiveis({
      padrao: tipoProduto === 'padrao',
      personalizar: tipoProduto === 'personalizar',
      novo: tipoProduto === 'novo',
    });
  }, [tipoProduto]);

  const validarFormulario = () => {
    if (!cliente?.nome || !cliente?.email || !telefone || !tipoProduto) {
      alert('Preencha nome, email, telefone e tipo de solicitação.');
      return false;
    }

    if (tipoProduto === 'padrao') {
      const linha = document.getElementById('linha-produto')?.value;
      const produto = document.getElementById('produto-padrao')?.value;
      if (!linha || !produto) {
        alert('Selecione a linha e o produto.');
        return false;
      }
    }

    if (tipoProduto === 'novo') {
      const tipoProjeto = document.getElementById('tipo-projeto')?.value;
      if (!tipoProjeto) {
        alert('Informe o tipo de projeto.');
        return false;
      }
    }

    return true;
  };

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

  const handleLogout = () => logoutCliente();

  const handleUploadImagem = async () => {
    const file = document.getElementById('imagem-referencia')?.files?.[0];
    if (!file) return null;

    const formData = new FormData();
    formData.append('imagem', file);

    try {
      const resposta = await axios.post('/upload/novo', formData);
      return resposta.data.url;
    } catch (erro) {
      console.error('Erro no upload da imagem:', erro);
      return null;
    }
  };

  const handleSalvarOrcamento = async () => {
    if (!validarFormulario()) return;

    const tipo_solicitacao = tipoProduto;
    const mensagemTexto = document.getElementById('mensagem')?.value || '';

    const dados = {
      produto: document.getElementById('produto-padrao')?.value || '',
      tipoProjeto: document.getElementById('tipo-projeto')?.value || '',
      estrutura: document.getElementById('estrutura')?.value || '',
      altura: document.getElementById('altura')?.value || '',
      largura: document.getElementById('largura')?.value || '',
      profundidade: document.getElementById('profundidade')?.value || '',
    };

    const imagemUrl = await handleUploadImagem();
    if (imagemUrl) dados.imagemReferencia = imagemUrl;

    try {
      await axios.post('/api/orcamentos', {
        cliente_email: cliente.email,
        tipo_solicitacao,
        mensagem: mensagemTexto,
        dados,
      });
      alert('Orçamento salvo com sucesso!');
    } catch (erro) {
      alert('Erro ao salvar orçamento.');
    }
  };
  const handleVisualizar = () => {
    if (!validarFormulario()) return;

    const linha = document.getElementById('linha-produto')?.value || '';
    const produto = document.getElementById('produto-padrao')?.value || '';
    const preco = produtosComPreco[linha]?.[produto] ?? null;

    const dados = {
      nome: cliente.nome,
      email: cliente.email,
      telefone,
      tipoProduto,
      mensagem: document.getElementById('mensagem')?.value || '',
      linha,
      produto,
      preco,
      tipoProjeto: document.getElementById('tipo-projeto')?.value || '',
      estrutura: document.getElementById('estrutura')?.value || '',
      altura: document.getElementById('altura')?.value || '',
      largura: document.getElementById('largura')?.value || '',
      profundidade: document.getElementById('profundidade')?.value || '',
      imagemReferencia,
    };

    setResumo(dados);
  };

  const gerarImagem = () => {
    if (!validarFormulario()) return;

    const form = document.getElementById('form-como-comprar');
    html2canvas(form).then(canvas => {
      const link = document.createElement('a');
      link.download = 'orcamento.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const enviarWhatsApp = () => {
    if (!validarFormulario()) return;

    const texto = `Olá! Aqui está meu orçamento:\n\nCliente: ${cliente.nome}\nEmail: ${cliente.email}\nTelefone: ${telefone}\nMensagem: ${document.getElementById('mensagem')?.value || ''}`;
    const url = `https://wa.me/?text=${encodeURIComponent(texto)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="page-como-comprar" className="tela">
      <h1>Como Comprar</h1>

      {!cliente ? (
        <div className="form-login-cliente">
          <p>{modo === 'login' ? 'Faça login para solicitar orçamento:' : 'Cadastre-se para começar:'}</p>

          {modo === 'cadastro' && (
            <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          )}
          <input type="email" placeholder="Seu e-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} />

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
              <legend>Contato</legend>
              <input type="text" id="telefone" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />
              <textarea id="mensagem" placeholder="Mensagem" required></textarea>
            </fieldset>

            <fieldset>
              <legend>Produto</legend>
              <select id="tipo-produto" value={tipoProduto} onChange={(e) => setTipoProduto(e.target.value)} required>
                <option disabled value="">Tipo de solicitação</option>
                <option value="padrao">Produto existente</option>
                <option value="personalizar">Personalizar produto</option>
                <option value="novo">Novo projeto</option>
              </select>

              {camposVisiveis.padrao && (
                <div>
                  <select id="linha-produto" onChange={(e) => {
                    const linha = e.target.value;
                    const produtoSelect = document.getElementById('produto-padrao');
                    produtoSelect.innerHTML = '<option value="">Produto</option>';
                    produtosPorLinha[linha]?.forEach(prod => {
                      const opt = document.createElement('option');
                      opt.value = prod;
                      opt.textContent = prod;
                      produtoSelect.appendChild(opt);
                    });
                  }}>
                    <option value="">Linha de produto</option>
                    <option value="pet">PET</option>
                    <option value="residencial">Residencial</option>
                    <option value="comercial">Comercial</option>
                    <option value="decoracao">Decoração</option>
                    <option value="utilidades">Utilidades</option>
                  </select>
                  <select id="produto-padrao">
                    <option value="">Produto</option>
                  </select>
                </div>
              )}

              {camposVisiveis.novo && (
                <div>
                  <input type="file" id="imagem-referencia" accept="image/*" />
                  <input type="text" id="tipo-projeto" placeholder="Tipo de projeto" />
                  <select id="estrutura">
                    <option value="madeira">Madeira</option>
                    <option value="metal">Metal</option>
                    <option value="ambos">Ambos</option>
                  </select>
                  <input type="number" id="altura" placeholder="Altura (cm)" />
                  <input type="number" id="largura" placeholder="Largura (cm)" />
                  <input type="number" id="profundidade" placeholder="Profundidade (cm)" />
                </div>
              )}
            </fieldset>

            <div className="botoes">
              <button type="button" onClick={handleVisualizar}>Visualizar</button>
              <button type="button" onClick={handleSalvarOrcamento}>Salvar</button>
              <button type="button" onClick={gerarImagem}>Imagem</button>
              <button type="button" onClick={enviarWhatsApp}>WhatsApp</button>
            </div>
          </form>

          {resumo && (
            <div className="resumo-orcamento">
              <h3>Resumo</h3>
              <ul>
                <li><strong>Nome:</strong> {resumo.nome}</li>
                <li><strong>Email:</strong> {resumo.email}</li>
                <li><strong>Telefone:</strong> {resumo.telefone}</li>
                <li><strong>Tipo:</strong> {resumo.tipoProduto}</li>
                <li><strong>Mensagem:</strong> {resumo.mensagem}</li>
                {resumo.produto && <li><strong>Produto:</strong> {resumo.produto}</li>}
                {resumo.tipoProjeto && <li><strong>Projeto:</strong> {resumo.tipoProjeto}</li>}
                {resumo.estrutura && <li><strong>Estrutura:</strong> {resumo.estrutura}</li>}
                {resumo.altura && <li><strong>Altura:</strong> {resumo.altura} cm</li>}
                {resumo.largura && <li><strong>Largura:</strong> {resumo.largura} cm</li>}
                {resumo.profundidade && <li><strong>Profundidade:</strong> {resumo.profundidade} cm</li>}
                {resumo.preco && <li><strong>Valor:</strong> R$ {resumo.preco.toFixed(2)}</li>}
                {resumo.imagemReferencia && (
                  <li>
                    <strong>Imagem:</strong><br />
                    <img src={resumo.imagemReferencia} alt="Referência" style={{ maxWidth: '100%' }} />
                  </li>
                )}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ComoComprar;
