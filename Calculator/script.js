const ans_display = document.querySelector("#ans-display");
const display = document.querySelector("#result-display");

// console.log(ans_display, display);

// Get the id #calculator containing all the elements of the calculator
const btnListener = document.getElementById("calculator").childNodes;

// Initialize an array to store all child nodes of btnListener
const childNodesCalculator = [];

for (const iterator of btnListener) {
    // In this for I store all the ids that the calculator has.
    if (iterator.id) {
        childNodesCalculator.push(iterator.id);
    }
}

// I initialize an array to store all the button id's.
let listOperators = [...childNodesCalculator
    .filter((x) => x.includes("op"))];
// console.log(listOperators);

let listNumbers = [...childNodesCalculator
    .filter((x) => x.includes("num"))];
// console.log(listNumbers);


let num1 = 0;
let num2 = 0;
let operator;
let str = "";
let ans = 0;
ans_display.textContent += ans;

function setAc() {
    num1 = 0;
    num2 = 0;
    operator;
    str = 0;
    display.textContent = "";
    if (score != "💀 there was an error!")
        ans_display.textContent = "Ans = " + ans;
}

const objOfOperator = [];
for (let i of btnListener) {
    if (i.id) {
        let obj = { id: i.id, value: i.value };
        objOfOperator.push(obj);
    }
}

const listValuesOperators = [];
objOfOperator.forEach((item) => {
    if (item.id.includes("op")) {
        listValuesOperators.push(item.value);
    }
});

function setKeyDown(event) {
    // Show text on display
    if (event.key === "Escape") setAc(); // Pressing the AC button resets the display and all variables.

    const regex = /^[0-9]$/;
    if (regex.test(event.key) && event.key != "Enter" ||
        ["+", "-", "/", "*", "."].includes(event.key)) {
        str += event.key;
        display.textContent = str;
    }
    
    if (event.key === "Backspace" || event.key === "Delete") Del(); // Here we delete from display the last number to show it on screen and save it.

    if (event.key === "Enter") setEqual();
}

btnListener.forEach((button) => {
    button.addEventListener("click", () => {
        // Show text on display
        if (button.id == "btn-ac") setAc(); //Pressing the AC button resets the display and all variables.

        if (button.value != "=") str += button.value;
        display.textContent = str;

        if (button.id === "btn-ans") {
            str += ans;
            display.textContent = str;
        }
        if (button.id === "btn-del") Del(); // Here we delete from display the last number to show it on screen and save it.

        if (button.id === "btn-equal") setEqual();

    });
});

window.addEventListener("keydown", setKeyDown);


const setEqual = () => {
    let newStr = convertStringToNumbers(str);
    let score = finalScore(newStr);

    if (isNaN(score)) {
        score = "💀 there was an error!";
    }

    display.textContent = "";
    ans = score;

    display.textContent = ans;
    ans_display.textContent = str + " = ";
    str = ans;
}
const Del = () => {
    str = display.textContent.split("").slice(0, -1).join("");
    display.textContent = "";
    display.textContent += str;
}

function convertStringToNumbers(str) {
    let newArray = [];
    let result = [];
    let num = "";

    let stringToArray = str.split("");

    for (let index = 0; index < stringToArray.length; index++) {
        // This for return a array of number and string operators 
        // but whitout scintific notation Example: 
        // [10, "+", 50, "+", "1e^x2"]
        if (listValuesOperators.includes(stringToArray[index])) {
            if (num.includes("e^x")) newArray.push(num);
            else newArray.push(Number(num));

            newArray.push(stringToArray[index]);
            num = "";
            continue;
        }

        num += stringToArray[index];

        if (index === stringToArray.length - 1) {
            if (num.includes("e^x")) newArray.push(num);
            else newArray.push(Number(num));
        }

    }

    for (const iterator of newArray) {
        // This for return a array whit scintific notation converted
        //  in number Example: [10, "+", 50, "+", 100]
        if (
            typeof iterator === "string" &&
            !listValuesOperators.includes(iterator)
        ) {
            let stringSplit = iterator.split("");
            let posAfterX = stringSplit.indexOf("x") + 1;
            let posBeforeE = stringSplit.indexOf("e") - 1;
            let exponent = Number(
                stringSplit.slice(posAfterX, stringSplit.length).join("")
            );
            let coefficient = Number(stringSplit.slice(0, posBeforeE + 1).join(""));

            for (let index = 0; index < exponent; index++) {
                coefficient += "0";
            }
            result.push(Number(coefficient));
            continue;
        }
        result.push(iterator);
    }

    return result;

}

function operation(positionOp, operand, string) {
    let result = 0;

    n1 = string[positionOp - 1];
    n2 = string[positionOp + 1];

    if (operand === "*") result = Multiply(n1, n2);
    if (operand === "/") result = Divide(n1, n2);
    if (operand === "+") result = Add(n1, n2);
    if (operand === "-") result = Subtract(n1, n2);

    return result;
}
function finalScore(mathExpression) {
    let r = 0;

    if (mathExpression.length === 1) return mathExpression;

    for (let index = 0; index < mathExpression.length + 1; index++) {
        // This part determines the sequence in which the operations 
        // of an expression are performed.
        // The order of the operation is (PEMDAS)
        let posMultiply = mathExpression.indexOf("*");
        let posDivide = mathExpression.indexOf("/");
        let posAdd = mathExpression.indexOf("+");
        let posSubtract = mathExpression.indexOf("-");

        if (posMultiply != -1) {
            r = operation(posMultiply, "*", mathExpression)
            mathExpression.splice(posMultiply - 1, 3, r);
            continue;
        }

        if (posDivide != -1) {
            r = operation(posDivide, "/", mathExpression)
            mathExpression.splice(posDivide - 1, 3, r);
            if (r === "💀 there was an error!") {
                return r;
            }
            continue;
        }

        if (posAdd != -1) {
            r = operation(posAdd, "+", mathExpression);
            mathExpression.splice(posAdd - 1, 3, r);
            continue;
        }

        if (posSubtract != -1) {
            r = operation(posSubtract, "-", mathExpression);
            mathExpression.splice(posSubtract - 1, 3, r);
            continue;
        }

    }

    return r;
}


function Add(a, b) {
    return a + b;
}
function Subtract(a, b) {
    return a - b;
}
function Multiply(a, b) {
    return a * b;
}
function Divide(a, b) {
    let r;
    try {
        if (b === 0) console.log("HAY ALGO MALO");
        r = a / b;
        if (r === Infinity) {
            r = "💀 there was an error!";
        }
    } catch (error) {
        console.log("hay algo malo - ", error);
    } finally {
        return r;
    }
}