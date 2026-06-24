if (localStorage.getItem("isLoggedIn") === "true") {
  window.location.href = "main.html";
}

const form = document.getElementById("login-form");
const errorBox = document.getElementById("error");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  
  if (!username || !password) {
    errorBox.textContent = "Please fill in both fields.";
    return;
  }

 
  if (username === "admin" && password === "admin123") {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "main.html";
  } else {
    errorBox.textContent = "Invalid username or password.";
  }
});
