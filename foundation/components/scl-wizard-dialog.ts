/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-duplicates */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-plusplus */
/* eslint-disable no-undef */
import { LitElement, TemplateResult, css, html } from 'lit';
import { customElement, property, queryAll, state } from 'lit/decorators.js';

import 'ace-custom-element';
import '@material/mwc-button';
import '@material/mwc-dialog';
import { Dialog } from '@material/mwc-dialog';
import type { List } from '@material/mwc-list';

import { newEditEvent } from '@openenergytools/open-scd-core';
import {
  Wizard,
  WizardInputElement,
  WizardPage,
  WizardActor,
  wizardInputSelector,
  checkValidity,
  reportValidity,
} from '../../wizard-library/foundation.js';
import {
  CreateWizardRequest,
  EditWizardRequest,
  newCloseWizardEvent,
} from '../../foundation.js';

function renderWizardInput(input: TemplateResult): TemplateResult {
  return input;
}

function dialogInputs(dialog?: Dialog): WizardInputElement[] {
  return Array.from(dialog?.querySelectorAll(wizardInputSelector) ?? []);
}

function dialogValid(dialog?: Dialog): boolean {
  return dialogInputs(dialog).every(checkValidity);
}

/** A wizard style dialog consisting of several pages commiting some
 * [[`EditorAction`]] on completion and aborting on dismissal. */
@customElement('scl-wizard-dialog')
export class SclWizardDialog extends LitElement {
  /** The [[`Wizard`]] implemented by this dialog. */
  @property({ type: Array })
  wizard: Wizard = [];

  @property({ attribute: false })
  wizardRequest: EditWizardRequest | CreateWizardRequest | null = null;

  /** Index of the currently active [[`WizardPage`]] */
  @state()
  pageIndex = 0;

  @queryAll('mwc-dialog') dialogs!: NodeListOf<Dialog>;

  @queryAll(wizardInputSelector) inputs!: NodeListOf<WizardInputElement>;

  /** The `Dialog` showing the active [[`WizardPage`]]. */
  get dialog(): Dialog | undefined {
    return this.dialogs[this.pageIndex];
  }

  /** Checks the inputs of all [[`WizardPage`]]s for validity. */
  checkValidity(): boolean {
    return Array.from(this.inputs).every(checkValidity);
  }

  private get firstInvalidPage(): number {
    return Array.from(this.dialogs).findIndex(dialog => !dialogValid(dialog));
  }

  prev(): void {
    if (this.pageIndex <= 0) return;
    this.pageIndex--;
    this.dialog?.show();
  }

  async next(): Promise<void> {
    if (dialogValid(this.dialog)) {
      if (this.wizard.length > this.pageIndex + 1) this.pageIndex++;
      this.dialog?.show();
    } else {
      this.dialog?.show();
      await this.dialog?.updateComplete;
      dialogInputs(this.dialog).map(reportValidity);
    }
  }

  /** Commits `action` if all inputs are valid, reports validity otherwise. */
  async act(action?: WizardActor, primary = true): Promise<boolean> {
    if (action === undefined) return false;
    const wizardInputs = Array.from(this.inputs);
    const wizardList = <List | null>(
      this.dialog?.querySelector('filtered-list,mwc-list')
    );
    if (!this.checkValidity()) {
      this.pageIndex = this.firstInvalidPage;
      wizardInputs.map(reportValidity);
      return false;
    }

    const wizardActions = action(wizardInputs, this, wizardList);
    if (wizardActions.length > 0) {
      if (primary) this.wizard[this.pageIndex].primary = undefined;
      else this.wizard[this.pageIndex].secondary = undefined;
      this.dispatchEvent(newCloseWizardEvent(this.wizardRequest!));
    }
    wizardActions.forEach(wa => this.dispatchEvent(newEditEvent(wa)));
    return true;
  }

  private onClosed(ae: CustomEvent<{ action: string } | null>): void {
    if (!(ae.detail && ae.detail?.action)) return;
    if (ae.detail.action === 'close')
      this.dispatchEvent(newCloseWizardEvent(this.wizardRequest!));
    else if (ae.detail.action === 'prev') this.prev();
    else if (ae.detail.action === 'next') this.next();
  }

  constructor() {
    super();

    this.act = this.act.bind(this);
    this.renderPage = this.renderPage.bind(this);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('wizard')) {
      this.pageIndex = 0;
      while (
        this.wizard.findIndex(page => page.initial) > this.pageIndex &&
        dialogValid(this.dialog)
      ) {
        this.dialog?.close();
        this.next();
      }
      this.dialog?.show();
    }
    if (this.wizard[this.pageIndex]?.primary?.auto) {
      this.updateComplete.then(() =>
        this.act(this.wizard[this.pageIndex].primary!.action)
      );
    }
  }

  renderPage(page: WizardPage, index: number): TemplateResult {
    return html`<mwc-dialog
      defaultAction="next"
      heading=${page.title}
      @closed=${this.onClosed}
    >
      <nav><slot name="nav"></slot></nav>
      <div id="wizard-content">${page.content?.map(renderWizardInput)}</div>
      ${index > 0
        ? html`<mwc-button
            slot="secondaryAction"
            dialogAction="prev"
            icon="navigate_before"
            label=${this.wizard?.[index - 1].title}
          ></mwc-button>`
        : html``}
      ${page.secondary
        ? html`<mwc-button
            slot="secondaryAction"
            @click=${() => this.act(page.secondary?.action, false)}
            icon="${page.secondary.icon}"
            label="${page.secondary.label}"
          ></mwc-button>`
        : html`<mwc-button
            slot="secondaryAction"
            dialogAction="close"
            label="close"
            style="--mdc-theme-primary: var(--mdc-theme-error)"
          ></mwc-button>`}
      ${page.primary
        ? html`<mwc-button
            slot="primaryAction"
            @click=${() => this.act(page.primary?.action)}
            icon="${page.primary.icon}"
            label="${page.primary.label}"
            trailingIcon
          ></mwc-button>`
        : index + 1 < (this.wizard?.length ?? 0)
        ? html`<mwc-button
            slot="primaryAction"
            dialogAction="next"
            icon="navigate_next"
            label=${this.wizard?.[index + 1].title}
            trailingicon
          ></mwc-button>`
        : html``}
    </mwc-dialog>`;
  }

  render(): TemplateResult {
    return html`${this.wizard.map(this.renderPage)}`;
  }

  static styles = css`
    mwc-dialog {
      --mdc-dialog-max-width: 92vw;
    }

    mwc-dialog > nav {
      position: absolute;
      top: 8px;
      right: 14px;
      color: var(--base00);
    }

    #wizard-content {
      display: flex;
      flex-direction: column;
    }

    #wizard-content > * {
      display: block;
      margin-top: 16px;
    }

    *[iconTrailing='search'] {
      --mdc-shape-small: 28px;
    }
  `;
}
