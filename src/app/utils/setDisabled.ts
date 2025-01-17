type disabledElement = HTMLInputElement | HTMLButtonElement;

export function setDisabled(arr: disabledElement[], disabled: boolean) {
  arr.forEach((element) => {
    element.disabled = disabled;
  });
}
