const BASE_URL = "http://127.0.0.1:5000";

async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  const data = await res.json();
  
  // Update response output
  document.getElementById("healthOutput").textContent = JSON.stringify(data, null, 2);
  
  // Update status code
  const statusDiv = document.getElementById("healthStatus");
  statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
  statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
}

async function sendEcho() {
  const message = document.getElementById("echoMessage").value;
  const res = await fetch(
    `${BASE_URL}/echo?message=${encodeURIComponent(message)}`
  );
  const data = await res.json();
  
  // Update response output
  document.getElementById("echoOutput").textContent = JSON.stringify(data, null, 2);
  
  // Update status code
  const statusDiv = document.getElementById("echoStatus");
  statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
  statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
}

async function reverseMessage() {
  const message = document.getElementById("reverseMessage").value;
  const res = await fetch(
    `${BASE_URL}/reverse?message=${encodeURIComponent(message)}`
  );
  const data = await res.json();
  
  // Update response output
  document.getElementById("reverseOutput").textContent = JSON.stringify(data, null, 2);
  
  // Update status code
  const statusDiv = document.getElementById("reverseStatus");
  statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
  statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
}

async function addNumbers() {
  const num1 = document.getElementById("num1").value;
  const num2 = document.getElementById("num2").value;
  const res = await fetch(`${BASE_URL}/add?num1=${num1}&num2=${num2}`);
  const data = await res.json();
  
  // Update response output
  document.getElementById("addOutput").textContent = JSON.stringify(data, null, 2);
  
  // Update status code
  const statusDiv = document.getElementById("addStatus");
  statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
  statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
}

async function getClock() {
  const res = await fetch(`${BASE_URL}/clock`);
  const data = await res.json();
  
  // Update response output
  document.getElementById("clockOutput").textContent = JSON.stringify(data, null, 2);
  
  // Update status code
  const statusDiv = document.getElementById("clockStatus");
  statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
  statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
}
