// Sorting Algorithms with visualization steps

export function bubbleSort(array) {
    const animations = [];
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            // Compare step
            animations.push(['compare', j, j + 1]);
            
            if (array[j] > array[j + 1]) {
                // Swap step
                animations.push(['swap', j, j + 1]);
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
            
            // Reset colors
            animations.push(['reset', j, j + 1]);
        }
        // Mark last element as sorted
        animations.push(['sorted', n - i - 1]);
    }
    // Mark first element as sorted
    animations.push(['sorted', 0]);
    return animations;
}

export function selectionSort(array) {
    const animations = [];
    const n = array.length;
    
    for (let i = 0; i < n - 1; i++) {
        let minIndex = i;
        
        // Highlight current minimum
        animations.push(['min', minIndex]);
        
        for (let j = i + 1; j < n; j++) {
            // Compare current element with minimum
            animations.push(['compare', j, minIndex]);
            
            if (array[j] < array[minIndex]) {
                // Reset old minimum
                animations.push(['reset-min', minIndex]);
                minIndex = j;
                // Highlight new minimum
                animations.push(['min', minIndex]);
            }
            
            // Reset comparison
            animations.push(['reset', j, minIndex]);
        }
        
        if (minIndex !== i) {
            // Swap elements
            animations.push(['swap', i, minIndex]);
            [array[i], array[minIndex]] = [array[minIndex], array[i]];
        }
        
        // Mark as sorted
        animations.push(['sorted', i]);
    }
    
    // Mark last element as sorted
    animations.push(['sorted', n - 1]);
    return animations;
}

export function insertionSort(array) {
    const animations = [];
    const n = array.length;
    
    for (let i = 1; i < n; i++) {
        let j = i;
        
        // Highlight element being inserted
        animations.push(['insert', j]);
        
        while (j > 0 && array[j] < array[j - 1]) {
            // Compare with previous element
            animations.push(['compare', j, j - 1]);
            
            // Swap elements
            animations.push(['swap', j, j - 1]);
            [array[j], array[j - 1]] = [array[j - 1], array[j]];
            
            // Reset colors
            animations.push(['reset', j, j - 1]);
            
            j--;
        }
        
        // Mark as partially sorted
        animations.push(['partial-sorted', i]);
    }
    
    // Final pass to mark all as sorted
    for (let i = 0; i < n; i++) {
        animations.push(['sorted', i]);
    }
    
    return animations;
}

// Merge Sort implementation (as shown in previous example)
export function mergeSort(array) {
    const animations = [];
    const auxiliaryArray = [...array];
    mergeSortHelper(array, 0, array.length - 1, auxiliaryArray, animations);
    return animations;
}

// Quick Sort implementation (as shown in previous example)
export function quickSort(array) {
    const animations = [];
    quickSortHelper(array, 0, array.length - 1, animations);
    return animations;
}

export function heapSort(array) {
    const animations = [];
    const n = array.length;
    
    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(array, n, i, animations);
    }
    
    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        // Move current root to end
        animations.push(['swap', 0, i]);
        [array[0], array[i]] = [array[i], array[0]];
        
        // Mark as sorted
        animations.push(['sorted', i]);
        
        // Heapify reduced heap
        heapify(array, i, 0, animations);
    }
    
    // Mark first element as sorted
    animations.push(['sorted', 0]);
    return animations;
}

function heapify(array, n, i, animations) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    // Highlight parent and children
    animations.push(['heap-compare', i, left, right]);
    
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        // Swap and continue heapifying
        animations.push(['swap', i, largest]);
        [array[i], array[largest]] = [array[largest], array[i]];
        
        // Reset colors
        animations.push(['heap-reset', i, left, right]);
        
        heapify(array, n, largest, animations);
    } else {
        // Reset colors
        animations.push(['heap-reset', i, left, right]);
    }
}