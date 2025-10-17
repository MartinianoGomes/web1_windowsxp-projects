const form = document.querySelector("form");
const amount = document.getElementById("amount");
const expense = document.getElementById("expense");
const category = document.getElementById("category");
const expenseList = document.querySelector("ul");
const totalDisplay = document.querySelector("aside h2");
const counterDisplay = document.querySelector("aside header span");

let expenses = [];

amount.oninput = () => {
  let value = amount.value.replace(/\D/g, "");
  value = Number(value) / 100;
  amount.value = formatCurrencyBR(value);
};

function formatCurrencyBR(value) {
  if (typeof value === "string") {
    value = Number(value.replace(/\D/g, "")) / 100;
  }
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

form.onsubmit = (event) => {
  event.preventDefault();

  const newExpense = {
    id: new Date().getTime(),
    expense: expense.value.trim(),
    category_id: category.value,
    category_name: category.options[category.selectedIndex].text,
    amount: Number(amount.value.replace(/\D/g, "")) / 100,
    createdAt: new Date(),
  };

  if (!newExpense.expense || !newExpense.category_id || !newExpense.amount) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  expenses.push(newExpense);
  renderExpenses();
  form.reset();
};

function renderExpenses() {
  expenseList.innerHTML = "";

  let total = 0;

  for (const item of expenses) {
    const expenseItem = document.createElement("li");
    expenseItem.classList.add("expense");

    const expenseIcon = document.createElement("img");
    expenseIcon.setAttribute("src", `img/${item.category_id}.svg`);
    expenseIcon.setAttribute("alt", item.category_name);

    const expenseInfo = document.createElement("div");
    expenseInfo.classList.add("expense-info");

    const expenseName = document.createElement("strong");
    expenseName.textContent = item.expense;

    const expenseCategory = document.createElement("span");
    expenseCategory.textContent = item.category_name;

    const expenseValue = document.createElement("span");
    expenseValue.classList.add("expense-amount");
    expenseValue.textContent = formatCurrencyBR(item.amount);

    const expenseDelete = document.createElement("img");
    expenseDelete.setAttribute("src", "img/remove.svg");
    expenseDelete.setAttribute("alt", "Remover despesa");
    expenseDelete.classList.add("remove-icon");
    expenseDelete.onclick = () => {
      expenses = expenses.filter((e) => e.id !== item.id);
      renderExpenses();
    };

    expenseInfo.append(expenseName, expenseCategory);
    expenseItem.append(expenseIcon, expenseInfo, expenseValue, expenseDelete);
    expenseList.append(expenseItem);

    total += item.amount;
  }

  counterDisplay.textContent = `${expenses.length} despesas`;
  totalDisplay.innerHTML = `<small>R$</small>${total
    .toFixed(2)
    .replace(".", ",")}`;
}