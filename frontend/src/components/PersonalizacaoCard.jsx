import { useState } from 'react';

function PersonalizacaoCard({ dados, onVoltar }) {
  const [precoVerniz, setPrecoVerniz] = useState(120); // valor por litro
  const [margemLucro, setMargemLucro] = useState(30); // %
  const [resultado, setResultado] = useState(null);

  const calcular = () => {
    const { altura, largura, profundidade } = dados;
    const areaTotal = (altura * largura + altura * profundidade + largura * profundidade) * 2 / 10000; // cm² → m²
    const coberturaPorLitro = 10; // m² por litro
    const quantidadeLitros = areaTotal / coberturaPorLitro;
    const custoVerniz = quantidadeLitros * precoVerniz;
    const precoFinal = custoVerniz * (1 + margemLucro / 100);

    setResultado({
      areaTotal: areaTotal.toFixed(2),
      quantidadeLitros: quantidadeLitros.toFixed(2),
      custoVerniz: custoVerniz.toFixed(2),
      precoFinal: precoFinal.toFixed(2)
    });
  };

  return (
    <div className="personalizacao-card">
      <h3>Orçamento com Personalização</h3>
      <p><strong>Cliente:</strong> {dados.nome}</p>
      <p><strong>Contato:</strong> {dados.contato}</p>
      <p><strong>Produto base:</strong> {dados.produto_base}</p>
      <p><strong>Descrição da personalização:</strong> {dados.personalizacao}</p>

      <label>Preço do verniz (R$/litro):</label>
      <input type="number" value={precoVerniz} onChange={(e) => setPrecoVerniz(Number(e.target.value))} />

      <label>Margem de lucro (%):</label>
      <input type="range" min="0" max="100" value={margemLucro} onChange={(e) => setMargemLucro(Number(e.target.value))} />
      <p>{margemLucro}%</p>

      <button onClick={calcular}>Calcular proposta</button>
      <button onClick={onVoltar}>Voltar</button>

      {resultado && (
        <div className="resultado">
          <p><strong>Área total:</strong> {resultado.areaTotal} m²</p>
          <p><strong>Quantidade de verniz:</strong> {resultado.quantidadeLitros} L</p>
          <p><strong>Custo do verniz:</strong> R$ {resultado.custoVerniz}</p>
          <p><strong>Preço final com lucro:</strong> R$ {resultado.precoFinal}</p>
        </div>
      )}
    </div>
  );
}

export default PersonalizacaoCard;