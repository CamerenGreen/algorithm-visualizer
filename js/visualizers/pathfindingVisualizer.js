export class Visualizer {
    constructor(canvas, algorithms) {
        this.canvas = canvas;
        this.algorithms = algorithms;
        this.grid = [];
        this.rows = 20;
        this.cols = 40;
        this.animationSpeed = 50;
        this.isPlaying = false;
        this.animationQueue = [];
        this.currentAnimation = null;
        this.startNode = null;
        this.endNode = null;
        this.isMouseDown = false;
        this.draggingNode = null;
        this.initializeGrid(this.rows, this.cols);
    }

    initializeGrid(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.grid = [];
        this.canvas.innerHTML = '';
        this.canvas.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;

        // Create grid nodes
        for (let row = 0; row < rows; row++) {
            const currentRow = [];
            for (let col = 0; col < cols; col++) {
                const node = document.createElement('div');
                node.className = 'grid-node';
                node.dataset.row = row;
                node.dataset.col = col;
                
                node.addEventListener('mousedown', () => this.handleNodeMouseDown(row, col));
                node.addEventListener('mouseenter', () => this.handleNodeMouseEnter(row, col));
                node.addEventListener('mouseup', () => this.handleNodeMouseUp());

                this.canvas.appendChild(node);
                currentRow.push({
                    row,
                    col,
                    isWall: false,
                    element: node
                });
            }
            this.grid.push(currentRow);
        }

        // Set start and end nodes
        this.startNode = this.grid[Math.floor(rows/2)][Math.floor(cols/4)];
        this.endNode = this.grid[Math.floor(rows/2)][Math.floor(3*cols/4)];
        this.updateNodeTypes();
    }

    handleNodeMouseDown(row, col) {
        this.isMouseDown = true;
        const node = this.grid[row][col];

        if (node === this.startNode) {
            this.draggingNode = 'start';
        } else if (node === this.endNode) {
            this.draggingNode = 'end';
        } else {
            node.isWall = !node.isWall;
            this.updateNodeTypes();
        }
    }

    handleNodeMouseEnter(row, col) {
        if (!this.isMouseDown) return;
        
        const node = this.grid[row][col];
        
        if (this.draggingNode === 'start') {
            this.startNode = node;
            this.updateNodeTypes();
        } else if (this.draggingNode === 'end') {
            this.endNode = node;
            this.updateNodeTypes();
        } else {
            node.isWall = true;
            this.updateNodeTypes();
        }
    }

    handleNodeMouseUp() {
        this.isMouseDown = false;
        this.draggingNode = null;
    }

    updateNodeTypes() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                node.element.className = 'grid-node';
                
                if (node === this.startNode) {
                    node.element.classList.add('start');
                } else if (node === this.endNode) {
                    node.element.classList.add('end');
                } else if (node.isWall) {
                    node.element.classList.add('wall');
                }
            }
        }
    }

    clearWalls() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.grid[row][col].isWall = false;
            }
        }
        this.updateNodeTypes();
    }

    clearPath() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                const node = this.grid[row][col];
                node.element.classList.remove('visited', 'path');
            }
        }
    }

    generateMaze() {
        this.clearWalls();
        this.clearPath();
        
        // Simple maze generation - can be enhanced
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (Math.random() < 0.3 && 
                    !(this.grid[row][col] === this.startNode) && 
                    !(this.grid[row][col] === this.endNode)) {
                    this.grid[row][col].isWall = true;
                }
            }
        }
        this.updateNodeTypes();
    }

    startVisualization(algorithm) {
        if (this.isPlaying) return;
        
        this.clearPath();
        this.isPlaying = true;
        
        // Prepare grid nodes for algorithm
        const gridNodes = this.grid.map(row => 
            row.map(node => ({
                row: node.row,
                col: node.col,
                isWall: node.isWall,
                isStart: node === this.startNode,
                isEnd: node === this.endNode,
                distance: Infinity,
                isVisited: false,
                previousNode: null,
                fScore: Infinity,
                gScore: Infinity,
                hScore: Infinity
            }))
        );

        const startNode = gridNodes[this.startNode.row][this.startNode.col];
        const endNode = gridNodes[this.endNode.row][this.endNode.col];
        
        const animations = this.algorithms[algorithm](gridNodes, startNode, endNode);
        this.animationQueue = animations;
        this.processAnimations();
    }

    processAnimations() {
        if (!this.isPlaying || this.animationQueue.length === 0) {
            this.isPlaying = false;
            return;
        }

        const animation = this.animationQueue.shift();
        this.executeAnimation(animation);

        this.currentAnimation = setTimeout(() => {
            this.processAnimations();
        }, 100 - this.animationSpeed);
    }

    executeAnimation(animation) {
        const [type, ...args] = animation;

        switch(type) {
            case 'visited':
                const visitedNode = this.grid[args[0]][args[1]];
                if (!visitedNode.isWall && visitedNode !== this.startNode && visitedNode !== this.endNode) {
                    visitedNode.element.classList.add('visited');
                }
                break;
            case 'closed':
                const closedNode = this.grid[args[0]][args[1]];
                if (!closedNode.isWall && closedNode !== this.startNode && closedNode !== this.endNode) {
                    closedNode.element.classList.add('closed');
                }
                break;
            case 'path':
                const pathNode = this.grid[args[0]][args[1]];
                if (pathNode !== this.startNode && pathNode !== this.endNode) {
                    pathNode.element.classList.add('path');
                }
                break;
            case 'no-path':
                alert("No path found between start and end nodes!");
                this.isPlaying = false;
                break;
            case 'updated':
                const updatedNode = this.grid[args[0]][args[1]];
                if (!updatedNode.isWall && updatedNode !== this.startNode && updatedNode !== this.endNode) {
                    updatedNode.element.classList.add('updated');
                    setTimeout(() => {
                        updatedNode.element.classList.remove('updated');
                    }, 300);
                }
                break;
        }
    }

    pauseVisualization() {
        this.isPlaying = false;
        if (this.currentAnimation) {
            clearTimeout(this.currentAnimation);
            this.currentAnimation = null;
        }
    }

    setSpeed(speed) {
        this.animationSpeed = speed;
    }
}