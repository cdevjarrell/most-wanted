"use strict";
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor(
    "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
    yesNo
  ).toLowerCase();
  let searchResults;
  switch (searchType) {
    case "yes":
      searchResults = searchByName(people);
      break;
    case "no":
      searchResults = searchByTrait(people);
      break;
    default:
      app(people); // restart app
      break;
  }

  // Call the mainMenu function ONLY after you find the SINGLE person you are looking for
  mainMenu(searchResults, people);
}

// Menu function to call once you find who you are looking for
function mainMenu(person, people) {
  /* Here we pass in the entire person object that we found in our search, as well as the entire original dataset of people. We need people in order to find descendants and other information that the user may want. */

  if (!person) {
    alert("Could not find that individual.");
    return app(people); // restart
  }

  let displayOption = prompt(
    "Found " +
      person.firstName +
      " " +
      person.lastName +
      " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'"
  );

  switch (displayOption) {
    case "info":
      // TODO: get person's info
      displayPerson(person);
      break;
    case "family":
      displayFamily(person, people);
      break;
    case "descendants":
      // TODO: get person's descendants
      displayDescendants(person, people);
      break;
    case "restart":
      app(people); // restart
      break;
    case "quit":
      return; // stop execution
    default:
      return mainMenu(person, people); // ask again
  }
}

function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);

  let foundPerson = people.filter(function (person) {
    if (person.firstName === firstName && person.lastName === lastName) {
      return true;
    } else {
      return false;
    }
  });
  // TODO: find the person using the name they entered
  // No results, 1 result, or multiple.
  return menuController(foundPerson);
}

function menuController(currentResults) {
  if (currentResults.length > 1) {
    currentResults = multipleResultsMenu(currentResults);
  } else if (currentResults.length == 0) {
    currentResults = false;
  } else {
    currentResults = currentResults[0];
  }

  return currentResults;
}

function searchByTrait(people) {
  let output = "Enter the trait to search by: \n" + getSearchableTraitsList();

  let command = promptFor(output, isValidTraitCommand);

  let trait = getTraitByCommand(command);

  people = getResultsBy(trait, people);

  return menuController(people);
}

function getResultsBy(trait, people) {
  let traitValue = promptFor(
    `Enter the value for ${trait.label.toLowerCase()}.`,
    trait.validation
  );
  let foundPeople = people.filter(function (person) {
    if (person[trait.key] == traitValue.toLowerCase()) {
      return true;
    }
    return false;
  });
  return foundPeople;
}

function multipleResultsMenu(results) {
  let output = `${results.length} results found. Choose a number below for more information about that person. \n`;

  output += `${getNameList(results)}\n`;
  output += "To refine your search, type 'refine'.";

  let command = promptFor(output, chars);

  if (results[Number(command) - 1]) {
    return results[Number(command) - 1];
  } else if (command === "refine") {
    return searchByTrait(results);
  } else {
    return multipleResultsMenu(results);
  }
}

function getNameList(results, prefix = false) {
  return (
    results
      .map(function (person, index) {
        return `${formatName(person, prefix ? prefix : `${index + 1}:`)}`;
      })
      .join("\n") + "\n"
  );
}

function displayPerson(person) {
  // print all of the information about a person:
  // height, weight, age, name, occupation, eye color.
  let personInfo = infoTraits
    .map((trait) => `${trait.label}: ${trait.get(person)}`)
    .join("\n");

  // TODO: finish getting the rest of the information to display
  alert(personInfo);
}

function getGender(person) {
  return person.gender;
}

function getDOB(person) {
  return person.dob;
}

function getAge(person) {
  let now = Date.now();
  let [month, day, year] = person.dob.split("/");
  let birthday = new Date(Number(year), Number(month), Number(day));
  let difference = now - birthday;
  let days = difference / (1000 * 60 * 60 * 24);

  return Math.abs(Math.floor(days / 365.25));
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
  let output = "";

  output += getParents(person, people);
  output += getSpouse(person, people);
  output += getSiblings(person, people);

  if (!output) {
    output += "No family information available.";
  }
  alert(output);
}

