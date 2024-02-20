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
import {ComboBoxValueChangedEvent} from "@vaadin/combo-box";
import {TextFieldValueChangedEvent} from "@vaadin/text-field";
import {CheckboxCheckedChangedEvent} from "@vaadin/checkbox";
import {createDefaultTieRole, isArrayNotEmpty, isStrEmpty, isStrNotEmpty} from "Frontend/utils/common";
import {ComboBoxLitRenderer, comboBoxRenderer} from "@vaadin/combo-box/lit";
import {CHANGEDAT} from "Frontend/enums/DefaultValues";
import {KnotRole} from "Frontend/interfaces/Interfaces";
import {LdEventTarget} from "Frontend/events/LdEventTarget";

@customElement('tie-editor-dialog')
export class TieEditorDialog extends NodeEditorDialog {

    protected switchTitle() {
        this.dialogTitle = `Tie ${this.node.descriptor}`
    }

    private localEditorSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '30px', columns: 2}
    ];

    private krRenderer: ComboBoxLitRenderer<string> = (item) => html`
        <div
                style="display: flex;"
                id="${item}"
        >
            <span id="${item}">${item}</span>
            <vaadin-tooltip
                    for="${item}"
                    text="Related indexes will be changed!"
                    position="start"></vaadin-tooltip>
        </div>
    `;

    protected renderMetaLayout = () => {
        return html`
            <vaadin-form-layout colspan="2" .responsiveSteps="${this.localEditorSteps}"
                                style="padding: 0; margin: 0;">
                <vaadin-form-layout colspan="2" .responsiveSteps="${this.localEditorSteps}"
                                    style="padding: 0; margin: 0;">
                    <vaadin-text-field
                            label="Descriptor"
                            class="text-field-width"
                            name="descriptor"
                            value="${this.node.descriptor}"
                            readonly
                    >
                    </vaadin-text-field>
                    <vaadin-text-field
                            label="UID"
                            name="uid"
                            class="text-field-width"
                            value="${this.node.uid}"
                            readonly
                    >
                    </vaadin-text-field>
                    <vaadin-combo-box
                            label="KnotRole"
                            name="knotRole"
                            class="text-field-width"
                            ${comboBoxRenderer(this.krRenderer, [])}
                            value="${this.node.knotRole != null && this.node.knotRole.length != 0 ? this.node.knotRole[0].type : null}"
                            .items="${this.knots}"
                            @value-changed="${(e: ComboBoxValueChangedEvent) => {
                                const value = e.detail.value;
                                if (isStrNotEmpty(value)) {
                                    if (isArrayNotEmpty(this.node.knotRole!)) {
                                        this.replaceColumnInAssociatedIndexes(this.node.knotRole![0].type!, value);
                                    }
                                    this.node!.knotRole = [createDefaultTieRole(value) as KnotRole];
                                    this.replaceDataRangeInextendedColumn();
                                } else  {
                                    if (isArrayNotEmpty(this.node.knotRole!)) {
                                        this.replaceColumnInAssociatedIndexes(this.node.knotRole![0].type!);
                                    }
                                    this.node.knotRole = null;
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
                                if (isStrEmpty(e.detail.value)) {
                                    this.replaceColumnInAssociatedIndexes(CHANGEDAT);
                                }
                                this.node!.timeRange = e.detail.value;
                                this.requestUpdate();
                            }}"
                    >
                    </vaadin-combo-box>
                    <vaadin-horizontal-layout colspan="2">
                        <vaadin-text-area
                                label="Description"
                                class="text-field-width"
                                value="${this.node.description}"
                                name="description"
                                style="height: 150px; width: 70%"
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
        this.tabsLayout.addEventListener(LdEventTarget.RESET_KNOT_RANGE_ROLE, () => {
            this.node.knotRole = null;
            this.requestUpdate();
        });
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
