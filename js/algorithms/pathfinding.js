// Pathfinding Algorithms with visualization steps

export function breadthFirstSearch(grid, startNode, endNode) {
    const animations = [];
    const visitedNodesInOrder = [];
    const queue = [startNode];
    startNode.isVisited = true;
    
    // Mark start node
    animations.push(['visited', startNode.row, startNode.col]);
    
    while (queue.length > 0) {
        const currentNode = queue.shift();
        visitedNodesInOrder.push(currentNode);
        
        // If we've reached the end node, reconstruct path
        if (currentNode === endNode) {
            const pathNodes = getPathNodes(endNode);
            animatePath(animations, pathNodes);
            return animations;
        }
        
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            
            // Animate visiting this neighbor
            animations.push(['visited', neighbor.row, neighbor.col]);
            
            if (neighbor === endNode) {
                const pathNodes = getPathNodes(endNode);
                animatePath(animations, pathNodes);
                return animations;
            }
            
            queue.push(neighbor);
        }
    }
    
    // If we get here, no path was found
    animations.push(['no-path']);
    return animations;
}

export function depthFirstSearch(grid, startNode, endNode) {
    const animations = [];
    const visitedNodesInOrder = [];
    const stack = [startNode];
    startNode.isVisited = true;
    
    // Mark start node
    animations.push(['visited', startNode.row, startNode.col]);
    
    while (stack.length > 0) {
        const currentNode = stack.pop();
        visitedNodesInOrder.push(currentNode);
        
        // If we've reached the end node, reconstruct path
        if (currentNode === endNode) {
            const pathNodes = getPathNodes(endNode);
            animatePath(animations, pathNodes);
            return animations;
        }
        
        const neighbors = getUnvisitedNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            neighbor.isVisited = true;
            neighbor.previousNode = currentNode;
            
            // Animate visiting this neighbor
            animations.push(['visited', neighbor.row, neighbor.col]);
            
            if (neighbor === endNode) {
                const pathNodes = getPathNodes(endNode);
                animatePath(animations, pathNodes);
                return animations;
            }
            
            stack.push(neighbor);
        }
    }
    
    // If we get here, no path was found
    animations.push(['no-path']);
    return animations;
}

export function dijkstra(grid, startNode, endNode) {
    const animations = [];
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = getAllNodes(grid);
    
    // Mark start node
    animations.push(['visited', startNode.row, startNode.col]);
    
    while (unvisitedNodes.length > 0) {
        sortNodesByDistance(unvisitedNodes);
        const closestNode = unvisitedNodes.shift();
        
        // If we encounter a wall, skip it
        if (closestNode.isWall) continue;
        
        // If the closest node is at infinity, we're trapped
        if (closestNode.distance === Infinity) {
            animations.push(['no-path']);
            return animations;
        }
        
        closestNode.isVisited = true;
        visitedNodesInOrder.push(closestNode);
        animations.push(['visited', closestNode.row, closestNode.col]);
        
        if (closestNode === endNode) {
            const pathNodes = getPathNodes(endNode);
            animatePath(animations, pathNodes);
            return animations;
        }
        
        updateUnvisitedNeighbors(closestNode, grid, animations);
    }
    
    // If we get here, no path was found
    animations.push(['no-path']);
    return animations;
}

export function aStarSearch(grid, startNode, endNode) {
    const animations = [];
    const openSet = [startNode];
    const closedSet = [];
    startNode.gScore = 0;
    startNode.fScore = heuristic(startNode, endNode);
    
    // Mark start node
    animations.push(['visited', startNode.row, startNode.col]);
    
    while (openSet.length > 0) {
        sortNodesByFScore(openSet);
        const currentNode = openSet.shift();
        
        // If we've reached the end node, reconstruct path
        if (currentNode === endNode) {
            const pathNodes = getPathNodes(endNode);
            animatePath(animations, pathNodes);
            return animations;
        }
        
        closedSet.push(currentNode);
        animations.push(['closed', currentNode.row, currentNode.col]);
        
        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (neighbor.isWall || closedSet.includes(neighbor)) continue;
            
            const tentativeGScore = currentNode.gScore + 1; // Assuming each step has cost 1
            
            if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
                animations.push(['visited', neighbor.row, neighbor.col]);
            } else if (tentativeGScore >= neighbor.gScore) {
                continue;
            }
            
            neighbor.previousNode = currentNode;
            neighbor.gScore = tentativeGScore;
            neighbor.fScore = neighbor.gScore + heuristic(neighbor, endNode);
        }
    }
    
    // If we get here, no path was found
    animations.push(['no-path']);
    return animations;
}

export function greedyBestFirstSearch(grid, startNode, endNode) {
    const animations = [];
    const openSet = [startNode];
    const closedSet = [];
    startNode.hScore = heuristic(startNode, endNode);
    
    // Mark start node
    animations.push(['visited', startNode.row, startNode.col]);
    
    while (openSet.length > 0) {
        sortNodesByHScore(openSet);
        const currentNode = openSet.shift();
        
        // If we've reached the end node, reconstruct path
        if (currentNode === endNode) {
            const pathNodes = getPathNodes(endNode);
            animatePath(animations, pathNodes);
            return animations;
        }
        
        closedSet.push(currentNode);
        animations.push(['closed', currentNode.row, currentNode.col]);
        
        const neighbors = getNeighbors(currentNode, grid);
        for (const neighbor of neighbors) {
            if (neighbor.isWall || closedSet.includes(neighbor)) continue;
            
            if (!openSet.includes(neighbor)) {
                neighbor.previousNode = currentNode;
                neighbor.hScore = heuristic(neighbor, endNode);
                openSet.push(neighbor);
                animations.push(['visited', neighbor.row, neighbor.col]);
            }
        }
    }
    
    // If we get here, no path was found
    animations.push(['no-path']);
    return animations;
}

// Helper functions

function getUnvisitedNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited && !neighbor.isWall);
}

function getNeighbors(node, grid) {
    const neighbors = [];
    const {col, row} = node;
    
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    
    return neighbors.filter(neighbor => !neighbor.isWall);
}

function getAllNodes(grid) {
    const nodes = [];
    for (const row of grid) {
        for (const node of row) {
            nodes.push(node);
        }
    }
    return nodes;
}

function sortNodesByDistance(unvisitedNodes) {
    unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
}

function sortNodesByFScore(nodes) {
    nodes.sort((nodeA, nodeB) => nodeA.fScore - nodeB.fScore);
}

function sortNodesByHScore(nodes) {
    nodes.sort((nodeA, nodeB) => nodeA.hScore - nodeB.hScore);
}

function updateUnvisitedNeighbors(node, grid, animations) {
    const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
    for (const neighbor of unvisitedNeighbors) {
        neighbor.distance = node.distance + 1;
        neighbor.previousNode = node;
        animations.push(['updated', neighbor.row, neighbor.col]);
    }
}

function heuristic(nodeA, nodeB) {
    // Manhattan distance
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
}

function getPathNodes(endNode) {
    const pathNodes = [];
    let currentNode = endNode;
    while (currentNode !== null) {
        pathNodes.unshift(currentNode);
        currentNode = currentNode.previousNode;
    }
    return pathNodes;
}

function animatePath(animations, pathNodes) {
    // Skip the first node (start) and last node (end) for special coloring
    for (let i = 1; i < pathNodes.length - 1; i++) {
        const node = pathNodes[i];
        animations.push(['path', node.row, node.col]);
    }
}