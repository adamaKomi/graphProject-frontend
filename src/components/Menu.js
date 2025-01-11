import React, { useState } from 'react';

const Menu = ({ graphData }) => {
  const [algorithm, setAlgorithm] = useState('');
  const [result, setResult] = useState('');

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const runAlgorithm = () => {
    if (algorithm === 'BFS') {
      const result = bfs(graphData, 'A'); // Commence par le noeud A
      setResult(`BFS Result: ${result.join(' -> ')}`);
    } else if (algorithm === 'DFS') {
      const result = dfs(graphData, 'A'); // Commence par le noeud A
      setResult(`DFS Result: ${result.join(' -> ')}`);
    }
  };

  // Algorithme BFS
  const bfs = (graph, startNode) => {
    let visited = new Set();
    let queue = [startNode];
    let result = [];

    while (queue.length > 0) {
      const node = queue.shift();
      if (!visited.has(node)) {
        visited.add(node);
        result.push(node);

        // Ajouter les voisins non visités à la queue
        graph[node]?.forEach(neighbor => {
          if (!visited.has(neighbor.node)) {
            queue.push(neighbor.node);
          }
        });
      }
    }
    return result;
  };

  // Algorithme DFS
  const dfs = (graph, startNode, visited = new Set(), result = []) => {
    visited.add(startNode);
    result.push(startNode);

    graph[startNode]?.forEach(neighbor => {
      if (!visited.has(neighbor.node)) {
        dfs(graph, neighbor.node, visited, result);
      }
    });

    return result;
  };

  return (
    <div>
      <h2>Select Algorithm</h2>
      <select value={algorithm} onChange={handleAlgorithmChange}>
        <option value="">Select an algorithm</option>
        <option value="BFS">Breadth-First Search (BFS)</option>
        <option value="DFS">Depth-First Search (DFS)</option>
      </select>
      <button onClick={runAlgorithm}>Run</button>
      <p>{result}</p>
    </div>
  );
};

export default Menu;
