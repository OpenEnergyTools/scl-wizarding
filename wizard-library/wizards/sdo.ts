/* eslint-disable import/no-extraneous-dependencies */
import { TemplateResult, html } from 'lit';

import { Edit } from '@openscd/open-scd-core';

import { getReference } from '@openenergytools/scl-lib';

import '@material/mwc-list/mwc-list-item';

import '../../foundation/components/scl-wizarding-textfield.js';
import '../../foundation/components/scl-wizarding-select.js';

import {
  Wizard,
  WizardActor,
  WizardInputElement,
  createElement,
  getValue,
} from '../foundation.js';
import { patterns } from './patterns.js';

type DoContent = {
  name: string | null;
  desc: string | null;
  type: string | null;
  doTypes: Element[];
};

function renderContent(content: DoContent): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${content.name}
      required
      pattern="${patterns.alphanumericFirstLowerCase}"
      dialogInitialFocus
    >
      ></scl-wizarding-textfield
    >`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${content.desc}
      nullable
      pattern="${patterns.normalizedString}"
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-select fixedMenuPosition label="type" required
      >${content.doTypes.map(
        dataType =>
          html`<mwc-list-item
            value=${dataType.id}
            ?selected=${dataType.id === content.type}
            >${dataType.id}</mwc-list-item
          >`
      )}</scl-wizarding-select
    >`,
  ];
}

function createSDoAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!);

    const actions: Edit[] = [];

    const element = createElement(parent.ownerDocument, 'SDO', {
      name,
      desc,
      type,
    });

    actions.push({
      parent,
      node: element,
      reference: getReference(parent, 'SDO'),
    });

    return actions;
  };
}

export function createSDoWizard(parent: Element): Wizard {
  const [type, name, desc] = [null, '', null];

  const doTypes = Array.from(
    parent.ownerDocument.querySelectorAll('DOType')
  ).filter(doType => doType.getAttribute('id'));

  return [
    {
      title: 'Add SDO',
      primary: { icon: '', label: 'save', action: createSDoAction(parent) },
      content: renderContent({
        name,
        desc,
        type,
        doTypes,
      }),
    },
  ];
}

function updateSDoAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const type = getValue(inputs.find(i => i.label === 'type')!)!;

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      type === element.getAttribute('type')
    ) {
      return [];
    }

    return [{ element, attributes: { name, desc, type } }];
  };
}

export function editSDoWizard(element: Element): Wizard {
  const [type, name, desc] = [
    element.getAttribute('type'),
    element.getAttribute('name'),
    element.getAttribute('desc'),
  ];

  const doTypes = Array.from(
    element.ownerDocument.querySelectorAll('DOType')
  ).filter(doType => doType.getAttribute('id'));

  return [
    {
      title: 'Edit SDO',
      primary: { icon: '', label: 'save', action: updateSDoAction(element) },
      content: renderContent({
        name,
        desc,
        type,
        doTypes,
      }),
    },
  ];
}
