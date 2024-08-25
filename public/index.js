// Event listener for form submission
document.querySelector("#task-form").addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent form submission

  // Get form input values
  const inputValue = document.querySelector(".input").value;
  const descValue = document.querySelector(".description").value;

  addTask(inputValue, descValue);
  saveData(); // Save data after adding a task
});

// Function to add a task
const addTask = (inputValue, descValue) => {
  const taskParent = document.querySelector(".task-list");
  const li = document.createElement("li");
  li.className = "task bg-gray-800 rounded-md";
  li.innerHTML = `
    <div class="outer bg-gray-800 text-white p-2 rounded-lg space-y-2 flex justify-between w-full px-4 items-center">
        <div class="left">
            <div class="first flex space-x-2">
                <span class="check">
                    <input type="checkbox" class="mt-2 checkbox" />
                </span>
                <h1 class="heading text-xl font-bold capitalize">${inputValue}</h1>
            </div>
            <div class="second text-left hidden">
                <p class="text-justify ml-6 desc">${descValue}</p>
            </div>
        </div>
        <div class="right flex justify-center items-center mb-2">
            <button class="view-btn text-xl font-bold hover:underline transition duration-500">View</button>
        </div>
    </div>
    <div class="lower p-2 px-3 transition duration-500 hidden">
        <hr class="my-4 border border-white w-full mx-auto">
        <div class="buttons flex justify-center items-center w-full m-auto pb-3 space-x-2">
            <button class="edit px-8 font-bold text-xl bg-white text-black rounded-lg py-1 w-1/3 cursor-pointer hover:bg-gray-700 transition-all duration-500 hover:text-white">Edit</button>
            <button class="delete px-8 font-bold text-xl bg-white text-black rounded-lg py-1 w-1/3 cursor-pointer hover:bg-gray-700 hover:text-white transition-all duration-500">Delete</button>
        </div>
    </div>
  `;

  taskParent.appendChild(li);
  document.querySelector(".input").value = "";
  document.querySelector(".description").value = "";

  // Checkbox event listener to update summary and save data
  li.querySelector(".checkbox").addEventListener("change", () => {
    updateSummary();
    saveData();
  });

  // Delete task
  li.querySelector(".delete").addEventListener("click", (e) => {
    li.remove();
    updateSummary();
    saveData();
  });

  // Toggle task details view
  const viewBtn = li.querySelector(".view-btn");
  viewBtn.addEventListener("click", () => {
    const secondDiv = li.querySelector(".second");
    secondDiv.classList.toggle("hidden");
    const lowerDiv = li.querySelector(".lower");
    lowerDiv.classList.toggle("hidden");
  });

  // Update the summary
  updateSummary();
};

// Search functionality
function search() {
  const inputValue = document
    .getElementById("search-input")
    .value.toUpperCase();
  const taskList = document.querySelectorAll(".task");
  taskList.forEach((task) => {
    const taskName = task.querySelector(".heading").textContent.toUpperCase();
    task.style.display = taskName.includes(inputValue) ? "" : "none";
  });
}

// Filtering tasks
document.querySelector(".all").addEventListener("click", () => {
  filterTasks("all");
});
document.querySelector(".active").addEventListener("click", () => {
  filterTasks("active");
});
document.querySelector(".complete").addEventListener("click", () => {
  filterTasks("complete");
});

function filterTasks(filter) {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    const isChecked = task.querySelector(".checkbox").checked;
    if (filter === "all") {
      task.style.display = "";
    } else if (filter === "active" && !isChecked) {
      task.style.display = "";
    } else if (filter === "complete" && isChecked) {
      task.style.display = "";
    } else {
      task.style.display = "none";
    }
  });
  updateSummary();
}

// Update task summary
function updateSummary() {
  const tasks = document.querySelectorAll(".task");
  const totalTasks = tasks.length;
  const completedTasks = Array.from(tasks).filter(
    (task) => task.querySelector(".checkbox").checked
  ).length;

  const activeTasks = totalTasks - completedTasks;

  document.querySelector(".total").textContent = totalTasks;
  document.querySelector(".completed").textContent = completedTasks;
  document.querySelector(".activeTask").textContent = activeTasks;
}

// Save tasks to localStorage, including the checkbox states
function saveData() {
  const tasks = document.querySelectorAll(".task");
  const taskData = Array.from(tasks).map((task) => ({
    html: task.innerHTML,
    checked: task.querySelector(".checkbox").checked,
  }));
  localStorage.setItem("tasks", JSON.stringify(taskData));
}

// Show tasks from localStorage
function showData() {
  const taskParent = document.querySelector(".task-list");
  const savedData = JSON.parse(localStorage.getItem("tasks"));
  if (savedData) {
    savedData.forEach((task) => {
      const li = document.createElement("li");
      li.className = "task bg-gray-800 rounded-md";
      li.innerHTML = task.html;
      taskParent.appendChild(li);

      const checkbox = li.querySelector(".checkbox");
      checkbox.checked = task.checked;

      // Reattach event listeners
      checkbox.addEventListener("change", () => {
        updateSummary();
        saveData();
      });

      li.querySelector(".delete").addEventListener("click", (e) => {
        li.remove();
        updateSummary();
        saveData();
      });

      const viewBtn = li.querySelector(".view-btn");
      viewBtn.addEventListener("click", () => {
        const secondDiv = li.querySelector(".second");
        secondDiv.classList.toggle("hidden");
        const lowerDiv = li.querySelector(".lower");
        lowerDiv.classList.toggle("hidden");
      });
    });
  }
  updateSummary(); // Update summary on page load
}

// Load saved tasks on page load
showData();
