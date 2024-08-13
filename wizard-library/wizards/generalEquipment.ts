/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';
import { Edit } from '@openscd/open-scd-core';

import { getReference } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';
import '../../foundation/components/scl-wizarding-checkbox.js';

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
  desc: string | null;
  type: string | null;
  virtual: string | null;
  reservedValues: string[];
};

export function contentGeneralEquipmentWizard(
  options: RenderOptions
): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${options.name}
      required
      .reservedValues=${options.reservedValues}
      dialogInitialFocus
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${options.desc}
      nullable
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="type"
      .maybeValue=${options.type}
      minLength="3"
      pattern="AXN|BAT|MOT|FAN|FIL|PMP|TNK|VLV|E[A-Z]*"
      required
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-checkbox
      label="virtual"
      .maybeValue=${options.virtual}
      nullable
    ></scl-wizarding-checkbox>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const generalEquipmentKeys = ['name', 'desc', 'type', 'virtual'];
    generalEquipmentKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const generalEquipment = createElement(
      parent.ownerDocument,
      'GeneralEquipment',
      attributes
    );

    return [
      {
        parent,
        node: generalEquipment,
        reference: getReference(parent, 'GeneralEquipment'),
      },
    ];
  };
}

export function createGeneralEquipmentWizard(parent: Element): Wizard {
  const name = '';
  const desc = null;
  const type = null;
  const virtual = null;

  return [
    {
      title: 'Add GeneralEquipment',
      primary: {
        icon: 'save',
        label: 'save',
        action: createAction(parent),
      },
      content: [
        ...contentGeneralEquipmentWizard({
          name,
          desc,
          type,
          virtual,
          reservedValues: reservedNames(parent, 'GeneralEquipment'),
        }),
      ],
    },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const generalEquipmentKeys = ['name', 'desc', 'type', 'virtual'];
    generalEquipmentKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (
      generalEquipmentKeys.some(
        key => attributes[key] !== element.getAttribute(key)
      )
    ) {
      return [{ element, attributes }];
    }

    return [];
  };
}

export function editGeneralEquipmentWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');
  const virtual = element.getAttribute('virtual');

  return [
    {
      title: 'Edit GeneralEquipment',
      primary: {
        icon: 'save',
        label: 'save',
        action: updateAction(element),
      },
      content: [
        ...contentGeneralEquipmentWizard({
          name,
          desc,
          type,
          virtual,
          reservedValues: reservedNames(element),
        }),
      ],
    },
  ];
}
