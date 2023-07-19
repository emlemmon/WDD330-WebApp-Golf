import { getLocalStorage, setLocalStorage } from "./utils.mjs";

export function initSettings() {
  changeSetting("isPink", "pink", "blue");
  changeSetting("isStandard", "standard", "wilds");

  document
    .querySelectorAll("input[name='backColor']")
    .forEach((radioButton) =>
      radioButton.addEventListener("change", () =>
        onChange("backColor", "pink", "blue", "isPink")
      )
    );

  document
    .querySelectorAll("input[name='scoringChoice']")
    .forEach((radioButton) =>
      radioButton.addEventListener("change", () =>
        onChange("scoringChoice", "standard", "wilds", "isStandard")
      )
    );
}

function changeSetting(localStr, first, second) {
  let setting = getLocalStorage(localStr);
  if (setting === null) {
    setting = true;
  }
  if (setting) {
    document.getElementById(first).checked = true;
  } else {
    document.getElementById(second).checked = true;
  }
}

function onChange(selection, first, second, localStr) {
  const radioBtns = document.querySelectorAll(`input[name=${selection}]`);
  for (const i of radioBtns) {
    if (i.checked && i.value === first) {
      setLocalStorage(localStr, true);
    } else if (i.checked && i.value === second) {
      setLocalStorage(localStr, false);
    }
  }
}
