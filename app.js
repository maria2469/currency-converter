const BASE_URL = "https://api.currencyapi.com/v3/latest";
const API_KEY = "cur_live_Ovm3Erjsl4Y8YJGbOyUzizdpwMipalx5gJ3Oh9pq";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


// Populate the dropdowns with currency codes
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag images
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch and update exchange rate
const updateExchangeRate = async (initial = false) => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  // Default values for initial load
  let fromValue = initial ? "USD" : fromCurr.value;
  let toValue = initial ? "PKR" : toCurr.value;

  const URL = `${BASE_URL}?apikey=${API_KEY}`;
  let response = await fetch(URL);
  let data = await response.json();
  let conversionRates = data.data;

  if (conversionRates[fromValue] && conversionRates[toValue]) {
    let fromRate = conversionRates[fromValue].value;
    let toRate = conversionRates[toValue].value;
    let rate = toRate / fromRate;

    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromValue} = ${finalAmount.toFixed(2)} ${toValue}`;
  } else {
    msg.innerText = "Conversion rate not available.";
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate(true); // Pass true for initial load
});
