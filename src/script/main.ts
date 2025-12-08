const people = document.getElementById("people") as HTMLInputElement;
const bill = document.getElementById("bill") as HTMLInputElement;
const tipAmountList: NodeListOf<HTMLInputElement> | [] = document.querySelectorAll("form input[name='tip-amount']");
const tipsInPercentage: NodeListOf<HTMLInputElement> = document.querySelectorAll(".tip-fixed");
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

customTip.addEventListener("beforeinput", (e: InputEvent) => {
  const inputTipValue: string | null = e.data;
  const currentTip = customTip.value;

  if (!inputTipValue) return;
  if (e.inputType.startsWith("delete")) return;

  if (e.inputType === "insertFromPaste") {
    if (parseFloat(inputTipValue).toFixed(2)) return;
  }

  if (/[,.]/.test(inputTipValue) && currentTip.includes(".")) {
    e.preventDefault();
  }

  if (
    !currentTip.includes(".") && currentTip.length === 3 && !/[,.]/.test(inputTipValue)) {
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
  let tipAmount = customTip.value.replace(/,/, ".");

  if (tipAmount.includes(".")) {
    const index = Array.from(tipAmount).findIndex((el) => el === ".");
    tipAmount =
      parseInt(tipAmount.substring(0, index)).toString() +
      tipAmount.substring(index, tipAmount.length);
  } else {
    tipAmount = parseInt(tipAmount).toString();
  }

  const calculatedTip: number = parseFloat(tipAmount);

  const stringValue = calculatedTip >= 0 ? tipAmount : "";

  customTip.value = stringValue;

  tips = calculatedTip;

  if (!customTip.value || customTip.value === "0.00") {
    showError("tip", "Can't be zero");
  } else {
    clearError(["tip"]);
  }
});

let tipSelected = (tip: HTMLInputElement) => {
  tip.addEventListener("click", (e: MouseEvent) => {
    if (tip.id === "tip") {
      tipsInPercentage.forEach((tip) => (tip.checked = false));
    } else {
      customTip.value = "";
      clearError(["tip"]);
      tips = (parseFloat(bill.value) * parseInt(tip.value)) / 100;
    }
  });
};

tipAmountList.forEach((item: HTMLInputElement) => tipSelected(item));

bill.addEventListener("beforeinput", (e: InputEvent) => {
  const inputValue: string | null = e.data;
  const current = bill.value;

  if (!inputValue) return;
  if (e.inputType.startsWith("delete")) return;
  if (e.inputType === "insertFromPaste") {
    if (parseFloat(inputValue).toFixed(2)) return;
  }

  if (/[,.]/.test(inputValue) && current.includes(".")) {
    e.preventDefault();
  }

  if (
    !current.includes(".") && current.length === 6 && !/[,.]/.test(inputValue)) {
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
  if (input.includes(".")) {
    const index = Array.from(input).findIndex((el) => el === ".");
    input =
      parseInt(input.substring(0, index)).toString() +
      input.substring(index, input.length);
  } else {
    input = parseInt(input).toString();
  }

  const billValue = parseFloat(input);
  const stringValue = billValue >= 0 ? input : "";

  bill.value = stringValue;
  totalBill = billValue;

  if (!bill.value || bill.value === "0.00") {
    showError("bill", "Can't be zero");
  } else {
    clearError(["bill"]);
  }
});

function valueToFloat(i: HTMLInputElement) {
  i.addEventListener("focusout", () => {
    i.value ? parseFloat(i.value).toFixed(2) : "";
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
  const integerValue = parseInt(people.value);
  const stringValue = integerValue >= 0 ? integerValue.toString() : "";
  people.value = stringValue;
  totalPeople = parseInt(people.value);

  if (!people.value || people.value === "0") {
    showError("people", "Can't be zero");
  } else {
    clearError(["people"]);
  }
});

function result(e: Event) {
  e.preventDefault();

  if (totalBill && tips && totalPeople) {
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

resetBtn.addEventListener("click", (e: Event) => {
  e.preventDefault();
  clearInputs();
  resetBtn.disabled = true;
});
