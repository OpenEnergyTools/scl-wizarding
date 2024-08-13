import { LitElement } from 'lit';
import { property } from 'lit/decorators.js';

import {
  EditWizardRequest,
  CreateWizardRequest,
  isCreateRequest,
  newCloseWizardEvent,
} from '../foundation.js';

import { wizards } from './wizards/wizards.js';
import { Wizard } from './foundation.js';

export default class WizardLibraryBase extends LitElement {
  @property({ attribute: false })
  wizardRequest: EditWizardRequest | CreateWizardRequest | null = null;

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
}
