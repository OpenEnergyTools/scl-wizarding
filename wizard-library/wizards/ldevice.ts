/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';
import { Edit } from '@openscd/open-scd-core';

import '../../foundation/components/scl-wizarding-textfield.js';

import { Wizard, WizardActor, WizardInputElement } from '../foundation.js';

function render(
  inst: string,
  name: string | null,
  ldNames: string[]
): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="inst"
      .maybeValue=${inst}
      disabled
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${name}
      nullable
      .reservedValues=${ldNames}
    ></scl-wizarding-textfield>`,
  ];
}

export function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;

    if (name === element.getAttribute('name')) return [];

    return [
      {
        element,
        attributes: { name },
      },
    ];
  };
}

export function lDeviceEditWizard(element: Element): Wizard {
  const ldNames: string[] = Array.from(
    element.ownerDocument.querySelectorAll(
      ':root > IED > AccessPoint > Server > LDevice'
    )
  ).map(ied => ied.getAttribute('name')!);

  return [
    {
      title: 'Edit LDevice',
      primary: {
        icon: 'edit',
        label: 'save',
        action: updateAction(element),
      },
      content: render(
        element.getAttribute('inst') ?? '',
        element.getAttribute('name'),
        ldNames
      ),
    },
  ];
}
