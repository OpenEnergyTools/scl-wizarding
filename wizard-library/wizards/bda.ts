/* eslint-disable import/no-extraneous-dependencies */

import { Edit } from '@openscd/open-scd-core';

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
import { getReference } from '../../foundation/utils/scldata.js';

function createBDaAction(parent: Element): WizardActor {
  return (inputs: WizardInputElement[]): Edit[] => {
    const name = getValue(inputs.find(i => i.label === 'name')!)!;
    const desc = getValue(inputs.find(i => i.label === 'desc')!);
    const bType = getValue(inputs.find(i => i.label === 'bType')!)!;
    const type =
      bType === 'Enum' || bType === 'Struct'
        ? getValue(inputs.find(i => i.label === 'type')!)
        : null;
    const sAddr = getValue(inputs.find(i => i.label === 'sAddr')!);
    const valKind =
      getValue(inputs.find(i => i.label === 'valKind')!) !== ''
        ? getValue(inputs.find(i => i.label === 'valKind')!)
        : null;
    const valImport =
      getValue(inputs.find(i => i.label === 'valImport')!) !== ''
        ? getValue(inputs.find(i => i.label === 'valImport')!)
        : null;

    const valField = inputs.find(
      i => i.label === 'Val' && i.style.display !== 'none'
    );
    const Val = valField ? getValue(valField) : null;

    const element = createElement(parent.ownerDocument, 'BDA', {
      name,
      desc,
      bType,
      type,
      sAddr,
      valKind,
      valImport,
    });

    if (Val !== null) {
      const valElement = createElement(parent.ownerDocument, 'Val', {});
      valElement.textContent = Val;
      element.appendChild(valElement);
    }

    return [
      {
        parent,
        node: element,
        reference: getReference(parent, 'BDA'),
      },
    ];
  };
}

export function createBDaWizard(element: Element): Wizard {
  const doc = element.ownerDocument;

  const name = '';
  const desc = null;
  const bType = '';
  const type = null;
  const sAddr = null;
  const Val = null;
  const valKind = null;
  const valImport = null;

  const doOrEnumTypes = Array.from(
    doc.querySelectorAll('DAType, EnumType')
  ).filter(doOrEnumType => doOrEnumType.getAttribute('id'));

  const data = element.closest('DataTypeTemplates')!;

  return [
    {
      title: 'Add BDA',
      primary: {
        icon: '',
        label: 'save',
        action: createBDaAction(element),
      },
      content: [
        ...renderAbstractDataAttributeContent(
          name,
          desc,
          bType,
          doOrEnumTypes,
          type,
          sAddr,
          valKind,
          valImport,
          Val,
          data
        ),
      ],
    },
  ];
}

function updateBDaAction(element: Element): WizardActor {
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

    let bdaAction: Edit | null;
    const valAction: Edit = [];

    if (
      name === element.getAttribute('name') &&
      desc === element.getAttribute('desc') &&
      bType === element.getAttribute('bType') &&
      type === element.getAttribute('type') &&
      sAddr === element.getAttribute('sAddr') &&
      valKind === element.getAttribute('valKind') &&
      valImport === element.getAttribute('valImprot')
    ) {
      bdaAction = null;
    } else {
      bdaAction = {
        element,
        attributes: {
          name,
          desc,
          bType,
          type,
          sAddr,
          valKind,
          valImport,
        },
      };
    }

    if (Val !== (element.querySelector('Val')?.textContent?.trim() ?? null)) {
      valAction.push(
        getValAction(
          element.querySelector('Val'),
          Val,
          bdaAction?.element ?? element
        )
      );
    }

    const actions: Edit[] = [];
    if (bdaAction) actions.push(bdaAction);
    if (valAction) actions.push(...valAction);
    return actions;
  };
}

export function editBDaWizard(element: Element): Wizard {
  const doc = element.ownerDocument;
  const type = element.getAttribute('type');
  const name = element.getAttribute('name');
  const desc = element.getAttribute('desc');
  const bType = element.getAttribute('bType') ?? '';
  const sAddr = element.getAttribute('sAddr');
  const Val = element.querySelector('Val')?.innerHTML.trim() ?? null;
  const valKind = element.getAttribute('valKind');
  const valImport = element.getAttribute('valImport');

  const daOrEnumTypes = Array.from(doc.querySelectorAll('DAType, EnumType'))
    .filter(isPublic)
    .filter(daOrEnumType => daOrEnumType.getAttribute('id'));

  const data = element.closest('DataTypeTemplates')!;

  return [
    {
      title: 'Edit BDA',
      primary: {
        icon: '',
        label: 'save',
        action: updateBDaAction(element),
      },
      content: [
        ...renderAbstractDataAttributeContent(
          name,
          desc,
          bType,
          daOrEnumTypes,
          type,
          sAddr,
          valKind,
          valImport,
          Val,
          data
        ),
      ],
    },
  ];
}
