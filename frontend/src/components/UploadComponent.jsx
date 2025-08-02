import React, { useState, useEffect } from 'react';
import './UploadComponent.css';

function UploadComponent({ onUploadSuccess, categoriaInicial = 'carrossel' }) {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewImages, setPreviewImages] = useState([]);
  const [savedImages, setSavedImages] = useState([]);
  const [categoria, setCategoria] = useState(categoriaInicial);

  const carregarImagensSalvas = () => {
    const imagensSalvas = JSON.parse(localStorage.getItem(categoria)) || [];
    const imagensFormatadas = imagensSalvas
      .filter((url) => url && url.startsWith('http'))
      .map((url) => ({
        name: decodeURIComponent(url.split('/').pop()),
        url,
      }));
    setSavedImages(imagensFormatadas);
  };

  const limparImagensInvalidas = () => {
    const imagensSalvas = JSON.parse(localStorage.getItem(categoria)) || [];
    const imagensValidas = imagensSalvas.filter((url) => url && url.startsWith('http'));
    localStorage.setItem(categoria, JSON.stringify(imagensValidas));
    carregarImagensSalvas();
  };

  useEffect(() => {
    limparImagensInvalidas();
  }, [categoria]);

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(selectedFiles);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleUpload = () => {
    files.forEach((file) => {
      const formData = new FormData();
      formData.append('imagem', file);

      const xhr = new XMLHttpRequest();
      xhr.open('POST', `http://localhost:3001/upload/${categoria}`);

      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          setUploadProgress((prev) => ({
            ...prev,
            [file.name]: percent,
          }));
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200 || xhr.status === 201) {
          const { url } = JSON.parse(xhr.responseText);
          const decodedName = decodeURIComponent(url.split('/').pop());

          const listaAtual = JSON.parse(localStorage.getItem(categoria)) || [];
          const novaLista = [...listaAtual, url];
          localStorage.setItem(categoria, JSON.stringify(novaLista));

          if (onUploadSuccess) {
            onUploadSuccess(url);
          }

          carregarImagensSalvas();
        } else {
          console.error('❌ Upload falhou:', file.name);
        }
      };

      xhr.onerror = () => {
        console.error('💥 Erro no upload:', file.name);
      };

      xhr.send(formData);
    });

    setFiles([]);
    setPreviewImages([]);
  };

  const handleDelete = (index) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    const updatedPreviews = previewImages.filter((_, i) => i !== index);
    setPreviewImages(updatedPreviews);
  };

  const handleReorder = (startIndex, endIndex) => {
    if (endIndex < 0 || endIndex >= files.length) return;

    const reorderedFiles = [...files];
    const [movedFile] = reorderedFiles.splice(startIndex, 1);
    reorderedFiles.splice(endIndex, 0, movedFile);
    setFiles(reorderedFiles);

    const reorderedPreviews = [...previewImages];
    const [movedPreview] = reorderedPreviews.splice(startIndex, 1);
    reorderedPreviews.splice(endIndex, 0, movedPreview);
    setPreviewImages(reorderedPreviews);
  };

  return (
    <div className="upload-container">
      <h2>Upload de Arquivos</h2>

      <label>
        Categoria:
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="carrossel">Carrossel</option>
          <option value="clientes">Clientes</option>
          <option value="fornecedores">Fornecedores</option>
        </select>
      </label>

      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>

      <div className="upload-preview">
        {previewImages.map((src, index) => (
          <div key={index} className="preview-item">
            <img src={src} alt={`Preview ${index}`} />
            <div className="preview-controls">
              <button onClick={() => handleDelete(index)}>Excluir</button>
              <button onClick={() => handleReorder(index, index - 1)}>↑</button>
              <button onClick={() => handleReorder(index, index + 1)}>↓</button>
            </div>
            {uploadProgress[files[index]?.name] !== undefined && (
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${uploadProgress[files[index].name]}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {savedImages.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <h3>Imagens Salvas:</h3>
          <div className="upload-preview">
            {savedImages.map(({ name, url }, i) => (
              <div key={i} className="preview-item">
                <img src={url} alt={name} />
                <span>{name}</span>
                <button
                  onClick={() => {
                    const novaLista = savedImages.filter((_, idx) => idx !== i);
                    const urls = novaLista.map((img) => img.url);
                    localStorage.setItem(categoria, JSON.stringify(urls));
                    setSavedImages(novaLista);
                  }}
                >
                  🗑️ Excluir
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadComponent;
