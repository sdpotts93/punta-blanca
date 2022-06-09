// ----------------- VARIABLES ----------------------

const checkInDate = document.getElementById("Check-in");
const checkInDatepicker = new TheDatepicker.Datepicker(checkInDate);
checkInDatepicker.render();
let finalCheckInDate = null;

// Date in en-US locale so its read correctly
const mxCityDateInEnglishLocale = new Date().toLocaleString("en-US", {
  timeZone: "America/Mexico_City",
});

checkInDatepicker.options.setMinDate(mxCityDateInEnglishLocale);

const checkOutDate = document.getElementById("Check-out");
const checkOutDatepicker = new TheDatepicker.Datepicker(checkOutDate);
checkOutDatepicker.render();
let finalCheckOutDate = null;

// Create new Date instance
const intialMinCheckoutDate = new Date(Date.UTC(
  mxCityDateInEnglishLocale.getDate(),
  mxCityDateInEnglishLocale.getMonth(),
  mxCityDateInEnglishLocale.getFullYear()
));

// Add a day
intialMinCheckoutDate.setDate(intialMinCheckoutDate.getDate() + 1);

checkOutDatepicker.options.setMinDate(intialMinCheckoutDate.toUTCString());


// ----------------- LISTENERS ----------------------

checkInDate.addEventListener("input", maskDateInput, false);

checkOutDate.addEventListener("input", maskDateInput, false);

checkInDatepicker.options.onSelect((event, day, previousDay) => {

  if (!day) {

    // Create new Date instance
    const intialMinCheckoutDate = new Date(Date.UTC(
      mxCityDateInEnglishLocale.getDate(),
      mxCityDateInEnglishLocale.getMonth(),
      mxCityDateInEnglishLocale.getFullYear()
    ));

    // Add a day
    intialMinCheckoutDate.setDate(intialMinCheckoutDate.getDate() + 1);

    checkOutDatepicker.options.setMinDate(intialMinCheckoutDate.toUTCString());

    checkInDate.value = "";
    return;
  }

  // Create new Date instance
  const minCheckoutDate = new Date(Date.UTC(day.year, day.month, day.dayNumber));

  // Add a day
  minCheckoutDate.setDate(day.dayNumber + 1);

  checkOutDatepicker.options.setMinDate(minCheckoutDate.toUTCString());

  checkInDate.value = `${padNumber(day.dayNumber)}/${padNumber(day.month)}/${day.year}`;

  // Separate date in parts
  const dateParts = checkInDate.value.split("/");

  // Create date object from user input (DD/MM/YYYY)
  // Month is 0-based, that's why we need dataParts[1] - 1
  const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).getTime();

  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

  const localISOTime = new Date(dateObject - tzoffset).toISOString()

  console.log(localISOTime, "localISOTime");

  finalCheckInDate = localISOTime;

});

checkOutDatepicker.options.onSelect((event, day, previousDay) => {

  if (!day) {
    checkOutDate.value = "";
    return;
  }

  checkOutDate.value = `${padNumber(day.dayNumber)}/${padNumber(day.month)}/${day.year}`;

  // Separate date in parts
  const dateParts = checkOutDate.value.split("/");

  // Create date object from user input (DD/MM/YYYY)
  // Month is 0-based, that's why we need dataParts[1] - 1
  const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]).getTime();

  const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

  const localISOTime = new Date(dateObject - tzoffset).toISOString()

  console.log(localISOTime, "localISOTime");

  finalCheckOutDate = localISOTime;

});

// ----------------- FUNCTIONS ----------------------

// Fills in a number if number < 10 with padding 0s to be have a lengh of two
function padNumber(n) {
  let length =  String(n).length;
  return length == 2 ? String(n) : String(n).padStart(1, "0");
}

// Mask date input to match format DD/MM/YYYY
function maskDateInput(e) {

  const selectionStart = this.selectionStart;

  // Only grab digits
  const onlyDigits = this.value.replace(/\D/g,'');

  // If the user writes in the middle of the input, this will push
  // the last digit out (FIFO)
  const maxEightDigits = onlyDigits.substring(0, Math.min(8, onlyDigits.length));

  // Get an array that looks like this ['DD', 'MM', 'YYYY']
  const date = splitString(maxEightDigits, 2, 4);

  // Join that array with "/" to get the correct date input format
  const joinedDate = date.join("/");

  this.value = joinedDate;

  // Separate date in parts
  const dateParts = joinedDate.split("/");

  // Create date object from user input (DD/MM/YYYY)
  // Month is 0-based, that's why we need dataParts[1] - 1
  const dateObject = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);

  // Selected date with format YYYY/MM/DD
  const selectedDate = dateObject.getFullYear()+'/'+ (dateObject.getMonth()+1) +'/'+ dateObject.getDate();

  // Get current datetime with timezone
  const nowDate = new Date();

  // Current datetime with format YYYY/MM/DD
  const currentDate = nowDate.getFullYear()+ '/' + (nowDate.getMonth()+1) + '/' + nowDate.getDate();

  // Get the number of days in a particular month
  const daysInMonth = new Date(+dateParts[2], dateParts[1] - 1, 0).getDate();

  try {
    if (
      (new Date(selectedDate) > new Date(currentDate)) ||
      +dateParts[0] > daysInMonth ||
      dateParts[1] - 1 > 11
    ) {
      dateError.style.display = "block";
      wrongDate = true;
    } else {

      const dateObject = new Date(selectedDate).getTime();

      const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds

      const localISOTime = new Date(dateObject - tzoffset).toISOString()

      dateHiddenInput.value = localISOTime;

      dateError.style.display = "none";
      wrongDate = false;
    }
  } catch {
    // If there are still not three parts to the input date, hide date warning
    dateError.style.display = "none";
  }

  // If the date value was already filled, return cursor to the same position
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(this.value)) {
    this.selectionStart = this.selectionEnd = selectionStart;
  }
}

console.log("yes");
