/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';
import { Edit } from '@openscd/open-scd-core';

import '../../foundation/components/scl-wizarding-textfield.js';

import {
  createElement,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

import { getReference } from '../../foundation/utils/scldata.js';

const defaultPowerTransformerType = 'PTR';

type RenderOptions = {
  name: string | null;
  desc: string | null;
  type: string | null;
  reservedValues: string[];
};

function renderPowerTransformerWizard(
  options: RenderOptions
): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${options.name}
      required
      dialogInitialFocus
      .reservedValues=${options.reservedValues}
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${options.desc}
      nullable
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="type"
      .maybeValue=${options.type}
      disabled
    ></scl-wizarding-textfield>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const powerTransformer = createElement(
      parent.ownerDocument,
      'PowerTransformer',
      {
        name,
        desc,
        type: defaultPowerTransformerType,
      }
    );

    return [
      {
        parent,
        node: powerTransformer,
        reference: getReference(parent, 'PowerTransformer'),
      },
    ];
  };
}

export function createPowerTransformerWizard(parent: Element): Wizard {
  return [
    {
      title: 'Add PowerTransformer',
      primary: {
        icon: '',
        label: 'add',
        action: createAction(parent),
      },
      content: renderPowerTransformerWizard({
        name: '',
        reservedValues: reservedNames(parent, 'PowerTransformer'),
        desc: null,
        type: defaultPowerTransformerType,
      }),
    },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc')
    )
      return [];

    return [{ element, attributes: { name, desc } }];
  };
}

export function editPowerTransformerWizard(element: Element): Wizard {
  return [
    {
      title: 'Edit PowerTransformer',
      primary: {
        icon: 'edit',
        label: 'save',
        action: updateAction(element),
      },
      content: renderPowerTransformerWizard({
        name: element.getAttribute('name'),
        reservedValues: reservedNames(element),
        desc: element.getAttribute('desc'),
        type: element.getAttribute('type'),
      }),
    },
  ];
}
