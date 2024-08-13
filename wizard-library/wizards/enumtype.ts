/* eslint-disable import/no-extraneous-dependencies */
import { html } from 'lit';

import { Edit } from '@openscd/open-scd-core';
import { getReference } from '@openenergytools/scl-lib';

import {
  Wizard,
  WizardActor,
  WizardInputElement,
  createElement,
  getValue,
} from '../foundation.js';
import { patterns } from './patterns.js';

function createEnumTypeAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const enumTypeAttrs: Record<string, string | null> = {};
    const enumTypeKeys = ['id', 'desc'];
    enumTypeKeys.forEach(key => {
      enumTypeAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const enumType = createElement(
      parent.ownerDocument,
      'EnumType',
      enumTypeAttrs
    );

    return [
      { parent, node: enumType, reference: getReference(parent, 'EnumType') },
    ];
  };
}

export function createEnumTypeWizard(parent: Element): Wizard {
  return [
    {
      title: 'Add EnumType',
      primary: {
        icon: 'Save',
        label: 'Save',
        action: createEnumTypeAction(parent),
      },
      content: [
        html`<scl-wizarding-textfield
          label="id"
          .maybeValue=${''}
          required
          maxlength="127"
          minlength="1"
          pattern="${patterns.nmToken}"
        ></scl-wizarding-textfield>`,
        html`<scl-wizarding-textfield
          label="desc"
          .maybeValue=${null}
          nullable
          pattern="${patterns.normalizedString}"
        ></scl-wizarding-textfield>`,
      ],
    },
  ];
}
