/* eslint-disable import/no-extraneous-dependencies */
import { html, TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';

import { Edit } from '@openscd/open-scd-core';

import '@material/mwc-checkbox';
import '@material/mwc-formfield';

import { getReference } from '@openenergytools/scl-lib';

import '../../foundation/components/scl-wizarding-textfield.js';

import { createElement, typeNullable, typePattern } from '../foundation.js';

interface AddressContentOptions {
  element: Element;
  types: string[];
}

function getPElement(parent: Element, type: string | null): Element | null {
  return (
    Array.from(parent.querySelectorAll(':scope > Address > P')).find(
      p => p.getAttribute('type') === type
    ) ?? null
  );
}

export function existDiff(oldAddr: Element, newAddr: Element): boolean {
  return Array.from(oldAddr.querySelectorAll('P')).some(
    pType =>
      getPElement(newAddr, pType.getAttribute('type'))?.textContent !==
      pType.textContent
  );
}

export function createAddressElement(
  parent: Element,
  inputs: Record<string, string | null>,
  instType: boolean
): Element {
  const address = createElement(parent.ownerDocument, 'Address', {});

  Object.entries(inputs)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .filter(([_, value]) => value !== null)
    .forEach(([key, value]) => {
      const type = key;
      const child = createElement(parent.ownerDocument, 'P', { type });
      if (instType)
        child.setAttributeNS(
          'http://www.w3.org/2001/XMLSchema-instance',
          'xsi:type',
          `tP_${key}`
        );
      child.textContent = value;
      address.appendChild(child);
    });

  return address;
}

export function updateAddress(
  parent: Element,
  inputs: Record<string, string | null>,
  instType: boolean
): Edit[] {
  const actions: Edit[] = [];

  const newAddress = createAddressElement(parent, inputs, instType);
  const oldAddress = parent.querySelector('Address');

  if (oldAddress !== null && existDiff(oldAddress, newAddress)) {
    actions.push({
      node: oldAddress,
    });
    actions.push({
      parent,
      node: newAddress,
      reference: oldAddress.nextSibling,
    });
  } else if (oldAddress === null)
    actions.push({
      parent,
      node: newAddress,
      reference: getReference(parent, 'Address'),
    });

  return actions;
}

export function hasTypeRestriction(element: Element): boolean {
  return Array.from(element.querySelectorAll('Address > P')).some(pType =>
    pType.getAttribute('xsi:type')
  );
}

export function contentAddress(
  content: AddressContentOptions
): TemplateResult[] {
  const pChildren: Record<string, string | null> = {};

  content.types.forEach(type => {
    if (!pChildren[type])
      pChildren[type] = getPElement(content.element, type)?.textContent ?? null;
  });

  return [
    html`<mwc-formfield label="Add XMLSchema-instance type">
      <mwc-checkbox
        id="instType"
        ?checked="${hasTypeRestriction(content.element)}"
      ></mwc-checkbox>
    </mwc-formfield>`,
    html`${Object.entries(pChildren).map(
      ([key, value]) =>
        html`<scl-wizarding-textfield
          label="${key}"
          ?nullable=${typeNullable[key]}
          .maybeValue=${value}
          pattern="${ifDefined(typePattern[key])}"
          required
        ></scl-wizarding-textfield>`
    )}`,
  ];
}
