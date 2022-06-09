// ----------------- VARIABLES ----------------------

const checkinDate = document.getElementById("Check-in");
const checkinDatepicker = new TheDatepicker.Datepicker(checkinDate);
checkinDatepicker.render();

// Date in en-US locale so its read correctly
const mxCityDateInEnglishLocale = new Date().toLocaleString("en-US", {
  timeZone: "America/Mexico_City",
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

checkinDatepicker.options.setMinDate(mxCityDateInEnglishLocale);

let checkinParams = "";


const checkoutDate = document.getElementById("Check-out");
const checkoutDatepicker = new TheDatepicker.Datepicker(checkoutDate);
checkoutDatepicker.render();

// Create new Date instance
const initialMinCheckoutDate = new Date(Date.UTC(
    mxCityDateInEnglishLocale.split("/")[2],
    String(parseInt(mxCityDateInEnglishLocale.split("/")[0]) - 1),
    String(parseInt(mxCityDateInEnglishLocale.split("/")[1]) + 1)
)).toISOString().split("T")[0];

const formattedInitialMinCheckoutDate = formatISODate(initialMinCheckoutDate);

checkoutDatepicker.options.setMinDate(formattedInitialMinCheckoutDate);

let checkoutParams = "";


const checkAvailabilityButton = document.querySelector("#email-form > input");

const bookNowHeader = document.querySelector("body > div > div:nth-child(2) > div > div.div-block > a.navlink.pinks");

bookNowHeader.href = "https://hotels.cloudbeds.com/reservation/HkDshd";

// ----------------- LISTENERS ----------------------

checkAvailabilityButton.addEventListener("click", handleCheckAvailability, false);

checkinDate.addEventListener("input", maskDateInput, false);

checkoutDate.addEventListener("input", maskDateInput, false);

checkinDatepicker.options.onSelect((event, day, previousDay) => {

  if (!day) {

    checkinParams = "";

    // Create new Date instance
    const initialMinCheckoutDate = new Date(Date.UTC(
        mxCityDateInEnglishLocale.split("/")[2],
        String(parseInt(mxCityDateInEnglishLocale.split("/")[0]) - 1),
        String(parseInt(mxCityDateInEnglishLocale.split("/")[1]) + 1)
    )).toISOString().split("T")[0];

    const formattedInitialMinCheckoutDate = formatISODate(initialMinCheckoutDate);

    checkoutDatepicker.options.setMinDate(formattedInitialMinCheckoutDate);

    checkinDate.value = "";
    return;
  }

  // Create new Date instance
  const minCheckoutDate = new Date(Date.UTC(day.year, day.month-1, day.dayNumber + 1)).toISOString().split("T")[0];

  const formattedMinCheckoutDate = formatISODate(minCheckoutDate);

  checkoutDatepicker.options.setMinDate(formattedMinCheckoutDate);

  checkinDate.value = `${padNumber(day.dayNumber)}-${padNumber(day.month)}-${day.year}`;

  checkinParams = `${day.year}-${padNumber(day.month)}-${padNumber(day.dayNumber)}`

});

checkoutDatepicker.options.onSelect((event, day, previousDay) => {

  if (!day) {

    checkoutParams = "";

    checkinDatepicker.options.setMaxDate(null);

    checkoutDate.value = "";
    return;
  }


  // Create new Date instance
  const maxCheckinDate = new Date(Date.UTC(day.year, day.month-1, day.dayNumber - 1)).toISOString().split("T")[0];

  const formattedMaxCheckinDate = formatISODate(maxCheckinDate);

  checkinDatepicker.options.setMaxDate(formattedMaxCheckinDate);

  checkoutDate.value = `${padNumber(day.dayNumber)}-${padNumber(day.month)}-${day.year}`;

  checkoutParams = `${day.year}-${padNumber(day.month)}-${padNumber(day.dayNumber)}`

});

// ----------------- FUNCTIONS ----------------------

function handleCheckAvailability(e) {
  e.preventDefault();
  e.stopPropagation();
  if (checkoutParams && checkinParams) {
    window.location.href = `https://hotels.cloudbeds.com/reservation/HkDshd#checkin=${checkinParams}&checkout=${checkoutParams}`
  }
}

function formatISODate(date) {
  const dateArray = date.split("-");
  return `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}`
}

// Fills in a number if number < 10 with padding 0s to be have a lengh of two
function padNumber(n) {
  let length =  String(n).length;
  return length == 2 ? String(n) : String(n).padStart(1, "0");
}

// Mask date input to match format DD/MM/YYYY
function maskDateInput(e) {
  return false;
}
