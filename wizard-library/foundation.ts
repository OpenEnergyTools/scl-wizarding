/* eslint-disable no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-use-before-define */
/* eslint-disable no-undef */
import { TemplateResult } from 'lit';

import { List } from '@material/mwc-list';
import { Select } from '@material/mwc-select';
import { TextArea } from '@material/mwc-textarea';
import { TextField } from '@material/mwc-textfield';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Edit } from '@openscd/open-scd-core';
import { SclWizardingTextfield } from '../foundation/components/scl-wizarding-textfield.js';
import { SclWizardingSelect } from '../foundation/components/scl-wizarding-select.js';
import { SclWizardingCheckbox } from '../foundation/components/scl-wizarding-checkbox.js';

/** Throws an error bearing `message`, never returning. */
export function unreachable(message: string): never {
  throw new Error(message);
}

/** @returns the cartesian product of `arrays` */
export function crossProduct<T>(...arrays: T[][]): T[][] {
  return arrays.reduce<T[][]>(
    (a, b) => <T[][]>a.flatMap(d => b.map(e => [d, e].flat())),
    [[]]
  );
}

export const wizardInputSelector =
  'scl-wizarding-textfield, mwc-textfield, mwc-textarea, ace-editor, mwc-select, scl-wizarding-select, scl-wizarding-checkbox';
export type WizardInputElement =
  | SclWizardingTextfield
  | TextField
  | TextArea
  | Select
  | SclWizardingSelect;

/** @returns [[`EditorAction`]]s to dispatch on [[`WizardDialog`]] commit. */
export type WizardActor = (
  inputs: WizardInputElement[],
  wizard: Element,
  list?: List | null
) => Edit[];

export function canCheckValidity(
  type: any
): type is SclWizardingTextfield | SclWizardingSelect | TextField | Select {
  return 'checkValidity' in type;
}

/** @returns the validity of `input` depending on type. */
export function checkValidity(input: WizardInputElement): boolean {
  if (canCheckValidity(input)) return input.checkValidity();
  return true;
}

export function canReportValidity(
  type: any
): type is SclWizardingTextfield | SclWizardingSelect | TextField | Select {
  return 'reportValidity' in type;
}

/** reports the validity of `input` depending on type. */
export function reportValidity(input: WizardInputElement): boolean {
  if (canReportValidity(input)) return input.reportValidity();
  return true;
}

export function isInputWithMaybeValue(
  type: any
): type is SclWizardingTextfield | SclWizardingCheckbox | SclWizardingSelect {
  return 'maybeValue' in type;
}

/** @returns the `value` or `maybeValue` of `input` depending on type. */
export function getValue(input: WizardInputElement): string | null {
  if (isInputWithMaybeValue(input)) return input.maybeValue;
  return input.value ?? null;
}

export function isSclTextfield(type: any): type is SclWizardingTextfield {
  return 'maybeValue' in type && 'multiplier' in type;
}

/** @returns the `multiplier` of `input` if available. */
export function getMultiplier(input: WizardInputElement): string | null {
  if (isSclTextfield(input)) return input.multiplier;
  return null;
}

/** @returns [[`WizardAction`]]s to dispatch on [[`WizardDialog`]] menu action. */
export type WizardMenuActor = (wizard: Element) => void;

/** User interactions rendered in the wizard-dialog menu */
export interface MenuAction {
  label: string;
  icon?: string;
  action: WizardMenuActor;
}

/** Represents a page of a wizard dialog */
export interface WizardPage {
  title: string;
  content?: TemplateResult[];
  primary?: {
    icon: string;
    label: string;
    action: WizardActor;
    auto?: boolean;
  };
  secondary?: {
    icon: string;
    label: string;
    action: WizardActor;
  };
  initial?: boolean;
  menuActions?: MenuAction[];
}
export type Wizard = WizardPage[];
export type WizardFactory = () => Wizard;

/** If `wizard === null`, close the current wizard, else queue `wizard`. */
export interface WizardDetail {
  wizard: WizardFactory | null;
  subwizard?: boolean;
}

