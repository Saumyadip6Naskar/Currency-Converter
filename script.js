const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const convertBtn = document.getElementById("convertBtn");
const result = document.getElementById("result");
const amountInput = document.getElementById("amountInput");

// Fetch currency list
async function loadCurrencies() {
  try {
    const res = await fetch("https://api.exchangerate-api.com/v4/latest/USD");
    if (!res.ok) throw new Error("Failed to fetch currency list");
    const data = await res.json();

    const currencies = Object.keys(data.rates);

    currencies.forEach(curr => {
      let option1 = document.createElement("option");
      let option2 = document.createElement("option");

      option1.value = option1.text = curr;
      option2.value = option2.text = curr;

      fromCurrency.add(option1);
      toCurrency.add(option2);
    });

    // Default values
    fromCurrency.value = "USD";
    toCurrency.value = "INR";
  } catch (error) {
    result.innerText = "⚠ Unable to load currency list. Please try again later.";
    console.error(error);
  }
}

loadCurrencies();

// Conversion function
convertBtn.addEventListener("click", async () => {
  let amount = amountInput.value;

  if (amount === "" || amount <= 0) {
    result.innerText = "⚠ Please enter a valid positive amount.";
    return;
  }

  try {
    const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency.value}`);
    if (!res.ok) throw new Error("Failed to fetch conversion rate");

    const data = await res.json();
    let rate = data.rates[toCurrency.value];

    if (!rate) {
      result.innerText = `⚠ Conversion rate not available for ${toCurrency.value}.`;
      return;
    }

    let converted = (amount * rate).toFixed(2);
    result.innerText = `${amount} ${fromCurrency.value} = ${converted} ${toCurrency.value}`;
  } catch (error) {
    result.innerText = "⚠ Conversion failed. Please check your internet connection.";
    console.error(error);
  }
});
