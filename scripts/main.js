const display = document.querySelector('#display');
const buttons = document.querySelector('#calculator').querySelectorAll('button');
const cleanButton = buttons[0];
const signButton = buttons[1];
const zeroButton = buttons[15];
const commaButton = buttons[16];
const maxValueResult = 9999999999;
const minValueResult = -9999999999;
const maxLengthValue = 10;

let operatorButton;
let numText1 = "";
let numText2= "";
let result;
let operatorOn = false;
let commaOn = false;
let signOn = false;
let disabledButtons = false;

setDisabledButton(signButton, true);
setDisabledButton(zeroButton, true);

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
    if(button.getAttribute("class") == "numbers") addNumText(button.innerHTML);
    else if(button.getAttribute("class") == "operator") operation(button);
    else if(button.getAttribute("id") == "equals") equals();
    else if(button.getAttribute("id") == "clear") reset();
    else if(button.getAttribute("id") == "comma") comma() ;
    else if(button.getAttribute("id") == "sign") sign();
    checkButtonsDisabled();
}

function addNumText(num) {
    if(!operatorOn && numText1 == "0" && num == "0") return;
    if(operatorOn && numText2 == "0" && num == "0") return;
    if(!operatorOn) addNumText1(num);
    else addNumText2(num);    
}

function addNumText1(num){
    let lengthOnlyNum = numText1.replace(/[^0-9]/g, '').length;

    if(numText1 == ""){
        result = null;
        signOn = false;
        display.innerHTML = num; 
        if(num != 0) numText1 = num;        
    }else if(!operatorOn && (maxLengthValue >  lengthOnlyNum)){ 
        display.innerHTML = (display.innerHTML + num);
        numText1 += num;
    }
}

function addNumText2(num){
    let lengthOnlyNum = numText2.replace(/[^0-9]/g, '').length;

    if(numText2 == ""){
        display.innerHTML = num; 
        numText2 = num;
    }else if(maxLengthValue >  lengthOnlyNum){
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
            signOn = false;
            numText2 = "";
    }    
    if(numText2 == ""){
        if(operatorButton != null) setHighLightingButton(operatorButton, false);
        operatorButton = operator;
        operatorOn = true;
        setHighLightingButton(operatorButton, true);
        if(commaOn) setHighLightingButton(commaButton, false);
        commaOn = false;
        signOn = false;
        if(numText1 == "") numText1 = "0";
    }else doubleOperation(operator);
}

function doubleOperation(operator){
    getResult();
    if(result > maxValueResult || result < minValueResult || result == null) displayError();
    else{
        if(result.toString().includes(".")) result = roundResult(result);
        showResult(result);
        numText1 = result.toString();
        numText2 = "";
        setHighLightingButton(operatorButton, false);
        operatorButton = operator;
        setHighLightingButton(operator, true);
        if(commaOn) setHighLightingButton(commaButton, false);
        commaOn = false;
        signOn = false;        
    }
}

function equals() {
    if(numText2 == "" && !operatorOn) return;
    if(numText2 == "" && operatorOn) displayError();
    else{
        getResult();
        if(result > maxValueResult || result < minValueResult|| result == null) displayError();
        else{
            if(result.toString().includes(".")) result = roundResult(result);
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

function roundResult(result){
    let resultText = result.toFixed(maxLengthValue).replace("-","");
    let integerText = "";
    let decimalText = "0.";
    let decimalOn = false;
    let resultNegative = (result < 0);

    for(i = 0; i < resultText.length; i++){
        if(resultText[i] == ".") decimalOn = true;
            else if(!decimalOn) integerText += resultText[i]; 
            else decimalText += resultText[i]; 
    }
    decimalText = parseFloat(decimalText).toFixed(maxLengthValue - integerText.length);
    if(resultNegative) result = (parseFloat(integerText) + parseFloat(decimalText)) * -1;
    else result = parseFloat(integerText) + parseFloat(decimalText);
    return result;
}

function showResult(result){
    let resultTextDisplay = result.toString().replace(".",",");
    display.innerHTML = resultTextDisplay;
}

function comma(){
    let lengthOnlyNum1 = numText1.replace(/[^0-9]/g, '').length;
    let lengthOnlyNum2 = numText2.replace(/[^0-9]/g, '').length;

    if(!commaOn){
        setHighLightingButton(commaButton, true);
        commaOn = true;
        if(!operatorOn && numText1 == ""){
            result = null;
            signOn = false;
            display.innerHTML = "0,";
            numText1 = "0.";
        }else if (operatorOn && numText2 == ""){
            display.innerHTML = "0,";
            numText2 = "0.";
        }else if (!operatorOn && (maxLengthValue >  lengthOnlyNum1)){
            display.innerHTML += ","; 
            numText1 += ".";
        }else if(operatorOn && (maxLengthValue >  lengthOnlyNum2)){
            display.innerHTML += ","; 
            numText2 += ".";
        }else{
            setHighLightingButton(commaButton, false);
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
    if(!signOn) setSignNegativeOn();
    else setSignPositiveOn();    
}

function setSignNegativeOn(){
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

function setSignPositiveOn(){
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

function setHighLightingButton(button, active){
    if(active) button.style.backgroundColor = "orange";
    else button.style.backgroundColor = "#fcc04b";
}

function setDisabledButton(button, disabled){
    if(disabled){
        button.disabled = disabled;
        button.style.color = "red";
        button.style.cursor = "not-allowed";
    } 
    else{
        button.disabled = disabled;
        button.style.color = "#ffffff";
        button.style.cursor = "default";
    } 
}

function checkButtonsDisabled(){
    let displayLength = display.innerHTML.replace(/[^0-9]/g, '').length;

    if(!disabledButtons){
        if(commaOn || maxLengthValue <= displayLength) setDisabledButton(commaButton, true);
        else setDisabledButton(commaButton, false);
        if(display.innerHTML == "0" || display.innerHTML == "0,") setDisabledButton(signButton, true);
        else if(operatorOn && numText2 == "") setDisabledButton(signButton, true);
        else setDisabledButton(signButton, false);
        if(maxLengthValue <= displayLength && operatorOn && numText2 == ""){
            buttons.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, false)
            });
        }else if(maxLengthValue <= displayLength && !operatorOn && numText1 == ""){
            buttons.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, false)
            });
        }else if(maxLengthValue <= displayLength){
            buttons.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, true)
            });
        }else{
            buttons.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, false)
            });
        }
        if(display.innerHTML == "0") setDisabledButton(zeroButton, true);
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
    buttons.forEach(button => {setDisabledButton(button, true)});
    setDisabledButton(cleanButton, false);
}

function finishOperation() {
    numText1 = "";
    numText2 = "";
    if(operatorOn) setHighLightingButton(operatorButton, false);
    operatorOn = false;
    operatorButton = null;
    if(commaOn) setHighLightingButton(commaButton, false);
    commaOn = false;
    if(result < 0) signOn = true;
    else signOn = false;
}

function reset() {
    finishOperation();
    signOn = false;
    result = null;
    display.innerHTML = 0;
    if(disabledButtons){
        buttons.forEach(button => {setDisabledButton(button, false)});
        disabledButtons = false;
    }
}