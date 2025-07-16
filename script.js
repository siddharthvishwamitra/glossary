let data = [];
let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [];

const list = document.getElementById("dictionary-list");
const pageNum = document.getElementById("page-num");
const searchInput = document.getElementById("search-input");
const clearIcon = document.getElementById("clear-icon");
const pagination = document.getElementById("pagination");
const jumpContainer = document.getElementById("jump-container");
const noResults = document.getElementById("no-results");

fetch("data.json")
  .then(res => res.json())
  .then(json => {
    data = json;
    filteredData = data;
    renderPage();
  });

function renderPage() {
  list.innerHTML = "";
  noResults.style.display = "none";
  
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const pageItems = filteredData.slice(start, end);
  
  if (filteredData.length === 0) {
    noResults.style.display = "block";
    pagination.style.display = "none";
    jumpContainer.style.display = "none";
    return;
  }
  
  pageItems.forEach(item => {
    const div = document.createElement("div");
    div.className = "entry";
    div.innerHTML = `
      <div class="word">${item.word}</div>
      <div class="meaning"><span>Meaning:</span> ${item.meaning}</div>
      <div class="example"><span>Example:</span> ${item.example}</div>
      ${item.hindi ? `<div class="hindi"><span>Hindi:</span> ${item.hindi}</div>` : ""}
    `;
    list.appendChild(div);
  });
  
  pageNum.textContent = `Page ${currentPage} of ${totalPages}`;
  document.getElementById("prev").disabled = currentPage === 1;
  document.getElementById("next").disabled = currentPage === totalPages;
  
  // Show or hide pagination/jump
  if (filteredData.length <= itemsPerPage) {
    pagination.style.display = "none";
    jumpContainer.style.display = "none";
  } else {
    pagination.style.display = "flex";
    jumpContainer.style.display = "flex";
  }
}

// Prev & Next
document.getElementById("prev").onclick = () => {
  if (currentPage > 1) {
    currentPage--;
    renderPage();
  }
};

document.getElementById("next").onclick = () => {
  const maxPage = Math.ceil(filteredData.length / itemsPerPage);
  if (currentPage < maxPage) {
    currentPage++;
    renderPage();
  }
};

// Jump to page
document.getElementById("jump-btn").onclick = () => {
  const input = document.getElementById("jump-input");
  const page = parseInt(input.value);
  const maxPage = Math.ceil(filteredData.length / itemsPerPage);
  
  if (!isNaN(page) && page >= 1 && page <= maxPage) {
    currentPage = page;
    renderPage();
  } else {
    showAlert(`Enter a valid page number (1 to ${maxPage})`);
  }
  input.value = "";
};

// Custom alert function (outside of any if/else)
function showAlert(message) {
  const alertBox = document.getElementById("custom-alert");
  alertBox.textContent = message;
  alertBox.style.display = "block";
  
  setTimeout(() => {
    alertBox.style.display = "none";
  }, 3000);
}

// Search
document.getElementById("search-btn").onclick = () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query === "") return;
  
  filteredData = data.filter(item =>
    item.word.toLowerCase().includes(query) ||
    item.meaning.toLowerCase().includes(query)
  );
  currentPage = 1;
  renderPage();
};

// Clear Search (× icon click)
clearIcon.onclick = () => {
  searchInput.value = "";
  clearIcon.style.display = "none";
  filteredData = data;
  currentPage = 1;
  renderPage();
};

// Show/hide clear icon on input
searchInput.addEventListener("input", () => {
  if (searchInput.value.trim() === "") {
    clearIcon.style.display = "none";
    filteredData = data;
    currentPage = 1;
    renderPage();
  } else {
    clearIcon.style.display = "inline";
  }
});