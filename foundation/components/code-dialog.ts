/* eslint-disable import/no-extraneous-dependencies */
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import 'ace-custom-element';
import '@material/mwc-dialog';
import type AceEditor from 'ace-custom-element';

import { Remove, Insert, newEditEvent } from '@openenergytools/open-scd-core';

function formatXml(xml: string, tab: string = '\t'): string {
  let formatted = '';
  let indent = '';

  xml.split(/>\s*</).forEach(node => {
    if (node.match(/^\/\w/)) indent = indent.substring(tab!.length);
    formatted += `${indent}<${node}>\r\n`;
    if (node.match(/^<?\w[^>]*[^/]$/)) indent += tab;
  });
  return formatted.substring(1, formatted.length - 3);
}

function codeEdits(
  oldElement: Element,
  newElementText: string
): (Remove | Insert)[] {
  const parent = oldElement.parentElement;
  if (!parent) return [];

  const remove: Remove = { node: oldElement };
  const insert: Insert = {
    parent: oldElement.parentElement,
    node: new DOMParser().parseFromString(newElementText, 'application/xml')
      .documentElement,
    reference: oldElement.nextSibling,
  };

  return [remove, insert];
}

/**  */
@customElement('code-dialog')
export default class CodeDialog extends LitElement {
  @property({ attribute: false })
  element!: Element;

  @query('ace-editor') editor!: AceEditor;

  save(element: Element) {
    const text = this.editor.value;
    if (!text) return;

    const edits = codeEdits(element, text);
    if (!edits.length) return;

    this.dispatchEvent(newEditEvent(edits));
    this.dispatchEvent(new CustomEvent('closed'));
  }

  onClosed(ae: CustomEvent<{ action: string }>): void {
    if (ae.detail.action === 'save') this.save(this.element);
    if (ae.detail.action === 'close')
      this.dispatchEvent(new CustomEvent('closed'));
  }

  updated(): void {
    this.editor.basePath = '';
    this.editor.mode = 'ace/mode/xml';
  }

  render(): TemplateResult {
    if (!this.element) return html`No SCL Element`;

    return html`<mwc-dialog
      heading="Edit ${this.element.tagName}"
      open
      defaultAction=""
      @closed=${this.onClosed}
    >
      <nav><slot name="nav"></slot></nav>
      <ace-editor
        wrap
        soft-tabs
        theme="ace/theme/solarized_light"
        value="${formatXml(
          new XMLSerializer().serializeToString(this.element)
        )}"
        style="width: 80vw; height: calc(100vh - 240px);"
      ></ace-editor>
      <mwc-button slot="secondaryAction" dialogAction="close"
        >Cancel</mwc-button
      >
      <mwc-button slot="primaryAction" icon="save" dialogAction="save"
        >Save</mwc-button
      >
    </mwc-dialog>`;
  }

  static styles = css`
    mwc-dialog {
      --mdc-dialog-min-width: 85vw;
      --mdc-dialog-max-height: calc(100vh - 200px);
    }

    mwc-dialog > nav {
      position: absolute;
      top: 8px;
      right: 14px;
      color: var(--base00);
    }
  `;
}
