/* eslint-disable import/no-extraneous-dependencies */
import { Edit } from '@openscd/open-scd-core';

import {
  createElement,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import { contentFunctionWizard } from './function.js';
import { getReference } from '../../foundation/utils/scldata.js';

function createEqSubFunctionAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const eqSubFunctionKeys = ['name', 'desc', 'type'];
    eqSubFunctionKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const eqSubFunction = createElement(
      parent.ownerDocument,
      'EqSubFunction',
      attributes
    );

    return [
      {
        parent,
        node: eqSubFunction,
        reference: getReference(parent, 'EqSubFunction'),
      },
    ];
  };
}

export function createEqSubFunctionWizard(parent: Element): Wizard {
  const name = '';
  const desc = null;
  const type = null;

  return [
    {
      title: 'Add EqSubFunction',
      primary: {
        icon: 'save',
        label: 'save',
        action: createEqSubFunctionAction(parent),
      },
      content: [
        ...contentFunctionWizard({
          name,
          desc,
          type,
          reservedValues: reservedNames(parent, 'EqSubFunction'),
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

export function editEqSubFunctionWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');

  return [
    {
      title: 'Edit EqSubFunction',
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