function displayDescendants(person, people) {
  let message = "Descendants:\n";
  let descendants = getDescendants(person, people).map((person) =>
    formatName(person)
  );

  if (descendants.length === 0) {
    message = `${formatName(person)} does not have any descendants.`;
  } else {
    message += descendants.join("\n");
  }
  alert(message);
}

function getDescendants(person, people) {
  let descendants = people.filter(function (possibleDescendant) {
    if (possibleDescendant.parents.includes(person.id)) {
      return true;
    }
    return false;
  });

  for (person of descendants) {
    descendants = [...descendants, ...getDescendants(person, people)];
  }

  return descendants;
}

function getSpouse(person, people) {
  let spouse = people.filter((possibleSpouse) => {
    if (person.currentSpouse === possibleSpouse.id) {
      return true;
    }
    return false;
  });

  return getNameList(spouse, "Spouse:");
}

function getSiblings(person, people) {
  let siblings = people.filter((currentPerson) => {
    if (currentPerson.id !== person.id) {
      // Not a sibling to yourself.
      for (let i = 0; i < currentPerson.parents.length; i++) {
        if (person.parents.includes(currentPerson.parents[i])) {
          return true;
        }
      }
    }
    return false;
  });

  return getNameList(siblings, "Sibling:");
}

function getParents(person, people) {
  let parents = people.filter((possibleParent) => {
    if (person.parents.includes(possibleParent.id)) {
      return true;
    }

    return false;
  });

  return getNameList(parents, "Parent:");
}

function formatName(person, prefix = "") {
  return `${prefix} ${person.firstName} ${person.lastName}`;
}

// function that prompts and validates user input
function promptFor(question, valid) {
  do {
    var response = prompt(question).trim();
  } while (!response || !valid(response));
  return response;
}

// helper function to pass into promptFor to validate yes/no answers
function yesNo(input) {
  return input.toLowerCase() == "yes" || input.toLowerCase() == "no";
}

// helper function to pass in as default promptFor validation
function chars(input) {
  return true; // default validation only
}

function isValidTraitCommand(input) {
  let commands = searchableTraits.map((trait) => trait.command);

  return commands.includes(input.toLowerCase());
}

function isValidGender(input) {
  return input.toLowerCase() === "male" || input.toLowerCase() === "female";
}

function isValidNumber(input) {
  let numberInput = Number(input);
  return !isNaN(numberInput);
}

function isValidEyeColor(input) {
  let eyeColors = ["brown", "blue", "hazel", "amber", "black", "green", "grey"];

  return eyeColors.includes(input.toLowerCase());
}

const infoTraits = [
  { label: "Name", get: formatName },
  { label: "Gender", get: getGender },
  { label: "Birthdate", get: getDOB },
  { label: "Age", get: getAge },
  { label: "Height", get: getWeight },
  { label: "Eye Color", get: getEyeColor },
  { label: "Occupation", get: getOccupation },
];

const searchableTraits = [
  { key: "gender", label: "Gender", command: "g", validation: isValidGender },
  { key: "height", label: "Height", command: "h", validation: isValidNumber },
  { key: "weight", label: "Weight", command: "w", validation: isValidNumber },
  {
    key: "eyeColor",
    label: "Eye Color",
    command: "e",
    validation: isValidEyeColor,
  },
  { key: "occupation", label: "Occupation", command: "o", validation: chars },
];

function getSearchableTraitsList() {
  return searchableTraits
    .map((trait) => {
      return `${trait.command}: ${trait.label}`;
    })
    .join("\n");
}

function getTraitByCommand(command) {
  return searchableTraits.filter((trait) => {
    if (trait.command === command) {
      return true;
    }
    return false;
  })[0];
}
