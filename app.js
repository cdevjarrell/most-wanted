"use strict"
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people){
  let searchType = promptFor("Do you know the name of the person you are looking for? Enter 'yes' or 'no'", yesNo).toLowerCase();
  let searchResults;
  switch(searchType){
    case 'yes':
      searchResults = searchByName(people);
      break;
    case 'no':
      // TODO: search by traits
      break;
      default:
    app(people); // restart app
      break;
  }
  
  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
};

// Menu function to call once you find who you are looking for
function mainMenu(person, people){

  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if(!person){
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt("Found " + person.firstName + " " + person.lastName + " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'");

  switch(displayOption){
    case "info":
    // TODO: get person's info
    displayPerson(person);
    break;
    case "family":
    displayFamily(person, people);
    break;
    case "descendants":
    // TODO: get person's descendants
    break;
    case "restart":
    app(people); // restart
    break;
    case "quit":
    return; // stop execution
    default:
    return mainMenu(person, people); // ask again
  }
};

function searchByName(people){
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function(person){
    if(person.firstName === firstName && person.lastName === lastName){
      return true;
    }
    else{
      return false;
    }
  })
  // TODO: find the person using the name they entered
  // No results, 1 result, or multiple.
  return foundPerson[0];
};

// alerts a list of people
function displayPeople(people){
  alert(people.map(function(person){
    return person.firstName + " " + person.lastName;
  }).join("\n"));
};

function displayPerson(person){
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = "First Name: " + person.firstName + "\n";
  personInfo += "Last Name: " + person.lastName + "\n";
  personInfo += `${getGender(person)}\n`;
  personInfo += `${getHeight(person)}\n`;
  personInfo += `${getWeight(person)}\n`;
  personInfo += `${getEyeColor(person)}\n`;
  personInfo += `${getOccupation(person)}\n`;
  personInfo += `${getGender(person)}\n`;

  // TODO: finish getting the rest of the information to display
  alert(personInfo);
};

function getGender(person) {
  return "Gender: " + person.gender;
}

function getHeight(person) {
  return "Height: " + person.height;
}

function getWeight(person) {
  return "Weight: " + person.weight;
}

function getEyeColor(person) {
  return "Eye Color: " + person.eyeColor;
}

function getOccupation(person) {
  return "Occupation: " + person.occupation;
}

function displayFamily(person, people) {
  let output = '';

  output += getParents(person, people);
  output += getSiblings(person, people);

  alert(output);
}

function getSiblings(person, people){
  let siblings = '';
  let siblingsArray = [];
  if (hasParents(person)){
    siblingsArray = people.filter(function(currentPerson) {
      if (currentPerson.id !== person.id){ // Not a sibling to yourself.
        for(let i = 0; i < currentPerson.parents.length; i++){
          if (currentPerson.parents[i] === person.parents[0]) { // Need to check for both parents, only checks against first parent currently.
            return true;
          }
        }
      }
      return false;
    })
  }

  if (siblingsArray) {
    for(let i = 0; i < siblingsArray.length; i++){
      siblings += `Sibling: ${formatName(siblingsArray[i])}\n`;
    }
  }

  return siblings;
};

function getParents(person, people) {
  let output = '';

  for (let i = 0; i < person.parents.length; i++) {
    let id = person.parents[i];
    let parent = people.filter(function (possibleParent) {
      if (possibleParent.id === id) {
        return true;
      }
      return false;
    });

    if (parent) {
      output += `Parent: ${formatName(parent[0])}\n`;
    }
  }

  return output;
}

function formatName(person){
  return person.firstName + " " + person.lastName;
}

function hasParents(person){
  if (person.parents.length !== 0){
    return true;
  }
  return false;
}

// function that prompts and validates user input
function promptFor(question, valid){
  do{
    var response = prompt(question).trim();
  } while(!response || !valid(response));
  return response;
};

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input){
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
};

// helper function to pass in as default promptFor validation
function chars(input){
  return true; // default validation only
};
