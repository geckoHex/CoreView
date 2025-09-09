const BASE_URL = "http://localhost:5001";

// Default fetch options with credentials
const fetchOptions = {
  credentials: "include"
};

// UI State Management
function showLoginScreen() {
  document.getElementById("loginScreen").style.display = "flex";
  document.getElementById("mainApp").style.display = "none";
}

function showMainApp() {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("mainApp").style.display = "block";
  document.getElementById("mainApp").style.animation = "fadeInApp 0.5s ease-out";
}

// Scroll to section function for sidebar navigation
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

// Login Screen Functions
async function performLogin() {
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;
  const loginError = document.getElementById("loginError");
  const loginButton = document.getElementById("loginButton");
  const btnText = loginButton.querySelector(".btn-text");
  const btnSpinner = loginButton.querySelector(".btn-spinner");
  
  console.log("Login attempt:", { username }); // Debug log (don't log password)
  
  if (!username || !password) {
    loginError.textContent = "Please enter both username and password";
    return;
  }
  
  // Show loading state
  loginButton.disabled = true;
  btnText.style.display = "none";
  btnSpinner.style.display = "flex";
  loginError.textContent = "";
  
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
    
    if (res.ok) {
      console.log("Login successful, switching to main app..."); // Debug log
      // Clear password field
      document.getElementById("loginPassword").value = "";
      // Show main app
      showMainApp();
      // Update account info
      updateAccountInfo(data.user);
    } else {
      console.log("Login failed with status:", res.status); // Debug log
      loginError.textContent = data.error || "Invalid credentials. Please try again.";
    }
  } catch (error) {
    console.error("Login error:", error); // Debug log
    loginError.textContent = "Unable to connect to server. Please try again.";
  } finally {
    // Reset button state
    loginButton.disabled = false;
    btnText.style.display = "inline";
    btnSpinner.style.display = "none";
  }
}

function updateAccountInfo(username) {
  const accountName = document.getElementById("accountName");
  if (accountName) {
    accountName.textContent = username;
  }
}

async function logout() {
  try {
    const res = await fetch(`${BASE_URL}/logout`, {
      method: "POST",
      credentials: "include"
    });
    
    const data = await res.json();
    
    // Clear form fields
    document.getElementById("loginUsername").value = "";
    document.getElementById("loginPassword").value = "";
    
    // Show login screen
    showLoginScreen();
  } catch (error) {
    console.error("Logout error:", error);
    // Even if logout fails, show login screen
    showLoginScreen();
  }
}

async function checkAuthStatus() {
  try {
    console.log("Checking auth status..."); // Debug log
    
    const res = await fetch(`${BASE_URL}/auth`, fetchOptions);
    const data = await res.json();
    
    console.log("Auth status response:", data); // Debug log
    
    if (data.auth) {
      console.log("User is authenticated, showing main app"); // Debug log
      showMainApp();
      updateAccountInfo(data.user);
    } else {
      console.log("User is not authenticated, showing login screen"); // Debug log
      showLoginScreen();
    }
  } catch (error) {
    console.error("Auth status check error:", error); // Debug log
    showLoginScreen();
  }
}

// Check auth status on page load
document.addEventListener("DOMContentLoaded", function() {
  checkAuthStatus();
  
  // Add Enter key support for login form
  document.getElementById("loginUsername").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      performLogin();
    }
  });
  
  document.getElementById("loginPassword").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      performLogin();
    }
  });
});

// API Testing Functions
async function checkHealth() {
  try {
    const res = await fetch(`${BASE_URL}/health`, fetchOptions);
    const data = await res.json();
    
    // Update response output
    document.getElementById("healthOutput").textContent = JSON.stringify(data, null, 2);
    
    // Update status code
    const statusDiv = document.getElementById("healthStatus");
    statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
    statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
  } catch (error) {
    document.getElementById("healthOutput").textContent = `Error: ${error.message}`;
    const statusDiv = document.getElementById("healthStatus");
    statusDiv.textContent = "Network Error";
    statusDiv.className = "status-code status-5xx visible";
  }
}

async function sendEcho() {
  try {
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
  } catch (error) {
    document.getElementById("echoOutput").textContent = `Error: ${error.message}`;
    const statusDiv = document.getElementById("echoStatus");
    statusDiv.textContent = "Network Error";
    statusDiv.className = "status-code status-5xx visible";
  }
}

async function reverseMessage() {
  try {
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
  } catch (error) {
    document.getElementById("reverseOutput").textContent = `Error: ${error.message}`;
    const statusDiv = document.getElementById("reverseStatus");
    statusDiv.textContent = "Network Error";
    statusDiv.className = "status-code status-5xx visible";
  }
}

async function addNumbers() {
  try {
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
  } catch (error) {
    document.getElementById("addOutput").textContent = `Error: ${error.message}`;
    const statusDiv = document.getElementById("addStatus");
    statusDiv.textContent = "Network Error";
    statusDiv.className = "status-code status-5xx visible";
  }
}

async function getClock() {
  try {
    const res = await fetch(`${BASE_URL}/clock`, fetchOptions);
    const data = await res.json();
    
    // Update response output
    document.getElementById("clockOutput").textContent = JSON.stringify(data, null, 2);
    
    // Update status code
    const statusDiv = document.getElementById("clockStatus");
    statusDiv.textContent = `HTTP ${res.status} ${res.statusText}`;
    statusDiv.className = `status-code status-${Math.floor(res.status / 100)}xx visible`;
  } catch (error) {
    document.getElementById("clockOutput").textContent = `Error: ${error.message}`;
    const statusDiv = document.getElementById("clockStatus");
    statusDiv.textContent = "Network Error";
    statusDiv.className = "status-code status-5xx visible";
  }
}
