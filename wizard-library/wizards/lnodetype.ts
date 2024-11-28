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

function createLNodeTypeAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const lNodeTypeAttrs: Record<string, string | null> = {};
    const lNodeTypeKeys = ['id', 'desc', 'lnClass'];
    lNodeTypeKeys.forEach(key => {
      lNodeTypeAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const lNodeType = createElement(
      parent.ownerDocument,
      'LNodeType',
      lNodeTypeAttrs
    );

    return [
      { parent, node: lNodeType, reference: getReference(parent, 'LNodeType') },
    ];
  };
}

export function createLNodeTypeWizard(parent: Element): Wizard {
  return [
    {
      title: 'Add LNodeType',
      primary: {
        icon: 'Save',
        label: 'Save',
        action: createLNodeTypeAction(parent),
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
        html`<scl-wizarding-textfield
          label="lnClass"
          .maybeValue=${'LLN0'}
          pattern="${patterns.lnClass}"
        ></scl-wizarding-textfield>`,
      ],
    },
  ];
}
