if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "index.html";
}


const issuesBox = document.getElementById("issues");
const spinner = document.getElementById("spinner");
const empty = document.getElementById("empty");
const tabs = document.querySelectorAll(".tab");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modal-body");

let allIssues = [];  
let currentTab = "all";


function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US");
}


function labelClass(label) {
  return label.toLowerCase().replace(/\s+/g, "-");
}


function statusIcon(status) {
  return status === "open"
    ? "assets/Open-Status.png"
    : "assets/Closed- Status .png";
}


function showSpinner(show) {
  spinner.classList.toggle("hidden", !show);
  if (show) { issuesBox.innerHTML = ""; empty.classList.add("hidden"); }
}


function updateSummary() {
  const open = allIssues.filter((i) => i.status === "open").length;
  const closed = allIssues.filter((i) => i.status === "closed").length;
  document.getElementById("open-count").textContent = open;
  document.getElementById("closed-count").textContent = closed;
  document.getElementById("summary-text").textContent =
    `${allIssues.length} issues total`;
}


function cardTemplate(issue) {
  const labels = issue.labels
    .map((l) => `<span class="label ${labelClass(l)}">${l}</span>`)
    .join("");

  return `
    <article class="card ${issue.status}" data-id="${issue.id}">
      <div class="card-top">
        <img class="status-icon" src="${statusIcon(issue.status)}" alt="${issue.status}" />
        <span class="priority ${issue.priority}">${issue.priority}</span>
      </div>
      <h3>${issue.title}</h3>
      <p class="desc">${issue.description}</p>
      <div class="labels">${labels}</div>
      <div class="card-foot">
        <span>#${issue.id} by ${issue.author}</span>
        <span>${formatDate(issue.createdAt)}</span>
      </div>
    </article>`;
}