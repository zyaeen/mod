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
import {TextFieldChangeEvent, TextFieldValueChangedEvent} from "@vaadin/text-field";
import {CheckboxCheckedChangedEvent} from "@vaadin/checkbox";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdColumnDialog";
import {ID_POSTFIX} from "Frontend/enums/DefaultValues";

@customElement('anchor-editor-dialog')
export class AnchorEditorDialog extends NodeEditorDialog {
    // private columnDialog!: LdColumnDialog;

    protected switchTitle() {
        this.dialogTitle = `Anchor ${this.node.mnemonic}_${this.node.descriptor}`;
    }

    private localEditorSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '30px', columns: 2}
    ];

    protected renderMetaLayout = () => {
        return html`
            <vaadin-form-layout colspan="2" .responsiveSteps="${this.localEditorSteps}"
                                style="padding: 0; margin: 0;">
                <vaadin-text-field
                        label="Mnemonic"
                        class="text-field-width"
                        name="mnemonic"
                        minlength="2"
                        maxlength="2"
                        value="${this.node.mnemonic}"
                        allowed-char-pattern="[A-Z]"
                        error-message="Invalid mnemonic!"
                        ?invalid="${!this.isMnemonicValid}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.isMnemonicValid = this.mnemonics.indexOf(e.detail.value) == -1 && e.detail.value.length == 2;
                        }}"
                        @change="${(e: TextFieldChangeEvent) => {
                            const oldValue = structuredClone(this.node.mnemonic);
                            if (isStrNotEmpty(oldValue) && isStrNotEmpty(e.target.value) && this.isMnemonicValid) {
                                this.node!.mnemonic = e.target.value;
                                this.replaceColumnInAssociatedIndexes(
                                        (oldValue! + ID_POSTFIX).toUpperCase(),
                                        (e.target.value.toUpperCase() + ID_POSTFIX).toUpperCase()
                                );
                            }
                            this.requestUpdate();
                        }}"
                >
                </vaadin-text-field>
                <vaadin-text-field label="UID" name="uid"
                                   class="text-field-width"
                                   value="${this.node.uid}"
                                   readonly
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Descriptor"
                        class="text-field-width"
                        name="descriptor"
                        value="${this.node.descriptor}"
                        minlength="1"
                        error-message="Invalid descriptor!"
                        ?invalid="${!this.isDescriptorValid}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.isDescriptorValid = this.descriptors.indexOf(e.detail.value) == -1 && e.detail.value.length != 0;
                        }}"
                        @change="${(e: TextFieldChangeEvent) => {
                            const oldValue = structuredClone(this.node.descriptor);
                            if (isStrNotEmpty(oldValue) && isStrNotEmpty(e.target.value) && this.isDescriptorValid) {
                                this.node!.descriptor = e.target.value;
                                this.replaceColumnInAssociatedIndexes(oldValue!.toUpperCase(), e.target.value.toUpperCase());
                            }
                            this.requestUpdate();
                        }}"
                <!--                            allowed-char-pattern="[a-zA-Z]"-->
                >
                </vaadin-text-field>
                <vaadin-combo-box
                        class="text-field-width"
                        value="${this.node.identity}"
                        .items="${Object.values(Identity)}"
                        label="Identity"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.identity = e.detail.value;
                        }}"
                >
                </vaadin-combo-box>
                <vaadin-horizontal-layout colspan="2">
                    <vaadin-text-area
                            label="Description"
                            class="text-field-width"
                            value="${this.node.description}"
                            caret="20"
                            name="description"
                            style="height: 150px; width: 100%"
                            @value-changed="${(e: TextFieldValueChangedEvent) => {
                                this.node!.description = e.detail.value;
                            }}"
                    >
                    </vaadin-text-area>
                    <vaadin-vertical-layout theme="spacing-xs padding" style="width: 30%">
                        <p></p>
                        <vaadin-checkbox
                                label="Deprecated"
                                name="deprecated"
                                .checked="${this.node.deprecated == null ? false : this.node.deprecated}"
                                @checked-changed="${(e: CheckboxCheckedChangedEvent) => {
                                    this.node!.deprecated = e.detail.value;
                                }}"
                        >
                        </vaadin-checkbox>
                        <vaadin-checkbox
                                label="Skip"
                                name="skip"
                                .checked="${isStrNotEmpty(this.node.skip)}"
                                @checked-changed="${(e: CheckboxCheckedChangedEvent) => {
                                    this.node!.skip = e.detail.value;
                                }}"
                        >
                        </vaadin-checkbox>
                    </vaadin-vertical-layout>

                </vaadin-horizontal-layout>

            </vaadin-form-layout>
        `
    }

    protected renderTabsLayout = (knots: string[]) => {
        this.initTabsLayout();
        this.tabsLayout.setKnots(knots);
        this.tabsLayout.indexVisibility = true;
        this.tabsLayout.columnVisibility = true;
        return html`
            <vaadin-vertical-layout style="width: 100%" colspan="5">
                ${this.tabsLayout}
            </vaadin-vertical-layout>
        `;
    }

    render(): TemplateResult<1> {
        return super.render();
    }

}
