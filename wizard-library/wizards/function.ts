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

type RenderOptions = {
  name: string | null;
  desc: string | null;
  type: string | null;
  reservedValues: string[];
};

export function contentFunctionWizard(
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
      nullable
    ></scl-wizarding-textfield>`,
  ];
}

function createFunctionAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const functionAttrs: Record<string, string | null> = {};
    const functionKeys = ['name', 'desc', 'type'];
    functionKeys.forEach(key => {
      functionAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const fUnction = createElement(
      parent.ownerDocument,
      'Function',
      functionAttrs
    );

    return [
      { parent, node: fUnction, reference: getReference(parent, 'Function') },
    ];
  };
}

export function createFunctionWizard(parent: Element): Wizard {
  const name = '';
  const desc = null;
  const type = null;

  return [
    {
      title: 'Add Function',
      primary: {
        icon: 'save',
        label: 'save',
        action: createFunctionAction(parent),
      },
      content: [
        ...contentFunctionWizard({
          name,
          desc,
          type,
          reservedValues: reservedNames(parent, 'Function'),
        }),
      ],
    },
  ];
}

function updateFunction(element: Element): WizardActor {
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

export function editFunctionWizard(element: Element): Wizard {
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const type = element.getAttribute('type');

  return [
    {
      title: 'Edit Function',
      primary: {
        icon: 'save',
        label: 'save',
        action: updateFunction(element),
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
