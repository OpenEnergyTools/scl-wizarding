/* eslint-disable import/no-extraneous-dependencies */
import { Edit } from '@openscd/open-scd-core';

import { getReference } from '@openenergytools/scl-lib';

import {
  createElement,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import { contentFunctionWizard } from './function.js';

function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const eqFunctionKeys = ['name', 'desc', 'type'];
    eqFunctionKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const eqFunction = createElement(
      parent.ownerDocument,
      'EqFunction',
      attributes
    );

    return [
      {
        parent,
        node: eqFunction,
        reference: getReference(parent, 'EqFunction'),
      },
    ];
  };
}

export function createEqFunctionWizard(parent: Element): Wizard {
  const name = '';
  const desc = null;
  const type = null;

  return [
    {
      title: 'Add EqFunction',
      primary: {
        icon: 'save',
        label: 'save',
        action: createAction(parent),
      },
      content: [
        ...contentFunctionWizard({
          name,
          desc,
          type,
          reservedValues: reservedNames(parent, 'EqFunction'),
        }),
      ],
    },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const functionKeys = ['name', 'desc', 'type'];
    functionKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (
      functionKeys.some(key => attributes[key] !== element.getAttribute(key))
    ) {
      return [{ element, attributes }];
    }

    return [];
  };
}

export function editEqFunctionWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');

  return [
    {
      title: 'Edit EqFunction',
      primary: {
        icon: 'save',
        label: 'save',
        action: updateAction(element),
      },
      content: [
        ...contentFunctionWizard({
          name,
          desc,
          type,
          reservedValues: reservedNames(element),
        }),
      ],
    },
  ];
}
