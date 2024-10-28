import { backend } from 'declarations/backend';

const display = document.getElementById('display');
const keys = document.querySelectorAll('.key');
const clearButton = document.getElementById('clear');
const equalsButton = document.getElementById('equals');
const loadingIndicator = document.getElementById('loading');

let currentInput = '';
let operator = '';
let firstOperand = '';

keys.forEach(key => {
    key.addEventListener('click', () => {
        const value = key.dataset.value;
        if (['+', '-', '*', '/'].includes(value)) {
            if (currentInput !== '') {
                if (firstOperand === '') {
                    firstOperand = currentInput;
                    operator = value;
                    currentInput = '';
                } else {
                    calculate();
                    operator = value;
                }
            }
        } else {
            currentInput += value;
        }
        updateDisplay();
    });
});

clearButton.addEventListener('click', () => {
    currentInput = '';
    operator = '';
    firstOperand = '';
    updateDisplay();
});

equalsButton.addEventListener('click', calculate);

function updateDisplay() {
    display.value = currentInput || '0';
}

async function calculate() {
    if (firstOperand !== '' && operator !== '' && currentInput !== '') {
        const a = parseFloat(firstOperand);
        const b = parseFloat(currentInput);
        
        loadingIndicator.style.display = 'block';
        
        try {
            let result;
            switch (operator) {
                case '+':
                    result = await backend.add(a, b);
                    break;
                case '-':
                    result = await backend.subtract(a, b);
                    break;
                case '*':
                    result = await backend.multiply(a, b);
                    break;
                case '/':
                    result = await backend.divide(a, b);
                    break;
            }
            currentInput = result.toString();
            firstOperand = '';
            operator = '';
            updateDisplay();
        } catch (error) {
            console.error('Calculation error:', error);
            currentInput = 'Error';
            updateDisplay();
        } finally {
            loadingIndicator.style.display = 'none';
        }
    }
}

updateDisplay();
