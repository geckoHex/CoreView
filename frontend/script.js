const BASE_URL = "http://127.0.0.1:5000";

async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  const data = await res.json();
  document.getElementById("healthOutput").textContent = JSON.stringify(
    data,
    null,
    2
  );
}

async function sendEcho() {
  const message = document.getElementById("echoMessage").value;
  const res = await fetch(
    `${BASE_URL}/echo?message=${encodeURIComponent(message)}`
  );
  const data = await res.json();
  document.getElementById("echoOutput").textContent = JSON.stringify(
    data,
    null,
    2
  );
}

async function reverseMessage() {
  const message = document.getElementById("reverseMessage").value;
  const res = await fetch(
    `${BASE_URL}/reverse?message=${encodeURIComponent(message)}`
  );
  const data = await res.json();
  document.getElementById("reverseOutput").textContent = JSON.stringify(
    data,
    null,
    2
  );
}

async function addNumbers() {
  const num1 = document.getElementById("num1").value;
  const num2 = document.getElementById("num2").value;
  const res = await fetch(`${BASE_URL}/add?num1=${num1}&num2=${num2}`);
  const data = await res.json();
  document.getElementById("addOutput").textContent = JSON.stringify(
    data,
    null,
    2
  );
}

async function getClock() {
  const res = await fetch(`${BASE_URL}/clock`);
  const data = await res.json();
  document.getElementById("clockOutput").textContent = JSON.stringify(
    data,
    null,
    2
  );
}
