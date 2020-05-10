// ==UserScript==
// @name         Calcular Dinero hecho en Ventas (ML)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL    https://github.com/randomperson190/CalcularDineroVentasML/edit/master/Script.js
// @downloadURL  https://github.com/randomperson190/CalcularDineroVentasML/edit/master/Script.js
// @description  try to take over the world!
// @author       You
// @match        https://articulo.mercadolibre.com.ar/MLA-*
// @grant        none
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// ==/UserScript==

///////////////////////////////////////////////
///////////////////////////////////////////////

// @@@@@@@@@@@@@@@@@@@@@@@@@@
// @@@ External functions @@@
// @@@@@@@@@@@@@@@@@@@@@@@@@@

function addPointsToNumber(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function addDolarSignToNumber(number) {
    number = "$"+number;
    return number;
}

function insertAfter(referenceNode, newNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

///////////////////////////////////////////////
///////////////////////////////////////////////

// @@@@@@@@@@@@@@@@@@@@
// @@@ My functions @@@
// @@@@@@@@@@@@@@@@@@@@

function getAndCleanSoldQuantity() {
    var soldQuantity = document.querySelector(".item-conditions").innerText;
    if (soldQuantity == "Usado" || soldQuantity == "Nuevo") {
        return false;
    }
    soldQuantity = soldQuantity.replace(" ","").replace("vendidos","").replace("vendido","");
    soldQuantity = soldQuantity.replace("Nuevo","").replace("Usado","").replace(" ","").replace("-","");
    soldQuantity = parseInt(soldQuantity);
    return soldQuantity;
}

function getAndCleanPrice() {
    var price = document.querySelector(".price-tag-fraction")[1];
    if (price == NaN || price == undefined) {
        //price = document.querySelector(".price-tag-fraction")[0];
        price = document.querySelector(".item-price").querySelectorAll(".price-tag")[0].innerText
        //price = document.querySelector(".item-price").querySelectorAll(".price-tag")[1].innerText.replace("$","").replace("/unidad","").replace("\r","").replace("\n","").replace("\n","")
    }
    price = price.replace("$","").replace("/unidad","").replace("\r","").replace("\n","").replace("\n","");
    price = price.replace(".", ",");
    price = price.replace(",", "");
    price = price.replace(",", "");
    price = parseInt(price);
    return price;
}

function calculateIncome(soldQuantity, price) {
    var income = soldQuantity * price;
    income = addPointsToNumber(income);
    income = addDolarSignToNumber(income);
    return income;
}

function addIncomeResultNextToSoldQuantity(income) {
    document.querySelector(".item-conditions").append("\r");
    document.querySelector(".item-conditions").append("Ganancia en Ventas: ");
    document.querySelector(".item-conditions").append(income);
}

function rewriteOriginalSoldQuantityText(soldQuantity) {
    document.querySelector(".item-conditions").innerText = "";
    document.querySelector(".item-conditions").innerText = "Ventas realizadas: ";
    document.querySelector(".item-conditions").append(soldQuantity);
}

///////////////////////////////////////////////
///////////////////////////////////////////////

// ### Get clean numbers ###
var soldQuantity = getAndCleanSoldQuantity();
if (soldQuantity == false) {
    return;
}
var price = getAndCleanPrice()
// ### Calculate income ###
var income = calculateIncome(soldQuantity, price);
// ### Realizar cambios pertinentes ###
var el = document.createElement("div");
el.innerHTML = "Ganancia en Ventas: " + income;
el.style.color = "#666";
el.style.fontSize = "14px";
el.style.lineHeight = "1";
var div = document.getElementsByClassName('item-conditions')[0];
insertAfter(div, el);
document.getElementsByClassName('item-conditions')[0].style.marginBottom = "2px";
document.getElementsByClassName('item-conditions')[0].innerText = "Cantidad Vendida: " + soldQuantity;
// ### Printear resultado ###
console.log("Ganancia en Ventas: " + income);
