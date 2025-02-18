/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';
import { Edit, Update } from '@openenergytools/open-scd-core';

import {
  updateVoltageLevel,
  Update as SimpleUpdate,
  getReference,
} from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';

import {
  cloneElement,
  createElement,
  getMultiplier,
  getValue,
  reservedNames,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';

const initial = {
  nomFreq: '50',
  numPhases: '3',
  Voltage: '110',
  multiplier: 'k',
};

type RenderOptions = {
  name: string;
  reservedValues: string[];
  desc: string | null;
  nomFreq: string | null;
  numPhases: string | null;
  Voltage: string | null;
  multiplier: string | null;
};

function render(option: RenderOptions): TemplateResult[] {
  return [
    html`<scl-wizarding-textfield
      label="name"
      .maybeValue=${option.name}
      helper="VoltageLevel name attribute"
      required
      validationMessage="Required information"
      .reservedValues="${option.reservedValues}"
      dialogInitialFocus
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="desc"
      .maybeValue=${option.desc}
      nullable
      helper="VoltageLevel name attribute"
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="nomFreq"
      .maybeValue=${option.nomFreq}
      nullable
      helper="Nominal Frequency"
      suffix="Hz"
      required
      validationMessage="Number bigger than 0"
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="numPhases"
      .maybeValue=${option.numPhases}
      nullable
      helper="Number of Phases"
      suffix="#"
      required
      validationMessage="Number bigger than 0"
      type="number"
      min="1"
      max="255"
    ></scl-wizarding-textfield>`,
    html`<scl-wizarding-textfield
      label="Voltage"
      .maybeValue=${option.Voltage}
      nullable
      unit="V"
      .multipliers=${[null, 'G', 'M', 'k', '', 'm']}
      .multiplier=${option.multiplier}
      helper="Voltage"
      required
      validationMessage="Number bigger than 0"
    ></scl-wizarding-textfield>`,
  ];
}

export function createAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!);
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const nomFreq = getValue(inputs.find(i => i.label === 'nomFreq')!);
    const numPhases = getValue(inputs.find(i => i.label === 'numPhases')!);
    const Voltage = getValue(inputs.find(i => i.label === 'Voltage')!);
    const multiplier = getMultiplier(inputs.find(i => i.label === 'Voltage')!);

    const element = createElement(parent.ownerDocument, 'VoltageLevel', {
      name,
      desc,
      nomFreq,
      numPhases,
    });

    if (Voltage !== null) {
      const voltageElement = createElement(parent.ownerDocument, 'Voltage', {
        unit: 'V',
        multiplier,
      });
      voltageElement.textContent = Voltage;
      element.insertBefore(voltageElement, element.firstChild);
    }

    return [
      {
        parent,
        node: element,
        reference: getReference(parent, 'VoltageLevel'),
      },
    ];
  };
}

export function voltageLevelCreateWizard(parent: Element): Wizard {
  return [
    {
      title: 'voltagelevel.wizard.title.add',
      primary: {
        icon: 'add',
        label: 'add',
        action: createAction(parent),
      },
      content: render({
        name: '',
        reservedValues: reservedNames(parent, 'VoltageLevel'),
        desc: '',
        nomFreq: initial.nomFreq,
        numPhases: initial.numPhases,
        Voltage: initial.Voltage,
        multiplier: initial.multiplier,
      }),
    },
  ];
}

function getVoltageAction(
  oldVoltage: Element | null,
  Voltage: string | null,
  multiplier: string | null,
  voltageLevel: Element
): Edit[] {
  if (oldVoltage === null) {
    const element = createElement(voltageLevel.ownerDocument, 'Voltage', {
      unit: 'V',
      multiplier,
    });
    element.textContent = Voltage;
    return [
      {
        parent: voltageLevel,
        node: element,
        reference:
          getReference(voltageLevel, 'Voltage') ?? voltageLevel.firstChild,
      },
    ];
  }

  if (Voltage === null)
    return [
      {
        node: oldVoltage,
      },
    ];

  const newVoltage = cloneElement(oldVoltage, { multiplier });
  newVoltage.textContent = Voltage;

  return [
    {
      parent: voltageLevel,
      node: newVoltage,
      reference: oldVoltage.nextElementSibling,
    },
    { node: oldVoltage },
  ];
}

export function updateAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = inputs.find(i => i.label === 'name')!.value!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const nomFreq = getValue(inputs.find(i => i.label === 'nomFreq')!);
    const numPhases = getValue(inputs.find(i => i.label === 'numPhases')!);
    const Voltage = getValue(inputs.find(i => i.label === 'Voltage')!);
    const multiplier = getMultiplier(inputs.find(i => i.label === 'Voltage')!);

    let voltageLevelAction: Update | null;
    let voltageAction: Edit | null;

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      nomFreq === element.getAttribute('nomFreq') &&
      numPhases === element.getAttribute('numPhases')
    ) {
      voltageLevelAction = null;
    } else {
      voltageLevelAction = {
        element,
        attributes: { name, desc, nomFreq, numPhases },
      };
    }

    if (
      Voltage ===
        (element.querySelector('VoltageLevel > Voltage')?.textContent?.trim() ??
          null) &&
      multiplier ===
        (element
          .querySelector('VoltageLevel > Voltage')
          ?.getAttribute('multiplier') ?? null)
    ) {
      voltageAction = null;
    } else {
      voltageAction = getVoltageAction(
        element.querySelector('VoltageLevel > Voltage'),
        Voltage,
        multiplier,
        element
      );
    }

    const complexAction: Edit[] = [];
    if (voltageLevelAction)
      complexAction.push(
        ...updateVoltageLevel(voltageLevelAction as SimpleUpdate)
      );
    if (voltageAction) complexAction.push(voltageAction);
    return complexAction.length ? [complexAction] : [];
  };
}

export function voltageLevelEditWizard(element: Element): Wizard {
  return [
    {
      title: 'Edit VoltageLevel',
      primary: {
        icon: 'edit',
        label: 'save',
        action: updateAction(element),
      },
      content: render({
        name: element.getAttribute('name') ?? '',
        reservedValues: reservedNames(element),
        desc: element.getAttribute('desc'),
        nomFreq: element.getAttribute('nomFreq'),
        numPhases: element.getAttribute('numPhases'),
        Voltage:
          element
            .querySelector('VoltageLevel > Voltage')
            ?.textContent?.trim() ?? null,
        multiplier:
          element
            .querySelector('VoltageLevel > Voltage')
            ?.getAttribute('multiplier') ?? null,
      }),
    },
  ];
}
