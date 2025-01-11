// reducer.js


const initialMaze = Array(20).fill().map(() => Array(20).fill(0));

const initialState = {
    maze: [initialMaze],
    graph: {},
    visitedNodes: [],
    algorithm: '',
    clickedCells: [],
    startSelectPoint: false,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MAZE':
            return { ...state, maze: action.payload };
        case 'SET_GRAPH':
            return { ...state, graph: action.payload };
        case 'SET_VISITED_NODES':
            return { ...state, visitedNodes: action.payload };
        case 'SET_ALGORITHM':
            return { ...state, algorithm: action.payload };
        case 'SET_CLICKED_CELLS':
            return { ...state, clickedCells: action.payload };
        case 'RESET_MAZE':
            return initialState;
        case 'CANCEL_CLICKED_CELL':
            const newClickedCells = state.clickedCells.filter(cell=> cell!=`${action.payload[0]},${action.payload[1]}`);
            return {...state, clickedCells: newClickedCells};
        case 'SET_SELECT_POINT':
            return { ...state, startSelectPoint: !state.startSelectPoint };
        default:
            return state;
    }
};

export default reducer;
