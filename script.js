/*  1- Create Varibales
    2- Get Number of letters
    3- Create The Inputs
    4- Check Letters Placment
    */

/* Create Varibales */
let words = [
  "rat",
  "banana",
  "dog",
  "snail",
  "mouse",
  "cow",
  "duck",
  "apple",
  "dolphin",
  "tomato",
];
let hints = 2;
let currentTry = 1;
let indexArr = [];
let tempArr = [];
let iIndex = [];
let word = words[Math.floor(Math.random() * words.length)];
let answerArr = [...word];
let wordArr = [...word];
let numberOfLetters = word.length;
let numberOfTries = 5;
console.log(word);
console.log(wordArr);

/* initialize starting setting function  */
function initialset() {
  /* Disable all input except the first try */
  $("input:not(.try-1 input)").prop("disabled", true);
  /* Set autofocus on the first input of the first try */
  $("#try-1_letter-1").focus();
  /* Make input accept only letters */
  $("input").keypress((e) => {
    return /[a-z]/i.test(e.key);
  });
  /* Auto focus on next input if the current input is filled */
  $("input").keydown(function (e) {
    if (/[a-z]/i.test(e.key)) {
      if (this.value.length === this.maxLength && e.key != "Backspace") {
        $(`.try-${currentTry} input`).each(function (index, element) {
          if ($(element).val() === "") {
            $(element).focus();
            return false;
          }
        });
      }
    }
  });
  /* Auto focus on previous input when press Backspace */
  $("input").keyup(function (e) {
    if (e.key === "Backspace") {
      $(this).prev("input").focus();
    }
  });
  /* Call checkWord function on "Enter" press */
  $("body").keydown(function (e) {
    if (e.key === "Enter") {
      checkWord();
    }
  });
  /* add number of hints to the button text */
  $(".hint span").text(hints);
}

/* Add input function */
function addInputs() {
  /* Add the try divs */
  for (let i = 1; i <= numberOfTries; i++) {
    $(".inputs").append(`<div class='try-${i}'><span >Try ${i}</span> </div>`);
    /* Add the number of inputs based on the word's length */
    for (let j = 1; j <= numberOfLetters; j++) {
      $(`.try-${i}`).append(
        `<input  type='text' id='try-${i}_letter-${j}' maxlength='1' />`
      );
    }
  }
  /* change input size depending on the number of letters */
  if (numberOfLetters >= 5 && numberOfLetters < 7) {
    $(".trial_container .inputs div").addClass("six");
  } else if (numberOfLetters >= 7) {
    $(".trial_container .inputs div").removeClass("six");
    $(".trial_container .inputs div").addClass("seven");
  }
  initialset();
}

/* Check word function */
function checkWord() {
  /* check if there is an empty input */
  let x = 0;
  for (let i = 1; i <= numberOfLetters; i++) {
    if ($(`#try-${currentTry}_letter-${i}`).val() === "") {
      x = 1;
      /* make shake effect to alert the user of empty inputs */
      $(`#try-${currentTry}_letter-${i}`).addClass("shake");
      setTimeout(() => {
        $(`#try-${currentTry}_letter-${i}`).removeClass("shake");
      }, 500);
    }
  }
  /* if all inputs are filled disable current input and enable next one */
  if (!x) {
    $(`.try-${currentTry} input`).prop("disabled", true);
    $(`.try-${currentTry + 1} input`).prop("disabled", false);
    /* check the letters in right place */
    for (let i = 1; i <= numberOfLetters; i++) {
      let inputValue = $(`#try-${currentTry}_letter-${i}`).val();
      let inputField = $(`#try-${currentTry}_letter-${i}`);
      /* if the letter isn't already right and in place make the change for it */
      if (iIndex.includes(i)) {
        continue;
      } else if (inputValue === wordArr[i - 1]) {
        inputField.css("background-color", "#afd198");
        indexArr.push(i - 1);
        iIndex.push(i);
        wordArr[i - 1] = "";
      }
    }
    /* check the right letter but not in the right place */
    tempArr = [...wordArr];
    for (let i = 1; i <= numberOfLetters; i++) {
      let inputValue = $(`#try-${currentTry}_letter-${i}`).val();
      let inputField = $(`#try-${currentTry}_letter-${i}`);
      if (iIndex.includes(i)) {
        continue;
      } else if (tempArr.includes(inputValue)) {
        tempArr[tempArr.indexOf(inputValue)] = "";
        inputField.css("background-color", "#e8efcf");
        /* check wrong letters */
      } else if (wordArr.includes(inputValue) === false) {
        inputField.css("background-color", "#ff94aa ");
      }
    }
    /* Right answer all inputs are right */
    if (indexArr.length === numberOfLetters) {
      $(`.try-${currentTry + 1} input`).prop("disabled", true);
      return false;
    }
    /* increment current try */
    currentTry++;
    /* Put right answers in their places in the next try */
    for (let i = 1; i <= indexArr.length; i++) {
      let inputField = $(`#try-${currentTry}_letter-${indexArr[i - 1] + 1}`);
      inputField.val(answerArr[indexArr[i - 1]]);
      inputField.css("background-color", "#afd198");
      inputField.prop("disabled", true);
    }
    /* Autofocus on the first abled input field in the next try */
    for (let i = 1; i <= numberOfLetters; i++) {
      let inputField = $(`#try-${currentTry}_letter-${i}`);
      if (inputField.prop("disabled") === false) {
        inputField.focus();
        break;
      }
    }
  }
}
/* hint function */
function hint() {
  for (let i = 1; i <= numberOfLetters; i++) {
    let inputField = $(`#try-${currentTry}_letter-${i}`);
    /* fill the first empty input with the right letter and make the change for it as the right letter in the right place */
    if (!iIndex.includes(i)) {
      inputField.val(wordArr[i - 1]);
      inputField.css("background-color", "#afd198");
      inputField.prop("disabled", true);
      indexArr.push(i - 1);
      iIndex.push(i);
      wordArr[i - 1] = "";
      inputField.next("input").focus();
      hints--;
      $(".hint span").text(hints);
      /* if out of hints remove number of hints and make button unclickable */
      if (hints < 1) {
        console.log("we're here ");
        $(".hint span").remove();
        $(".hint ").addClass("unclickable");
        $(".hint").css("background-color", "#D862BC");
        return false;
      }
      break;
    }
  }
}
addInputs();
