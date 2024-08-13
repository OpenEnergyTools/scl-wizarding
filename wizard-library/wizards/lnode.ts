/* eslint-disable no-use-before-define */
/* eslint-disable import/no-extraneous-dependencies */
import { TemplateResult, html, render } from 'lit';
import { classMap } from 'lit/directives/class-map.js';

import '@material/mwc-icon-button-toggle';
import '@material/mwc-list';
import '@material/mwc-radio';
import '@material/mwc-textfield';
import { Button } from '@material/mwc-button';
import { ListItemBase } from '@material/mwc-list/mwc-list-item-base.js';

import {
  getReference,
  identity,
  lnInstGenerator,
  find,
} from '@openenergytools/scl-lib';
import { Edit, Insert } from '@openscd/open-scd-core';
import { OscdFilteredList } from '@openscd/oscd-filtered-list';

import {
  Wizard,
  WizardActor,
  WizardInputElement,
  createElement,
} from '../foundation.js';

// global variables
const selectedIEDs: string[] = [];
let isLogicalNodeInstance = true;

/** Sorts selected `ListItem`s to the top and disabled ones to the bottom. */
function compare(
  a: { anyLn: Element; childLNode: boolean; selected: boolean },
  b: { anyLn: Element; childLNode: boolean; selected: boolean }
): number {
  if (a.childLNode !== b.childLNode) return a.childLNode ? -1 : 1;

  if (a.selected !== b.selected) return b.selected ? -1 : 1;

  return 0;
}

function logicalNodeParameters(anyLn: Element): {
  prefix: string;
  lnClass: string;
  inst: string;
  iedName: string;
  ldInst: string;
} {
  const prefix = anyLn.getAttribute('prefix') ?? '';
  const lnClass = anyLn.getAttribute('lnClass') ?? '';
  const inst = anyLn.getAttribute('inst') ?? '';

  const iedName = anyLn.closest('IED')?.getAttribute('name') ?? '';
  const ldInst = anyLn.closest('LDevice')?.getAttribute('inst') ?? '';

  return { prefix, lnClass, inst, iedName, ldInst };
}

function allAnyLNs(doc: XMLDocument): Element[] {
  return Array.from(
    doc.querySelectorAll(
      ':root > IED > AccessPoint > Server > LDevice > LN0, :root > IED > AccessPoint > Server > LDevice > LN'
    )
  );
}

function anyLnObject(
  parent: Element,
  anyLn: Element
): { anyLn: Element; childLNode: boolean; selected: boolean } {
  const { iedName, ldInst, prefix, lnClass, inst } =
    logicalNodeParameters(anyLn);

  const childLNode = Array.from(parent.children).some(child => {
    if (child.tagName !== 'LNode') return false;
    return (
      child.getAttribute('iedName') === iedName &&
      child.getAttribute('ldInst') === ldInst &&
      (child.getAttribute('prefix') ?? '') === prefix &&
      child.getAttribute('lnClass') === lnClass &&
      (child.getAttribute('lnInst') ?? '') === inst
    );
  });

  if (childLNode) return { anyLn, childLNode, selected: true };

  const selected = Array.from(
    parent.closest('Substation')?.querySelectorAll('LNode') ?? []
  ).some(child => {
    if (child.tagName !== 'LNode') return false;
    return (
      child.getAttribute('iedName') === iedName &&
      child.getAttribute('ldInst') === ldInst &&
      (child.getAttribute('prefix') ?? '') === prefix &&
      child.getAttribute('lnClass') === lnClass &&
      (child.getAttribute('lnInst') ?? '') === inst
    );
  });

  return { anyLn, childLNode, selected };
}

function lnFilterList(element: HTMLElement): OscdFilteredList {
  return element
    .closest('#createLNodeWizardContent')
    ?.querySelector('#lnList') as OscdFilteredList;
}

function showLogicalNodeTypes(evt: Event, parent: Element): void {
  isLogicalNodeInstance = !isLogicalNodeInstance;

  const button = evt.target as Button;

  const instanceFilter = button.parentElement!.parentElement!.querySelector(
    '#instanceFilter'
  ) as Element;

  if (isLogicalNodeInstance) instanceFilter.classList.remove('hidden');
  else instanceFilter.classList.add('hidden');

  const doc = parent.ownerDocument;

  render(
    html`${isLogicalNodeInstance
      ? // eslint-disable-next-line no-use-before-define
        renderInstances(parent)
      : renderTypicals(doc)}`,
    lnFilterList(button)
  );
}

function showIEdFilterList(evt: Event): void {
  const ieds = (evt.target as HTMLElement)
    .closest('#createLNodeWizardContent')
    ?.querySelector('#iedList') as OscdFilteredList;

  if (ieds.classList.contains('hidden')) ieds.classList.remove('hidden');
  else ieds.classList.add('hidden');
}

function createSingleLNode(parent: Element, ln: Element): Insert | null {
  if (ln.tagName === 'LNodeType') {
    const lnClass = ln.getAttribute('lnClass');
    if (!lnClass) return null;
    const lnType = ln.getAttribute('id');
    const lnInst = lnInstGenerator(parent, 'LNode')(lnClass);
    if (!lnInst) return null;

    const node = createElement(parent.ownerDocument, 'LNode', {
      iedName: 'None',
      lnClass,
      lnInst,
      lnType,
    });

    return {
      parent,
      node,
      reference: getReference(parent, 'LNode'),
    };
  }

  const { iedName, ldInst, prefix, lnClass, inst } = logicalNodeParameters(ln);
  const node = createElement(parent.ownerDocument, 'LNode', {
    iedName,
    ldInst,
    prefix,
    lnClass,
    lnInst: inst,
  });

  return {
    parent,
    node,
    reference: getReference(parent, 'LNode'),
  };
}

