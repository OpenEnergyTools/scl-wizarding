/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';
import { Edit } from '@openenergytools/open-scd-core';

import { getReference } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';

import {
  createElement,
  getChildElementsByTagName,
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

type ContentOptions = {
  name: string | null;
  desc: string | null;
  type: string | null;
  reservedNames: string[];
};

function contentProcessWizard(content: ContentOptions): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${content.name}
      required
      .reservedValues=${content.reservedNames}
      dialogInitialFocus
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${content.desc}
      nullable
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="type"
      .maybeValue=${content.type}
      nullable
    ></scl-wizarding-textfield>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const processKeys = ['name', 'desc', 'type'];
    processKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const process = createElement(parent.ownerDocument, 'Process', attributes);

    return [
      { parent, node: process, reference: getReference(parent, 'Process') },
    ];
  };
}

export function createProcessWizard(parent: Element): Wizard {
  const name = '';
  const desc = '';
  const type = '';
  const reservedNames: string[] = getChildElementsByTagName(
    parent.parentElement!,
    'Process'
  )
    .filter(sibling => sibling !== parent)
    .map(sibling => sibling.getAttribute('name')!);
  return [
    {
      title: 'Add Process',
      primary: {
        icon: 'save',
        label: 'save',
        action: createAction(parent),
      },
      content: [
        ...contentProcessWizard({
          name,
          desc,
          type,
          reservedNames,
        }),
      ],
    },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const tapProcessKeys = ['name', 'desc', 'type'];
    tapProcessKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (
      tapProcessKeys.some(key => attributes[key] !== element.getAttribute(key))
    ) {
      return [{ element, attributes }];
    }
    return [];
  };
}

export function editProcessWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');
  const reservedNames: string[] = getChildElementsByTagName(
    element.parentElement!,
    'Process'
  )
    .filter(sibling => sibling !== element)
    .map(sibling => sibling.getAttribute('name')!);

  return [
    {
      title: 'Edit Process',
      primary: {
        icon: 'save',
        label: 'save',
        action: updateAction(element),
      },
      content: [
        ...contentProcessWizard({
          name,
          desc,
          type,
          reservedNames,
        }),
      ],
    },
  ];
}
