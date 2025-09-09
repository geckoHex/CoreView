const BASE_URL = "http://localhost:5001";

// Default fetch options with credentials
const fetchOptions = {
  credentials: "include"
};

// Authentication functions
async function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  
  console.log("Login attempt:", { username, password }); // Debug log
  
  if (!username || !password) {
    document.getElementById("authOutput").textContent = "Please enter both username and password";
    return;
  }
  
  try {
    console.log("Sending login request to:", `${BASE_URL}/login`); // Debug log
    
    const res = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify({ username, password })
    });
    
    console.log("Login response status:", res.status); // Debug log
    
    const data = await res.json();
    console.log("Login response data:", data); // Debug log
    
    document.getElementById("authOutput").textContent = JSON.stringify(data, null, 2);
    
    if (res.ok) {
      console.log("Login successful, checking auth status..."); // Debug log
      // Clear password field
      document.getElementById("password").value = "";
      checkAuthStatus(); // Update UI
    } else {
      console.log("Login failed with status:", res.status); // Debug log
    }
  } catch (error) {
    console.error("Login error:", error); // Debug log
    document.getElementById("authOutput").textContent = `Error: ${error.message}`;
  }
}

async function logout() {
  try {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });
    
    const data = await res.json();
    document.getElementById("authOutput").textContent = JSON.stringify(data, null, 2);
    
    // Clear form fields
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    
    checkAuthStatus(); // Update UI
  } catch (error) {
    document.getElementById("authOutput").textContent = `Error: ${error.message}`;
  }
}

async function checkAuthStatus() {
  try {
    console.log("Checking auth status..."); // Debug log
    
    const res = await fetch(`${BASE_URL}/auth`, fetchOptions);
    const data = await res.json();
    
    console.log("Auth status response:", data); // Debug log
    
    const authSection = document.getElementById("authSection");
    const mainSections = document.getElementById("mainSections");
    
    if (data.auth) {
      console.log("User is authenticated, showing main sections"); // Debug log
      document.getElementById("authOutput").textContent = `Logged in as: ${data.user}`;
      authSection.style.display = "block";
      mainSections.style.display = "block";
      document.getElementById("loginForm").style.display = "none";
      document.getElementById("logoutButton").style.display = "block";
    } else {
      console.log("User is not authenticated, showing login form"); // Debug log
      document.getElementById("authOutput").textContent = "Not logged in";
      authSection.style.display = "block";
      mainSections.style.display = "none";
      document.getElementById("loginForm").style.display = "block";
      document.getElementById("logoutButton").style.display = "none";
    }
  } catch (error) {
    console.error("Auth status check error:", error); // Debug log
    document.getElementById("authOutput").textContent = `Error checking auth: ${error.message}`;
  }
}

// Check auth status on page load
document.addEventListener("DOMContentLoaded", checkAuthStatus);

async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`, fetchOptions);
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
    `${BASE_URL}/echo?message=${encodeURIComponent(message)}`,
    fetchOptions
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
    `${BASE_URL}/reverse?message=${encodeURIComponent(message)}`,
    fetchOptions
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
  const res = await fetch(`${BASE_URL}/add?num1=${num1}&num2=${num2}`, fetchOptions);
  const data = await res.json();
  
  // Update response output
  document.getElementById("addOutput").textContent = JSON.stringify(data, null, 2);
  
  // Update status code
  const statusDiv = document.getElementById("addStatus");
  statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
  statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
}

async function getClock() {
  const res = await fetch(`${BASE_URL}/clock`, fetchOptions);
  const data = await res.json();
  
  // Update response output
  document.getElementById("clockOutput").textContent = JSON.stringify(data, null, 2);
  
  // Update status code
  const statusDiv = document.getElementById("clockStatus");
  statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
  statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
}