function createAction(parent: Element): WizardActor {
  return (_: WizardInputElement[], wizard: Element): Edit[] => {
    const list = wizard.shadowRoot?.querySelector(
      '#lnList'
    ) as OscdFilteredList;

    const selectedLNs = (list.selected as ListItemBase[])
      .filter(item => !item.disabled)
      .map(item => item.value)
      .map(id => {
        if (id.endsWith('LLN0')) return find(parent.ownerDocument, 'LN0', id);
        if (id.startsWith('#'))
          return find(parent.ownerDocument, 'LNodeType', id);

        return find(parent.ownerDocument, 'LN', id);
      })
      .filter(item => item !== null) as Element[];

    return selectedLNs
      .map(ln => createSingleLNode(parent, ln))
      .filter(insert => insert) as Insert[];
  };
}

function filterIED(evt: Event, parent: Element): void {
  const iedFilterList = evt.target as OscdFilteredList;
  const ieds = (iedFilterList.selected as ListItemBase[]).map(
    selection => selection.value
  );

  // update global array selectedIEDs
  selectedIEDs.length = 0;
  selectedIEDs.push(...ieds);

  render(renderInstances(parent), lnFilterList(evt.target as HTMLElement));
}

function renderListItem(value: {
  anyLn: Element;
  childLNode: boolean;
  selected: boolean;
}): TemplateResult {
  const { iedName, ldInst, prefix, lnClass, inst } = logicalNodeParameters(
    value.anyLn
  );

  return html`<mwc-check-list-item
    value="${identity(value.anyLn)}"
    twoline
    ?disabled=${value.selected}
    ?selected=${value.childLNode}
    ><span>${prefix}${lnClass}${inst}</span
    ><span slot="secondary">${iedName} | ${ldInst}</span></mwc-check-list-item
  >`;
}

function renderTypicals(doc: XMLDocument): TemplateResult[] {
  return Array.from(
    doc.querySelectorAll(':root > DataTypeTemplates > LNodeType')
  ).map(lNodeType => {
    const lnClass = lNodeType.getAttribute('lnClass');
    const id = lNodeType.getAttribute('id');

    return html`<mwc-check-list-item twoline value="${identity(lNodeType)}"
      ><span>${lnClass}</span
      ><span slot="secondary">#${id}</span></mwc-check-list-item
    >`;
  });
}

function renderInstances(parent: Element): TemplateResult[] {
  const doc = parent.ownerDocument;

  return allAnyLNs(doc)
    .filter(anyLn =>
      selectedIEDs.includes(anyLn.closest('IED')?.getAttribute('name') ?? '')
    )
    .map(anyLn => anyLnObject(parent, anyLn))
    .sort(compare)
    .map(renderListItem);
}

function renderIEDItems(parent: Element): TemplateResult[] {
  const doc = parent.ownerDocument;

  return Array.from(doc.querySelectorAll(':root > IED')).map(ied => {
    const [iedName, manufacturer] = ['name', 'manufacturer'].map(value =>
      ied.getAttribute(value)
    );

    return html`<mwc-check-list-item
      twoline
      value="${iedName ?? 'None'}"
      ?selected=${selectedIEDs.includes(iedName!)}
      ><span>${iedName}</span
      ><span slot="secondary">${manufacturer}</span></mwc-check-list-item
    >`;
  });
}

export function createLNodeWizard(parent: Element): Wizard {
  const iedNames = Array.from(parent.children)
    .filter(child => child.tagName === 'LNode' && child.getAttribute('iedName'))
    .map(lNode => lNode.getAttribute('iedName')!);

  selectedIEDs.push(...Array.from(new Set(iedNames)));

  return [
    {
      title: 'Add LNode',
      primary: {
        icon: 'save',
        label: 'save',
        action: createAction(parent),
      },
      content: [
        html`<div id="createLNodeWizardContent">
          <style>
            .hidden {
              display: none;
            }
          </style>
          <mwc-icon-button-toggle
            style="position:absolute;top:8px;right:60px;"
            onicon="layers"
            officon="layers_clear"
            @click="${(evt: Event) => showLogicalNodeTypes(evt, parent)}"
          ></mwc-icon-button-toggle>
          <div style="display: flex; flex-direction: row;">
            <div id="instanceFilter">
              <mwc-icon-button-toggle
                ?on=${!selectedIEDs.length}
                style="position:absolute;top:8px;right:110px;"
                onicon="filter_list"
                officon="filter_list_off"
                @click="${showIEdFilterList}"
              ></mwc-icon-button-toggle>
              <oscd-filtered-list
                class="${classMap({ hidden: selectedIEDs.length })}"
                id="iedList"
                multi
                disableCheckAll
                @selected="${(evt: Event) => filterIED(evt, parent)}"
                >${renderIEDItems(parent)}</oscd-filtered-list
              >
            </div>
            <oscd-filtered-list id="lnList" multi></oscd-filtered-list>
          </div>
        </div>`,
      ],
    },
  ];
}