/** @returns a clone of `element` with attributes set to values from `attrs`. */
export function cloneElement(
  element: Element,
  attrs: Record<string, string | null>
): Element {
  const newElement = <Element>element.cloneNode(false);
  Object.entries(attrs).forEach(([name, value]) => {
    if (value === null) newElement.removeAttribute(name);
    else newElement.setAttribute(name, value);
  });
  return newElement;
}

/**
 * Extract the 'name' attribute from the given XML element.
 * @param element - The element to extract name from.
 * @returns the name, or undefined if there is no name.
 */
export function getNameAttribute(element: Element): string | undefined {
  const name = element.getAttribute('name');
  return name || undefined;
}

export function isPublic(element: Element): boolean {
  return !element.closest('Private');
}

/** @returns a new [[`tag`]] element owned by [[`doc`]]. */
export function createElement(
  doc: Document,
  tag: string,
  attrs: Record<string, string | null>
): Element {
  const element = doc.createElementNS(doc.documentElement.namespaceURI, tag);
  Object.entries(attrs)
    .filter(([_, value]) => value !== null)
    .forEach(([name, value]) => element.setAttribute(name, value!));
  return element;
}

export function getChildElementsByTagName(
  element: Element | null | undefined,
  tag: string | null | undefined
): Element[] {
  if (!element || !tag) return [];
  return Array.from(element.children).filter(
    element => element.tagName === tag
  );
}

export function getTypes(element: Element): string[] {
  if (!element.ownerDocument.documentElement) return [];

  const scl: Element = element.ownerDocument.documentElement;

  const type =
    (scl.getAttribute('version') ?? '2003') +
    (scl.getAttribute('revision') ?? '') +
    (scl.getAttribute('release') ?? '');

  if (type === '2003') return pTypes2003;

  if (type === '2007B') return pTypes2007B;

  return pTypes2007B4;
}

const pTypes2003: string[] = [
  'IP',
  'IP-SUBNET',
  'IP-GATEWAY',
  'OSI-TSEL',
  'OSI-SSEL',
  'OSI-PSEL',
  'OSI-AP-Title',
  'OSI-AP-Invoke',
  'OSI-AE-Qualifier',
  'OSI-AE-Invoke',
  'OSI-NSAP',
  'VLAN-ID',
  'VLAN-PRIORITY',
];

const pTypes2007B: string[] = [
  ...pTypes2003,
  'SNTP-Port',
  'MMS-Port',
  'DNSName',
  'UDP-Port',
  'TCP-Port',
  'C37-118-IP-Port',
];

const pTypes2007B4: string[] = [
  ...pTypes2007B,
  'IPv6',
  'IPv6-SUBNET',
  'IPv6-GATEWAY',
  'IPv6FlowLabel',
  'IPv6ClassOfTraffic',
  'IPv6-IGMPv3Src',
  'IP-IGMPv3Sr',
  'IP-ClassOfTraffic',
];

const typeBase = {
  IP: '([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])[.]([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])[.]([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])[.]([0-9]{1,2}|1[0-9]{2}|2[0-4][0-9]|25[0-5])',
  OSI: '[0-9A-F]+',
  OSId: '[0-9]+',
  OSIAPi: '[0-9\u002C]+',
  MAC: '([0-9A-F]{2}-){5}[0-9A-F]{2}',
  APPID: '[0-9A-F]{4}',
  VLANp: '[0-7]',
  VLANid: '[0-9A-F]{3}',
  port: '0|([1-9][0-9]{0,3})|([1-5][0-9]{4,4})|(6[0-4][0-9]{3,3})|(65[0-4][0-9]{2,2})|(655[0-2][0-9])|(6553[0-5])',
  IPv6: '([0-9a-f]{1,4}:){7}[0-9a-f]{1,4}',
  IPv6sub: '/[1-9]|/[1-9][0-9]|/1[0-1][0-9]|/12[0-7]',
};

