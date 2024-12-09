import React, { useState, useEffect } from "react";
import ForceGraph2D from "react-force-graph-2d";
import Cookies from "js-cookie";
import defaultData from "../data/data.json";
import "./GrafoIdeas.css";

const GrafoIdeas = () => {
  const [graphData, setGraphData] = useState(defaultData); // Initialize with default data
  const [hoveredNode, setHoveredNode] = useState(null); // Track the hovered node
  const [mode, setMode] = useState("edit"); // Default mode: 'edit'
  const [isEditingTitle, setIsEditingTitle] = useState(false); // Track title editing state
  const [customTitle, setCustomTitle] = useState(
    "Interactive Graph with Persistence"
  ); // Default title
  const [settingsVisible, setSettingsVisible] = useState(false); // Track visibility of settings

  // Load data from cookies or default file
  useEffect(() => {
    const savedData = Cookies.get("grafo_data");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setGraphData(parsedData);
        if (parsedData.title) setCustomTitle(parsedData.title);
      } catch (error) {
        console.error("Error reading cookie grafo_data:", error);
      }
    } else {
      setGraphData(defaultData); // Use default data if no cookie is found
    }
  }, []);

  // Automatically update the graph if the JSON file changes
  useEffect(() => {
    const interval = setInterval(() => {
      const savedData = Cookies.get("grafo_data");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setGraphData((prevData) => {
            if (JSON.stringify(prevData) !== JSON.stringify(parsedData)) {
              return parsedData;
            }
            return prevData;
          });
        } catch (error) {
          console.error("Error updating data from cookie:", error);
        }
      }
    }, 2000); // Check every 2 seconds
    return () => clearInterval(interval);
  }, []);

  // Handle file upload
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
          if (jsonData.title) setCustomTitle(jsonData.title); // Update title if present
          Cookies.set("grafo_data", JSON.stringify(jsonData), { expires: 0.5 }); // Save to cookie (12 hours)
          alert(
            "File loaded and saved in cookie. Persistence active for 12 hours."
          );
        } catch (error) {
          alert(
            "Error reading the JSON file. Ensure it has the correct format."
          );
        }
      };
      reader.readAsText(file);
    }
  };

  // Switch between modes (edit or upload)
  const handleModeChange = (event) => {
    const selectedMode = event.target.value;
    setMode(selectedMode);

    if (selectedMode === "edit") {
      const savedData = Cookies.get("grafo_data");
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          setGraphData(parsedData);
          if (parsedData.title) setCustomTitle(parsedData.title);
        } catch (error) {
          console.error("Error reading cookie grafo_data:", error);
        }
      } else {
        setGraphData(defaultData); // Revert to default data
      }
    } else {
      setGraphData({ nodes: [], links: [] }); // Clear data in upload mode
    }
  };

  // Download clean JSON data
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
      source: typeof link.source === "object" ? link.source.id : link.source,
      target: typeof link.target === "object" ? link.target.id : link.target,
      label: link.label,
    }));

    const cleanedData = {
      title: customTitle,
      nodes: cleanedNodes,
      links: cleanedLinks,
    };

    const blob = new Blob([JSON.stringify(cleanedData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "graph_data.json";
    a.click();
    URL.revokeObjectURL(url); // Free memory
  };

  // Toggle title editing state
  const toggleTitleEdit = () => {
    setIsEditingTitle(!isEditingTitle);
  };

  // Toggle settings visibility
  const toggleSettings = () => {
    setSettingsVisible(!settingsVisible);
  };

  return (
    <div>

    {/* Settings Section */}
    <button
      onClick={toggleSettings}
      style={{
        marginBottom: "10px",
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
    >
      Settings
    </button>

    {settingsVisible && (
      <div>
        <div style={{ marginBottom: "20px" }}>
          <label>
            <input
              type="radio"
              name="mode"
              value="upload"
              checked={mode === "upload"}
              onChange={handleModeChange}
            />
            Upload File
          </label>
          <label style={{ marginLeft: "20px" }}>
            <input
              type="radio"
              name="mode"
              value="edit"
              checked={mode === "edit"}
              onChange={handleModeChange}
            />
            Edit Online
          </label>
        </div>

        {mode === "upload" && (
          <div style={{ marginBottom: "20px" }}>
            <input
              type="file"
              accept="application/json"
              onChange={handleFileUpload}
            />
          </div>
        )}

        <button
          style={{
            marginBottom: "10px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={downloadJSON}
        >
          Download JSON
        </button>
      <button
        onClick={toggleTitleEdit}
        style={{
          padding: "10px 20px",
          marginLeft: '5px',
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        {isEditingTitle ? "Save Title" : "Edit Title"}
      </button>
      </div>
    )}
    {/* End Settings */}

      <div
        style={{ display: "flex", alignItems: "center", marginBottom: "20px" }}
      >
        {isEditingTitle ? (
          <input
            type="text"
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            style={{
              fontSize: "24px",
              padding: "5px",
              marginRight: "10px",
              flex: 1,
              border: "1px solid #ccc",
            }}
          />
        ) : (
          <h1 style={{ flex: 1 }}>{customTitle}</h1>
        )}
      </div>

      <ForceGraph2D
        graphData={graphData}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const title = node.title;
          const fontSize = 12 / globalScale; // Scale text based on zoom level

          const nodeSize = 2; // Node size

          // Draw node as a circle
          ctx.beginPath();
          ctx.arc(node.x, node.y, nodeSize, 0, 2 * Math.PI, false);
          ctx.fillStyle = node.color || "blue";
          ctx.fill();

          // Draw node title
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = "black";
          ctx.fillText(title, node.x + 10, node.y + 1);
        }}
        linkCanvasObject={(link, ctx, globalScale) => {
          const fontSize = 8 / globalScale; // Scale text based on zoom level
          const nodeSize = 2; // Same size as used in nodeCanvasObject
          const arrowSize = 6; // Arrow size

          // Calculate the direction vector and its length
          const dx = link.target.x - link.source.x;
          const dy = link.target.y - link.source.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          // Adjust positions for the link line to account for node size and arrow size
          const adjustedTargetX =
            link.target.x - (dx / distance) * (nodeSize + arrowSize);
          const adjustedTargetY =
            link.target.y - (dy / distance) * (nodeSize + arrowSize);

          const adjustedSourceX = link.source.x + (dx / distance) * nodeSize;
          const adjustedSourceY = link.source.y + (dy / distance) * nodeSize;

          // Draw link line excluding the arrow section
          ctx.beginPath();
          ctx.moveTo(adjustedSourceX, adjustedSourceY);
          ctx.lineTo(adjustedTargetX, adjustedTargetY);
          ctx.strokeStyle = link.color || "gray"; // Link color
          ctx.lineWidth = link.width || 0.2; // Link width
          ctx.stroke();

          // Draw label if it exists
          if (link.label) {
            const midX = (adjustedSourceX + adjustedTargetX) / 2;
            const midY = (adjustedSourceY + adjustedTargetY) / 2;

            // Draw text at the middle of the link
            ctx.font = `${fontSize}px Sans-Serif`;
            ctx.fillStyle = "black";
            ctx.fillText(link.label, midX, midY);
          }
        }}
        linkDirectionalArrowLength={6} // Arrow size
        linkDirectionalArrowRelPos={1} // Adjust arrow to the very edge of the target
        onNodeHover={(node) => setHoveredNode(node || null)}
      />

      {hoveredNode && (
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 20,
            background: "#fff",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h4>{hoveredNode.title}</h4>
          <p>{hoveredNode.description}</p>
          <ul>
            {hoveredNode.bullets.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <em>Tags: {hoveredNode.tags.join(", ")}</em>
        </div>
      )}
    </div>
  );
};

export default GrafoIdeas;
