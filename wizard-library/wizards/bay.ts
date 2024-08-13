/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';

import { Edit } from '@openscd/open-scd-core';
import { getReference, updateBay } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';

import {
  createElement,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

type RenderOptions = {
  name: string | null;
  reservedValues: string[];
  desc: string | null;
};

export function renderBayWizard(options: RenderOptions): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${options.name}
      required
      .reservedValues="${options.reservedValues}"
      dialogInitialFocus
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${options.desc}
      nullable
    ></scl-wizarding-textfield>`,
  ];
}

export function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const node = createElement(parent.ownerDocument, 'Bay', {
      name,
      desc,
    });

    const action = {
      parent,
      node,
      reference: getReference(parent, 'Bay'),
    };

    return [action];
  };
}

export function createBayWizard(parent: Element): Wizard {
  return [
    {
      title: 'Add Bay',
      primary: {
        icon: '',
        label: 'add',
        action: createAction(parent),
      },
      content: renderBayWizard({
        name: '',
        reservedValues: reservedNames(parent, 'Bay'),
        desc: '',
      }),
    },
  ];
}

export function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc')
    )
      return [];

    return updateBay({ element, attributes: { name, desc } });
  };
}

export function editBayWizard(element: Element): Wizard {
  return [
    {
      title: 'Edit Bay',
      primary: {
        icon: 'edit',
        label: 'save',
        action: updateAction(element),
      },
      content: renderBayWizard({
        name: element.getAttribute('name'),
        reservedValues: reservedNames(element),
        desc: element.getAttribute('desc'),
      }),
    },
  ];
}
