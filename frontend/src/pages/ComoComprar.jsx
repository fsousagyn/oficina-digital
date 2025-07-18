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
  const [camposVisiveis, setCamposVisiveis] = useState({
    padrao: false,
    personalizar: false,
    novo: false,
  });
  const [resumo, setResumo] = useState(null);

  const produtosPorLinha = {
    pet: ['Comedouro', 'Caminha', 'Brinquedo'],
    residencial: ['Mesa', 'Cadeira', 'Estante'],
    comercial: ['Expositor pequeno', 'Expositor médio', 'Expositor grande'],
    decoracao: ['Quadro', 'Escultura', 'Vaso'],
    utilidades: ['Organizador', 'Porta-objetos', 'Suporte'],
  };

  const produtosComPreco = {
  pet: {
    Comedouro: 49.90,
    Caminha: 129.90,
    Brinquedo: 19.90,
  },
  residencial: {
    Mesa: 399.90,
    Cadeira: 149.90,
    Estante: 599.90,
  },
  comercial: {
    'Expositor pequeno': 299.90,
    'Expositor médio': 499.90,
    'Expositor grande': 799.90,
  },
  decoracao: {
    Quadro: 89.90,
    Escultura: 149.90,
    Vaso: 59.90,
  },
  utilidades: {
    Organizador: 39.90,
    'Porta-objetos': 29.90,
    Suporte: 24.90,
  },
};

  useEffect(() => {
    setCamposVisiveis({
      padrao: tipoProduto === 'padrao',
      personalizar: tipoProduto === 'personalizar',
      novo: tipoProduto === 'novo',
    });
  }, [tipoProduto]);

  const validarFormulario = () => {
    if (!cliente.nome || !cliente.email || !telefone || !tipoProduto) {
      alert('Preencha nome, email, telefone e tipo de solicitação.');
      return false;
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

  const handleLogout = () => {
    logoutCliente();
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
  };

  setResumo(dados);
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

const gerarPDF = async () => {
  if (!validarFormulario()) return;

  const doc = new jsPDF();
  const margem = 15;
  let y = 20;

  // Logo
  const logo = new Image();
  logo.src = '/imagens/logo-ef.png'; // caminho relativo ao public/
  await new Promise(resolve => {
    logo.onload = resolve;
  });
  doc.addImage(logo, 'PNG', margem, y, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(75, 54, 33);
  doc.text('Orçamento - EF Criativa', margem + 35, y + 10);
  y += 40;

  // Cliente
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Cliente:', margem, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${cliente.nome}`, margem, y); y += 6;
  doc.text(`Email: ${cliente.email}`, margem, y); y += 6;
  doc.text(`Telefone: ${telefone}`, margem, y); y += 10;

  // Detalhes
  doc.setFont('helvetica', 'bold');
  doc.text('Detalhes do Orçamento:', margem, y);
  y += 8;

  doc.setFont('helvetica', 'normal');
  doc.text(`Tipo de solicitação: ${tipoProduto}`, margem, y); y += 6;
  doc.text(`Mensagem: ${document.getElementById('mensagem')?.value || ''}`, margem, y); y += 10;

  // Tabela de itens
  const itens = [];

  if (tipoProduto === 'padrao') {
  const linha = document.getElementById('linha-produto')?.value || '';
  const produto = document.getElementById('produto-padrao')?.value || '';
  const preco = produtosComPreco[linha]?.[produto] ?? 'N/D';

  itens.push(['Linha de produto', linha]);
  itens.push(['Produto', produto]);
  itens.push(['Valor', `R$ ${preco.toFixed(2)}`]);
}

  if (tipoProduto === 'novo') {
    itens.push(['Tipo de projeto', document.getElementById('tipo-projeto')?.value || '']);
    itens.push(['Estrutura', document.getElementById('estrutura')?.value || '']);
    itens.push(['Altura (cm)', document.getElementById('altura')?.value || '']);
    itens.push(['Largura (cm)', document.getElementById('largura')?.value || '']);
    itens.push(['Profundidade (cm)', document.getElementById('profundidade')?.value || '']);
  }

  autoTable(doc, {
    startY: y,
    head: [['Item', 'Detalhe']],
    body: itens,
    styles: {
      fillColor: [210, 180, 140], // tom terroso
      textColor: [75, 54, 33],
      fontSize: 11,
    },
    headStyles: {
      fillColor: [139, 69, 19],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    margin: { left: margem, right: margem },
  });

  y = doc.lastAutoTable.finalY + 10;

  // Rodapé
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100);
  doc.text('Este orçamento é válido por 15 dias. Para dúvidas ou ajustes, entre em contato conosco.', margem, y);
  y += 20;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(75, 54, 33);
  doc.text('Assinatura do cliente: ____________________________', margem, y);

  // QR Code para WhatsApp
  const whatsappLink = `https://wa.me/5562996204767?text=Olá!%20Gostaria%20de%20falar%20sobre%20meu%20orçamento.`;
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, whatsappLink, { width: 80, margin: 1 });
  const qrDataUrl = qrCanvas.toDataURL('image/png');
  doc.addImage(qrDataUrl, 'PNG', 150, 20, 40, 40);
  doc.setFontSize(10);
  doc.text('Fale conosco via WhatsApp', 150, 65);

  doc.save('orcamento-ef-criativa.pdf');
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
              <legend>Cliente</legend>
              <label htmlFor="nome">Nome:</label>
              <input type="text" id="nome" defaultValue={cliente.nome} required />

              <label htmlFor="email">Email:</label>
              <input type="email" id="email" defaultValue={cliente.email} required />

              <label htmlFor="telefone">Telefone:</label>
              <input type="text" id="telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} required />

              <label htmlFor="mensagem">Mensagem:</label>
              <textarea id="mensagem" required></textarea>
            </fieldset>

            <fieldset>
              <legend>Produto</legend>
              <label htmlFor="tipo-produto">Tipo de solicitação</label>
              <select id="tipo-produto" value={tipoProduto} onChange={(e) => setTipoProduto(e.target.value)} required>
                <option disabled value="">Selecione</option>
                <option value="padrao">Produto existente (padrão)</option>
                <option value="personalizar">Produto existente + personalização</option>
                <option value="novo">Novo projeto</option>
              </select>

              {camposVisiveis.padrao && (
                <div id="campos-padrao">
                  <label>Linha de produto</label>
                  <select
                    id="linha-produto"
                    onChange={(e) => {
                      const linha = e.target.value;
                      const produtoSelect = document.getElementById('produto-padrao');
                      produtoSelect.innerHTML = '<option value="">Selecione o produto</option>';
                      produtosPorLinha[linha]?.forEach(prod => {
                        const opt = document.createElement('option');
                        opt.value = prod;
                        opt.textContent = prod;
                        produtoSelect.appendChild(opt);
                      });
                    }}
                  >
                    <option value="">Selecione a linha</option>
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
                </div>
              )}
            </fieldset>

            <div className="botoes">
              <button type="button" onClick={handleVisualizar}>Visualizar</button>
              <button type="button" onClick={handleSalvarOrcamento}>Salvar Orçamento</button>
              <button type="button" onClick={gerarPDF}>Gerar PDF</button>
              <button type="button" onClick={gerarImagem}>Salvar como imagem</button>
              <button type="button" onClick={enviarWhatsApp}>Enviar via WhatsApp</button>
            </div>
          </form>

          {resumo && (
            <div className="resumo-orcamento">
              <h3>Resumo do Orçamento</h3>
              <ul className="resumo-lista">
                <li><strong>Nome:</strong> {resumo.nome}</li>
                <li><strong>Email:</strong> {resumo.email}</li>
                <li><strong>Telefone:</strong> {resumo.telefone}</li>
                <li><strong>Tipo de solicitação:</strong> {resumo.tipoProduto}</li>
                <li><strong>Mensagem:</strong> {resumo.mensagem}</li>
                {resumo.produto && <li><strong>Produto:</strong> {resumo.produto}</li>}
                {resumo.tipoProjeto && <li><strong>Tipo de projeto:</strong> {resumo.tipoProjeto}</li>}
                {resumo.estrutura && <li><strong>Estrutura:</strong> {resumo.estrutura}</li>}
                {resumo.altura && <li><strong>Altura:</strong> {resumo.altura} cm</li>}
                {resumo.largura && <li><strong>Largura:</strong> {resumo.largura} cm</li>}
                {resumo.profundidade && <li><strong>Profundidade:</strong> {resumo.profundidade} cm</li>}
                {resumo.preco && <li><strong>Valor:</strong> R$ {resumo.preco.toFixed(2)}</li>}
              </ul>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ComoComprar;