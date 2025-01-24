
export const createGraph = (maze) => {
    const rows = 20;
    const cols = 70;
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
