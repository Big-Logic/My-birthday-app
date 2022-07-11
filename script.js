import { validateInput } from "./input-validation.js";

const pantryId = "8d48d553-74a3-426f-8925-2845de13b0c1";

const birthdayTitle = document.querySelector(".birthday_text");
const errMsgContainer = document.querySelector(".error_message");
const participiansContainer = document.querySelector(".participians_container");
const participians = document.querySelector(".participians");
const participiansViewBtn = document.querySelector(".participians_view--btn");
const participiansCloseBtn = document.querySelector(".participians_close--btn");

//count down elements
const daysNum = document.querySelector(".days_num");
const daysText = document.querySelector(".days_text");
const hoursNum = document.querySelector(".hours_num");
const hoursText = document.querySelector(".hours_text");
const minutesNum = document.querySelector(".minutes_num");
const minutesText = document.querySelector(".minutes_text");
const secondsNum = document.querySelector(".seconds_num");
const secondsText = document.querySelector(".seconds_text");

//form elements
const form = document.querySelector("#message_form");
const personName = document.querySelector("#person_name");
const message = document.querySelector("#message");

//loading spinner elements
const loadingSpinner = document.querySelector(".loading_spinner");

//tooltip elements
const tooltipP = document.querySelector(".tooltip p");

//displays the remaining date to the birthday
const dislayTimmer = function (days, hours, minutes, seconds) {
  const counters = [days, hours, minutes, seconds];
  const numbersElements = [daysNum, hoursNum, minutesNum, secondsNum];
  const textElements = [daysText, hoursText, minutesText, secondsText];
  const outputText = ["Days", "Hours", "Minutes", "Seconds"];

  // loop through the counters array and update the html counters elements
  counters.forEach((ele, i) => {
    if (ele >= 0 && ele < 10) {
      numbersElements[i].textContent = `0${ele}`;
    } else if (ele < 0) {
      numbersElements[i].textContent = "0";
    } else {
      numbersElements[i].textContent = ele;
    }

    //control flow for removing s from the date text if it is < 2
    if (ele < 2) {
      textElements[i].textContent = outputText[i].slice(
        0,
        outputText[i].length - 1
      );
    } else {
      textElements[i].textContent = outputText[i];
    }
  });
};

const createTimer = function () {
  const countDownDate = new Date("Jul 16, 2022 00:00:00").getTime();

  // Update the count down every 1 second
  const x = setInterval(function () {
    // Get today's date and time
    const now = new Date().getTime();

    // Find the distance between now and the count down date
    const distance = countDownDate - now;

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result in the element with id="demo"
    dislayTimmer(days, hours, minutes, seconds);

    // If the count down is finished, write some text
    if (distance < 0) {
      clearInterval(x);
      birthdayTitle.textContent = "Happy Birthday Big Logic";
      tooltipP.textContent = "Completed🥱";
    }
  }, 1000);
};

createTimer();

const sendData = async function () {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    userName: `${personName.value}`,
    message: `${message.value}`,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  loadingSpinner.classList.add("loading_spinner--show");
  try {
    const res = await fetch(
      `https://getpantry.cloud/apiv1/pantry/${pantryId}/basket/${personName.value}`,
      requestOptions
    );

    const response = await res.text();

    console.log(response);
    loadingSpinner.innerHTML = `<p class="fetch_succ--msg">Message send successfully.<br /> Thanks for the concerns ${personName.value}. <br /> Your name has been added to <br /> the participians list. <br /> Click the<span class="text_bold"> people who send</span> button to view.</p>`;
    getDate();
  } catch (err) {
    console.log(err);
    loadingSpinner.innerHTML = `<p class="fetch_err--msg">Unable to send your message.<br /> Please reload the page <br /> make sure you have an internet connection <br /> before trying again!!</p>`;
  }
};

//display all individuals who send a message
const displayParticipians = function (arr, container) {
  container.innerHTML = "";
  arr.forEach((ele) => {
    const markup = `
    <h3>🤜🏻${ele.name}</h3>
  `;
    container.insertAdjacentHTML("afterbegin", markup);
  });
};

const getDate = async function () {
  try {
    const res = await fetch(`https://getpantry.cloud/apiv1/pantry/${pantryId}`);

    const result = await res.json();
    console.log(result.baskets);
    displayParticipians(result.baskets, participians);
  } catch (err) {
    console.log(err);
    participians.innerHTML = `<p class="fetch_err--msg">An Error occured!! Please make should you have an internet connection and try again!!</p>`;
  }
};

getDate();

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const validationResult = validateInput(personName.value, message.value);
  if (validationResult) {
    sendData();
  } else {
    errMsgContainer.classList.add("error_message--show");
    setTimeout(() => {
      errMsgContainer.classList.remove("error_message--show");
    }, 2000);
  }
});

participiansViewBtn.addEventListener("click", () => {
  participiansContainer.classList.add("participians_container--show");
  participians.classList.add("participians--show");
});

participiansCloseBtn.addEventListener("click", () => {
  participiansContainer.classList.remove("participians_container--show");
  participians.classList.remove("participians--show");
});
