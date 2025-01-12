import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Labyrinthe from '../labyrinthe/Labyrinthe';
import './MainPage.css';
import {
  setMaze,
  setGraph,
  setVisitedNodes,
  setAlgorithm,
  setClickedCells,
  resetMaze,
  setSelectPoint
} from '../../redux/actions';

const MainPage = () => {
  const dispatch = useDispatch();
  const algorithm = useSelector((state) => state.algorithm);
  const clickedCells = useSelector((state) => state.clickedCells);
  const [error, setError] = useState(null);
  const visitedNodes = useSelector(state => state.visitedNodes);

  const rows = 20;
  const cols = 20;

  const createGraph = (maze) => {
    let graph = {};
    const getNeighbors = (i, j) => {
      const neighbors = [];
      if (i > 0 && maze[i - 1][j] === 0) neighbors.push([i - 1, j]); // Haut
      if (i < rows - 1 && maze[i + 1][j] === 0) neighbors.push([i + 1, j]); // Bas
      if (j > 0 && maze[i][j - 1] === 0) neighbors.push([i, j - 1]); // Gauche
      if (j < cols - 1 && maze[i][j + 1] === 0) neighbors.push([i, j + 1]); // Droite
      return neighbors;
    };

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (maze[i][j] === 0) {
          const node = `${i},${j}`;
          graph[node] = [];
          const neighbors = getNeighbors(i, j);
          neighbors.forEach(neighbor => {
            const neighborNode = `${neighbor[0]},${neighbor[1]}`;
            graph[node].push(neighborNode);
          });
        }
      }
    }

    return graph;
  };

  const connectWebSocket = () => {
    const socket = new WebSocket("ws://localhost:3002");

    socket.onopen = () => {
      console.log("Connexion WebSocket établie");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          setError(data.error);
          console.error(data.error);
        } else {
          // Mise à jour continue des nœuds visités
          dispatch(setVisitedNodes(data));
          console.log("Nœuds visités reçus du serveur :");
          console.log(data);
        }
      } catch (err) {
        console.error("Erreur de parsing JSON :", err);
      }
    };

    socket.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Connexion WebSocket fermée");
    };

    return socket;
  };

  const sendGraphToServer = (graph) => {
    const socket = connectWebSocket();

    socket.onopen = () => {
      const graphData = { graph: graph };
      socket.send(JSON.stringify(graphData));
    };

    return socket; // Retourner la connexion pour pouvoir la réutiliser pour envoyer les points et l'algorithme
  };

  const sendAlgorithmAndPoints = (socket) => {
    if (algorithm === '') {
      window.alert("Choisir un algorithme !!!");
      return;
    }
    else if (clickedCells.length < 2) {
      window.alert("Selectionner deux points !!!");
      return;
    }
  
    // Vérifier si le WebSocket est ouvert avant d'envoyer
    if (socket.readyState === WebSocket.OPEN) {
      const instructionData = {
        algorithm: algorithm,
        points: clickedCells,
      };
      socket.send(JSON.stringify(instructionData));
      console.log("Requête envoyée : " + algorithm + " | points : " + clickedCells);
    } else {
      // Si la connexion n'est pas encore ouverte, attendre et réessayer d'envoyer
      socket.onopen = () => {
        const instructionData = {
          algorithm: algorithm,
          points: clickedCells,
        };
        socket.send(JSON.stringify(instructionData));
        console.log("Requête envoyée : " + algorithm + " | points : " + clickedCells);
      };
    }
  };

  const generateMaze = () => {
    dispatch(setVisitedNodes([]));
    const newMaze = Array(rows).fill().map(() => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newMaze[i][j] = Math.random() > 0.7 ? 1 : 0;
      }
    }
    dispatch(setMaze(newMaze));
    const newGraph = createGraph(newMaze);
    if (Object.keys(newGraph).length > 0) {
      sendGraphToServer(newGraph); // Envoyer le graphe au serveur
    }
    dispatch(setClickedCells([]));
  };

  const handleSelectAlgorithm = (event) => {
    dispatch(setAlgorithm(event.target.value));
  };

  const handleStartAnimation = () => {
    const socket = connectWebSocket();  // Créer une nouvelle connexion WebSocket

    sendAlgorithmAndPoints(socket);  // Envoyer l'algorithme et les points au serveur
  };

  return (
    <div className='main-page'>
      <div className='main-page-container'>
        <Labyrinthe />
        <div className="right-side-bar">
          <div className='right-container'>
            <div className='menu'>
              <div>
                <button onClick={() => generateMaze()}>Générer un labyrinthe</button>
                <button onClick={() => dispatch(resetMaze())}>Réinitialiser</button>
              </div>
              <select onChange={handleSelectAlgorithm} value={algorithm}>
                <option value="">Choisissez un algorithme</option>
                <option value="DIJKSTRA">Dijkstra</option>
                <option value="BFS">BFS</option>
                <option value="DFS">DFS</option>
              </select>
              <div className='parameters'>
                <h3>Paramétrage</h3>
                <button onClick={() => handleStartAnimation()} >Commencer</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
