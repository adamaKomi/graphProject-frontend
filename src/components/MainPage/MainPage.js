import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Labyrinthe from '../labyrinthe/Labyrinthe';
import './MainPage.css';
import {
  setMaze,
  setGraph,
  setVisitedNodes,
  setPathNodes,
  setAlgorithm,
  setClickedCells,
  resetMaze,
  setSelectPoint,
  setMazeHeight,
  setMazeWidth,
  setPathFound,
} from '../../redux/actions';
import AlgorithmSelector from '../AlgorithmSelector';

const MainPage = () => {
  const dispatch = useDispatch();

  const algorithm = useSelector((state) => state.algorithm);
  const clickedCells = useSelector((state) => state.clickedCells);
  const visitedNodes = useSelector(state => state.visitedNodes);
  const rows = useSelector(state => state.mazeHeight);
  const cols = useSelector(state => state.mazeWidth);;
  const pathNodes = useSelector(state=>state.pathNodes);

  const [error, setError] = useState(null);
  const [pathLengh, setPathLengh] = useState(0);





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
        } else if (data.pathNodes) {
          dispatch(setPathNodes(data.pathNodes));
        } else if (data.pathFound) {
          dispatch(setPathFound(true));
        } else if (data.pathLengh) {
          setPathLengh(parseInt(data.pathLengh));
        }
        else {
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
    else if ((algorithm==='A_STAR')&&(clickedCells.length < 2)) {
      window.alert("Selectionner deux points !!!");
      return;
    }
    else if (clickedCells.length < 1) {
      window.alert("Selectionner au moins un point !!!");
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
    // reinitialiser 
    dispatch(setVisitedNodes([]));
    dispatch(setPathNodes([]));
    dispatch(setPathFound(false));
    setPathLengh(0);
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

  

  // pour commencer l'animation
  const handleStartAnimation = () => {
    // reinitialiser 
    dispatch(setVisitedNodes([]));
    dispatch(setPathNodes([]));
    dispatch(setPathFound(false));
    setPathLengh(0);
    const socket = connectWebSocket();  // Créer une nouvelle connexion WebSocket

    sendAlgorithmAndPoints(socket);  // Envoyer l'algorithme et les points au serveur
  };


  const handleSetMazeWidth = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value < 0) {
      window.alert("Entrer un entier positif");
      return;
    } else {
      dispatch(setMazeWidth(Math.max(value, 15)));
    }
  }


  const handleSetMazeHeight = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value < 0) {
      window.alert("Entrer un entier positif");
      return;
    } else {
      dispatch(setMazeHeight(Math.max(value, 10)));
    }
  }


  return (
    <div className='main-page'>
      <div className='main-page-container'>
        <div className="main-page-container-item controls">
          <div className='container '>
            <div className='menu'>
              <div className='maze-controls' >
                <button onClick={() => generateMaze()} className='generate-maze'>Générer un labyrinthe</button>
                <button 
                  onClick={() => { 
                    dispatch(resetMaze()); 
                    setPathLengh(0); } 
                    }
                    className='reset-maze'
                  >Réinitialiser</button>
              </div>
              {/*  liste des algorithmes */}
              <AlgorithmSelector />
              <div className='parameters'>
                <button onClick={() => handleStartAnimation()} >Commencer</button>
              </div>
            </div>
          </div>
        </div>
        {/* Afficher la longueur du chemin */}
        {/* {pathLengh>0 && ( */}
        <div className='info-path'>
          <h4 className='pathLengh'>Informations</h4>
          <p>Algorithme : <strong>{algorithm.length>0?algorithm:'None'}</strong></p>
          <p>Noeuds visités : <strong>{visitedNodes.length}</strong></p>
          <p>Longueur chemin : <strong>{pathNodes.length}</strong></p>
        </div>
        {/* )} */}
        <Labyrinthe className="main-page-container-item" />
      </div>
    </div>
  );
};

export default MainPage;
