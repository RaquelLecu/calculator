const DISPLAY = document.querySelector('#display');
const BUTTONS = document.querySelector('#calculator').querySelectorAll('button');
const CLEAN_BUTTON = BUTTONS[0];
const SIGN_BUTTON = BUTTONS[1];
const ZERO_BUTTON = BUTTONS[15];
const COMMA_BUTTON = BUTTONS[16];
const MAX_VALUE_RESULT = 9999999999;
const MIN_VALUE_RESULT = -9999999999;
const MAX_LENGTH_VALUE = 10;

let operatorButton;
let numText1 = "";
let numText2= "";
let result;
let operatorOn = false;
let commaOn = false;
let signOn = false;
let disabledError = false;

setDisabledButton(SIGN_BUTTON, true);
setDisabledButton(ZERO_BUTTON, true);

BUTTONS.forEach(button => button.addEventListener('click', event => {eventStart(event.target)}));

window.addEventListener("keydown", function (event) {
    event.preventDefault();
    if(event.key == "Escape") BUTTONS[0].click();
        if(event.ctrlKey) BUTTONS[1].click();
        else if(event.key == 1) BUTTONS[11].click();
        else if(event.key == 2) BUTTONS[12].click();
        else if(event.key == 3) BUTTONS[13].click();
        else if(event.key == 4) BUTTONS[7].click();
        else if(event.key == 5) BUTTONS[8].click();
        else if(event.key == 6) BUTTONS[9].click();
        else if(event.key == 7) BUTTONS[3].click();
        else if(event.key == 8) BUTTONS[4].click();
        else if(event.key == 9) BUTTONS[5].click();
        else if(event.key == 0) BUTTONS[15].click();
        else if(event.key == "+") BUTTONS[14].click();
        else if(event.key == "-") BUTTONS[10].click();
        else if(event.key == "*") BUTTONS[6].click();
        else if(event.key == "/") BUTTONS[2].click();
        else if(event.key == "Enter") BUTTONS[17].click();
        else if(event.key == ",") BUTTONS[16].click();
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
        DISPLAY.innerHTML = num; 
        if(num != 0) numText1 = num;        
    }else if(!operatorOn && (MAX_LENGTH_VALUE >  lengthOnlyNum)){ 
        DISPLAY.innerHTML = (DISPLAY.innerHTML + num);
        numText1 += num;
    }
}

