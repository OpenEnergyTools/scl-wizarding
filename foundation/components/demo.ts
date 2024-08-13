/* eslint-disable import/no-duplicates */
import { LitElement, TemplateResult, html } from 'lit';
import { property, query } from 'lit/decorators.js';

import { newCreateWizardEvent, newEditWizardEvent } from '../../foundation.js';

export default class TriggerWizard extends LitElement {
  @property()
  doc!: XMLDocument;

  @query('#tag') input!: HTMLInputElement;

  @query('#parenttag') parentinput!: HTMLInputElement;

  @query('#childtag') childinput!: HTMLInputElement;

  triggerInspectWizard(): void {
    const element = this.doc.querySelector(this.input.value);
    if (!element) return;

    this.dispatchEvent(newEditWizardEvent(element));
  }

  triggerCreateWizard(): void {
    const parent = this.doc.querySelector(this.parentinput.value);
    const tagName = this.childinput.value;
    if (!parent || !tagName) return;

    this.dispatchEvent(newCreateWizardEvent(parent, tagName));
  }

  render(): TemplateResult {
    return html`<input id="tag" name="tagname" />
      <button @click="${this.triggerInspectWizard}">edit</button>
      <input id="parenttag" name="parentTag" />
      <input id="childtag" name="childTag" />
      <button @click="${this.triggerCreateWizard}">edit</button>`;
  }
}
