import './Galeria.css';

function Galeria() {
  const imagens = [
    { src: '/imagens/projeto1.jpg', alt: 'Projeto de marcenaria 1' },
    { src: '/imagens/projeto2.jpg', alt: 'Projeto de serralheria 2' },
    { src: '/imagens/projeto3.jpg', alt: 'Projeto decorativo 3' },
  ];

  return (
    <section className="galeria">
      <h2>Galeria de Projetos</h2>
      <div className="grade">
        {imagens.map((img, index) => (
          <img key={index} src={img.src} alt={img.alt} />
        ))}
      </div>
    </section>
  );
}

export default Galeria;
