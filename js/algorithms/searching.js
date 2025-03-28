// Searching Algorithms with visualization steps

export function linearSearch(array, target) {
    const animations = [];
    const n = array.length;
    
    for (let i = 0; i < n; i++) {
        // Highlight current element being checked
        animations.push(['check', i]);
        
        if (array[i] === target) {
            // Found the target
            animations.push(['found', i]);
            return animations;
        }
        
        // Mark as checked
        animations.push(['checked', i]);
    }
    
    // Target not found
    animations.push(['not-found']);
    return animations;
}

export function binarySearch(array, target) {
    const animations = [];
    let left = 0;
    let right = array.length - 1;
    
    // Initial array must be sorted
    animations.push(['sorted-array']);
    
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        // Highlight current middle element
        animations.push(['check', mid]);
        
        if (array[mid] === target) {
            // Found the target
            animations.push(['found', mid]);
            return animations;
        }
        
        if (array[mid] < target) {
            // Highlight left half as eliminated
            for (let i = left; i <= mid; i++) {
                animations.push(['eliminate', i]);
            }
            left = mid + 1;
        } else {
            // Highlight right half as eliminated
            for (let i = mid; i <= right; i++) {
                animations.push(['eliminate', i]);
            }
            right = mid - 1;
        }
    }
    
    // Target not found
    animations.push(['not-found']);
    return animations;
}

export function jumpSearch(array, target) {
    const animations = [];
    const n = array.length;
    const step = Math.floor(Math.sqrt(n));
    let prev = 0;
    
    // Initial array must be sorted
    animations.push(['sorted-array']);
    
    // Jump ahead in steps
    while (array[Math.min(step, n) - 1] < target) {
        animations.push(['jump', prev, Math.min(step, n) - 1]);
        prev = step;
        step += Math.floor(Math.sqrt(n));
        
        if (prev >= n) {
            animations.push(['not-found']);
            return animations;
        }
    }
    
    // Linear search in current block
    while (array[prev] < target) {
        animations.push(['check', prev]);
        prev++;
        
        if (prev === Math.min(step, n)) {
            animations.push(['not-found']);
            return animations;
        }
    }
    
    // Check if element is found
    animations.push(['check', prev]);
    if (array[prev] === target) {
        animations.push(['found', prev]);
    } else {
        animations.push(['not-found']);
    }
    
    return animations;
}

export function interpolationSearch(array, target) {
    const animations = [];
    let low = 0;
    let high = array.length - 1;
    
    // Initial array must be sorted
    animations.push(['sorted-array']);
    
    while (low <= high && target >= array[low] && target <= array[high]) {
        // Calculate position using interpolation formula
        const pos = low + Math.floor(
            ((high - low) / (array[high] - array[low])) * (target - array[low])
        );
        
        // Highlight current position
        animations.push(['check', pos]);
        
        if (array[pos] === target) {
            animations.push(['found', pos]);
            return animations;
        }
        
        if (array[pos] < target) {
            // Highlight left half as eliminated
            for (let i = low; i <= pos; i++) {
                animations.push(['eliminate', i]);
            }
            low = pos + 1;
        } else {
            // Highlight right half as eliminated
            for (let i = pos; i <= high; i++) {
                animations.push(['eliminate', i]);
            }
            high = pos - 1;
        }
    }
    
    animations.push(['not-found']);
    return animations;
}

export function exponentialSearch(array, target) {
    const animations = [];
    const n = array.length;
    
    // Initial array must be sorted
    animations.push(['sorted-array']);
    
    if (array[0] === target) {
        animations.push(['found', 0]);
        return animations;
    }
    
    let i = 1;
    while (i < n && array[i] <= target) {
        animations.push(['check', i]);
        i *= 2;
    }
    
    // Perform binary search in the found range
    return binarySearchRange(array, target, Math.floor(i / 2), Math.min(i, n - 1), animations);
}

function binarySearchRange(array, target, left, right, animations) {
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        
        animations.push(['check', mid]);
        
        if (array[mid] === target) {
            animations.push(['found', mid]);
            return animations;
        }
        
        if (array[mid] < target) {
            for (let i = left; i <= mid; i++) {
                animations.push(['eliminate', i]);
            }
            left = mid + 1;
        } else {
            for (let i = mid; i <= right; i++) {
                animations.push(['eliminate', i]);
            }
            right = mid - 1;
        }
    }
    
    animations.push(['not-found']);
    return animations;
}