import { LitElement, TemplateResult, html } from 'lit';
import { state, queryAll } from 'lit/decorators.js';

import '@material/mwc-icon-button';

import './wizard-library/wizard-code-form.js';

import { WizardRequest, WizardEvent } from './foundation.js';

/** `LitElement` mixin that adds a `workflow` property which [[`Wizard`]]s are
 * queued onto on incoming [[`WizardEvent`]]s, first come first displayed. */
export default class SclWizarding extends LitElement {
  /** FIFO queue of [[`Wizard`]]s to display. */
  @state()
  workflow: WizardRequest[] = [];

  @queryAll('.library') libraryLitElements?: LitElement[];

  updateWizardLibraries(): void {
    this.updateComplete.then(() => {
      (this.libraryLitElements ?? []).forEach(libraryLitElement =>
        libraryLitElement.requestUpdate()
      );
    });
  }

  private closeWizard(we: WizardEvent): void {
    this.workflow.splice(this.workflow.indexOf(we.detail), 1);
    this.requestUpdate();
    this.updateWizardLibraries();
  }

  private onWizard(we: WizardEvent) {
    const wizard = we.detail;
    if (wizard === undefined) return;
    if (wizard === null) this.workflow.shift();
    else if (wizard!.subWizard) this.workflow.unshift(wizard);
    else this.workflow.push(wizard);
    this.requestUpdate();
    this.updateWizardLibraries();
  }

  constructor() {
    super();

    window.addEventListener('oscd-edit-wizard-request', event =>
      this.onWizard(event as WizardEvent)
    );
    window.addEventListener('oscd-create-wizard-request', event =>
      this.onWizard(event as WizardEvent)
    );
    this.addEventListener('oscd-close-wizard', event =>
      this.closeWizard(event as WizardEvent)
    );
  }

  render(): TemplateResult {
    if (!this.workflow.length) return html``;

    return html`<wizard-code-form
      class="library"
      .wizardRequest="${this.workflow[0]}"
    ></wizard-code-form>`;
  }
}
