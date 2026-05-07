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

    const eventCard = this.closest(".e-card");

    // === Extract Values ===
    const day = eventCard.querySelector(".date").textContent.trim();
    const monthYear = eventCard.querySelector(".month").textContent.trim();
    const title = eventCard.querySelector(".title h2").textContent.trim();
    const timeText = eventCard.querySelector(".time p").textContent;
    const location = eventCard.querySelector(".location p").textContent.trim();

    // === Convert Date Properly ===

    // Extract clean pieces
    const [monthName, year] = monthYear.split(" ");
    const monthIndex = new Date(`${monthName} 1, ${year}`).getMonth();

    // Extract hour + am/pm
    let hour = parseInt(timeText);
    const isPM = timeText.toLowerCase().includes("pm");

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


// SEND MESSAGE
document.getElementById("form").addEventListener("submit", function(e) {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const message = document.getElementById("message").value;
  const email = document.getElementById("email").value;

  const to = 'preciouswordassembly@gmail.com';
  if (name.value || message.value || email.value != 0){
      const subject = encodeURIComponent("Church Inquiry Message");
      const body = encodeURIComponent(
          `Hi I'm: ${name}\n${message}`
        );
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;

    window.open(gmailUrl, "_blank");
  }
});


// PLAY SERMONS
const sermons = document.querySelectorAll(".listen_btn");

let currentAudio = null;
let currentBtn = null;

sermons.forEach(sermon => {
  const btn = sermon.querySelector(".btn");
  const audio = sermon.querySelector("audio");

  btn.addEventListener("click", async () => {

    // Stop previous audio
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      if (currentBtn) currentBtn.textContent = "Play Sermon";
    }

    if (audio.paused) {
      btn.textContent = "Loading...";
      await audio.play();

      btn.textContent = "Pause Sermon";
      currentAudio = audio;
      currentBtn = btn;
    } else {
      audio.pause();
      btn.textContent = "Play Sermon";
    }

  });

  audio.addEventListener("ended", () => {
    btn.textContent = "Play Sermon";
  });
});