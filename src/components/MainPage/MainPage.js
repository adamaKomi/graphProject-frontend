// MainPage.js
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
  const startSelectPoint = useSelector(state => state.startSelectPoint);
  const [error, setError] = useState(null);  // État pour l'erreur
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


  const sendGraphToServer = (graph) => {

    const socket = new WebSocket("ws://localhost:3002");

    socket.onopen = () => {
      console.log("Connexion WebSocket établie");

      // Envoyer des données JSON représentant le graphe au serveur
      const graphData = {
        graph: graph,
      };
      socket.send(JSON.stringify(graphData));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setError(data.error);  // Afficher l'erreur reçue
        console.error(data.error);
      } else {
        dispatch(setVisitedNodes(data));  // Mettre à jour les nœuds visités
        console.log("Nœuds visités :");
        console.log(visitedNodes);

      }
    };

    socket.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Connexion WebSocket fermée");
    };

    return () => {
      socket.close();  // Fermer la connexion WebSocket lorsque le composant est démonté
    };
  };

  useEffect(() => {
    let ws;

    const connectWebSocket = () => {
      // Établir une connexion WebSocket
      ws = new WebSocket('ws://localhost:3002');

      // Événement déclenché à l'ouverture de la connexion
      ws.onopen = () => {
        console.log('WebSocket connection opened');
      };

      // Événement déclenché lors de la réception d'un message
      ws.onmessage = (event) => {
        try {
          // Parse le message reçu
          const data = JSON.parse(event.data);
          console.log('Visited nodes:', data);
          dispatch(setVisitedNodes(data));
        } catch (err) {
          console.error('Error parsing message', err);
        }
      };

      // Événement déclenché à la fermeture de la connexion
      ws.onclose = (event) => {
        console.log('WebSocket connection closed', event.code, event.reason);
        // Tentative de reconnexion après un délai
        setTimeout(() => {
          console.log('Reconnecting...');
          connectWebSocket();
        }, 5000); // Reconnexion après 5 secondes
      };

      // Gestion des erreurs
      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    };

    connectWebSocket();

    // Nettoyage de la connexion WebSocket à la fermeture du composant
    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, []);




  const generateMaze = () => {
    dispatch(setVisitedNodes([]))
    const newMaze = Array(rows).fill().map(() => Array(cols).fill(0));
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newMaze[i][j] = Math.random() > 0.7 ? 1 : 0;
      }
    }
    dispatch(setMaze(newMaze));
    const newGraph = createGraph(newMaze);
    if (Object.keys(newGraph).length > 0) {
      sendGraphToServer(newGraph);
    }
    dispatch(setClickedCells([]));
  };

  const handleSelectAlgorithm = (event) => {
    dispatch(setAlgorithm(event.target.value));
  };

  // const handleSelectPoint = () => {
  //   dispatch(setSelectPoint());
  // };

  const handleStartAnimation = () => {
    if(algorithm===''){
      window.alert("Choisir un algorithme !!!");
      return;
    }
    else if(clickedCells.length<2){
      window.alert("Selectionner deux points !!!");
      return;
    }

    const socket = new WebSocket("ws://localhost:3002");

    socket.onopen = () => {
      console.log("Connexion WebSocket établie");

      // Envoyer des données JSON représentant le graphe au serveur
      const instructionData = {
        algorithm: algorithm,
        points: clickedCells,
      };
      socket.send(JSON.stringify(instructionData));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.error) {
        setError(data.error);  // Afficher l'erreur reçue
        console.error(data.error);
      } 
      else {
        console.log("Requête envoyé : " +algorithm+ " | points : "+clickedCells);
      }
    };

    socket.onerror = (error) => {
      console.error("Erreur WebSocket:", error);
    };

    socket.onclose = () => {
      console.log("Connexion WebSocket fermée");
    };

    return () => {
      socket.close();  // Fermer la connexion WebSocket lorsque le composant est démonté
    };
  }


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
                {/* {startSelectPoint ?
                                    <button onClick={handleSelectPoint}>Arreter</button>
                                    :
                                    <button onClick={handleSelectPoint}>Choisir deux points</button>
                                } */}
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
