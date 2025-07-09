import './ComoComprar.css';

function ComoComprar() {
  return (
    <div className="como-comprar">
      <h1>Como Comprar</h1>
      <p>Preencha o formulário abaixo para solicitar seu orçamento personalizado:</p>
      <form>
        <label htmlFor="nome">Nome:</label>
        <input type="text" id="nome" name="nome" required />

        <label htmlFor="email">Email:</label>
        <input type="email" id="email" name="email" required />

        <label htmlFor="telefone">Telefone:</label>
        <input type="tel" id="telefone" name="telefone" />

        <label htmlFor="mensagem">Detalhes do Projeto:</label>
        <textarea id="mensagem" name="mensagem" rows="5" required></textarea>

        <button type="submit">Enviar Pedido</button>
      </form>
    </div>
  );
}

export default ComoComprar;