/** Patterns from IEC 61850-6 for all `P` elements */
export const typePattern: Partial<Record<string, string>> = {
  IP: typeBase.IP,
  'IP-SUBNET': typeBase.IP,
  'IP-GATEWAY': typeBase.IP,
  'OSI-TSEL': typeBase.OSI,
  'OSI-SSEL': typeBase.OSI,
  'OSI-PSEL': typeBase.OSI,
  'OSI-AP-Title': typeBase.OSIAPi,
  'OSI-AP-Invoke': typeBase.OSId,
  'OSI-AE-Qualifier': typeBase.OSId,
  'OSI-AE-Invoke': typeBase.OSId,
  'MAC-Address': typeBase.MAC,
  APPID: typeBase.APPID,
  'VLAN-ID': typeBase.VLANid,
  'VLAN-PRIORITY': typeBase.VLANp,
  'OSI-NSAP': typeBase.OSI,
  'SNTP-Port': typeBase.port,
  'MMS-Port': typeBase.port,
  DNSName: '[^ ]*',
  'UDP-Port': typeBase.port,
  'TCP-Port': typeBase.port,
  'C37-118-IP-Port':
    '102[5-9]|10[3-9][0-9]|1[1-9][0-9][0-9]|[2-9][0-9]{3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]',
  IPv6: typeBase.IPv6,
  'IPv6-SUBNET': typeBase.IPv6sub,
  'IPv6-GATEWAY': typeBase.IPv6,
  IPv6FlowLabel: '[0-9a-fA-F]{1,5}',
  IPv6ClassOfTraffic: '[0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]',
  'IPv6-IGMPv3Src': typeBase.IPv6,
  'IP-IGMPv3Sr': typeBase.IP,
  'IP-ClassOfTraffic': typeBase.OSI,
};

/** Whether `P` element is required within `Address` */
export const typeNullable: Partial<Record<string, boolean>> = {
  IP: false,
  'IP-SUBNET': false,
  'IP-GATEWAY': true,
  'OSI-TSEL': true,
  'OSI-SSEL': true,
  'OSI-PSEL': true,
  'OSI-AP-Title': true,
  'OSI-AP-Invoke': true,
  'OSI-AE-Qualifier': true,
  'OSI-AE-Invoke': true,
  'OSI-NSAP': true,
  'MAC-Address': false,
  APPID: false,
  'VLAN-ID': true,
  'VLAN-PRIORITY': true,
  'SNTP-Port': true,
  'MMS-Port': true,
  DNSName: true,
  'UDP-Port': true,
  'TCP-Port': true,
  'C37-118-IP-Port': true,
  IPv6: true,
  'IPv6-SUBNET': true,
  'IPv6-GATEWAY': true,
  IPv6FlowLabel: true,
  IPv6ClassOfTraffic: true,
  'IPv6-IGMPv3Src': true,
  'IP-IGMPv3Sr': true,
  'IP-ClassOfTraffic': true,
};

/** Max length definition for all `P` element */
export const typeMaxLength: Partial<Record<string, number>> = {
  'OSI-TSEL': 8,
  'OSI-SSEL': 16,
  'OSI-PSEL': 16,
  'OSI-AP-Invoke': 5,
  'OSI-AE-Qualifier': 5,
  'OSI-AE-Invoke': 5,
  'OSI-NSAP': 40,
  'IP-ClassOfTraffic': 2,
};

/** Sorts selected `ListItem`s to the top and disabled ones to the bottom. */
export function compareNames(a: Element | string, b: Element | string): number {
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b);

  if (typeof a === 'object' && typeof b === 'string')
    return (a.getAttribute('name') ?? '').localeCompare(b);

  if (typeof a === 'string' && typeof b === 'object')
    return a.localeCompare(b.getAttribute('name')!);

  if (typeof a === 'object' && typeof b === 'object')
    return (a.getAttribute('name') ?? '').localeCompare(
      b.getAttribute('name') ?? ''
    );

  return 0;
}

/** @returns reserved siblings names attributes */
export function reservedNames(element: Element, tagName?: string): string[] {
  if (tagName)
    return getChildElementsByTagName(element, tagName).map(
      sibling => sibling.getAttribute('name')!
    );

  if (!element.parentElement) return [];
  return getChildElementsByTagName(element.parentElement, element.tagName)
    .filter(sibling => sibling !== element)
    .map(sibling => sibling.getAttribute('name')!);
}
