export class Visualizer {
    constructor(canvas, algorithms) {
        this.canvas = canvas;
        this.algorithms = algorithms;
        this.data = [];
        this.animationSpeed = 50;
        this.isPlaying = false;
        this.animationQueue = [];
        this.currentAnimation = null;
        this.targetValue = null;
        this.resultElement = document.getElementById('search-result');
    }

    generateNewArray(size = 15) {
        // Generate sorted array for searching algorithms
        this.data = Array.from({length: size}, (_, i) => Math.floor(Math.random() * 90) + 10);
        this.data.sort((a, b) => a - b);
        this.render();
        this.resultElement.textContent = '';
    }

    render() {
        this.canvas.innerHTML = '';
        const width = this.canvas.clientWidth / this.data.length;
        
        this.data.forEach((value, index) => {
            const element = document.createElement('div');
            element.className = 'array-element';
            element.style.height = `${value}%`;
            element.style.width = `${width - 2}px`;
            element.style.left = `${index * width}px`;
            element.textContent = value;
            element.setAttribute('data-value', value);
            this.canvas.appendChild(element);
        });
    }

    startVisualization(algorithm, target) {
        if (this.isPlaying) return;
        
        this.targetValue = target;
        this.isPlaying = true;
        
        // Reset all elements first
        const elements = this.canvas.querySelectorAll('.array-element');
        elements.forEach(el => {
            el.classList.remove('checked', 'found', 'current', 'eliminated');
        });

        const animations = this.algorithms[algorithm]([...this.data], target);
        this.animationQueue = animations;
        this.processAnimations();
    }

    processAnimations() {
        if (!this.isPlaying || this.animationQueue.length === 0) {
            this.isPlaying = false;
            
            // Check if we found the target
            if (this.animationQueue.length === 0 && !this.resultElement.textContent) {
                this.resultElement.textContent = `Value ${this.targetValue} not found in the array`;
                this.resultElement.style.color = 'red';
            }
            return;
        }

        const animation = this.animationQueue.shift();
        this.executeAnimation(animation);

        this.currentAnimation = setTimeout(() => {
            this.processAnimations();
        }, 100 - this.animationSpeed);
    }

    executeAnimation(animation) {
        const elements = this.canvas.querySelectorAll('.array-element');
        const [type, ...args] = animation;

        switch(type) {
            case 'check':
                elements[args[0]].classList.add('current');
                break;
            case 'checked':
                elements[args[0]].classList.remove('current');
                elements[args[0]].classList.add('checked');
                break;
            case 'found':
                elements[args[0]].classList.add('found');
                this.resultElement.textContent = `Found value ${this.targetValue} at index ${args[0]}`;
                this.resultElement.style.color = 'green';
                this.isPlaying = false;
                break;
            case 'not-found':
                this.resultElement.textContent = `Value ${this.targetValue} not found in the array`;
                this.resultElement.style.color = 'red';
                this.isPlaying = false;
                break;
            case 'eliminate':
                elements[args[0]].classList.add('eliminated');
                break;
            case 'sorted-array':
                // Visual indication that array is sorted
                this.canvas.style.border = '2px solid #4CAF50';
                setTimeout(() => {
                    this.canvas.style.border = '1px solid #ddd';
                }, 500);
                break;
            case 'jump':
                for (let i = args[0]; i <= args[1]; i++) {
                    elements[i].classList.add('jumped');
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