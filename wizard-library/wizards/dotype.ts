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

function createDOTypeAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const doTypeAttrs: Record<string, string | null> = {};
    const doTypeKeys = ['id', 'desc', 'cdc'];
    doTypeKeys.forEach(key => {
      doTypeAttrs[key] = getValue(inputs.find(i => i.label === key)!);
    });

    const doType = createElement(parent.ownerDocument, 'DOType', doTypeAttrs);

    return [
      { parent, node: doType, reference: getReference(parent, 'DOType') },
    ];
  };
}

export function createDOTypeWizard(parent: Element): Wizard {
  return [
    {
      title: 'Add DOType',
      primary: {
        icon: 'save',
        label: 'Save',
        action: createDOTypeAction(parent),
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
          label="cdc"
          .maybeValue=${'ENS'}
          pattern="${patterns.cdc}"
        ></scl-wizarding-textfield>`,
      ],
    },
  ];
}
