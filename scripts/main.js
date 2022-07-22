const display = document.querySelector('#display');
const elements = document.querySelector('#calculator').querySelectorAll('button');

let num1;
let num2;
let result;
let operatorElement;
let operatorOn = false;
let commaOn = false;
let signOn = false;
let disabledButtons = false;

elements.forEach(element => element.addEventListener('click', event => {start(event.target)}));

window.addEventListener("keydown", function (event) {
    event.preventDefault();
    if(event.key == "Escape") start(elements[0]);
    if(!disabledButtons){
        if(event.ctrlKey) start(elements[1]);
        else if(event.key == 1) start(elements[11]);
        else if(event.key == 2) start(elements[12]);
        else if(event.key == 3) start(elements[13]);
        else if(event.key == 4) start(elements[7]);
        else if(event.key == 5) start(elements[8]);
        else if(event.key == 6) start(elements[9]);
        else if(event.key == 7) start(elements[3]);
        else if(event.key == 8) start(elements[4]);
        else if(event.key == 9) start(elements[5]);
        else if(event.key == 0) start(elements[15]);
        else if(event.key == "+") start(elements[14]);
        else if(event.key == "-") start(elements[10]);
        else if(event.key == "*") start(elements[6]);
        else if(event.key == "/") start(elements[2]);
        else if(event.key == "Enter") start(elements[17]);
        else if(event.key == ",") start(elements[16]);
    }
});

function start(element){
    if(element.getAttribute("class") == "numbers") addNum(element.innerHTML);
    else if(element.getAttribute("class") == "operator") operation(element);
    else if(element.getAttribute("id") == "equals") equals();
    else if(element.getAttribute("id") == "clear") reset();
    else if(element.getAttribute("id") == "comma") comma(element) ;
    else if(element.getAttribute("id") == "sign") sign();
}

function addNum(num) {
    if(!operatorOn && (num1 == "" || num1 === undefined) && num == "0") return;
    if(operatorOn && num2 == "0" && num == "0") return;
    if(!operatorOn) addNum1(num);
    else addNum2(num);    
}

function addNum1(num){
    if(num1 == "" || num1 === undefined){
        result = null;
        display.innerHTML = num; 
        num1 = num;        
    }else if(!operatorOn && (10 >  num1.replace(/[^0-9]/g, '').length)){ 
        display.innerHTML = (display.innerHTML + num);
        num1 += num;
    }
}

function addNum2(num){
    if(num2 == "" || num2 === undefined){
        display.innerHTML = num; 
        num2 = num;
    }else if(10 >  num2.replace(/[^0-9]/g, '').length){
        if(num2 == "0" && num != "0" ){
            num2 = num;
            display.innerHTML = num;
        }else{
            display.innerHTML = (display.innerHTML + num);
            num2 += num;
        }
    }
}

function operation(operator){
    if(result != null && !operatorOn){
            num1 = result.toString();
            result = null;
            num2 = "";
    }    
    if(num2 == "" || num2 === undefined){
        if(operatorElement != null) operatorElement.style.backgroundColor = '#fcc04b';
        operatorElement = operator;
        operatorOn = true;
        operator.style.backgroundColor = 'orange';
        if(commaOn) elements[16].style.backgroundColor = '#fcc04b';
        commaOn = false;
        signOn = false;
        if(num1 == "" || num1 === undefined) num1 = "0";
    }else doubleOperation(operator);
}

function doubleOperation(operator){
    getResult();
    if(result > 9999999999 || result < -9999999999 || result == null) displayError();
    else{
        if(result.toString().includes(".")) roundResult();
        showResult(result);
        num1 = result.toString();
        num2 = "";
        operatorElement.style.backgroundColor = '#fcc04b';
        operatorElement = operator;
        operatorElement.style.backgroundColor = 'orange';
        if(commaOn) elements[16].style.backgroundColor = '#fcc04b';
        commaOn = false;
        signOn = false;        
    }
}

function equals() {
    if((num2 == "" || num2 === undefined) && !operatorOn){
        resetOperation();
        if(display.innerHTML != "0"){
            num1 = display.innerHTML.replace(",",".");
            if(num1.includes("-")) signOn = true;
            if(num1.includes(".")){
                commaOn =  true;
                elements[16].style.backgroundColor = 'orange';
        }
    }
    }else if((num2 == "" || num2 === undefined) && operatorOn){
        displayError();
    }else{
        getResult();
        if(result > 9999999999 || result < -9999999999 || result == null) displayError();
        else{
            if(result.toString().includes(".")) roundResult();
            showResult(result);
            resetOperation();
        }
    }
}

