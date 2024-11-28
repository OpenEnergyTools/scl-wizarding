/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';
import { Edit } from '@openenergytools/open-scd-core';

import '../../foundation/components/scl-wizarding-textfield.js';
import { updateIED } from '@openenergytools/scl-lib';

import {
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

function render(
  name: string,
  iedNames: string[],
  desc: string | null,
  type: string | null,
  manufacturer: string | null,
  owner: string | null
): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${name}
      .reservedValues=${iedNames}
      required
      dialogInitialFocus
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${desc}
      nullable
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="type"
      .maybeValue=${type}
      disabled
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="manufacturer"
      .maybeValue=${manufacturer}
      disabled
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="owner"
      .maybeValue=${owner}
      disabled
    ></scl-wizarding-textfield>`,
  ];
}

export function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc')
    )
      return [];

    return updateIED({
      element,
      attributes: { name, desc },
    });
  };
}

export function iEDEditWizard(element: Element): Wizard {
  const iedNames: string[] = Array.from(
    element.ownerDocument.querySelectorAll(':root > IED')
  )
    .map(ied => ied.getAttribute('name')!)
    .filter(ied => ied !== element.getAttribute('name'));

  return [
    {
      title: 'Edit IED',
      primary: {
        icon: 'edit',
        label: 'save',
        action: updateAction(element),
      },
      content: render(
        element.getAttribute('name') ?? '',
        iedNames,
        element.getAttribute('desc'),
        element.getAttribute('type'),
        element.getAttribute('manufacturer'),
        element.getAttribute('owner')
      ),
    },
  ];
}
