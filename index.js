const formTypeSelector = document.querySelector("#formType");
const qualityTypeSelector = document.querySelector("#qualityType");

formTypeSelector.addEventListener("change", e => {
  if (e.target.selectedIndex >= 4) {
    qualityTypeSelector.setAttribute("disabled", true);
  } else {
    qualityTypeSelector.removeAttribute("disabled");
  }
});

const addAbilityButton = document.querySelector("#addAbility");
const abilitiesAddedList = document.querySelector("#abilitiesAddedList");
const abilityName = document.querySelector("#abilityName");
const abilityDescription = document.querySelector("#abilityDescription");
const abilityExceptions = document.querySelector("#abilityExceptions");

class Ability {
  constructor(abilityName, abilityDescription, abilityExceptions) {
    this.abilityName = abilityName;
    this.abilityDescription = abilityDescription;
    this.abilityExceptions = abilityExceptions;
  }
}

let abilitiesAdded = [];

addAbilityButton.addEventListener("click", e => {
  e.preventDefault();

  if (abilitiesAdded.length < 6) {
    const abilityToAdd = new Ability(
      abilityName.value,
      abilityDescription.value,
      abilityExceptions.value
    );

    abilitiesAdded.push(abilityToAdd);

    updateAddedAbilitiesList();
  }

  abilityName.value = "";
  abilityDescription.value = "";
  abilityExceptions.value = "";
});

function updateAddedAbilitiesList() {
  let temp = "";

  abilitiesAdded.forEach(element => {
    temp += `<button>${element.abilityName}</button>`;
  });

  abilitiesAddedList.innerHTML = temp;
}

abilitiesAddedList.addEventListener("click", e => {
  e.preventDefault();

  abilitiesAdded = abilitiesAdded.filter(element => {
    return element.abilityName !== e.target.textContent;
  });

  updateAddedAbilitiesList();
});

const eraseButton = document.querySelector("#erase");
const aionUser = document.querySelector("#aionUser");
eraseButton.addEventListener("click", e => {
  e.preventDefault();
  aionUser.value = "";
  aionName.value = "";
  abilityDescription.value = "";
  abilityName.value = "";
  abilityExceptions.value = "";
  abilitiesAddedList.innerHTML = "";
  abilitiesAdded = [];
});

const saveButton = document.querySelector("#save");
const statsATK = document.querySelector("#statsATK");
const statsDEF = document.querySelector("#statsDEF");
const statsAGL = document.querySelector("#statsAGL");
const statsPER = document.querySelector("#statsPER");
const statsRES = document.querySelector("#statsRES");

saveButton.addEventListener("click", e => {
  e.preventDefault();
  localStorage.clear();

  let obj = {
    aionUser: aionUser.value,
    aionName: aionName.value,
    formType: formType.selectedIndex,
    qualityType: qualityType.selectedIndex,
    statsATK: statsATK.selectedIndex,
    statsDEF: statsDEF.selectedIndex,
    statsAGL: statsAGL.selectedIndex,
    statsPER: statsPER.selectedIndex,
    statsRES: statsRES.selectedIndex,
    abilities: abilitiesAdded
  };

  localStorage.setItem("user", JSON.stringify(obj));
});

const loadButton = document.querySelector("#load");
loadButton.addEventListener("click", e => {
  e.preventDefault();
  let savedFields = JSON.parse(localStorage.getItem("user"));

  aionUser.value = savedFields.aionUser;
  aionName.value = savedFields.aionName;
  formType.selectedIndex = savedFields.formType;
  qualityType.selectedIndex = savedFields.qualityType;
  statsATK.selectedIndex = savedFields.statsATK;
  statsDEF.selectedIndex = savedFields.statsDEF;
  statsAGL.selectedIndex = savedFields.statsAGL;
  statsPER.selectedIndex = savedFields.statsPER;
  statsRES.selectedIndex = savedFields.statsRES;
  abilitiesAdded = savedFields.abilities;

  let savedAbilityList = "";
  savedFields.abilities.forEach(element => {
    savedAbilityList += `<button>${element.abilityName}</button>`;
  });

  abilitiesAddedList.innerHTML = savedAbilityList;
});

const generateButton = document.querySelector("#generate");
generateButton.addEventListener("click", e => {
  e.preventDefault();

  let BSA =
    (Number(statsATK.value) +
      Number(statsDEF.value) +
      Number(statsAGL.value) +
      Number(statsPER.value) +
      Number(statsRES.value)) /
    5;

  let aionClass;

  if (BSA < 1.9) {
    aionClass = "Class I";
  } else if (BSA < 3.9) {
    aionClass = "Class II";
  } else if (BSA < 6.9) {
    aionClass = "Class III";
  } else if (BSA < 8.9) {
    aionClass = "Class IV";
  } else {
    aionClass = "Class V";
  }

  let qualityTypeExport = qualityType.value;

  if (formType.selectedIndex >= 4) {
    qualityTypeExport = "Normal";
  }

  let exportData = {
    aionUser: aionUser.value,
    aionName: aionName.value,
    formType: formType.value,
    qualityType: qualityTypeExport,
    statsATK: Number(statsATK.value),
    statsDEF: Number(statsDEF.value),
    statsAGL: Number(statsAGL.value),
    statsPER: Number(statsPER.value),
    statsRES: Number(statsRES.value),
    abilities: abilitiesAdded,
    BSA: BSA,
    aionClass: aionClass
  };

  let abilitiesExport = "";
  for (let i in exportData.abilities) {
    abilitiesExport += `Ability ${Number(i) + 1}: ${
      exportData.abilities[i].abilityName
    }\n`;
  }

  let descriptionExport = "Description: ";
  for (let i in exportData.abilities) {
    descriptionExport += `${exportData.abilities[i].abilityDescription} `;
  }

  let exceptionExport = "Exceptions/Checks: ";
  for (let i in exportData.abilities) {
    exceptionExport += `${exportData.abilities[i].abilityExceptions} `;
  }

  let docDefinition = {
    content: [
      { text: `${exportData.aionUser}`, style: "header" },
      `${exportData.aionClass} Aion`,
      `${exportData.formType} ${exportData.qualityType} Aion`,
      {
        style: "tableExample",
        table: {
          body: [
            ["ATK", "DEF", "AGL", "PER", "RES", "BSA"],
            [
              `${exportData.statsATK}`,
              `${exportData.statsDEF}`,
              `${exportData.statsAGL}`,
              `${exportData.statsPER}`,
              `${exportData.statsRES}`,
              `${exportData.BSA}`
            ]
          ]
        }
      },
      abilitiesExport,
      descriptionExport,
      exceptionExport
    ]
  };

  pdfMake.createPdf(docDefinition).open();
});
