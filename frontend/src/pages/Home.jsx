import Header from '../components/Header';
import Galeria from '../components/Galeria';
import Footer from '../components/Footer';

function Home() {
  return (
    <>
      
      <main style={{ paddingTop: '100px', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
        
<section style={{ marginTop: '2rem' }}>
          <h2>Bem-vindo à EF Criativa!</h2>
          <p>Essa é sua página inicial em construção. Em breve, teremos vídeos e clientes por aqui ✨</p>
        </section>
        
        <section className="quem-somos" style={{ marginTop: '2rem', padding: '0 1rem' }}>
          <h2>Quem Somos</h2>
          <p>
            A EF Criativa é uma fusão de tradição artesanal e inovação tecnológica. Combinamos marcenaria e serralheria
            para criar projetos únicos que refletem a alma e a inteligência digital.
          </p>
        </section>
<Galeria />
        
      </main>
      <Footer />
    </>
  );
}

export default Home;
