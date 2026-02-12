// Get all needed DOM elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebration = document.getElementById("celebration");
const attendeeList = document.getElementById("attendeeList");
const waterCount = document.getElementById("waterCount");
const zeroCount = document.getElementById("zeroCount");
const powerCount = document.getElementById("powerCount");

// Track attendance numbers and lists
let count = 0;
const maxCount = 50;
// Initialize team counts and attendees list, and winner info
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0,
};
let attendees = [];
let winnerName = "";
let winnerLocked = false;

function loadSavedData() {
  // Read saved values (if they exist)
  const savedCount = localStorage.getItem("totalCount");
  const savedTeamCounts = localStorage.getItem("teamCounts");
  const savedAttendees = localStorage.getItem("attendees");
  const savedWinnerName = localStorage.getItem("winnerName");
  const savedWinnerLocked = localStorage.getItem("winnerLocked");

  if (savedCount !== null) {
    count = parseInt(savedCount);
  }

  if (savedTeamCounts) {
    teamCounts = JSON.parse(savedTeamCounts);
  }

  if (savedAttendees) {
    attendees = JSON.parse(savedAttendees);
  }

  if (savedWinnerName) {
    winnerName = savedWinnerName;
  }

  if (savedWinnerLocked) {
    winnerLocked = savedWinnerLocked === "true";
  }

  updatePage();
}

function saveData() {
  // Save current values so they stay after refresh
  localStorage.setItem("totalCount", count);
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendees", JSON.stringify(attendees));
  localStorage.setItem("winnerName", winnerName);
  localStorage.setItem("winnerLocked", String(winnerLocked));
}

function updatePage() {
  // Update every part of the page in one place
  attendeeCount.textContent = count;
  updateProgressBar();
  updateTeamCounts();
  updateAttendeeList();
  updateCelebration();
}

function updateProgressBar() {
  // Turn progress into a percent width
  const percentage = Math.round((count / maxCount) * 100);
  progressBar.style.width = `${percentage}%`;
}

function updateTeamCounts() {
  // Show the team totals
  waterCount.textContent = teamCounts.water;
  zeroCount.textContent = teamCounts.zero;
  powerCount.textContent = teamCounts.power;
}

function updateAttendeeList() {
  // Clear the list before re-adding items
  attendeeList.innerHTML = "";

  if (attendees.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "attendee-empty";
    emptyItem.textContent = "No attendees yet.";
    attendeeList.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < attendees.length; i++) {
    const attendee = attendees[i];
    const listItem = document.createElement("li");
    listItem.className = "attendee-item";
    listItem.textContent = `${attendee.name} - ${attendee.team}`;
    attendeeList.appendChild(listItem);
  }
}

function showGreetingMessage(name, teamName) {
  // Show a friendly message after check-in
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;
  greeting.classList.add("success-message");
  greeting.style.display = "block";
}

function getWinningTeam() {
  // Pick one winner (first highest in this order)
  let topCount = teamCounts.water;
  let topTeam = "Team Water Wise";

  if (teamCounts.zero > topCount) {
    topCount = teamCounts.zero;
    topTeam = "Team Net Zero";
  }

  if (teamCounts.power > topCount) {
    topTeam = "Team Renewables";
  }

  return topTeam;
}

function updateCelebration() {
  // Lock the winner the first time the goal is reached
  if (count >= maxCount && !winnerLocked) {
    winnerName = getWinningTeam();
    winnerLocked = true;
    saveData();
  }

  if (winnerLocked) {
    celebration.textContent = `Goal reached! Winning team: ${winnerName}.`;
    celebration.style.display = "block";
    return;
  }

  celebration.style.display = "none";
}

// Handle form submission
form.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent form from submitting normally

  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  // Increment total count
  count++;

  // Update the selected team count
  teamCounts[team] = teamCounts[team] + 1;

  // Add this attendee to the list
  attendees.push({ name: name, team: teamName });

  // Update the page and save the data
  updatePage();
  showGreetingMessage(name, teamName);
  saveData();

  // Reset form
  form.reset();
});

loadSavedData();
