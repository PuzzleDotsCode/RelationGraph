import React, { useState, useEffect } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import Cookies from 'js-cookie';
import defaultData from '../data/data.json';
import './GrafoIdeas.css';

const GrafoIdeas = () => {
  const [graphData, setGraphData] = useState(defaultData); // Inicializar con el archivo predeterminado
  const [hoveredNode, setHoveredNode] = useState(null);
  const [mode, setMode] = useState('edit'); // 'edit' activado por defecto
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Controla si el título está en modo edición
  const [customTitle, setCustomTitle] = useState(
    'Grafo Interactivo con Persistencia'
  ); // Título predeterminado

  // Cargar datos desde cookies o desde el archivo predeterminado
  useEffect(() => {
    const savedData = Cookies.get('grafo_data');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setGraphData(parsedData);
        if (parsedData.title) setCustomTitle(parsedData.title);
      } catch (error) {
        console.error('Error al leer la cookie grafo_data:', error);
      }
    } else {
      setGraphData(defaultData); // Usar datos predeterminados si no hay cookie
    }
  }, []);

  // Manejar carga de archivo JSON
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setGraphData({
            nodes: jsonData.nodes || [],
            links: jsonData.links || [],
          });
          if (jsonData.title) setCustomTitle(jsonData.title); // Actualizar el título si está presente
          Cookies.set('grafo_data', JSON.stringify(jsonData), { expires: 0.5 }); // Guardar en cookie (12 horas)
          alert(
            'Archivo cargado y guardado en la cookie. Persistencia activa por 12 horas.'
          );
        } catch (error) {
          alert(
            'Error al leer el archivo JSON. Asegúrate de que tenga el formato correcto.'
          );
        }
      };
      reader.readAsText(file);
    }
  };

  // Cambiar entre modos de edición
  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);

    if (selectedMode === 'edit') {
      const savedData = Cookies.get('grafo_data');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setGraphData(parsedData);
          if (parsedData.title) setCustomTitle(parsedData.title);
        } catch (error) {
          console.error('Error al leer la cookie grafo_data:', error);
        }
      } else {
        setGraphData(defaultData); // Volver a datos predeterminados
      }
    } else {
      setGraphData({ nodes: [], links: [] }); // Limpiar datos en modo "Cargar archivo"
    }
  };

  // Descargar datos como JSON limpio
  const downloadJSON = () => {
    const cleanedNodes = graphData.nodes.map((node) => ({
      id: node.id,
      title: node.title,
      description: node.description,
      bullets: node.bullets,
      tags: node.tags,
      color: node.color,
    }));

    const cleanedLinks = graphData.links.map((link) => ({
      source: typeof link.source === 'object' ? link.source.id : link.source,
      target: typeof link.target === 'object' ? link.target.id : link.target,
      label: link.label,
    }));

    const cleanedData = {
      title: customTitle,
      nodes: cleanedNodes,
      links: cleanedLinks,
    };

    const blob = new Blob([JSON.stringify(cleanedData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'grafo_ideas.json';
    a.click();
    URL.revokeObjectURL(url); // Liberar memoria
  };

  // Alternar el modo de edición del título
  const toggleTitleEdit = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  return (
    <div>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            style={{
              fontSize: '24px',
              padding: '5px',
              marginRight: '10px',
              flex: 1,
              border: '1px solid #ccc',
            }}
          />
        ) : (
          <h1 style={{ flex: 1 }}>{customTitle}</h1>
        )}
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label>
          <input
            type="radio"
            name="mode"
            value="upload"
            checked={mode === 'upload'}
            onChange={handleModeChange}
          />
          Cargar archivo
        </label>
        <label style={{ marginLeft: '20px' }}>
          <input
            type="radio"
            name="mode"
            value="edit"
            checked={mode === 'edit'}
            onChange={handleModeChange}
          />
          Editar en línea
        </label>
      </div>

      {mode === 'upload' && (
        <div style={{ marginBottom: '20px' }}>
          <input
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
          />
        </div>
      )}

      <button
        style={{
          marginBottom: '10px',
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={downloadJSON}
      >
        Descargar JSON
      </button>
      <button
        onClick={toggleTitleEdit}
        style={{
          padding: '10px 20px',
          marginLeft: '5px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        {isEditingTitle ? 'Guardar Título' : 'Editar Título'}
      </button>

      <ForceGraph2D
        graphData={graphData}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const title = node.title;
          const fontSize = 10 / globalScale; // Escalar texto según el zoom

          const nodeSize = 4; // Tamaño reducido del nodo

          // Dibujar nodo como círculo
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || 'blue';
          ctx.fill();

          // Dibujar título del nodo
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = 'black';
          ctx.fillText(title, node.x + 10, node.y + 3);
        }}
        linkCanvasObject={(link, ctx, globalScale) => {
          const fontSize = 8 / globalScale; // Escalar texto según el zoom

          // Dibujar línea del enlace
          ctx.beginPath();
          ctx.moveTo(link.source.x, link.source.y);
          ctx.lineTo(link.target.x, link.target.y);
          ctx.strokeStyle = 'gray';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Dibujar label si existe
          if (link.label) {
            const midX = (link.source.x + link.target.x) / 2;
            const midY = (link.source.y + link.target.y) / 2;

            // Dibujar el texto en el centro del enlace
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = 'black';
            ctx.fillText(link.label, midX, midY);
          }
        }}
        linkDirectionalArrowLength={6}
        linkDirectionalArrowRelPos={1}
        onNodeHover={(node) => setHoveredNode(node || null)}
      />

      {hoveredNode && (
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
            background: '#fff',
            padding: '10px',
            border: '1px solid #ccc',
          }}
        >
          <h4>{hoveredNode.title}</h4>
          <p>{hoveredNode.description}</p>
          <ul>
            {hoveredNode.bullets.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <em>Tags: {hoveredNode.tags.join(', ')}</em>
        </div>
      )}
    </div>
  );
};

export default GrafoIdeas;
