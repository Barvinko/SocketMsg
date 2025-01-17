import { Spans } from '@type/enums';

export type ElementParamenter = {
  tag: string;
  className: string;
  parent?: HTMLElement;
};

export function createElement(tag: string, className: string, parent?: HTMLElement): HTMLElement {
  const element: HTMLElement = document.createElement(tag);
  element.className = className;
  if (parent) parent?.appendChild(element);

  return element;
}

export function createDiv(className: string, parent?: HTMLElement): HTMLDivElement {
  return createElement('div', className, parent) as HTMLDivElement;
}

export function createButton(className: string, text: string, parent?: HTMLElement): HTMLButtonElement {
  const button = createElement('button', className, parent) as HTMLButtonElement;
  button.innerText = text;
  return button;
}

export function createSpans(
  className: string,
  text: string,
  parent?: HTMLElement,
  tag: Spans = Spans.SPAN,
): HTMLSpanElement {
  const span = createElement(tag, className, parent) as HTMLSpanElement;
  span.innerText = text;
  return span;
}

export function createInput(className: string, type: string, parent?: HTMLElement): HTMLInputElement {
  const input = createElement('input', className, parent) as HTMLInputElement;
  input.type = type;
  return input;
}

export function createLabel(className: string, htmlFor: string, text: string, parent?: HTMLElement) {
  const element = createElement('label', className, parent) as HTMLLabelElement;
  element.htmlFor = htmlFor;
  element.innerText = text;

  return element;
}

export function createLink(className: string, text: string, src: string, parent?: HTMLElement): HTMLAnchorElement {
  const link = createElement('a', className, parent) as HTMLAnchorElement;
  link.textContent = text;
  link.href = src;
  link.target = '_blank';
  return link;
}
