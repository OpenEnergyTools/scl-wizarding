import { TemplateResult, html } from 'lit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Edit } from '@openenergytools/open-scd-core';

import { getReference } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';

import {
  Wizard,
  WizardActor,
  WizardInputElement,
  cloneElement,
  createElement,
  getValue,
} from '../foundation.js';
import { patterns } from './patterns.js';

type EnumValContent = {
  ord: string | null;
  desc: string | null;
  value: string | null;
};

function renderContent(content: EnumValContent): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="ord"
      .maybeValue=${content.ord}
      required
      type="number"
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="value"
      .maybeValue=${content.value}
      pattern="${patterns.normalizedString}"
      dialogInitialFocus
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      id="evDesc"
      label="desc"
      .maybeValue=${content.desc}
      nullable
      pattern="${patterns.normalizedString}"
    ></scl-wizarding-textfield>`,
  ];
}

function nextOrd(parent: Element): string {
  const maxOrd = Math.max(
    ...Array.from(parent.children).map(child =>
      parseInt(child.getAttribute('ord') ?? '-2', 10)
    )
  );
  // eslint-disable-next-line no-restricted-globals
  return isFinite(maxOrd) ? (maxOrd + 1).toString(10) : '0';
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const value = getValue(inputs.find(i => i.label === 'value')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const ord =
      getValue(inputs.find(i => i.label === 'ord')!) || nextOrd(parent);

    const element = createElement(parent.ownerDocument, 'EnumVal', {
      ord,
      desc,
    });

    element.textContent = value;

    const action = [
      {
        parent,
        node: element,
        reference: getReference(parent, 'EnumVal'),
      },
    ];

    return [action];
  };
}

export function createEnumValWizard(parent: Element): Wizard {
  const [ord, desc, value] = [nextOrd(parent), null, ''];

  return [
    {
      title: 'Add EnumVal',
      primary: {
        icon: '',
        label: 'Save',
        action: createAction(parent),
      },
      content: renderContent({ ord, desc, value }),
    },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const value = getValue(inputs.find(i => i.label === 'value')!) ?? '';
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const ord =
      getValue(inputs.find(i => i.label === 'ord')!) ||
      element.getAttribute('ord') ||
      nextOrd(element.parentElement!);

    if (
      value === element.textContent &&
      desc === element.getAttribute('desc') &&
      ord === element.getAttribute('ord')
    )
      return [];

    const newElement = cloneElement(element, { desc, ord });
    newElement.textContent = value;

    return [
      {
        parent: element.parentElement!,
        node: newElement,
        reference: getReference(element.parentElement!, 'EnumVal'),
      },
      { node: element },
    ];
  };
}

export function editEnumValWizard(element: Element): Wizard {
  const [ord, desc, value] = [
    element.getAttribute('ord'),
    element.getAttribute('desc'),
    element.textContent,
  ];

  return [
    {
      title: 'Edit EnumVal',
      primary: {
        icon: '',
        label: 'Save',
        action: updateAction(element),
      },
      content: renderContent({ ord, desc, value }),
    },
  ];
}