function getResult(){
    if(operatorElement.innerHTML == "+") result = plus();
    if(operatorElement.innerHTML == "-") result = minus();
    if(operatorElement.innerHTML == "*") result = multiply();
    if(operatorElement.innerHTML == "/"){ 
        if(num2 == "0" || num2 == "0,"){
            displayError();
        }else result = divide();
    }
}

function roundResult(){
    let resultString = result.toString().replace("-","");
    let integer = "";
    let decimal = "0.";
    let decimalOn = false;
    let resultNegative = (result < 0);

    for(i = 0; i < resultString.length; i++){
        if(resultString[i] == ".") decimalOn = true;
        else if(!decimalOn) integer += resultString[i];
        else decimal += resultString[i]; 
    }
    decimal = parseFloat(decimal).toFixed(10 - integer.length);
    if(resultNegative) result = (parseFloat(integer) + parseFloat(decimal)) * -1;
    else result = parseFloat(integer) + parseFloat(decimal);
}

function showResult(result){
    if(result.toString().replace(/[^0-9]/g, '').length > 10){
            if(signOn && commaOn) display.innerHTML = result.toString().substring(0,12).replace(".",",");
            else if (signOn || commaOn) display.innerHTML = result.toString().substring(0,11).replace(".",",");
    }else display.innerHTML = result.toString().replace(".",",");
}

function comma(element){
    if(!commaOn){
        element.style.backgroundColor = 'orange';
        commaOn = true;

        if(!operatorOn && (num1 == "" || num1 === undefined)){
            result = null;
            display.innerHTML = "0,";
            num1 = "0.";
        }else if (operatorOn && (num2 == "" || num2 === undefined)){
            display.innerHTML = "0,";
            num2 = "0.";
        }else if (!operatorOn && (10 >  num1.replace(/[^0-9]/g, '').length)){
            display.innerHTML += ","; 
            num1 += ".";
        }else if(operatorOn && (10 >  num2.replace(/[^0-9]/g, '').length)){
            display.innerHTML += ","; 
            num2 += ".";
        }else{
            element.style.backgroundColor = '#fcc04b';
            commaOn = false;
        }
    }
}

function sign(){
    if(result != null && !operatorOn){
        num1 = result.toString();
        result = null;
    } 
    if(num1 == "" || num1 === undefined) return;
    if(operatorOn && (num2 == "" || num2 === undefined)) return;
    if(!signOn) signNegative();
    else signPositive();    
}

function signNegative(){
    if(!operatorOn && (num1 != "0" && num1 != "0.")){
        display.innerHTML = "-" + display.innerHTML;
        num1 = "-" + num1;
        signOn = true;
    }else if(operatorOn && (num2 != "0" && num2 != "0.")){
        display.innerHTML = "-" + display.innerHTML;
        num2 = "-" + num2;
        signOn = true;
    } 
}

function signPositive(){
    if(!operatorOn && (num1 != "0" && num1 != "0.")){
        num1 = num1.replace("-","");
        display.innerHTML = num1.replace(".",",");
        signOn = false;
    }else if(operatorOn && (num2 != "0" && num2 != "0.")){
        num2 = num2.replace("-","");
        display.innerHTML = num2.replace(".",",");
        signOn = false;
    } 
}

function plus(){
    return (parseFloat(num1)  + parseFloat(num2));
}

function minus() {
    return (parseFloat(num1)  - parseFloat(num2));
}

function multiply() {
    return (parseFloat(num1)  * parseFloat(num2));
}

function divide() {
    return (parseFloat(num1)  / parseFloat(num2));
    
}

function displayError(){
    disabledButtons = true;
    display.innerHTML = "ERROR";
    elements.forEach(element => {element.disabled = true; element.style.color = "red"});
    elements[0].disabled = false;
    elements[0].style.color = "#ffffff";
}

function reset() {
    resetOperation();
    result = null;
    display.innerHTML = 0;
    if(disabledButtons){
        elements.forEach(element => {element.disabled = false; element.style.color = "#ffffff"});
        disabledButtons = false;
    }
}

function resetOperation() {
    num1 = "";
    num2 = "";
    if(operatorOn) operatorElement.style.backgroundColor = '#fcc04b';
    operatorOn = false;
    operatorElement = null;
    if(commaOn) elements[16].style.backgroundColor = '#fcc04b';
    commaOn = false;
    signOn = false;
}