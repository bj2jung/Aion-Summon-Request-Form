const formType = document.querySelector("#formType");
const qualityType = document.querySelector("#qualityType");
const xetherianEvolutionary = document.querySelector("#xetherianEvolutionary");

formType.addEventListener("change", () => {
  disableSelectors();
});

const addAbilityButton = document.querySelector("#addAbilityButton");
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

document.getElementById("abilityForm").addEventListener(
  "submit",
  e => {
    e.preventDefault();
    if (abilitiesAdded.length < 6) {
      const abilityToAdd = new Ability(
        abilityName.value,
        abilityDescription.value,
        abilityExceptions.value
      );

      abilitiesAdded.push(abilityToAdd);

      updateAddedAbilitiesList();
      abilityName.value = "";
      abilityDescription.value = "";
      abilityExceptions.value = "";
    }
  },
  false
);

document.getElementById("abilityForm").addEventListener("input", () => {
  if (
    abilityName.value &&
    abilityDescription.value &&
    abilityExceptions.value
  ) {
    addAbilityButton.removeAttribute("disabled");
  } else {
    addAbilityButton.setAttribute("disabled", true);
  }
});

function disableSelectors() {
  if (formType.selectedIndex >= 4) {
    qualityType.setAttribute("disabled", true);
    xetherianEvolutionary.setAttribute("disabled", true);
  } else {
    qualityType.removeAttribute("disabled");
    xetherianEvolutionary.removeAttribute("disabled");
  }
}

function updateAddedAbilitiesList() {
  let temp = "";

  abilitiesAdded.forEach(element => {
    temp += `<button class="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="${
      element.abilityDescription
    } \n${element.abilityExceptions} \nclick to remove">${
      element.abilityName
    }</button> `;
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
  formType.selectedIndex = 0;
  qualityType.selectedIndex = 0;
  statsATK.selectedIndex = 0;
  statsDEF.selectedIndex = 0;
  statsAGL.selectedIndex = 0;
  statsPER.selectedIndex = 0;
  statsRES.selectedIndex = 0;
  xetherianEvolutionary.checked = false;
  abilityDescription.value = "";
  abilityName.value = "";
  abilityExceptions.value = "";
  abilitiesAddedList.innerHTML = "";
  abilitiesAdded = [];

  disableSelectors();
  disableGenerateButton();
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
    xetherianEvolutionary: xetherianEvolutionary.checked,
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
  xetherianEvolutionary.checked = savedFields.xetherianEvolutionary;
  abilitiesAdded = savedFields.abilities;

  updateAddedAbilitiesList();
  disableSelectors();
  disableGenerateButton();
});

const generateButton = document.querySelector("#generate");

document.querySelector("#aionForm").addEventListener("input", () => {
  disableGenerateButton();
});

function disableGenerateButton() {
  if (aionUser.value && aionName.value) {
    generateButton.removeAttribute("disabled");
  } else {
    generateButton.setAttribute("disabled", true);
  }
}

generateButton.addEventListener("click", e => {
  e.preventDefault();

  let BSA =
    (Number(statsATK.selectedIndex) +
      Number(statsDEF.selectedIndex) +
      Number(statsAGL.selectedIndex) +
      Number(statsPER.selectedIndex) +
      Number(statsRES.selectedIndex)) /
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
  let xetherianEvolutionaryExport = xetherianEvolutionary.checked ? "XE" : "";

  if (formType.selectedIndex >= 4) {
    qualityTypeExport = "Normal";
  }

  let exportData = {
    aionUser: aionUser.value,
    aionName: aionName.value,
    formType: formType.value,
    qualityType: qualityTypeExport,
    xetherianEvolutionary: xetherianEvolutionaryExport,
    statsATK: Number(statsATK.selectedIndex),
    statsDEF: Number(statsDEF.selectedIndex),
    statsAGL: Number(statsAGL.selectedIndex),
    statsPER: Number(statsPER.selectedIndex),
    statsRES: Number(statsRES.selectedIndex),
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
      {
        text: `${exportData.aionUser}`,
        fontSize: 24,
        bold: true
      },
      "\n",
      {
        text: `${exportData.aionName} ${exportData.xetherianEvolutionary}`,
        italics: true
      },
      {
        text: `${exportData.aionClass} Aion`,
        italics: true
      },
      {
        text: `${exportData.formType} ${exportData.qualityType} Aion`,
        italics: true
      },
      "\n",
      "\n",
      {
        style: "tableExample",
        table: {
          widths: [75, 75, 75, 75, 75, 75],
          body: [
            [
              { text: "ATK", alignment: "center" },
              { text: "DEF", alignment: "center" },
              { text: "AGL", alignment: "center" },
              { text: "PER", alignment: "center" },
              { text: "RES", alignment: "center" },
              { text: "BSA", alignment: "center" }
            ],
            [
              { text: `${exportData.statsATK}`, alignment: "center" },
              { text: `${exportData.statsDEF}`, alignment: "center" },
              { text: `${exportData.statsAGL}`, alignment: "center" },
              { text: `${exportData.statsPER}`, alignment: "center" },
              { text: `${exportData.statsRES}`, alignment: "center" },
              { text: `${exportData.BSA}`, alignment: "center" }
            ]
          ]
        }
      },
      "\n",
      "\n",
      abilitiesExport,
      "\n",
      descriptionExport,
      "\n",
      exceptionExport
    ]
  };

  pdfMake.createPdf(docDefinition).open(); //TODO: download?
});
