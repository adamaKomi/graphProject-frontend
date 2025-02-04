import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    setClickedCells,
} from '../../redux/actions';




const Labyrinthe = () => {

    const dispatch = useDispatch();
    const maze = useSelector((state)=>state.maze);
    const visitedNodes = useSelector((state)=>state.visitedNodes);
    const clickedCells = useSelector((state)=>state.clickedCells);
    const pathNodes = useSelector(state=>state.pathNodes);
    const pathFound = useSelector(state=>state.pathFound);


    const handleClickMaze = (rowIndex, colIndex) => {
        
             // selectionner la cellule
        if (!clickedCells.includes(`${rowIndex},${colIndex}`)) {
            if( clickedCells[0] === ""){
                const secondeClickedCell = clickedCells[1];
                dispatch(setClickedCells([`${rowIndex},${colIndex}`, secondeClickedCell]));
            }else if(clickedCells[1] === ""){
                const firstClickedCell = clickedCells[0];
                dispatch(setClickedCells([firstClickedCell, `${rowIndex},${colIndex}`]));
            }
        }
        
        // annuler la selection de la cellule
        if (clickedCells.includes(`${rowIndex},${colIndex}`)) {
            if(clickedCells[0] === `${rowIndex},${colIndex}`){
                const secondeClickedCell = clickedCells[1];
                dispatch(setClickedCells(["", secondeClickedCell]));
            }
            if(clickedCells[1] === `${rowIndex},${colIndex}`){
                const firstClickedCell = clickedCells[0];
                dispatch(setClickedCells([firstClickedCell, ""]));
            }
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
                                            ${cell !== 1 && clickedCells[0]===`${rowIndex},${colIndex}` ? 'red' : ''}
                                            ${cell !== 1 && clickedCells[1]===`${rowIndex},${colIndex}` ? 'blue' : ''}
                                            ${visitedNodes.includes(`${rowIndex},${colIndex}`) ? 'green' : ''} 
                                            ${pathNodes.includes(`${rowIndex},${colIndex}`) ? 'yellow' : ''}
                                        `}
                                onClick={() => `${cell === 1 ? null : handleClickMaze(rowIndex, colIndex)}`}
                            ></div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </>
}

export default Labyrinthe;