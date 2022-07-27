const display = document.querySelector('#display');
const buttons = document.querySelector('#calculator').querySelectorAll('button');
const commaButton = buttons[16];
const C_button = buttons[0];
const sign_Button = buttons[1];
const zero_Button = buttons[15];

let numText1 = "";
let numText2= "";
let result;
let operatorButton;
let operatorOn = false;
let commaOn = false;
let signOn = false;
let disabledButtons = false;

//disabledButtonAndColor(sign_Button, true);
//disabledButtonAndColor(zero_Button, true);

buttons.forEach(button => button.addEventListener('click', event => {eventStart(event.target)}));

window.addEventListener("keydown", function (event) {
    event.preventDefault();
    if(event.key == "Escape") eventStart(buttons[0]);
    if(!disabledButtons){
        if(event.ctrlKey) eventStart(buttons[1]);
        else if(event.key == 1) eventStart(buttons[11]);
        else if(event.key == 2) eventStart(buttons[12]);
        else if(event.key == 3) eventStart(buttons[13]);
        else if(event.key == 4) eventStart(buttons[7]);
        else if(event.key == 5) eventStart(buttons[8]);
        else if(event.key == 6) eventStart(buttons[9]);
        else if(event.key == 7) eventStart(buttons[3]);
        else if(event.key == 8) eventStart(buttons[4]);
        else if(event.key == 9) eventStart(buttons[5]);
        else if(event.key == 0) eventStart(buttons[15]);
        else if(event.key == "+") eventStart(buttons[14]);
        else if(event.key == "-") eventStart(buttons[10]);
        else if(event.key == "*") eventStart(buttons[6]);
        else if(event.key == "/") eventStart(buttons[2]);
        else if(event.key == "Enter") eventStart(buttons[17]);
        else if(event.key == ",") eventStart(buttons[16]);
    }
});

function eventStart(button){
    if(button.getAttribute("class") == "numbers") addNum(button.innerHTML);
    else if(button.getAttribute("class") == "operator") operation(button);
    else if(button.getAttribute("id") == "equals") equals();
    else if(button.getAttribute("id") == "clear") reset();
    else if(button.getAttribute("id") == "comma") comma() ;
    else if(button.getAttribute("id") == "sign") sign();
}

function addNum(num) {
    if(!operatorOn && numText1 == "" && num == "0") return;
    if(operatorOn && numText2 == "0" && num == "0") return;
    if(!operatorOn) addNum1(num);
    else addNum2(num);    
}

function addNum1(num){
    let lengthOnlyNum1 = numText1.replace(/[^0-9]/g, '').length;

    if(numText1 == ""){
        result = null;
        display.innerHTML = num; 
        numText1 = num;        
    }else if(!operatorOn && (10 >  lengthOnlyNum1)){ 
        display.innerHTML = (display.innerHTML + num);
        numText1 += num;
    }
}

function addNum2(num){
    let lengthOnlyNum2 = numText2.replace(/[^0-9]/g, '').length;

    if(numText2 == ""){
        display.innerHTML = num; 
        numText2 = num;
    }else if(10 >  lengthOnlyNum2){
        if(numText2 == "0" && num != "0" ){
            numText2 = num;
            display.innerHTML = num;
        }else{
            display.innerHTML = (display.innerHTML + num);
            numText2 += num;
        }
    }
}

function operation(operator){
    if(result != null && !operatorOn){
            numText1 = result.toString();
            result = null;
            numText2 = "";
    }    
    if(numText2 == ""){
        if(operatorButton != null) highLightingButton(operatorButton, false);
        operatorButton = operator;
        operatorOn = true;
        highLightingButton(operatorButton, true);
        if(commaOn) highLightingButton(commaButton, false);
        commaOn = false;
        signOn = false;
        if(numText1 == "") numText1 = "0";
    }else doubleOperation(operator);
}

function doubleOperation(operator){
    getResult();
    if(result > 9999999999 || result < -9999999999 || result == null) displayError();
    else{
        if(result.toString().includes(".")) roundResult();
        showResult(result);
        numText1 = result.toString();
        numText2 = "";
        highLightingButton(operatorButton, false);
        operatorButton = operator;
        highLightingButton(operator, true);
        if(commaOn) highLightingButton(commaButton, false);
        commaOn = false;
        signOn = false;        
    }
}

function equals() {
    if(numText2 == "" && operatorOn){
        displayError();
    }else{
        getResult();
        if(result > 9999999999 || result < -9999999999 || result == null) displayError();
        else{
            if(result.toString().includes(".")) roundResult();
            showResult(result);
            finishOperation();
        }
    }
}

