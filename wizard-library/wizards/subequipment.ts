import { html, TemplateResult } from 'lit';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Edit } from '@openenergytools/open-scd-core';

import { getReference } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';
import '../../foundation/components/scl-wizarding-select.js';
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
  phase: string | null;
  virtual: string | null;
  reservedValues: string[];
};

function contentSubEquipmentWizard(options: RenderOptions): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${options.name}
      .reservedValues=${options.reservedValues}
      required
      dialogInitialFocus
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${options.desc}
      nullable
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-select
      label="phase"
      fixedMenuPosition
      .maybeValue=${options.phase}
      nullable
    >
      ${['A', 'B', 'C', 'N', 'all', 'none', 'AB', 'BC', 'CA'].map(
        value =>
          html`<mwc-list-item value="${value}">
            ${value.charAt(0).toUpperCase() + value.slice(1)}
          </mwc-list-item>`
      )}
    </scl-wizarding-select> `,
    html`<scl-wizarding-checkbox
      label="virtual"
      .maybeValue=${options.virtual}
      nullable
    ></scl-wizarding-checkbox>`,
  ];
}

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const subEquipmentAttrs: Record<string, string | null> = {};
    const subEquipmentKeys = ['name', 'desc', 'phase', 'virtual'];
    subEquipmentKeys.forEach(key => {
      subEquipmentAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const subEquipment = createElement(
      parent.ownerDocument,
      'SubEquipment',
      subEquipmentAttrs
    );

    return [
      {
        parent,
        node: subEquipment,
        reference: getReference(parent, 'SubEquipment'),
      },
    ];
  };
}

export function createSubEquipmentWizard(parent: Element): Wizard {
  const name = '';
  const desc = null;
  const phase = null;
  const virtual = null;

  return [
    {
      title: 'Add SubEquipment',
      primary: {
        icon: 'save',
        label: 'save',
        action: createAction(parent),
      },
      content: [
        ...contentSubEquipmentWizard({
          name,
          desc,
          phase,
          virtual,
          reservedValues: reservedNames(parent, 'SubEquipment'),
        }),
      ],
    },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const subFunctionKeys = ['name', 'desc', 'phase', 'virtual'];
    subFunctionKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (
      subFunctionKeys.some(key => attributes[key] !== element.getAttribute(key))
    )
      return [{ element, attributes }];

    return [];
  };
}

export function editSubEquipmentWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const phase = element.getAttribute('phase');
  const virtual = element.getAttribute('virtual');

  return [
    {
      title: 'Edit SubEquipment',
      primary: {
        icon: 'save',
        label: 'save',
        action: updateAction(element),
      },
      content: [
        ...contentSubEquipmentWizard({
          name,
          desc,
          phase,
          virtual,
          reservedValues: reservedNames(element),
        }),
      ],
    },
  ];
}
