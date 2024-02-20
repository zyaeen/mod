import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid/vaadin-grid-filter';
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import '@vaadin/grid/vaadin-grid-selection-column'
import '@vaadin/grid/vaadin-grid-filter-column'
import {
    NodeEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/NodeEditorDialog";
import {TemplateResult} from "lit/development";
import {isStrNotEmpty} from "Frontend/utils/common";
import {Identity} from "Frontend/enums/Identity";
import {TextFieldValueChangedEvent} from "@vaadin/text-field";

@customElement('cd-anchor-editor-dialog')
export class CdAnchorEditorDialog extends NodeEditorDialog {
    [x: string]: any;

    protected switchTitle() {
        this.dialogTitle = `Cross-domain anchor ${this.node.mnemonic}_${this.node.descriptor}`
    }

    private localEditorSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '30px', columns: 2}
    ];

    protected renderMetaLayout = () => {
        return html`
            <vaadin-form-layout colspan="3" .responsiveSteps="${this.localEditorSteps}"
                                style="padding: 0; margin: 0;">
                <vaadin-text-field
                        label="Mnemonic in this domain"
                        class="text-field-width"
                        name="mnemonic"
                        minlength="2"
                        maxlength="2"
                        value="${this.node.mnemonic}"
                        allowed-char-pattern="[A-Z]"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.mnemonic = e.detail.value;
                        }}"
                        readonly
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Connected anchor mnemonic"
                        class="text-field-width"
                        name="cdMnemonic"
                        value="${this.node.cdMnemonic}"
                        minlength="1"
                        readonly
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Connected domain"
                        class="text-field-width"
                        name="cdDomain"
                        value="${this.node.cdDomain}"
                        minlength="1"
                        readonly
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Descriptor"
                        class="text-field-width"
                        name="descriptor"
                        value="${this.node.connectedAnchorDescriptor ? this.node.connectedAnchorDescriptor : this.node.descriptor}"
                        minlength="1"
                        allowed-char-pattern="[a-zA-Z]"
                        readonly
                >
                </vaadin-text-field>
                <vaadin-text-field label="UID" name="uid"
                                   class="text-field-width"
                                   value="${this.node.uid}"
                                   readonly
                >
                </vaadin-text-field>
                <vaadin-combo-box
                        class="text-field-width"
                        value="${this.node.identity}"
                        .items="${Object.values(Identity)}"
                        label="Identity"
                        readonly
                >
                </vaadin-combo-box>
            </vaadin-form-layout>
            <vaadin-horizontal-layout colspan="4">
                <vaadin-text-area
                        label="Description"
                        class="text-field-width"
                        value="${this.node.description}"
                        caret="20"
                        name="description"
                        style="height: 150px; width: 100%"
                        readonly
                >
                </vaadin-text-area>
                <vaadin-vertical-layout theme="spacing-xs padding" style="width: 30%">
                    <p></p>
                    <vaadin-checkbox
                            label="Deprecated"
                            name="deprecated"
                            .checked="${this.node.deprecated == null ? false : this.node.deprecated}"
                            disabled
                    >
                    </vaadin-checkbox>
                    <vaadin-checkbox
                            label="Skip"
                            name="skip"
                            .checked="${isStrNotEmpty(this.node.skip)}"
                            disabled
                    >
                    </vaadin-checkbox>
                </vaadin-vertical-layout>

            </vaadin-horizontal-layout>
        `
    }

    protected override renderTabsLayout = () => {
        return html``;
    }

    render(): TemplateResult<1> {
        return super.render();
    }

}
