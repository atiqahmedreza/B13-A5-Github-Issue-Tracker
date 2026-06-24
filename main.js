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



function renderIssues(list) {
  if (!list || list.length === 0) {
    issuesBox.innerHTML = "";
    empty.classList.remove("hidden");
    return;
  }
  empty.classList.add("hidden");
  issuesBox.innerHTML = list.map(cardTemplate).join("");

  
  document.querySelectorAll(".card").forEach((card) => {
    card.addEventListener("click", () => openModal(card.dataset.id));
  });
}


function applyTab() {
  let list = allIssues;
  if (currentTab !== "all") {
    list = allIssues.filter((i) => i.status === currentTab);
  }
  renderIssues(list);
}


async function loadIssues() {
  showSpinner(true);
  try {
    allIssues = await getAllIssues(); 
    updateSummary();
    applyTab();
  } catch (err) {
    empty.textContent = "Failed to load issues. Try again.";
    empty.classList.remove("hidden");
  } finally {
    showSpinner(false);
  }
}


function renderModal(issue) {
  const labels = issue.labels.map((l) => `<span class="label ${labelClass(l)}">${l}</span>`).join("");
  modalBody.innerHTML = `
    <div class="modal-body">
      <span class="badge ${issue.status}">${issue.status}</span>
      <h2>${issue.title}</h2>
      <p>${issue.description}</p>
      <div class="labels">${labels}</div>
      <p class="row">Author: <b>${issue.author}</b></p>
      <p class="row">Assignee: <b>${issue.assignee || "Unassigned"}</b></p>
      <p class="row">Priority: <b>${issue.priority}</b></p>
      <p class="row">Created: <b>${formatDate(issue.createdAt)}</b></p>
      <p class="row">Updated: <b>${formatDate(issue.updatedAt)}</b></p>
    </div>`;
}


async function openModal(id) {
  modal.classList.remove("hidden");

  
  const local = allIssues.find((i) => String(i.id) === String(id) && i._local);
  if (local) { renderModal(local); return; }

  modalBody.innerHTML = '<div class="spinner"><div class="loader"></div></div>';
  try {
    renderModal(await getIssueById(id));
  } catch (err) {
    modalBody.innerHTML = "<p>Failed to load issue details.</p>";
  }
}

function closeModal() {
  modal.classList.add("hidden");
}



tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    currentTab = tab.dataset.tab;
    searchInput.value = "";
    applyTab();
  });
});


async function doSearch() {
  const q = searchInput.value.trim();
  if (!q) { applyTab(); return; }  
  showSpinner(true);
  try {
    const results = await searchIssues(q);
    renderIssues(results);
  } catch (err) {
    empty.textContent = "Search failed.";
    empty.classList.remove("hidden");
  } finally {
    showSpinner(false);
  }
}
searchBtn.addEventListener("click", doSearch);
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") doSearch();
});


document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();   
});


const newModal = document.getElementById("new-modal");
const newForm = document.getElementById("new-form");
let nextId = 1000; 

document.getElementById("new-btn").addEventListener("click", () => {
  newModal.classList.remove("hidden");
});
document.getElementById("new-close").addEventListener("click", () => {
  newModal.classList.add("hidden");
});
newModal.addEventListener("click", (e) => {
  if (e.target === newModal) newModal.classList.add("hidden");
});

newForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const now = new Date().toISOString();
  const labels = document.getElementById("f-labels").value
    .split(",").map((s) => s.trim()).filter(Boolean);

  const issue = {
    id: nextId++,
    title: document.getElementById("f-title").value.trim(),
    description: document.getElementById("f-desc").value.trim(),
    status: document.getElementById("f-status").value,
    priority: document.getElementById("f-priority").value,
    author: document.getElementById("f-author").value.trim(),
    assignee: "",
    labels: labels,
    createdAt: now,
    updatedAt: now,
    _local: true, 
  };

  allIssues.unshift(issue); 
  updateSummary();
  applyTab();
  newForm.reset();
  newModal.classList.add("hidden");
});


document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
});


loadIssues();
