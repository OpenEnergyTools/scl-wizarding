/* eslint-disable import/no-extraneous-dependencies */
import { html } from 'lit';

import { Edit } from '@openscd/open-scd-core';

import { Checkbox } from '@material/mwc-checkbox';

import { getReference } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';
import {
  createElement,
  getValue,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import { contentAddress, updateAddress } from './address.js';

function mxxTimeUpdateAction(
  gse: Element,
  oldMxxTime: Element | null,
  newTimeValue: string | null,
  option: {
    minOrMax: 'MinTime' | 'MaxTime';
  }
): Edit[] {
  if (oldMxxTime === null) {
    const newMxxTime = createElement(gse.ownerDocument, option.minOrMax, {
      unit: 's',
      multiplier: 'm',
    });
    newMxxTime.textContent = newTimeValue;
    return [
      {
        parent: gse,
        node: newMxxTime,
        reference: getReference(gse, option.minOrMax),
      },
    ];
  }

  if (newTimeValue === null)
    return [
      {
        node: oldMxxTime,
      },
    ];

  const newMxxTime = <Element>oldMxxTime.cloneNode(false);
  newMxxTime.textContent = newTimeValue;
  return [
    {
      parent: gse,
      node: newMxxTime,
      reference: oldMxxTime.nextSibling,
    },
    { node: oldMxxTime },
  ];
}

function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[], wizard: Element): Edit[] => {
    const action: Edit = [];

    const instType: boolean =
      (<Checkbox>wizard.shadowRoot?.querySelector('#instType'))?.checked ??
      false;

    const addressContent: Record<string, string | null> = {};
    addressContent['MAC-Address'] = getValue(
      inputs.find(i => i.label === 'MAC-Address')!
    );
    addressContent.APPID = getValue(inputs.find(i => i.label === 'APPID')!);
    addressContent['VLAN-ID'] = getValue(
      inputs.find(i => i.label === 'VLAN-ID')!
    );
    addressContent['VLAN-PRIORITY'] = getValue(
      inputs.find(i => i.label === 'VLAN-PRIORITY')!
    );

    const addressActions = updateAddress(element, addressContent, instType);

    addressActions.forEach(addressAction => {
      action.push(addressAction);
    });

    const minTime = getValue(inputs.find(i => i.label === 'MinTime')!);
    const MaxTime = getValue(inputs.find(i => i.label === 'MaxTime')!);
    if (
      minTime !==
      (element.querySelector('MinTime')?.textContent?.trim() ?? null)
    ) {
      action.push(
        ...mxxTimeUpdateAction(
          element,
          element.querySelector('MinTime'),
          minTime,
          { minOrMax: 'MinTime' }
        )
      );
    }
    if (
      MaxTime !==
      (element.querySelector('MaxTime')?.textContent?.trim() ?? null)
    ) {
      action.push(
        ...mxxTimeUpdateAction(
          element,
          element.querySelector('MaxTime'),
          minTime,
          { minOrMax: 'MaxTime' }
        )
      );
    }

    return [action];
  };
}

export function editGseWizard(element: Element): Wizard {
  const minTime = element.querySelector('MinTime')?.innerHTML.trim() ?? null;
  const maxTime = element.querySelector('MaxTime')?.innerHTML.trim() ?? null;

  const types = ['MAC-Address', 'APPID', 'VLAN-ID', 'VLAN-PRIORITY'];

  return [
    {
      title: 'Edit GSE',
      primary: {
        label: 'save',
        icon: 'save',
        action: updateAction(element),
      },
      content: [
        ...contentAddress({ element, types }),
        html`<scl-wizarding-textfield
          label="MinTime"
          .maybeValue=${minTime}
          nullable
          suffix="ms"
          type="number"
        ></scl-wizarding-textfield>`,
        html`<scl-wizarding-textfield
          label="MaxTime"
          .maybeValue=${maxTime}
          nullable
          suffix="ms"
          type="number"
        ></scl-wizarding-textfield>`,
      ],
    },
  ];
}
