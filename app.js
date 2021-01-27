"use strict";
/*
Build all of your functions for displaying and gathering information below (GUI).
*/

// app is the function called to start the entire application
function app(people) {
  let searchType = promptFor(
    "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
    yesNo
  );

  if (!searchType) {
    return;
  }

  let searchResults;
  switch (searchType.toLowerCase()) {
    case "yes":
      searchResults = searchByName(people);
      break;
    case "no":
      searchTerms.reset();
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
      getFullName(person) +
      " . Do you want to know their 'info', 'family', or 'descendants'? Type the option you want or 'restart' or 'quit'"
  );

  if (!displayOption) {
    return;
  }

  switch (displayOption.toLowerCase()) {
    case "info":
      displayPerson(person);
      break;
    case "family":
      displayFamily(person, people);
      break;
    case "descendants":
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

function multipleResultsMenu(results) {
  let output = `${makeList(getSearchTerms())} \n\n`;
  output += `${results.length} results found. Choose a number below for more information about that person. To refine your search, type 'refine'.\n\n`;
  output += `${makeList(getNames(results))}\n`;

  let command = promptFor(output, chars);

  if (!command) {
    return;
  }

  if (results[Number(command) - 1]) {
    return results[Number(command) - 1];
  } else if (command === "refine") {
    return searchByTrait(results);
  } else {
    return multipleResultsMenu(results);
  }
}

function searchByName(people) {
  let firstName = promptFor("What is the person's first name?", chars);
  let lastName = promptFor("What is the person's last name?", chars);
  let fullName = `${firstName} ${lastName}`;
  let foundPerson = getResultsByName(fullName, people);

  return menuController(foundPerson);
}

function getResultsByName(name, people) {
  return people.filter((person) => {
    if (compareStrings(getFullName(person), name)) {
      return true;
    } else {
      return false;
    }
  });
}

function searchByTrait(people) {
  let output = "Enter the trait to search by: \n" + getSearchableTraitsList();

  let command = promptFor(output, isValidTraitCommand);

  let trait = getTraitByCommand(command);

  if (!trait) {
    throw "Invalid Trait Command!";
  }

  people = getResultsBy(trait, people);

  return menuController(people);
}

function getResultsBy(trait, people) {
  let traitValue = promptFor(
    `Enter the value for ${trait.label.toLowerCase()}.`,
    trait.validation
  );

  if (!traitValue) {
    return [];
  }

  searchTerms.terms.push({
    trait: trait.label,
    value: traitValue.toLowerCase(),
  });

  let foundPeople = people.filter((person) => {
    if (person[trait.key] == traitValue.toLowerCase()) {
      return true;
    }
    return false;
  });

  return foundPeople;
}

function getNames(results, prefix = false) {
  return results.map(
    (person, index) =>
      `${getFullName(person, prefix ? prefix : `${index + 1}: `)}`
  );
}

function getFullName(person, prefix = "") {
  return `${prefix}${person.firstName} ${person.lastName}`;
}

function getGender(person) {
  return checkProperty(person.gender);
}

function getDOB(person) {
  return checkProperty(person.dob);
}

function getAge(person) {
  let valid = checkProperty(person.dob);

  if (valid) {
    let now = Date.now();
    let [month, day, year] = person.dob.split("/");
    let birthday = new Date(Number(year), Number(month) - 1, Number(day));
    let difference = now - birthday;
    let days = difference / (1000 * 60 * 60 * 24);

    return Math.abs(Math.floor(days / 365.25));
  }

  return valid;
}

function getHeight(person) {
  return checkProperty(person.height);
}

function getWeight(person) {
  return checkProperty(person.weight);
}

function getEyeColor(person) {
  return checkProperty(person.eyeColor);
}

function getOccupation(person) {
  return checkProperty(person.occupation);
}

function getDescendants(person, people) {
  let descendants = people.filter((possibleDescendant) => {
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

  return getNames(spouse, "Spouse: ");
}

function getSiblings(person, people) {
  let siblings = people.filter((currentPerson) => {
    if (currentPerson.id !== person.id) {
      // exclude yourself from the sibling list
      for (let i = 0; i < currentPerson.parents.length; i++) {
        if (person.parents.includes(currentPerson.parents[i])) {
          return true;
        }
      }
    }
    return false;
  });

  return getNames(siblings, "Sibling: ");
}

function getParents(person, people) {
  return people

    .filter((possibleParent) => {
      if (person.parents.includes(possibleParent.id)) {
        if (possibleParent.gender == "male") {
          possibleParent.relationship = "Father: ";
        } else {
          possibleParent.relationship = "Mother: ";
        }
        return true;
      }
      return false;
    })
    .map((parent) => `${parent.relationship} ${getFullName(parent)}`);
}

function displayPerson(person) {
  let personInfo = infoTraits
    .map((trait) => `${trait.label}: ${trait.get(person)}`)
    .join("\n");

  alert(personInfo);
}

function displayFamily(person, people) {
  let family = [
    ...getParents(person, people),
    ...getSpouse(person, people),
    ...getSiblings(person, people),
  ];

  let output = makeList(family);

  if (!output) {
    output = "No family information available.";
  }

  alert(output);
}

function makeList(items) {
  return items.join("\n");
}

function displayDescendants(person, people) {
  let message = "Descendants:\n";
  let descendants = getDescendants(person, people).map((person) =>
    getFullName(person)
  );

  if (descendants.length === 0) {
    message = `${getFullName(person)} does not have any descendants.`;
  } else {
    message += descendants.join("\n");
  }
  alert(message);
}

// function that prompts and validates user input
function promptFor(question, valid) {
  do {
    var response = prompt(question);
    if (response) {
      response = response.trim();
    } else {
      break;
    }
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
  { label: "Name", get: getFullName },
  { label: "Gender", get: getGender },
  { label: "Birthdate", get: getDOB },
  { label: "Age", get: getAge },
  { label: "Height", get: getHeight },
  { label: "Weight", get: getWeight },
  { label: "Eye Color", get: getEyeColor },
  { label: "Occupation", get: getOccupation },
];

const searchTerms = {
  terms: [],
  reset: function () {
    this.terms = [];
  },
};

function getSearchTerms() {
  return searchTerms.terms.map((term) => `${term.trait}: ${term.value}`);
}

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
  let searchedTerms = searchTerms.terms.map((term) => term.trait);

  return searchableTraits
    .filter((trait) => {
      if (searchedTerms.includes(trait.label)) {
        return false;
      }
      return true;
    })
    .map((trait) => `${trait.command}: ${trait.label}`)
    .join("\n");
}

function getTraitByCommand(command) {
  let traits = searchableTraits.filter((trait) => {
    if (trait.command === command) {
      return true;
    }

    return false;
  });

  if (traits.length > 0) {
    return traits[0];
  }

  return false;
}

function compareStrings(string1, string2) {
  return string1.trim().toLowerCase() === string2.trim().toLowerCase();
}

function checkProperty(property) {
  return property ? property : "Not available";
}
