import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <p>EF CrIAtiva – Marcenaria e Serralheria com Tecnologia e Alma</p>
      <p> Tradição artesanal + inteligência digital = projetos únicos</p>
      <div className="social-icons">
        <a href="https://www.instagram.com/efcriativa" target="_blank" rel="noopener noreferrer">
          <img src="/imagens/instagram.png" alt="Instagram" />
        </a>
		    <a href="https://www.facebook.com/efcriativa" target="_blank" rel="noopener noreferrer">
          <img src="/imagens/facebook.png" alt="Facebook" />
        </a>
		    <a href="https://www.youtube.com/madeirametalecerveja" target="_blank" rel="noopener noreferrer">
          <img src="/imagens/youtube.png" alt="YouTube" />
          </a>
        <a href="https://wa.me/5562996204767" target="_blank" rel="noopener noreferrer">
          <img src="/imagens/whatsapp.png" alt="WhatsApp" />
        </a>
      </div>
      <p>Contato: contato@efcriativa.com.br | (62) 99620-4767</p>
      <p>© 2025 EF Criativa. Todos os direitos reservados.</p>
    </footer>
  );
}

export default Footer;