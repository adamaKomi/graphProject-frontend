// actions.js
export const setMaze = (maze) => ({
    type: 'SET_MAZE',
    payload: maze,
});

export const setGraph = (graph) => ({
    type: 'SET_GRAPH',
    payload: graph,
});

export const setVisitedNodes = (nodes) => ({
    type: 'SET_VISITED_NODES',
    payload: nodes,
});

export const setPathNodes = (nodes)=>({
    type: 'SET_PATH_NODES',
    payload: nodes,
})

export const setAlgorithm = (algorithm) => ({
    type: 'SET_ALGORITHM',
    payload: algorithm,
});

export const setClickedCells = (cells) => ({
    type: 'SET_CLICKED_CELLS',
    payload: cells,
});


export const resetMaze = () => ({
    type: 'RESET_MAZE',
});

export const cancelClickedCell = (cell)=>({
    type: 'CANCEL_CLICKED_CELL',
    payload: cell,
})

export const setSelectPoint = ()=>({
    type: 'SET_SELECT_POINT',
})


export const setMazeWidth = (width) =>({
    type: 'SET_MAZE_WIDTH',
    payload: width,
})

export const setMazeHeight = (height) =>({
    type: 'SET_MAZE_HEIGHT',
    payload: height,
})

export const setPathFound = (statement)=>({
    type: 'SET_PATH_FOUND',
    payload: statement,
})