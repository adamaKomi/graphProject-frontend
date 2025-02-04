// reducer.js
import { createGraph } from "../components/functions/createGraph";

const rows = 20;
const cols = 70;


const initialMaze = Array(rows).fill().map(() => Array(cols).fill(0));

const initialGraph = createGraph(initialMaze);


const initialState = {
    maze: initialMaze,
    mazeWidth: cols,
    mazeHeight: rows,
    graph: initialGraph,
    visitedNodes: [],
    pathNodes: [],
    algorithm: '',
    clickedCells: ["",""],
    startSelectPoint: false,
    pathFound: false,
    startAnimation: false,
};



const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_MAZE':
            return { ...state, maze: action.payload };
        case 'SET_GRAPH':
            const newGraph = createGraph(action.payload);
            return { ...state, graph: newGraph };
        case 'SET_VISITED_NODES':
            return { ...state, visitedNodes: action.payload };
        case 'SET_PATH_NODES':
            return { ...state, pathNodes: action.payload }
        case 'SET_ALGORITHM':
            return { ...state, algorithm: action.payload };
        case 'SET_CLICKED_CELLS':
            return { ...state, clickedCells: action.payload };
        case 'RESET_MAZE':
            return initialState;
        case 'CANCEL_CLICKED_CELL':
            const newClickedCells = state.clickedCells.filter(cell => cell !== `${action.payload[0]},${action.payload[1]}`);
            return { ...state, clickedCells: newClickedCells };
        case 'SET_SELECT_POINT':
            return { ...state, startSelectPoint: !state.startSelectPoint };
        case 'SET_MAZE_WIDTH':
            return { ...state, mazeWidth: action.payload};
        case 'SET_MAZE_HEIGHT':
            return { ...state, mazeHeight: action.payload};
        case 'SET_PATH_FOUND':
            return { ...state, pathFound: action.payload};
        case 'SET_START_ANIMATION':
            return { ...state, startAnimation: action.payload};
        default:
            return state;
    }
};

export default reducer;