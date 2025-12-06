function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        return "ERR DIV/0";
    }
    return a / b;
}

function operate(operator, a, b) {
    switch (operator) {
        case '+': return add(a, b);
        case '-': return subtract(a, b);
        case '*': return multiply(a, b);
        case '/': return divide(a, b);
    }
}

function isError(result) {
    return typeof result === 'string' && result === "ERR DIV/0";
}

let firstNum = null;
let operator = null;
let secondNum = null;
let displayValue = "0";
let next = false;

const screen = document.querySelector('.screen');
const numButtons = document.querySelectorAll('.nums');
const operatorButton = document.querySelectorAll('.operators');
const clearButton = document.querySelector('#clear');

screen.value = displayValue;

function updateDisplay() {
    screen.value = displayValue;
}

function resetCalculator() {
    firstNum = null;
    operator = null;
    secondNum = null;
    next = false;
}


function handleNumClick(number) {
    
    if (displayValue === "OVERFLOW" || displayValue === "ERR DIV/0") {
        resetCalculator();
        displayValue = "0";
    }
    
    if (displayValue.replace('.', '').length > 12) {
        displayValue = "OVERFLOW";
        updateDisplay();
        return;
    }

  

    if (number === ",") {
        if (displayValue.includes('.')) return;
        if (displayValue === "" || displayValue === "0") {
            displayValue = "0.";
        }
        else {
            displayValue += ".";
        }
    }
    else {
        if (next || displayValue === "0") {
            displayValue = number;
            next = false;
        }
        else {
            displayValue += number;
        }
    }

    updateDisplay();
}


function handleOpClick(op) {
    const current = parseFloat(displayValue);

    if (firstNum === null) {
        firstNum = current;
        operator = op;
        next = true;
    }

    else if (next) {
        operator = op;
    }

    else {
        secondNum = current;
        const result = operate(operator, firstNum, secondNum);

        if (isError(result)) {
            displayValue = "ERR DIV/0";
            resetCalculator();
        }
        else {
            displayValue = result.toString();
            firstNum = result;
            operator = op;
            secondNum = null;
            next = true;
        }

        updateDisplay();

    }
    
}

numButtons.forEach(button => {
    button.addEventListener('click', () => {
        const number = button.textContent;
        handleNumClick(number);
    });
});

operatorButton.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.textContent;
        handleOpClick(op);
    })
});

clearButton.addEventListener('click', () => {
    resetCalculator();
    displayValue = "0";
    updateDisplay();
})



