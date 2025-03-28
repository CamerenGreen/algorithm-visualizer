export class Visualizer {
    constructor(canvas, algorithms) {
        this.canvas = canvas;
        this.algorithms = algorithms;
        this.data = [];
        this.animationSpeed = 50;
        this.isPlaying = false;
        this.animationQueue = [];
        this.currentAnimation = null;
    }
    
    generateNewArray(size, type = 'random') {
        switch(type) {
            case 'random':
                this.data = Array.from({length: size}, () => 
                    Math.floor(Math.random() * 100) + 5
                );
                break;
            case 'nearly-sorted':
                this.data = Array.from({length: size}, (_, i) => i * 3);
                // Add some randomness
                for (let i = 0; i < size/5; i++) {
                    const idx1 = Math.floor(Math.random() * size);
                    const idx2 = Math.floor(Math.random() * size);
                    [this.data[idx1], this.data[idx2]] = [this.data[idx2], this.data[idx1]];
                }
                break;
            case 'reversed':
                this.data = Array.from({length: size}, (_, i) => (size - i) * 3);
                break;
            case 'few-unique':
                const uniqueValues = [10, 30, 50, 70, 90];
                this.data = Array.from({length: size}, () => 
                    uniqueValues[Math.floor(Math.random() * uniqueValues.length)]
                );
                break;
        }
        this.render();
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
            this.canvas.appendChild(element);
        });
    }
    
    startVisualization(algorithm) {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        const animations = this.algorithms[algorithm]([...this.data]);
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
        const elements = this.canvas.querySelectorAll('.array-element');
        const [type, ...args] = animation;
        
        switch(type) {
            case 'compare':
                elements[args[0]].classList.add('highlight');
                elements[args[1]].classList.add('highlight');
                break;
            case 'swap':
                const temp = this.data[args[0]];
                this.data[args[0]] = this.data[args[1]];
                this.data[args[1]] = temp;
                this.render();
                break;
            case 'sorted':
                elements[args[0]].classList.add('sorted');
                break;
            case 'reset':
                elements.forEach(el => el.classList.remove('highlight'));
                break;
            case 'min':
                elements[args[0]].classList.add('min');
                break;
            case 'reset-min':
                elements[args[0]].classList.remove('min');
                break;
            case 'insert':
                elements[args[0]].classList.add('insert');
                break;
            case 'partial-sorted':
                elements[args[0]].classList.add('partial-sorted');
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
    
    stepVisualization() {
        if (this.animationQueue.length === 0) return;
        
        const animation = this.animationQueue.shift();
        this.executeAnimation(animation);
    }
    
    setSpeed(speed) {
        this.animationSpeed = speed;
    }
}