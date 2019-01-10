var hovCount = 0;
var helpCount = 0;
var footerWidth;

window.onload = function() {                                                    //this calls the depicted functions when the page is loaded
  styler()                                                                      //this is one of the functions
};

setTimeout(function () {                                                        //porforms a function after a set time
  document.getElementById("earlyText").style.opacity = "0";                     //set the opacity of the HTML loading text to 0
}, 3000);                                                                       //this is the set time of 3s

setTimeout(function () {                                                        //porforms a function after a set time
  document.getElementById("early").style.opacity = "0";                         //set the opacity of the HTML loading container to 0
}, 5000);                                                                       //this is the set time of 5s

setTimeout(function () {                                                        //porforms a function after a set time
  document.getElementById("early").style.display = "none";                      //hide the
}, 6000);                                                                       //this is the set time of 6s

var dots = window.setInterval( function() {                                     //performs a function every 0.5s
    var wait = document.getElementById("earlyText");                            //access the inner text of a HTML element with the id of earlyText
    if ( wait.innerHTML.length > 12 )                                           //if the text contains more than 12 characters then
        wait.innerHTML = "atmosphere.";                                         //change the text to "atmosphere."
    else                                                                        //else if the text contains less than 12 characters then
        wait.innerHTML += ".";                                                  //add a "." to the end of the text
    }, 500);

  $("#welcomeText").hover(function() {                                          //JQUERY code to check if the user is hovering over the id
      hovCount = hovCount + 1;                                                  //this is a varible to count how many times the element is hovered over
      if (hovCount < 2) {                                                       //this checks the function will only run once
        FLOATING_TEXT.float();                                                  //this calls a different JAVASCRIPT file which makes the text expload outwars
      }
});

function styler() {                                                             //this is a function which was called all the page load
  footerWidth = document.getElementById("footerTag").offsetWidth;               //this returns the width of the HTML element with the id of "footerTag" and assigns it to the varible
  document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;    //this moves the element to off the page to the right by its width minus 15px
}

function helpClick() {                                                          //this function is called when the help button is clicked
  var checker = oddEvenCheck(helpCount);                                        //checks whether the user wants to open or close the help section by counting each click and checking if it's odd or even
  if (checker === true) {                                                       //if it's closed it
    document.getElementById("helpLink").src = "assets/icons/help2.png"          //changes the button to a close symbol
    document.getElementById("footerTag").style.right = `10px`;                  //moves it back onto the screen
  }
  else {                                                                        //if it's open
  document.getElementById("helpLink").src = "assets/icons/help.png"             //changes the button back to saying "help"
  document.getElementById("footerTag").style.right = `-${footerWidth-15}px`;    //moves the element back off the page
  }
  helpCount = helpCount + 1;                                                    //this increments the counter every time the button is clicked
}

function oddEvenCheck(x) {                                                      //this function recieves interegers and checks if they are odd or even
  if (x % 2 == 0) {                                                             //if the integer mod 2 equals 0 then it's even
    return true;                                                                //so return the boolean value of "true"
  }
  else {                                                                        //if not
    return false;                                                               //return "false"
  }
}
