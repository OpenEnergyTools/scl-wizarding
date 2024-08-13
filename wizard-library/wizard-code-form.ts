/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-duplicates */
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import 'ace-custom-element';
import '@material/mwc-dialog';
import AceEditor from 'ace-custom-element';

import '../foundation/components/scl-wizard-dialog.js';
import '../foundation/components/code-dialog.js';
import {
  EditWizardRequest,
  CreateWizardRequest,
  isCreateRequest,
  newCloseWizardEvent,
} from '../foundation.js';
import { wizards } from './wizards/wizards.js';
import { Wizard } from './foundation.js';

/**
 * Format xml string in "pretty print" style and return as a string
 * @param xml - xml document as a string
 * @param tab - character to use as a tab
 * @returns string with pretty print formatting
 */
export function formatXml(xml: string, tab: string = '\t'): string {
  let formatted = '';
  let indent = '';

  xml.split(/>\s*</).forEach(node => {
    if (node.match(/^\/\w/)) indent = indent.substring(tab!.length);
    formatted += `${indent}<${node}>\r\n`;
    if (node.match(/^<?\w[^>]*[^/]$/)) indent += tab;
  });
  return formatted.substring(1, formatted.length - 3);
}

@customElement('wizard-code-form')
export default class WizardCodeForm extends LitElement {
  @property({ attribute: false })
  wizardRequest: EditWizardRequest | CreateWizardRequest | null = null;

  @state()
  showCode = false;

  @query('ace-editor') editor!: AceEditor;

  wizard(): Wizard | undefined {
    if (isCreateRequest(this.wizardRequest)) {
      const request = this.wizardRequest as CreateWizardRequest;
      return wizards[request.tagName]?.create(request.parent);
    }

    const request = this.wizardRequest as EditWizardRequest;
    return wizards[request.element.tagName]?.edit(request.element);
  }

  onClosed(): void {
    this.dispatchEvent(newCloseWizardEvent(this.wizardRequest!));
  }

  render(): TemplateResult {
    if (!this.wizardRequest) return html``;

    const element = isCreateRequest(this.wizardRequest)
      ? this.wizardRequest.parent
      : this.wizardRequest!.element;

    const wizard = this.wizard();
    if (!wizard || this.showCode)
      return html`<code-dialog .element=${element} @closed="${this.onClosed}">
        ${wizard
          ? html`<mwc-icon-button-toggle
              slot="nav"
              ?on=${this.showCode}
              onIcon="code_off"
              offIcon="code"
              @click="${() => {
                this.showCode = !this.showCode;
              }}"
            ></mwc-icon-button-toggle>`
          : html``}
      </code-dialog>`;
    return html`<scl-wizard-dialog .wizard=${wizard}
      ><mwc-icon-button-toggle
        slot="nav"
        ?on=${this.showCode}
        onIcon="code_off"
        offIcon="code"
        @click="${() => {
          this.showCode = !this.showCode;
        }}"
      ></mwc-icon-button-toggle
    ></scl-wizard-dialog> `;
  }

  static styles = css`
    mwc-dialog {
      --mdc-dialog-min-width: 85vw;
      --mdc-dialog-max-height: calc(100vh - 200px);
    }
  `;
}
