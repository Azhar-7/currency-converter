const BASE_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let opt = document.createElement("option");
    opt.value = currCode;
    opt.innerText = currCode;
    if (select.name === "from" && currCode === "USD") opt.selected = true;
    if (select.name === "to" && currCode === "INR") opt.selected = true;
    select.append(opt);
  }
  select.addEventListener("change", evt => updateFlag(evt.target));
}

const updateExchangeRate = async () => {
  let amtInput = document.querySelector(".amount input");
  let amt = amtInput.value;
  if (!amt || amt < 1) {
    amt = 1;
    amtInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  const URL = `${BASE_URL}/${from}.min.json`;
  console.log("Fetching:", URL); // debug

  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();

    if (!data[from] || data[from][to] === undefined) {
      throw new Error("Currency pair not found");
    }

    const rate = data[from][to];
    const result = (amt * rate).toFixed(2);

    msg.innerText = `${amt} ${fromCurr.value} = ${result} ${toCurr.value}`;
  } catch (err) {
    console.error("Fetch error:", err);
    msg.innerText = "Error fetching exchange rate. Try again later.";
  }
};

const updateFlag = element => {
  const countryCode = countryList[element.value];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

btn.addEventListener("click", e => {
  e.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