function addNumText2(num){
    let lengthOnlyNum = numText2.replace(/[^0-9]/g, '').length;

    if(numText2 == ""){
        DISPLAY.innerHTML = num; 
        numText2 = num;
    }else if(MAX_LENGTH_VALUE >  lengthOnlyNum){
        if(numText2 == "0" && num != "0" ){
            numText2 = num;
            DISPLAY.innerHTML = num;
        }else{
            DISPLAY.innerHTML = (DISPLAY.innerHTML + num);
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
        if(commaOn) setHighLightingButton(COMMA_BUTTON, false);
        commaOn = false;
        signOn = false;
        if(numText1 == "") numText1 = "0";
    }else doubleOperation(operator);
}

function doubleOperation(operator){
    getResult();
    if(result > MAX_VALUE_RESULT || result < MIN_VALUE_RESULT || result == null) displayError();
    else{
        if(result.toString().includes(".")) result = roundResult(result);
        showResult(result);
        numText1 = result.toString();
        numText2 = "";
        setHighLightingButton(operatorButton, false);
        operatorButton = operator;
        setHighLightingButton(operator, true);
        if(commaOn) setHighLightingButton(COMMA_BUTTON, false);
        commaOn = false;
        signOn = false;        
    }
}

function equals() {
    if(numText2 == "" && !operatorOn) return;
    if(numText2 == "" && operatorOn) displayError();
    else{
        getResult();
        if(result > MAX_VALUE_RESULT || result < MIN_VALUE_RESULT|| result == null) displayError();
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
    let resultText = result.toFixed(MAX_LENGTH_VALUE).replace("-","");
    let integerText = "";
    let decimalText = "0.";
    let decimalOn = false;
    let resultNegative = (result < 0);

    for(i = 0; i < resultText.length; i++){
        if(resultText[i] == ".") decimalOn = true;
            else if(!decimalOn) integerText += resultText[i]; 
            else decimalText += resultText[i]; 
    }
    decimalText = parseFloat(decimalText).toFixed(MAX_LENGTH_VALUE - integerText.length);
    if(resultNegative) result = (parseFloat(integerText) + parseFloat(decimalText)) * -1;
    else result = parseFloat(integerText) + parseFloat(decimalText);
    return result;
}

function showResult(result){
    let resultTextDisplay = result.toString().replace(".",",");
    DISPLAY.innerHTML = resultTextDisplay;
}

function comma(){
    let lengthOnlyNum1 = numText1.replace(/[^0-9]/g, '').length;
    let lengthOnlyNum2 = numText2.replace(/[^0-9]/g, '').length;

    if(!commaOn){
        setHighLightingButton(COMMA_BUTTON, true);
        commaOn = true;
        if(!operatorOn && numText1 == ""){
            result = null;
            signOn = false;
            DISPLAY.innerHTML = "0,";
            numText1 = "0.";
        }else if (operatorOn && numText2 == ""){
            DISPLAY.innerHTML = "0,";
            numText2 = "0.";
        }else if (!operatorOn && (MAX_LENGTH_VALUE >  lengthOnlyNum1)){
            DISPLAY.innerHTML += ","; 
            numText1 += ".";
        }else if(operatorOn && (MAX_LENGTH_VALUE >  lengthOnlyNum2)){
            DISPLAY.innerHTML += ","; 
            numText2 += ".";
        }else{
            setHighLightingButton(COMMA_BUTTON, false);
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
        DISPLAY.innerHTML = "-" + DISPLAY.innerHTML;
        numText1 = "-" + numText1;
        signOn = true;
    }else if(operatorOn && (numText2 != "0" && numText2 != "0.")){
        DISPLAY.innerHTML = "-" + DISPLAY.innerHTML;
        numText2 = "-" + numText2;
        signOn = true;
    } 
}

function setSignPositiveOn(){
    if(!operatorOn && (numText1 != "0" && numText1 != "0.")){
        numText1 = numText1.replace("-","");
        DISPLAY.innerHTML = numText1.replace(".",",");
        signOn = false;
    }else if(operatorOn && (numText2 != "0" && numText2 != "0.")){
        numText2 = numText2.replace("-","");
        DISPLAY.innerHTML = numText2.replace(".",",");
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
    let displayLength = DISPLAY.innerHTML.replace(/[^0-9]/g, '').length;

    if(!disabledError){
        if(commaOn || MAX_LENGTH_VALUE <= displayLength) setDisabledButton(COMMA_BUTTON, true);
        else setDisabledButton(COMMA_BUTTON, false);
        if(DISPLAY.innerHTML == "0" || DISPLAY.innerHTML == "0,") setDisabledButton(SIGN_BUTTON, true);
        else if(operatorOn && numText2 == "") setDisabledButton(SIGN_BUTTON, true);
        else setDisabledButton(SIGN_BUTTON, false);
        if(MAX_LENGTH_VALUE <= displayLength && operatorOn && numText2 == ""){
            BUTTONS.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, false)
            });
        }else if(MAX_LENGTH_VALUE <= displayLength && !operatorOn && numText1 == ""){
            BUTTONS.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, false)
            });
        }else if(MAX_LENGTH_VALUE <= displayLength){
            BUTTONS.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, true)
            });
        }else{
            BUTTONS.forEach(button => {
                if(button.classList.contains("numbers")) setDisabledButton(button, false)
            });
        }
        if(DISPLAY.innerHTML == "0") setDisabledButton(ZERO_BUTTON, true);
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
    disabledError = true;
    DISPLAY.innerHTML = "ERROR";
    BUTTONS.forEach(button => {setDisabledButton(button, true)});
    setDisabledButton(CLEAN_BUTTON, false);
}

function finishOperation() {
    numText1 = "";
    numText2 = "";
    if(operatorOn) setHighLightingButton(operatorButton, false);
    operatorOn = false;
    operatorButton = null;
    if(commaOn) setHighLightingButton(COMMA_BUTTON, false);
    commaOn = false;
    if(result < 0) signOn = true;
    else signOn = false;
}

function reset() {
    finishOperation();
    signOn = false;
    result = null;
    DISPLAY.innerHTML = 0;
    if(disabledError){
        BUTTONS.forEach(button => {setDisabledButton(button, false)});
        disabledError = false;
    }
}