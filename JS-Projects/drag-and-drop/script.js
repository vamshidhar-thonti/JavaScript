const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects", "Listen to music"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool"];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((arr, i) => {
    localStorage.setItem(`${arr}Items`, JSON.stringify(listArrays[i]));
  });
  // localStorage.setItem('backlogItems', JSON.stringify(backlogListArray));
  // localStorage.setItem('progressItems', JSON.stringify(progressListArray));
  // localStorage.setItem('completeItems', JSON.stringify(completeListArray));
  // localStorage.setItem('onHoldItems', JSON.stringify(onHoldListArray));
}

// Filter Arrays to remove empty items
const filterArray = function (array) {
  return array.filter((item) => item !== null);
};

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragstart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    updatedOnLoad = true;
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((backlogItem, index) => {
    createItemEl(backlogList, 0, backlogItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  backlogListArray = filterArray(backlogListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Update Item - Delete if the field is left blank
const updateItem = function (index, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[index].textContent) {
      delete selectedArray[index];
    } else {
      selectedArray[index] = selectedColumnEl[index].textContent;
    }

    updateDOM();
  }
};

// Add to column list, Reset Toolbox
const addToColumn = function (column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
};

// Show Add Item Inpuut Box
const showInputBox = function (column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
};

// Hide Add Item Inpuut Box
const hideInputBox = function (column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumn(column);
};

// Allows arrays to reflect drag and drop items
const rebuildArrays = function () {
  // backlogListArray = [];
  // progressListArray = [];
  // completeListArray = [];
  // onHoldListArray = [];

  backlogListArray = Array.from(backlogList.children).map(
    (backlog) => backlog.textContent
  );
  progressListArray = Array.from(progressList.children).map(
    (progress) => progress.textContent
  );
  completeListArray = Array.from(completeList.children).map(
    (complete) => complete.textContent
  );
  onHoldListArray = Array.from(onHoldList.children).map(
    (onHold) => onHold.textContent
  );

  // Array.from(backlogList.children).forEach((backlog) =>
  //   backlogListArray.push(backlog.textContent)
  // );
  // Array.from(progressList.children).forEach((progress) =>
  //   progressListArray.push(progress.textContent)
  // );
  // Array.from(completeList.children).forEach((complete) =>
  //   completeListArray.push(complete.textContent)
  // );
  // Array.from(onHoldList.children).forEach((onHold) =>
  //   onHoldListArray.push(onHold.textContent)
  // );

  updateDOM();
};

// When Item starts dragging
const drag = function (event) {
  draggedItem = event.target;
  dragging = true;
};

// Column allows for items to Drop
const allowDrop = function (event) {
  event.preventDefault();
};

// Dropping item into column
const drop = function (event) {
  event.preventDefault();
  listColumns.forEach((item) => item.classList.remove("over"));
  // Add Item to column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
};

// Dropping item into column
const dragEnter = function (index) {
  listColumns.forEach((item) => item.classList.remove("over"));
  listColumns[index].classList.add("over");
  currentColumn = index;
};

// On Load
updateDOM();