function getResult(){
    if(operatorButton.innerHTML == "+") result = plus();
    if(operatorButton.innerHTML == "-") result = minus();
    if(operatorButton.innerHTML == "*") result = multiply();
    if(operatorButton.innerHTML == "/"){ 
        if(numText2 == "0" || numText2 == "0,"){
            displayError();
        }else result = divide();
    }
}

function roundResult(){
    result = result.toFixed(10);
    if(result.toString().includes(".")){
        let resultText = result.toString().replace("-","");
        let integerText = "";
        let decimalText = "0.";
        let decimalOn = false;
        let resultNegative = (result < 0);

        for(i = 0; i < resultText.length; i++){
            if(resultText[i] == ".") decimalOn = true;
            else if(!decimalOn) integerText += resultText[i]; 
            else decimalText += resultText[i]; 
        }
        decimalText = parseFloat(decimalText).toFixed(10 - integerText.length);
        if(resultNegative) result = (parseFloat(integerText) + parseFloat(decimalText)) * -1;
        else result = parseFloat(integerText) + parseFloat(decimalText);
    }
}

function showResult(result){
    let resultTextDisplay = result.toString().replace(".",",");
    display.innerHTML = resultTextDisplay;
}

function comma(){
    let lengthOnlyNum1 = numText1.replace(/[^0-9]/g, '').length;
    let lengthOnlyNum2 = numText2.replace(/[^0-9]/g, '').length;

    if(!commaOn){
        highLightingButton(commaButton, true);
        commaOn = true;
        if(!operatorOn && numText1 == ""){
            result = null;
            display.innerHTML = "0,";
            numText1 = "0.";
        }else if (operatorOn && numText2 == ""){
            display.innerHTML = "0,";
            numText2 = "0.";
        }else if (!operatorOn && (10 >  lengthOnlyNum1)){
            display.innerHTML += ","; 
            numText1 += ".";
        }else if(operatorOn && (10 >  lengthOnlyNum2)){
            display.innerHTML += ","; 
            numText2 += ".";
        }else{
            highLightingButton(commaButton, false);
            commaOn = false;
        }
    }
}

function sign(){
    if(result != null && !operatorOn){
        numText1 = result.toString();
        result = null;
    } 
    if(numText1 == "") return;
    if(operatorOn && numText2 == "") return;
    if(!signOn) signNegative();
    else signPositive();    
}

function signNegative(){
    if(!operatorOn && (numText1 != "0" && numText1 != "0.")){
        display.innerHTML = "-" + display.innerHTML;
        numText1 = "-" + numText1;
        signOn = true;
    }else if(operatorOn && (numText2 != "0" && numText2 != "0.")){
        display.innerHTML = "-" + display.innerHTML;
        numText2 = "-" + numText2;
        signOn = true;
    } 
}

function signPositive(){
    if(!operatorOn && (numText1 != "0" && numText1 != "0.")){
        numText1 = numText1.replace("-","");
        display.innerHTML = numText1.replace(".",",");
        signOn = false;
    }else if(operatorOn && (numText2 != "0" && numText2 != "0.")){
        numText2 = numText2.replace("-","");
        display.innerHTML = numText2.replace(".",",");
        signOn = false;
    } 
}

function highLightingButton(button, active){
    if(active) button.style.backgroundColor = "orange";
    else button.style.backgroundColor = "#fcc04b";
}

function disabledButtonAndColor(button, disabled){
    if(disabled){
        button.disabled = disabled;
        button.style.color = "red";
    } 
    else{
        button.disabled = disabled;
        button.style.color = "#ffffff";
    } 
}

function plus(){
    return (parseFloat(numText1)  + parseFloat(numText2));
}

function minus() {
    return (parseFloat(numText1)  - parseFloat(numText2));
}

function multiply() {
    return (parseFloat(numText1)  * parseFloat(numText2));
}

function divide() {
    return (parseFloat(numText1)  / parseFloat(numText2));  
}

function displayError(){
    disabledButtons = true;
    display.innerHTML = "ERROR";
    buttons.forEach(button => {disabledButtonAndColor(button, true)});
    disabledButtonAndColor(C_button, false);
}

function finishOperation() {
    numText1 = "";
    numText2 = "";
    if(operatorOn) highLightingButton(operatorButton, false);
    operatorOn = false;
    operatorButton = null;
    if(commaOn) highLightingButton(commaButton, false);
    commaOn = false;
    signOn = false;
}

function reset() {
    finishOperation();
    result = null;
    display.innerHTML = 0;
    if(disabledButtons){
        buttons.forEach(button => {disabledButtonAndColor(button, false)});
        disabledButtons = false;
    }
}