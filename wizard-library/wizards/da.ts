/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';

import { Edit } from '@openenergytools/open-scd-core';

import '@material/mwc-button';
import '@material/mwc-list/mwc-list-item';

import { getReference } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';
import '../../foundation/components/scl-wizarding-select.js';
import '../../foundation/components/scl-wizarding-checkbox.js';

import {
  createElement,
  getValue,
  isPublic,
  Wizard,
  WizardActor,
  WizardInputElement,
} from '../foundation.js';
import {
  getValAction,
  renderAbstractDataAttributeContent,
} from './abstractda.js';
import { functionalConstraintEnum } from './patterns.js';

export function renderAdditionalDaContent(
  fc: string,
  dchg: string | null,
  qchg: string | null,
  dupd: string | null
): TemplateResult[] {
  return [
    html`<scl-wizarding-select
      label="fc"
      .maybeValue=${fc}
      required
      fixedMenuPosition
      >${functionalConstraintEnum.map(
        fcOption =>
          html`<mwc-list-item value="${fcOption}">${fcOption}</mwc-list-item>`
      )}</scl-wizarding-select
    >`,
    html`<scl-wizarding-checkbox
      label="dchg"
      .maybeValue=${dchg}
      nullable
    ></scl-wizarding-checkbox>`,
    html`<scl-wizarding-checkbox
      label="qchg"
      .maybeValue=${qchg}
      nullable
    ></scl-wizarding-checkbox>`,
    html`<scl-wizarding-checkbox
      label="dupd"
      .maybeValue=${dupd}
      nullable
    ></scl-wizarding-checkbox>`,
  ];
}

function createDaAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const bType = getValue(inputs.find(i => i.label === 'bType')!)!;
    const type =
      bType === 'Enum' || bType === 'Struct'
        ? getValue(inputs.find(i => i.label === 'type')!)
        : null;
    const sAddr = getValue(inputs.find(i => i.label === 'sAddr')!);
    const valKind = getValue(inputs.find(i => i.label === 'valKind')!);
    const valImport = getValue(inputs.find(i => i.label === 'valImport')!);
    const valField = inputs.find(
      i => i.label === 'Val' && i.style.display !== 'none'
    );
    const Val = valField ? getValue(valField) : null;

    const fc = getValue(inputs.find(i => i.label === 'fc')!) ?? '';
    const dchg = getValue(inputs.find(i => i.label === 'dchg')!);
    const qchg = getValue(inputs.find(i => i.label === 'qchg')!);
    const dupd = getValue(inputs.find(i => i.label === 'dupd')!);

    const actions: Edit[] = [];

    const element = createElement(parent.ownerDocument, 'DA', {
      name,
      desc,
      bType,
      type,
      sAddr,
      valKind,
      valImport,
      fc,
      dchg,
      qchg,
      dupd,
    });

    if (Val !== null) {
      const valElement = createElement(parent.ownerDocument, 'Val', {});
      valElement.textContent = Val;
      element.appendChild(valElement);
    }

    actions.push({
      parent,
      node: element,
      reference: getReference(parent, 'DA'),
    });

    return actions;
  };
}

export function createDaWizard(element: Element): Wizard {
  const doc = element.ownerDocument;

  const name = '';
  const desc = null;
  const bType = '';
  const type = null;
  const sAddr = null;
  const Val = null;
  const valKind = null;
  const valImport = null;
  const fc = '';
  const dchg = null;
  const qchg = null;
  const dupd = null;

  const doTypes = Array.from(doc.querySelectorAll('DAType, EnumType'))
    .filter(isPublic)
    .filter(doType => doType.getAttribute('id'));

  const data = element.closest('DataTypeTemplates')!;

  return [
    {
      title: 'Add DA',
      primary: {
        icon: '',
        label: 'save',
        action: createDaAction(element),
      },
      content: [
        ...renderAbstractDataAttributeContent(
          name,
          desc,
          bType,
          doTypes,
          type,
          sAddr,
          valKind,
          valImport,
          Val,
          data
        ),
        ...renderAdditionalDaContent(fc, dchg, qchg, dupd),
      ],
    },
  ];
}

function updateDaAction(element: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const bType = getValue(inputs.find(i => i.label === 'bType')!)!;
    const type =
      bType === 'Enum' || bType === 'Struct'
        ? getValue(inputs.find(i => i.label === 'type')!)
        : null;
    const sAddr = getValue(inputs.find(i => i.label === 'sAddr')!);
    const valKind = getValue(inputs.find(i => i.label === 'valKind')!);
    const valImport = getValue(inputs.find(i => i.label === 'valImport')!);
    const valField = inputs.find(
      i => i.label === 'Val' && i.style.display !== 'none'
    );
    const Val = valField ? getValue(valField) : null;

    const fc = getValue(inputs.find(i => i.label === 'fc')!) ?? '';
    const dchg = getValue(inputs.find(i => i.label === 'dchg')!);
    const qchg = getValue(inputs.find(i => i.label === 'qchg')!);
    const dupd = getValue(inputs.find(i => i.label === 'dupd')!);

    let daAction: Edit | null;
    const valAction: Edit[] = [];

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      bType === element.getAttribute('bType') &&
      type === element.getAttribute('type') &&
      sAddr === element.getAttribute('sAddr') &&
      valKind === element.getAttribute('valKind') &&
      valImport === element.getAttribute('valImprot') &&
      fc === element.getAttribute('fc') &&
      dchg === element.getAttribute('dchg') &&
      qchg === element.getAttribute('qchg') &&
      dupd === element.getAttribute('dupd')
    ) {
      daAction = null;
    } else {
      daAction = {
        element,
        attributes: {
          name,
          desc,
          bType,
          type,
          sAddr,
          valKind,
          valImport,
          fc,
          dchg,
          qchg,
          dupd,
        },
      };
    }

    if (Val !== (element.querySelector('Val')?.textContent?.trim() ?? null)) {
      valAction.push(
        getValAction(
          element.querySelector('Val'),
          Val,
          daAction?.element ?? element
        )
      );
    }

    const actions: Edit[] = [];
    if (daAction) actions.push(daAction);
    if (valAction) actions.push(...valAction);
    return actions;
  };
}

export function editDAWizard(element: Element): Wizard {
  const doc = element.ownerDocument;

  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const bType = element.getAttribute('bType') ?? '';
  const type = element.getAttribute('type');
  const sAddr = element.getAttribute('sAddr');
  const Val = element.querySelector('Val')?.innerHTML.trim() ?? null;
  const valKind = element.getAttribute('valKind');
  const valImport = element.getAttribute('valImport');
  const fc = element.getAttribute('fc') ?? '';
  const dchg = element.getAttribute('dchg');
  const qchg = element.getAttribute('qchg');
  const dupd = element.getAttribute('dupd');

  const doTypes = Array.from(doc.querySelectorAll('DAType, EnumType'))
    .filter(isPublic)
    .filter(doType => doType.getAttribute('id'));

  const data = element.closest('DataTypeTemplates')!;

  return [
    {
      title: 'Edit DA',
      primary: {
        icon: '',
        label: 'save',
        action: updateDaAction(element),
      },
      content: [
        ...renderAbstractDataAttributeContent(
          name,
          desc,
          bType,
          doTypes,
          type,
          sAddr,
          valKind,
          valImport,
          Val,
          data
        ),
        ...renderAdditionalDaContent(fc, dchg, qchg, dupd),
      ],
    },
  ];
}
