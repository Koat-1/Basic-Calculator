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

function isOverflow(result) {
    return result > 999999999999;
}

let firstNum = null;
let operator = null;
let secondNum = null;
let displayValue = "0";
let resetDisplay = false;

const screen = document.querySelector('.screen');
const numButtons = document.querySelectorAll('.nums');
const operatorButton = document.querySelectorAll('.operators');
const clearButton = document.querySelector('#clear');
const backspaceButton = document.querySelector('#backspace');
const equalsButton = document.querySelector('#equal');

screen.value = displayValue;

function updateDisplay() {
    screen.value = displayValue;
}

function resetCalculator() {
    firstNum = null;
    operator = null;
    secondNum = null;
    resetDisplay = false;
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
        if (resetDisplay || displayValue === "0") {
            displayValue = number;
            resetDisplay = false;
        }
        else {
            displayValue += number;
        }
    }
    
    updateDisplay();
}


function handleOpClick(op) {
    const current = parseFloat(displayValue);

    if (op === '=') {
        handleEqual();
        return;
    }
    
    if (firstNum === null) {
        firstNum = current;
        operator = op;
        resetDisplay = true;
    }

    else if (resetDisplay) {
        operator = op;
    }

    else {
        secondNum = current;
        const result = operate(operator, firstNum, secondNum);

        if (isError(result)) {
            displayValue = "ERR DIV/0";
            resetCalculator();
        }
        else if (isOverflow(result)) {
            displayValue = "OVERFLOW";
            resetCalculator();
        }
        else {
            displayValue = result.toString();
            firstNum = result;
            operator = op; 
            secondNum = null;
            resetDisplay = true;
        }

        updateDisplay();
    }   
}

function handleEqual() {
    if (firstNum === null || operator === null) {
        return;
    }
    
    let currentSecondNum;

    if (secondNum !== null) {
        currentSecondNum = secondNum;
    }
    else {
        currentSecondNum = parseFloat(displayValue);
        secondNum = currentSecondNum;
    }
    const result = operate(operator, firstNum, currentSecondNum);
    if (isError(result)) {
        displayValue = "ERR DIV/0";
        resetCalculator();
    }
    else if (isOverflow(result)) {
        displayValue = "OVERFLOW";
        resetCalculator();
    }
    else {
        displayValue = result.toString();
        firstNum = result;
        resetDisplay = true;
    }
    updateDisplay();
}

function backspace() {
    displayValue = displayValue.slice(0, -1);
    updateDisplay();
}


numButtons.forEach(button => {
    button.addEventListener('click', () => {
        handleNumClick(button.textContent);
    });
});

operatorButton.forEach(button => {
    if (button.textContent !== '=') { 
        button.addEventListener('click', () => {
            handleOpClick(button.textContent);
        });
    }
});

clearButton.addEventListener('click', () => {
    resetCalculator();
    displayValue = "0";
    updateDisplay();
})

backspaceButton.addEventListener('click', () => backspace());

equalsButton.addEventListener('click', handleEqual);



document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const key = event.key;

    const calculatorKeys = ['0','1','2','3','4','5','6','7','8','9','.',',','+','-','*','/','Enter','=','Escape','Backspace','c','C'];
    
    if (!calculatorKeys.includes(key)) {
        event.preventDefault(); 
        return;
    }

    switch (key) {
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9': handleNumClick(key); break;
        case '.':
        case ',': handleNumClick(','); break;
        case '+': handleOpClick('+'); break;
        case '-': handleOpClick('-'); break;
        case '*': handleOpClick('*'); break;
        case '/': handleOpClick('/'); break;
        case 'Backspace': backspace(); break;
        case 'c':
        case 'C':
        case 'Escape': resetCalculator(); displayValue = "0"; updateDisplay(); break;
        case 'Enter':
        case '=': handleEqual(); break;
    }

})
