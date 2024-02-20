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
import {Identity} from "Frontend/enums/Identity";
import {DataRange} from "Frontend/enums/DataRange";
import {TextFieldValueChangedEvent} from "@vaadin/text-field";
import {CheckboxCheckedChangedEvent} from "@vaadin/checkbox";
import {ComboBoxLitRenderer, comboBoxRenderer} from "@vaadin/combo-box/lit";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('knot-editor-dialog')
export class KnotEditorDialog extends NodeEditorDialog {

    protected switchTitle() {
        this.dialogTitle = `Knot ${this.node.mnemonic}_${this.node.descriptor}`
    }

    private localEditorSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '30px', columns: 3}
    ];

    private drRenderer: ComboBoxLitRenderer<string> = (item) => html`
        <div 
                style="display: flex;"
                id="${item}"
        >
            <span id="${item}">${item}</span>
            <vaadin-tooltip 
                    for="${item}" 
                    text="${item != this.node.dataRange ? 'All knot values of another data types will be deleted!' : StringUtils.EMPTY_STRING}"
                    position="start"
            ></vaadin-tooltip>
        </div>
    `;

    protected renderMetaLayout = () => {
        return html`
            <vaadin-form-layout colspan="2" .responsiveSteps="${this.localEditorSteps}"
                                style="padding: 0; margin: 0;">

                <vaadin-text-field
                        label="Mnemonic"
                        class="text-field-width"
                        name="mnemonic"
                        minlength="3"
                        maxlength="3"
                        value="${this.node.mnemonic}"
                        allowed-char-pattern="[A-Z]"
                        error-message="Invalid mnemonic!"
                        ?invalid="${!this.isMnemonicValid}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.mnemonic = e.detail.value;
                            this.isMnemonicValid = this.mnemonics.indexOf(e.detail.value) == -1 && e.detail.value.length == 3;
                        }}"
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
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.identity = e.detail.value;
                        }}"
                >
                </vaadin-combo-box>
                <vaadin-text-field
                        label="Descriptor"
                        class="text-field-width"
                        name="descriptor"
                        value="${this.node.descriptor}"
                        minlength="1"
                        allowed-char-pattern="[a-zA-Z]"
                        error-message="Invalid descriptor!"
                        ?invalid="${!this.isDescriptorValid}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.descriptor = e.detail.value;
                            this.isDescriptorValid = this.descriptors.indexOf(e.detail.value) == -1 && e.detail.value.length != 0;
                        }}"
                >
                </vaadin-text-field>
                <vaadin-combo-box
                        class="text-field-width"
                        value="${this.node.dataRange}"
                        ${comboBoxRenderer(this.drRenderer, [])}
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            if (this.node.dataRange != e.detail.value) {
                                this.node.values = {
                                    value: []
                                };
                            }
                            this.node.dataRange = e.detail.value;
                            this.setNumericOrNullable();
                            this.requestUpdate();
                        }}"
                        .items="${Object.values(DataRange).filter(el => el != DataRange.XML && el != DataRange.JSON)}"
                        label="Data range"
                >
                </vaadin-combo-box>
                <vaadin-text-field
                        label="Length"
                        name="length"
                        value="${this.node.length}"
                        style="padding-top: 0; width: 100%"
                        .disabled="${!this.isLongable}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            // @ts-ignore
                            this.node!.length = e.detail.value;
                        }}"
                        allowed-char-pattern="[0-9]"
                >
                </vaadin-text-field>
                <vaadin-text-area
                        label="Description"
                        class="text-field-width"
                        value="${this.node.description}"
                        caret="20"
                        name="description"
                        style="height: 150px; width: 100%"
                        colspan="2"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.description = e.detail.value;
                        }}"
                >
                </vaadin-text-area>
                <vaadin-vertical-layout theme="spacing-xs padding" style="width: 30%">
                    <vaadin-text-field
                            label="Precision"
                            name="precision"
                            class="text-field-width"
                            style="padding-top: 0; width: 100%"
                            value="${this.node.precision}"
                            .disabled="${!this.isNumeric}"
                            @value-changed="${(e: TextFieldValueChangedEvent) => {
                                this.node!.precision = e.detail.value;
                            }}"
                            allowed-char-pattern="[0-9]"

                    >
                    </vaadin-text-field>
                    <vaadin-text-field
                            label="Scale"
                            name="scale"
                            class="text-field-width"
                            style="padding-top: 0; width: 100%"
                            value="${this.node.scale}"
                            .disabled="${!this.isNumeric}"
                            @value-changed="${(e: TextFieldValueChangedEvent) => {
                                this.node!.scale = e.detail.value;
                            }}"
                            allowed-char-pattern="[0-9]"
                    >
                    </vaadin-text-field>
                    <vaadin-checkbox
                            label="Deprecated"
                            name="deprecated"
                            .checked="${this.node.deprecated == null ? false : this.node.deprecated}"
                            @checked-changed="${(e: CheckboxCheckedChangedEvent) => {
                                this.node!.deprecated = e.detail.value;
                            }}"
                    >
                    </vaadin-checkbox>
                </vaadin-vertical-layout>


            </vaadin-form-layout>
        `
    }

    protected renderTabsLayout = () => {
        this.initTabsLayout();
        this.tabsLayout.valueVisibility = true;
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
