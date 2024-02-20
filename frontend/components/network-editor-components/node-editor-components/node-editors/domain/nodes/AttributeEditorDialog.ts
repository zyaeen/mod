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
import {isArrayNotEmpty, isStrEmpty, isStrNotEmpty} from "Frontend/utils/common";
import {Identity} from "Frontend/enums/Identity";
import {DataRange} from "Frontend/enums/DataRange";
import {CheckboxCheckedChangedEvent} from "@vaadin/checkbox";
import {TextFieldChangeEvent, TextFieldValueChangedEvent} from "@vaadin/text-field";
import {ComboBox, ComboBoxValueChangedEvent} from "@vaadin/combo-box";
import {ComboBoxLitRenderer, comboBoxRenderer} from "@vaadin/combo-box/lit";
import {CHANGEDAT, ID_POSTFIX, StringUtils} from "Frontend/enums/DefaultValues";
import {SheetType} from "Frontend/enums/SheetType";
import {LdEventTarget} from "Frontend/events/LdEventTarget";

@customElement('attribute-editor-dialog')
export class AttributeEditorDialog extends NodeEditorDialog {
    private dataRangeToChange: DataRange | null = null;

    protected switchTitle() {
        this.dialogTitle = `Attribute ${this.node.mnemonic}_${this.node.descriptor}`
    }

    private localEditorSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '30px', columns: 4}
    ];


    private drRenderer: ComboBoxLitRenderer<string> = (item) => html`
        <div
                style="display: flex;"
                id="${item}"
        >
            <span id="${item}">${item}</span>
            <vaadin-tooltip
                    for="${item}"
                    text="${item != DataRange.JSON ? "Related JSON data will be deleted!" : StringUtils.EMPTY_STRING}"
                    position="start"></vaadin-tooltip>
        </div>
    `;
    private krRenderer: ComboBoxLitRenderer<string> = (item) => html`
        <div
                style="display: flex;"
                id="${item}"
        >
            <span id="${item}">${item}</span>
            <vaadin-tooltip
                    for="${item}"
                    text="Related JSON data will be deleted and related indexes will be changed!"
                    position="start"></vaadin-tooltip>
        </div>
    `;
    protected renderMetaLayout = () => {
        return html`
            <vaadin-form-layout colspan="3" .responsiveSteps="${this.localEditorSteps}"
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
                            this.isMnemonicValid = this.mnemonics.indexOf(e.detail.value) == -1 && e.detail.value.length == 3;
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
                <vaadin-text-field label="UID"
                                   name="uid"
                                   class="text-field-width"
                                   value="${this.node.uid}"
                                   readonly
                >
                </vaadin-text-field>
                <vaadin-combo-box
                        class="text-field-width"
                        .value="${this.node.dataRange}"
                        .items="${Object.values(DataRange)}"
                        ${comboBoxRenderer(this.drRenderer, [])}
                        label="Data Range"
                        @value-changed="${(e: ComboBoxValueChangedEvent) => {
                            const drLast = structuredClone(this.node.dataRange);
                            if (isStrNotEmpty(e.detail.value)) {
                                this.node.knotRange = null;
                                if (e.detail.value != DataRange.JSON) {
                                    this.node.json = null;
                                }
                                this.node.dataRange = e.detail.value as DataRange;
                            } else {
                                this.node.dataRange = drLast;
                            }
                            (e.target as ComboBox).value = this.node.dataRange as string;
                            this.requestUpdate();
                            this.setNumericOrNullable();
                        }}"
                >
                </vaadin-combo-box>
                <vaadin-text-field
                        label="Precision"
                        name="precision"
                        class="text-field-width"
                        value="${this.node.precision}"
                        .disabled="${!this.isNumeric}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.precision = e.detail.value;
                        }}"
                        allowed-char-pattern="[0-9]"
                >
                </vaadin-text-field>
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
                >
                </vaadin-text-field>
                <vaadin-combo-box
                        label="KnotRange"
                        name="knotRange"
                        class="text-field-width"
                        ${comboBoxRenderer(this.krRenderer, [])}
                        value="${this.node.knotRange}"
                        .items="${this.knots}"
                        @value-changed="${(e: ComboBoxValueChangedEvent) => {
                            if (isStrNotEmpty(e.detail.value)) {
                                this.node.dataRange = null;
                                this.node.json = null;
                                this.node.knotRange = e.detail.value;
                                this.replaceDataRangeInextendedColumn();
                                 // todo проанализировать перезаписывание индекса при изменении колонки?
                                // this.removeAssociatedIndexes(this.node.knotRange!);
                            } else {
                                this.node.knotRange = null;
                            }
                            this.requestUpdate();
                        }}"
                >
                </vaadin-combo-box>
                <vaadin-combo-box
                        class="text-field-width"
                        value="${this.node.timeRange}"
                        .items="${Object.values(Identity)}"
                        label="Time Range"
                        @value-changed="${(e: ComboBoxValueChangedEvent) => {
                            this.node!.timeRange = e.detail.value;
                            if (isStrEmpty(e.detail.value)) {
                                this.replaceColumnInAssociatedIndexes(CHANGEDAT);
                            }
                            this.requestUpdate();
                        }}"
                >
                </vaadin-combo-box>
                <vaadin-text-field
                        label="Scale"
                        name="scale"
                        class="text-field-width"
                        value="${this.node.scale}"
                        ?disabled="${!this.isNumeric}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.scale = e.detail.value;
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
                        style="height: 150px"
                        colspan="3"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node!.description = e.detail.value;
                        }}"
                >
                </vaadin-text-area>
                <vaadin-vertical-layout theme="spacing-xs padding" style="width: 20%">
                    <vaadin-text-field
                            label="Length"
                            name="length"
                            style="width: 80%"
                            class="text-field-width"
                            value="${this.node.length}"
                            ?disabled="${!this.isLongable}"
                            allowed-char-pattern="[0-9]"
                            @value-changed="${(e: TextFieldValueChangedEvent) => {
                                // @ts-ignore
                                this.node!.length = e.detail.value;
                            }}"
                    >
                    </vaadin-text-field>
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
                            ?disabled="${this.node.timeRange == null || this.node.timeRange == StringUtils.EMPTY_STRING}"
                            label="Layered"
                            name="layered"
                            .checked="${this.node.layered == null ? false : this.node.layered}"
                            @checked-changed="${(e: CheckboxCheckedChangedEvent) => {
                                this.node!.layered = e.detail.value;
                            }}"
                    >
                    </vaadin-checkbox>
                </vaadin-vertical-layout>
            </vaadin-form-layout>
        `
    }

    protected renderTabsLayout = (knots: string[]) => {
        this.initTabsLayout();
        this.tabsLayout.setKnots(knots);
        this.tabsLayout.indexVisibility = true;
        this.tabsLayout.columnVisibility = true;
        this.tabsLayout.jsonVisibility = true;
        this.tabsLayout.addEventListener(LdEventTarget.RESET_KNOT_RANGE_ROLE, () => {
            this.node.knotRange = null;
            this.requestUpdate();
        });
        return html`
            <vaadin-vertical-layout style="width: 100%" colspan="4">
                ${this.tabsLayout}
            </vaadin-vertical-layout>
        `;
    }

    public override setKnots(knots: string[]) {
        super.setKnots(knots)
        // if (isArrayNotEmpty(this.node.extendedColumn)) {
        //     for (const column of this.node.extendedColumn!) {
        //         if (isStrNotEmpty(column.knotRange)) {
        //             this.knots = [];
        //             break;
        //         }
        //     }
        // }
    }

    render(): TemplateResult<1> {
        return super.render();
    }
}
