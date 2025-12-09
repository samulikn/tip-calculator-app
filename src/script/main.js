const people = document.getElementById("people");
const bill = document.getElementById("bill");
const tipAmountList = document.querySelectorAll("form input[name='tip-amount']");
const tipsInPercentage = document.querySelectorAll(".tip-fixed");
const customTip = document.getElementById("tip");
const billSplitterForm = document.getElementById("bill-splitter");
const totalTipPerPerson = document.getElementById("tip-total");
const totalPerPerson = document.getElementById("total-perPerson");
const resetBtn = document.getElementById("reset-btn");
let tips = 0;
let totalBill = 0;
let totalPeople = 0;
function showError(inputElementId, errorMessage) {
    const errorMsg = document.getElementById(inputElementId + "-error");
    errorMsg.classList.remove("sr-only");
    errorMsg.textContent = errorMessage;
    const input = document.getElementById(inputElementId);
    input.classList.remove("focus:outline-green-400");
    input.classList.add("focus:outline-orange-400");
}
function clearError(elementIds) {
    elementIds.forEach(inputElementId => {
        const errorMsg = document.getElementById(inputElementId + "-error");
        errorMsg.classList.add("sr-only");
        errorMsg.textContent = "";
        const input = document.getElementById(inputElementId);
        input.classList.remove("focus:outline-orange-400");
        input.classList.add("focus:outline-green-400");
    });
}
function convertingToFloatString(input) {
    if (input.includes(".")) {
        const index = Array.from(input).findIndex((el) => el === ".");
        return parseInt(input.substring(0, index)).toString() +
            input.substring(index, input.length);
    }
    else {
        return parseInt(input).toString();
    }
}
customTip.addEventListener("beforeinput", (e) => {
    const inputTipValue = e.data;
    const currentTip = customTip.value;
    if (!inputTipValue)
        return;
    if (e.inputType.startsWith("delete"))
        return;
    if (e.inputType === "insertFromPaste") {
        if (parseFloat(inputTipValue).toFixed(2))
            return;
    }
    if (/[,.]/.test(inputTipValue) && currentTip.includes(".")) {
        e.preventDefault();
    }
    if (!currentTip.includes(".") && currentTip.length === 3 && !/[,.]/.test(inputTipValue)) {
        e.preventDefault();
    }
    if (!/[\d,.]/.test(inputTipValue)) {
        e.preventDefault();
    }
    if (/^\d+\.\d{2}$/.test(currentTip) && inputTipValue) {
        e.preventDefault();
    }
});
customTip.addEventListener("input", () => {
    let tipInput = customTip.value.replace(/,/, ".");
    tipInput = convertingToFloatString(tipInput);
    customTip.value = parseFloat(tipInput) >= 0 ? tipInput : "";
    if (!customTip.value || parseFloat(customTip.value) === 0) {
        showError("tip", "Can't be zero");
    }
    else {
        clearError(["tip"]);
    }
});
let tipSelected = (tip) => {
    tip.addEventListener("click", (e) => {
        if (tip.id === "tip") {
            tipsInPercentage.forEach((tip) => (tip.checked = false));
        }
        else {
            customTip.value = "";
            clearError(["tip"]);
        }
    });
};
tipAmountList.forEach((item) => tipSelected(item));
bill.addEventListener("beforeinput", (e) => {
    const inputValue = e.data;
    const current = bill.value;
    if (!inputValue)
        return;
    if (e.inputType.startsWith("delete"))
        return;
    if (e.inputType === "insertFromPaste") {
        if (parseFloat(inputValue).toFixed(2))
            return;
    }
    if (/[,.]/.test(inputValue) && current.includes(".")) {
        e.preventDefault();
    }
    if (!current.includes(".") && current.length === 6 && !/[,.]/.test(inputValue)) {
        e.preventDefault();
    }
    if (!/[\d,.]/.test(inputValue)) {
        e.preventDefault();
    }
    if (/^\d+\.\d{2}$/.test(current) && inputValue) {
        e.preventDefault();
    }
});
bill.addEventListener("input", () => {
    let input = bill.value.replace(/,/, ".");
    input = convertingToFloatString(input);
    bill.value = parseFloat(input) >= 0 ? input : "";
    if (!bill.value || parseFloat(bill.value) === 0) {
        showError("bill", "Can't be zero");
    }
    else {
        clearError(["bill"]);
    }
});
function valueToFloat(i) {
    i.addEventListener("focusout", () => {
        i.value = i.value ? parseFloat(i.value).toFixed(2) : "";
    });
}
[bill, customTip].forEach(valueToFloat);
people.addEventListener("beforeinput", (e) => {
    const input = e.data;
    if (!input)
        return;
    if (e.inputType.startsWith("delete"))
        return;
    if (e.inputType === "insertFromPaste") {
        if (/^[1-9]\d*$/.test(input))
            return;
    }
    if (!/[0-9]/.test(input)) {
        e.preventDefault();
    }
});
people.addEventListener("input", () => {
    const integerValue = parseInt(people.value);
    people.value = integerValue >= 0 ? integerValue.toString() : "";
    if (!people.value || people.value === "0") {
        showError("people", "Can't be zero");
    }
    else {
        clearError(["people"]);
    }
});
function result(e) {
    e.preventDefault();
    const selectedTip = billSplitterForm.elements.namedItem("tip-amount");
    const tipAmount = customTip.value ? parseFloat(customTip.value) : parseInt(selectedTip.value) * parseFloat(bill.value) / 100;
    tips = tipAmount ? tipAmount : 0;
    totalBill = parseFloat(bill.value);
    totalPeople = parseInt(people.value);
    if (totalBill && totalPeople) {
        totalTipPerPerson.value = (tips / totalPeople).toFixed(2);
        totalPerPerson.value = ((totalBill + tips) / totalPeople).toFixed(2);
        resetBtn.removeAttribute("disabled");
    }
}
billSplitterForm.addEventListener("input", result);
function clearInputs() {
    billSplitterForm.reset();
    totalBill = 0;
    tips = 0;
    totalPeople = 0;
    totalTipPerPerson.value = "0.00";
    totalPerPerson.textContent = "0.00";
    clearError(["bill", "tip", "people"]);
}
resetBtn.addEventListener("click", (e) => {
    e.preventDefault();
    clearInputs();
    resetBtn.disabled = true;
});
export {};
//# sourceMappingURL=main.js.map