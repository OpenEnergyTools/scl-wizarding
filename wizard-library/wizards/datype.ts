/* eslint-disable import/no-extraneous-dependencies */
import { html } from 'lit';

import { Edit } from '@openenergytools/open-scd-core';
import { getReference } from '@openenergytools/scl-lib';

import {
  Wizard,
  WizardActor,
  WizardInputElement,
  createElement,
  getValue,
} from '../foundation.js';
import { patterns } from './patterns.js';

function createDATypeAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const daTypeAttrs: Record<string, string | null> = {};
    const daTypeKeys = ['id', 'desc'];
    daTypeKeys.forEach(key => {
      daTypeAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const daType = createElement(parent.ownerDocument, 'DAType', daTypeAttrs);

    return [
      { parent, node: daType, reference: getReference(parent, 'DAType') },
    ];
  };
}

export function createDATypeWizard(parent: Element): Wizard {
  return [
    {
      title: 'Add DAType',
      primary: {
        icon: 'Save',
        label: 'Save',
        action: createDATypeAction(parent),
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
