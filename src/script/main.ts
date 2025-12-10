const people = document.getElementById("people") as HTMLInputElement;
const bill = document.getElementById("bill") as HTMLInputElement;
const tipAmountList: NodeListOf<HTMLInputElement> | [] = document.querySelectorAll("form input[name='tip-amount']");
const tipsInPercentage: NodeListOf<HTMLInputElement> | [] = document.querySelectorAll(".tip-fixed");
const customTip = document.getElementById("tip") as HTMLInputElement;
const billSplitterForm = document.getElementById("bill-splitter") as HTMLFormElement;
const totalTipPerPerson = document.getElementById("tip-total") as HTMLOutputElement;
const totalPerPerson = document.getElementById("total-perPerson") as HTMLOutputElement;
const resetBtn = document.getElementById("reset-btn") as HTMLButtonElement;

let tips: number = 0;
let totalBill: number = 0;
let totalPeople: number = 0;

function showError(inputElementId: string, errorMessage: string): void {
  const errorMsg = document.getElementById(inputElementId + "-error") as HTMLElement;
  errorMsg.classList.remove("sr-only");
  errorMsg.textContent = errorMessage;

  const input = document.getElementById(inputElementId) as HTMLInputElement;
  input.classList.remove("focus:outline-green-400");
  input.classList.add("focus:outline-orange-400");
}

function clearError(elementIds: string[]): void {
  elementIds.forEach(inputElementId => {
    const errorMsg = document.getElementById(inputElementId + "-error") as HTMLElement;
    errorMsg.classList.add("sr-only");
    errorMsg.textContent = "";

    const input = document.getElementById(inputElementId) as HTMLInputElement;
    input.classList.remove("focus:outline-orange-400");
    input.classList.add("focus:outline-green-400");
  })
}

function checkingValue(e:InputEvent) {
  const input: string | null = e.data;
  const element = e.currentTarget as HTMLInputElement;
  const current: string = element.value;

  if (!input) return;
  if (e.inputType.startsWith("delete")) return;
  
  if (e.inputType === "insertFromPaste") {
    if (!input || !/^\d+(\.\d{0,2})?$/.test(input)) {
      e.preventDefault();
    }
    return;
  }

  if (!input || !/[\d,.]/.test(input)) {
    e.preventDefault();
    return;
  }

  // Check if bill value less 1000000
  const elementId = element.getAttribute("id");
  if ( elementId === "bill" && !current.includes(".") && current.length === 6 && !/[,.]/.test(input)) {
    e.preventDefault();
    return;
  }

  // Check tips value less 100%
  if ( elementId === "tip" && parseFloat(current + input) > 100) {
    e.preventDefault();
    return;
  }

  if ((input === "." && current.includes(".")) || (input === "," && current.includes("."))) {
    e.preventDefault();
    return;
  }

  const selectionStart: number = element.selectionStart || 0;
  const selectionEnd: number = element.selectionEnd || 0;
  const newValue: string = 
    current.slice(0, selectionStart) + input + current.slice(selectionEnd);

  if (!/^\d+([,.]\d{0,2})?$/.test(newValue)) {
    e.preventDefault();
  }

}

function displayInputAsFloat(input: string): string {
  if (input.includes(".")) {
    const index: number = Array.from(input).findIndex((el) => el === ".");
    return parseInt(input.substring(0, index)).toString() +
      input.substring(index, input.length);
  } else {
    return parseInt(input).toString();
  }
}

[customTip, bill].forEach(el => el.addEventListener("beforeinput", checkingValue));

customTip.addEventListener("input", (e) => {
  let tipInput: string = customTip.value.replace(/,/, ".");
  tipInput = displayInputAsFloat(tipInput);
  customTip.value = parseFloat(tipInput) >= 0 ? tipInput : "";
});

const tipSelected = (tipBtn: HTMLInputElement) => {
  tipBtn.addEventListener("click", () => {
    if (tipBtn.id === "tip") {
      tipsInPercentage.forEach((tipFixed) => (tipFixed.checked = false));
    } else {
      customTip.value = "";
    }
  });
};

tipAmountList.forEach((tipBtn: HTMLInputElement) => tipSelected(tipBtn));

bill.addEventListener("input", () => {
  let input: string = bill.value.replace(/,/, ".");
  input = displayInputAsFloat(input);
  bill.value = parseFloat(input) >= 0 ? input : "";

  if (!bill.value || parseFloat(bill.value) === 0) {
    showError("bill", "Can't be zero");
  } else {
    clearError(["bill"]);
  }
});

function valueToFloat(i: HTMLInputElement) {
  i.addEventListener("focusout", () => {
    i.value = i.value ? parseFloat(i.value).toFixed(2) : "";
  });
}

[bill, customTip].forEach(valueToFloat);

people.addEventListener("beforeinput", (e: InputEvent) => {
  const input: string | null = e.data;

  if (!input) return;
  if (e.inputType.startsWith("delete")) return;
  if (e.inputType === "insertFromPaste") {
    if (/^[1-9]\d*$/.test(input)) return;
  }

  if (!/[0-9]/.test(input)) {
    e.preventDefault();
  }
});

people.addEventListener("input", () => {
  const integerValue: number = parseInt(people.value);
  people.value = integerValue >= 0 ? integerValue.toString() : "";

  if (!people.value || people.value === "0") {
    showError("people", "Can't be zero");
  } else {
    clearError(["people"]);
  }
});

function result(e: Event) {
  e.preventDefault();

  totalBill = parseFloat(bill.value);
  totalPeople = parseInt(people.value);

  const selectedTip = billSplitterForm.elements.namedItem("tip-amount") as RadioNodeList;

  const tipAmount: number = customTip.value ? parseFloat(customTip.value) : parseFloat(selectedTip.value);
  tips = tipAmount ? tipAmount * totalBill / 100 : 0;

  if (totalBill && totalPeople) {

    totalTipPerPerson.value = (tips / totalPeople).toFixed(2);
    totalPerPerson.value = ((totalBill + tips) / totalPeople).toFixed(2);

    resetBtn.removeAttribute("disabled");
  } else {
    clearOutputs();
  }
}

billSplitterForm.addEventListener("input", result);

function clearInputs() {
  billSplitterForm.reset();

  totalBill = 0;
  tips = 0;
  totalPeople = 0;

  clearError(["bill", "people"]);
}

function clearOutputs() {
  totalTipPerPerson.value = "0.00";
  totalPerPerson.textContent = "0.00";

  resetBtn.disabled = true;
}

resetBtn.addEventListener("click", (e: PointerEvent) => {
  e.preventDefault();
  clearInputs();
  clearOutputs();
});
