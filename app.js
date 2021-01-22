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
      searchResults = searchByTrait(people);
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
  return menuController(foundPerson);;
};

function menuController(currentResults) {
  if(currentResults.length > 1) {
    
    currentResults = multipleResultsMenu(currentResults);
    
  }
  else if(currentResults.length == 0) {
    currentResults = false;
  }
  else {
    currentResults = currentResults[0];
  }

  return currentResults;
}

function searchByTrait(people) {
  let output = "Enter the trait to search by: \n";
  let traits = "g: Gender \n";
  traits += "h: Height \n";
  traits += "w: Weight \n";
  traits += "e: Eye Color \n";
  traits += "o: Occupation \n";
  let selectedTrait = prompt(output + traits).toLowerCase();

  switch(selectedTrait) {
    case "g":
      people = getResultsBy("gender", people);
      break;
    case "h":
      people = getResultsBy("height", people);
      break;
    case "w":
      people = getResultsBy("weight", people);
      break;
    case "e":
      people = getResultsBy("eyeColor", people);
      break;
    case "o":
      people = getResultsBy("occupation", people);
      break;
    default:
      searchByTrait(people);
      break;
  }
  
  return menuController(people);

}

function getResultsBy(trait, people) {
  let traitValue = prompt(`Enter the value for ${trait}.`);
  let foundPeople = people.filter(function(person){
    if(person[trait] == traitValue) {
      return true;
    }
    return false;
  });
  return foundPeople;
}


function multipleResultsMenu(results) {
  let output = `${results.length} results found. Choose a number below for more information about that person. \n`;

  output += `${getNameList(results)}`

  let command = promptFor(output, chars);

  if(results[Number(command) - 1]) {
    return results[Number(command) - 1];

  }
  else if(command === "refine") {
    return searchByTrait(results);

  }
  else {
    return multipleResultsMenu(results);
  }
}

function getNameList(results) {
  let list = "";
  
  for(let i = 0; i < results.length; i++) {
      list += `${i + 1}: ${formatName(results[i])}\n`;
  }

  return list;
}

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
  personInfo += `Gender: ${getGender(person)}\n`;
  personInfo += `Height: ${getHeight(person)}\n`;
  personInfo += `Weight: ${getWeight(person)}\n`;
  personInfo += `Eye Color: ${getEyeColor(person)}\n`;
  personInfo += `Occupation: ${getOccupation(person)}\n`;

  // TODO: finish getting the rest of the information to display
  alert(personInfo);
};

function getGender(person) {
  return person.gender;
}

function getHeight(person) {
  return person.height;
}

function getWeight(person) {
  return person.weight;
}

function getEyeColor(person) {
  return person.eyeColor;
}

function getOccupation(person) {
  return person.occupation;
}

function displayFamily(person, people) {
  let output = '';

  output += getParents(person, people);
  output += getSpouse(person, people);
  output += getSiblings(person, people);

  if (!output) {
    output += 'No family information available.';
  }
  alert(output);
}

function getSpouse(person, people) {
  let output = '';
  
  let spouse = people.filter(function (possibleSpouse) {
    if (person.currentSpouse === possibleSpouse.id) {
      return true;
    } 
    return false;
  
  });

  if (spouse) {
    for(let i = 0; i < spouse.length; i++){
      output += `Spouse: ${formatName(spouse[i])}\n`;
    }
  }

  return output;
}

function getSiblings(person, people){
  let siblings = '';
  let siblingsArray = [];
  if (hasParents(person)){
    siblingsArray = people.filter(function(currentPerson) {
      if (currentPerson.id !== person.id){ // Not a sibling to yourself.
        for(let i = 0; i < currentPerson.parents.length; i++){
          if (person.parents.includes(currentPerson.parents[i])) {
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
  return `${person.firstName} ${person.lastName}`;
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
