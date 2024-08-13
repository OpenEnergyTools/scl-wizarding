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
    const subFunctionKeys = ['name', 'desc', 'type'];
    subFunctionKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const subFunction = createElement(
      parent.ownerDocument,
      'SubFunction',
      attributes
    );

    return [
      {
        parent,
        node: subFunction,
        reference: getReference(parent, 'SubFunction'),
      },
    ];
  };
}

export function createSubFunctionWizard(parent: Element): Wizard {
  const name = '';
  const desc = null;
  const type = null;

  return [
    {
      title: 'Add SubFunction',
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
          reservedValues: reservedNames(parent, 'SubFunction'),
        }),
      ],
    },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const attributes: Record<string, string | null> = {};
    const subFunctionKeys = ['name', 'desc', 'type'];
    subFunctionKeys.forEach(key => {
      attributes[key] = getValue(inputs.find(i => i.label === key)!);
    });

    if (
      subFunctionKeys.some(key => attributes[key] !== element.getAttribute(key))
    ) {
      return [{ element, attributes }];
    }

    return [];
  };
}

export function editSubFunctionWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');

  return [
    {
      title: 'Edit SubFunction',
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
