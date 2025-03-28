import { Visualizer as SortingVisualizer } from './visualizers/sortingVisualizer.js';
import { Visualizer as SearchingVisualizer } from './visualizers/searchingVisualizer.js';
import { Visualizer as PathfindingVisualizer } from './visualizers/pathfindingVisualizer.js';
import * as sortingAlgorithms from './algorithms/sorting.js';
import * as searchingAlgorithms from './algorithms/searching.js';
import * as pathfindingAlgorithms from './algorithms/pathfinding.js';

// Algorithm information
const algorithmInfo = {
    sorting: {
        bubbleSort: {
            description: "Repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
            complexity: "Time: O(n²), Space: O(1)"
        },
        // Add info for other sorting algorithms
    },
    searching: {
        linearSearch: {
            description: "Checks each element in the list sequentially until the target is found.",
            complexity: "Time: O(n), Space: O(1)"
        },
        // Add info for other searching algorithms
    },
    pathfinding: {
        breadthFirstSearch: {
            description: "Explores all neighbor nodes at the present depth before moving on to nodes at the next depth level.",
            complexity: "Time: O(V+E), Space: O(V)"
        },
        // Add info for other pathfinding algorithms
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabs = document.querySelectorAll('.tab-button');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and content
            document.querySelectorAll('.tab-button, .tab-content').forEach(el => {
                el.classList.remove('active');
            });
            
            // Add active class to clicked tab and corresponding content
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Update algorithm info
            updateAlgorithmInfo(tabId);
        });
    });
    
    function updateAlgorithmInfo(tabId) {
        const algorithmSelect = document.getElementById(`${tabId}-algorithm`);
        const selectedAlgorithm = algorithmSelect.value;
        const info = algorithmInfo[tabId][selectedAlgorithm];
        
        document.getElementById('algorithm-info').textContent = info.description;
        document.getElementById('complexity-info').textContent = info.complexity;
    }
    
    // Initialize visualizers
    const sortingVisualizer = new SortingVisualizer(
        document.getElementById('sorting-canvas'),
        sortingAlgorithms
    );
    
    const searchingVisualizer = new SearchingVisualizer(
        document.getElementById('searching-canvas'),
        searchingAlgorithms
    );
    
    const pathfindingVisualizer = new PathfindingVisualizer(
        document.getElementById('pathfinding-grid'),
        pathfindingAlgorithms
    );
    
    // Set up event listeners for each tab
    
    // Sorting tab
    document.getElementById('generate-array').addEventListener('click', () => {
        const size = parseInt(document.getElementById('array-size').value);
        const dataType = document.getElementById('data-type').value;
        sortingVisualizer.generateNewArray(size, dataType);
    });
    
    document.getElementById('start-sort').addEventListener('click', () => {
        const algorithm = document.getElementById('sort-algorithm').value;
        sortingVisualizer.startVisualization(algorithm);
    });
    
    // Searching tab
    document.getElementById('generate-search-array').addEventListener('click', () => {
        searchingVisualizer.generateNewArray();
    });
    
    document.getElementById('start-search').addEventListener('click', () => {
        const algorithm = document.getElementById('search-algorithm').value;
        const target = parseInt(document.getElementById('search-value').value);
        if (!isNaN(target)) {
            searchingVisualizer.startVisualization(algorithm, target);
        }
    });
    
    // Pathfinding tab
    document.getElementById('start-pathfinding').addEventListener('click', () => {
        const algorithm = document.getElementById('pathfinding-algorithm').value;
        pathfindingVisualizer.startVisualization(algorithm);
    });
    
    // Generate initial visualizations
    sortingVisualizer.generateNewArray(25, 'random');
    searchingVisualizer.generateNewArray();
    pathfindingVisualizer.initializeGrid(20, 40);
    
    // Update algorithm info for the default tab
    updateAlgorithmInfo('sorting');
});