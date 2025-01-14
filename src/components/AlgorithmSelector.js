import React from 'react';
import { 
    setAlgorithm,
    setVisitedNodes,
    setPathNodes,
    setPathFound,
 } from '../redux/actions';
import { useDispatch, useSelector } from 'react-redux';

function AlgorithmSelector() {

    const dispatch = useDispatch();
    const algorithm = useSelector(state=>state.algorithm);
    // fonction de choix de l'algorithme
  const handleSelectAlgorithm = (event) => {
    dispatch(setAlgorithm(event.target.value));
    dispatch(setVisitedNodes([]));
    dispatch(setPathNodes([]));
    dispatch(setPathFound(false));
  };


    return (
        <div onChange={handleSelectAlgorithm} className='algorithm-controls'>
            <h3>Choisir l'algorithme</h3>
            <select value={algorithm} onChange={handleSelectAlgorithm}>
            <option value="" selected>Choisir</option>
                <option value="DIJKSTRA">Dijkstra</option>
                <option value="BFS">BFS</option>
                <option value="DFS">DFS</option>
                <option value="A_STAR">A*</option>
            </select>
        </div>
    );
}

export default AlgorithmSelector;
