// State variables
let currentInput = '0';
let previousInput = null;
let operator = null;
let isNewNumber = true; // Flag to start a new number after an operator or equals

// DOM elements
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found.');
}

const createCalculatorUI = () => {
  const calculatorDiv = document.createElement('div');
  calculatorDiv.className = 'calculator';
  calculatorDiv.setAttribute('role', 'application');
  calculatorDiv.setAttribute('aria-label', 'Calculator');

  const displayDiv = document.createElement('div');
  displayDiv.className = 'display';
  displayDiv.setAttribute('role', 'status');
  displayDiv.setAttribute('aria-live', 'polite');
  displayDiv.textContent = currentInput;

  const buttonsGridDiv = document.createElement('div');
  buttonsGridDiv.className = 'buttons-grid';

  calculatorDiv.appendChild(displayDiv);
  calculatorDiv.appendChild(buttonsGridDiv);

  if (rootElement) {
    rootElement.appendChild(calculatorDiv);
  }

  return { displayDiv, buttonsGridDiv };
};

const { displayDiv, buttonsGridDiv } = createCalculatorUI();

const updateDisplay = () => {
  displayDiv.textContent = currentInput;
};

const handleNumberClick = (num) => {
  if (isNewNumber) {
    currentInput = num;
    isNewNumber = false;
  } else {
    currentInput = (currentInput === '0' ? num : currentInput + num);
  }
  updateDisplay();
};

const handleDecimalClick = () => {
  if (isNewNumber) {
    currentInput = '0.';
    isNewNumber = false;
  } else if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
};

const calculate = () => {
  if (previousInput === null || operator === null || isNewNumber) {
    if (previousInput === null && operator === null) {
      return;
    }
    if (previousInput !== null && operator !== null && isNewNumber) {
      previousInput = currentInput; // Use currentInput as both operands for scenarios like "5 + ="
    }
  }

  const prev = parseFloat(previousInput || currentInput);
  const current = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+':
      result = prev + current;
      break;
    case '-':
      result = prev - current;
      break;
    case '*':
      result = prev * current;
      break;
    case '/':
      if (current === 0) {
        currentInput = 'Error';
        previousInput = null;
        operator = null;
        isNewNumber = true;
        updateDisplay();
        return;
      }
      result = prev / current;
      break;
    default:
      return;
  }
  currentInput = result.toString();
  previousInput = null;
  operator = null;
  isNewNumber = true;
  updateDisplay();
};

const handleOperatorClick = (op) => {
  if (previousInput !== null && operator !== null && !isNewNumber) {
    calculate(); // Perform previous calculation before setting new operator
    previousInput = currentInput; // The result becomes the new previousInput
    operator = op;
    isNewNumber = true;
  } else {
    previousInput = currentInput;
    operator = op;
    isNewNumber = true;
  }
};


const handleEqualsClick = () => {
  if (previousInput !== null && operator !== null) {
    calculate();
  }
};

const handleClearClick = () => {
  currentInput = '0';
  previousInput = null;
  operator = null;
  isNewNumber = true;
  updateDisplay();
};

// Button definitions
const buttons = [
  { value: 'C', className: 'clear', handler: handleClearClick },
  { value: '/', className: 'operator', handler: () => handleOperatorClick('/') },
  { value: '*', className: 'operator', handler: () => handleOperatorClick('*') },
  { value: '-', className: 'operator', handler: () => handleOperatorClick('-') },

  { value: '7', className: '', handler: () => handleNumberClick('7') },
  { value: '8', className: '', handler: () => handleNumberClick('8') },
  { value: '9', className: '', handler: () => handleNumberClick('9') },
  { value: '+', className: 'operator', handler: () => handleOperatorClick('+') },

  { value: '4', className: '', handler: () => handleNumberClick('4') },
  { value: '5', className: '', handler: () => handleNumberClick('5') },
  { value: '6', className: '', handler: () => handleNumberClick('6') },
  { value: '0', className: '', handler: () => handleNumberClick('0') }, // Moved 0 here for typical layout

  { value: '1', className: '', handler: () => handleNumberClick('1') },
  { value: '2', className: '', handler: () => handleNumberClick('2') },
  { value: '3', className: '', handler: () => handleNumberClick('3') },
  { value: '.', className: '', handler: handleDecimalClick },
  { value: '=', className: 'equals', handler: handleEqualsClick },
];

// Dynamically create and append buttons
buttons.forEach(btn => {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = btn.value;
  buttonElement.className = `button ${btn.className}`;
  buttonElement.addEventListener('click', btn.handler);
  buttonsGridDiv.appendChild(buttonElement);
});

// Initial display update
updateDisplay();