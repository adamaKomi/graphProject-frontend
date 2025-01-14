import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setClickedCells,
    cancelClickedCell,
    setSelectPoint,
} from '../../redux/actions';




const Labyrinthe = () => {

    const dispatch = useDispatch();
    const maze = useSelector((state)=>state.maze);
    const visitedNodes = useSelector((state)=>state.visitedNodes);
    const clickedCells = useSelector((state)=>state.clickedCells);
    const startSelectPoint = useSelector(state=>state.startSelectPoint);
    const pathNodes = useSelector(state=>state.pathNodes);
    const pathFound = useSelector(state=>state.pathFound);


    const handleClickMaze = (rowIndex, colIndex) => {
        
            if (!clickedCells.includes(`${rowIndex},${colIndex}`) && clickedCells.length < 2) {
                const newClickedCell = [...clickedCells, `${rowIndex},${colIndex}`];
                dispatch(setClickedCells(newClickedCell));
            }
            // annuler la selection de la cellule
            if(clickedCells.includes(`${rowIndex},${colIndex}`)){
                dispatch(cancelClickedCell([rowIndex, colIndex]));
            }
    };

    

    return <>
        <div className={`labyrinthe-container ${pathFound?'pathFound':''}`}>
            <div className="labyrinthe">
                {maze.map((row, rowIndex) => (
                    <div key={rowIndex} className="row">
                        {row.map((cell, colIndex) => (
                            
                            <div
                                key={colIndex}
                                className={`cell ${cell === 1 ? 'wall' : 'path'} 
                                            ${cell !== 1 && clickedCells.includes(`${rowIndex},${colIndex}`) ? 'red' : ''}
                                            ${visitedNodes.includes(`${rowIndex},${colIndex}`) ? 'green' : ''} 
                                            ${pathNodes.includes(`${rowIndex},${colIndex}`) ? 'yellow' : ''}
                                        `}
                                onClick={() => `${cell===1? null :  handleClickMaze(rowIndex, colIndex)}`}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </>
}

export default Labyrinthe;