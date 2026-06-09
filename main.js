const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const menuBtnIcon = menuBtn.querySelector('i');

menuBtn.addEventListener('click', (e) =>{
  navLinks.classList.toggle('open');
  let_open();
});

let links = navLinks.children;

for(let link of links){
   link.addEventListener('click', (e) =>{
    navLinks.classList.remove('open');
    let_open();
    console.log('hello what');
  });
}

function let_open(){
     if (navLinks.classList.contains('open')){
      menuBtnIcon.setAttribute('class', 'ri-close-line')
    }
    
    else{
      menuBtnIcon.setAttribute('class', 'ri-menu-line')
    }
}


document.addEventListener("DOMContentLoaded", () => {
  function setNavHeight() {
    const nav = document.getElementById('navbar')
    if (!nav) return;

    const navHeight = nav.offsetHeight;
    document.documentElement.style.setProperty(
      "--nav-height",
      `${navHeight}px`
    );
  }

  setNavHeight();
  window.addEventListener("resize", setNavHeight);
});

// ADD TO CALENDAR
document.querySelectorAll(".c_btn").forEach(button => {

  button.addEventListener("click", function () {

    const eventCard = this.closest("article.event_card");

    // === Extract Values ===
    // Get elements safely
    const dayEl = eventCard.querySelector(".event_badge span.day") || eventCard.querySelector(".event_date");
    const monthEl = eventCard.querySelector(".event_badge span.month") || eventCard.querySelector(".event_month");
    const titleEl = eventCard.querySelector("h3.title") || eventCard.querySelector("h3");
    const timeEl = eventCard.querySelector(".time span");
    const locationEl = eventCard.querySelector(".location span");

    // Check if elements exist
    if (!dayEl || !monthEl || !titleEl || !timeEl || !locationEl) {
      console.error("Missing event card elements");
      return;
    }

    const day = dayEl.textContent.trim();
    const monthYear = monthEl.textContent.trim();
    const title = titleEl.textContent.trim();
    const timeText = timeEl.textContent.trim();
    const location = locationEl.textContent.trim();

    // === Convert Date Properly ===

    // Extract clean pieces
    const [monthName, year] = monthYear.split(" ");
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

    // Extract hour + am/pm
    let hour = parseInt(timeText.split(':')[0].trim()); // Extract hour before colon (e.g., "5" from "5:00PM")
    const isPM = timeText.toLowerCase().includes("pm");

    // Validate parsed values
    if (isNaN(hour) || isNaN(monthIndex) || isNaN(parseInt(day)) || isNaN(parseInt(year))) {
      console.error("Invalid date values:", { day, monthIndex, hour, year });
      return;
    }

    if (isPM && hour !== 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;

    // Create start date manually
    const startDateObj = new Date(
      parseInt(year),
      monthIndex,
      parseInt(day),
      hour,
      0,
      0
    );

    // 2 hour duration
    const endDateObj = new Date(startDateObj.getTime() + 2 * 60 * 60 * 1000);

    function formatDate(date) {
      return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
    }

    console.log(day);
    console.log(monthYear);
    console.log(timeText);

    const startDate = formatDate(startDateObj);
    const endDate = formatDate(endDateObj);

    // === Build Google Calendar URL ===
    const googleUrl = new URL("https://calendar.google.com/calendar/render");

    googleUrl.searchParams.append("action", "TEMPLATE");
    googleUrl.searchParams.append("text", title);
    googleUrl.searchParams.append("dates", `${startDate}/${endDate}`);
    googleUrl.searchParams.append("details", `Join us for ${title}`);
    googleUrl.searchParams.append("location", location);

    window.open(googleUrl.toString(), "_blank");

  });

});

// EVENT COUNTDOWN + SMOOTH SCROLL
// EDITABLE EVENT DATE: update the string below to change the countdown target
const EVENT_DATE = "2026-06-14T08:00:00"; // <--- set your event date/time here (ISO 8601)

const elDays = document.getElementById('countdown-days');
const elHours = document.getElementById('countdown-hours');
const elMinutes = document.getElementById('countdown-minutes');
const elSeconds = document.getElementById('countdown-seconds');
const countdownGrid = document.getElementById('countdown-grid');
const countdownMessage = document.getElementById('countdown-message');

const seeMoreBtn = document.getElementById('see-more-btn');
const upcomingEventsSection = document.getElementById('upcoming-events');

function formatNumber(n){ return String(n).padStart(2, '0'); }

function showEventMessage(text){
  if(countdownMessage){
    countdownMessage.textContent = text;
    countdownMessage.style.display = 'block';
  }
  if(countdownGrid){ countdownGrid.style.display = 'none'; }
}

function clearEventMessage(){
  if(countdownMessage){ countdownMessage.textContent = ''; countdownMessage.style.display = 'none'; }
  if(countdownGrid){ countdownGrid.style.display = 'flex'; }
}

let countdownInterval = null;
function updateCountdown(){
  const target = new Date(EVENT_DATE);
  const now = new Date();
  let diff = Math.max(0, target - now);

  const totalSec = Math.floor(diff / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const seconds = totalSec % 60;

  if(elDays) elDays.textContent = formatNumber(days);
  if(elHours) elHours.textContent = formatNumber(hours);
  if(elMinutes) elMinutes.textContent = formatNumber(minutes);
  if(elSeconds) elSeconds.textContent = formatNumber(seconds);

  // When countdown hits zero, stop and show message
  if(diff === 0){
    clearInterval(countdownInterval);
    showEventMessage('Event Started — See You There');
    if(countdownGrid) countdownGrid.classList.remove('soon');
    return;
  }

  // Add 'soon' visual accent when less than 24 hours
  if(diff <= 24 * 60 * 60 * 1000){
    if(countdownGrid) countdownGrid.classList.add('soon');
  } else {
    if(countdownGrid) countdownGrid.classList.remove('soon');
  }
}

// init
clearEventMessage();
updateCountdown();
countdownInterval = setInterval(updateCountdown, 1000);

if (seeMoreBtn && upcomingEventsSection) {
  seeMoreBtn.addEventListener('click', () => {
    upcomingEventsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}



// GLOBAL SERMON AUDIO PLAYER
const audio = new Audio();
const playButtons = document.querySelectorAll('.play_sermon');
const audioPlayer = document.getElementById('audio-player');
const playerTitle = document.querySelector('.player_title');
const playerSpeaker = document.querySelector('.player_speaker');
const playerToggle = document.querySelector('.player_toggle');
const playerProgress = document.querySelector('.player_progress');
const playerTime = document.querySelector('.player_time');
const playerClose = document.querySelector('.player_close');
let activeButton = null;

function formatTime(seconds) {
  if (!seconds || Number.isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function showPlayer() {
  audioPlayer.classList.add('active');
  audioPlayer.setAttribute('aria-hidden', 'false');
}

function hidePlayer() {
  audioPlayer.classList.remove('active');
  audioPlayer.setAttribute('aria-hidden', 'true');
}

function updatePlayerState() {
  if (audio.paused) {
    playerToggle.innerHTML = '<i class="ri-play-fill"></i>';
    if (activeButton) activeButton.classList.remove('active');
  } else {
    playerToggle.innerHTML = '<i class="ri-pause-fill"></i>';
    if (activeButton) activeButton.classList.add('active');
  }
}

function updateProgress() {
  if (!audio.duration) return;
  playerProgress.max = audio.duration;
  playerProgress.value = Math.min(audio.currentTime, audio.duration);
  playerTime.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
}

function setActiveButton(button) {
  if (activeButton) activeButton.classList.remove('active');
  activeButton = button;
  activeButton.classList.add('active');
}

function loadSermon(button) {
  const title = button.dataset.title;
  const speaker = button.dataset.speaker;
  const src = button.dataset.audio;
  const resolvedSrc = new URL(src, window.location.href).href;

  if (audio.src !== resolvedSrc) {
    audio.src = src;
    audio.currentTime = 0;
  }

  playerTitle.textContent = title;
  playerSpeaker.textContent = speaker;
  setActiveButton(button);
  showPlayer();
  audio.play().catch(() => {
    updatePlayerState();
  });
}

playButtons.forEach(button => {
  button.addEventListener('click', () => {
    const sourceUrl = new URL(button.dataset.audio, window.location.href).href;

    if (audio.src !== sourceUrl) {
      loadSermon(button);
      return;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  });
});

playerToggle.addEventListener('click', () => {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

playerProgress.addEventListener('input', () => {
  audio.currentTime = Number(playerProgress.value);
});

playerClose.addEventListener('click', () => {
  audio.pause();
  hidePlayer();
  if (activeButton) activeButton.classList.remove('active');
});

audio.addEventListener('play', updatePlayerState);
audio.addEventListener('pause', updatePlayerState);
audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', () => {
  audio.currentTime = 0;
  updatePlayerState();
});

// FORM VALIDATION
const formCont = document.getElementById("contact-form");

const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const messageInput = document.getElementById("message");

function showError(input, message) {

  const formGroup = input.parentElement;
  const error = formGroup.querySelector(".error");

  error.textContent = message;
  input.classList.add("input-error");

}

function clearError(input) {

  const formGroup = input.parentElement;
  const error = formGroup.querySelector(".error");

  error.textContent = "";
  input.classList.remove("input-error");

}

function validateEmail(email) {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function validatePhone(phone) {

  return /^[0-9+\s()-]{7,20}$/.test(phone);

}

function validateForm() {

  let isValid = true;

  // NAME
  if (nameInput.value.trim() === "") {

    showError(nameInput, "Please enter your name");
    isValid = false;

  } else {

    clearError(nameInput);

  }

  // EMAIL
  if (!validateEmail(emailInput.value.trim())) {

    showError(emailInput, "Enter a valid email address");
    isValid = false;

  } else {

    clearError(emailInput);

  }

  // PHONE
  if (!validatePhone(phoneInput.value.trim())) {

    showError(phoneInput, "Enter a valid phone number");
    isValid = false;

  } else {

    clearError(phoneInput);

  }

  // MESSAGE
  if (messageInput.value.trim().length < 10) {

    showError(messageInput, "Message must be at least 10 characters");
    isValid = false;

  } else {

    clearError(messageInput);

  }

  return isValid;

}

[nameInput, emailInput, phoneInput, messageInput].forEach(input => {

  input.addEventListener("input", () => {

    validateForm();

  });

});



