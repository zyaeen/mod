import {html} from 'lit';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid/vaadin-grid-filter';
import {FormLayout, FormLayoutResponsiveStep} from "@vaadin/form-layout";
import '@vaadin/grid/vaadin-grid-selection-column'
import '@vaadin/grid/vaadin-grid-filter-column'
import {
    NodeEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/NodeEditorDialog";
import {TemplateResult} from "lit/development";
import {isArrayNotEmpty, isStrEmpty, isStrNotEmpty} from "Frontend/utils/common";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdColumnDialog";
import {customElement} from "lit/decorators.js";
import {LeanDiNode} from "Frontend/interfaces/Interfaces";
import {GridColumn, GridItemModel} from "@vaadin/grid";
import {
    HostEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/deploy/nodes/HostEditorDialog";

import {DbType} from "Frontend/enums/DbType";
import {TextFieldChangeEvent, TextFieldValueChangedEvent} from "@vaadin/text-field";
import {ComboBox, ComboBoxValueChangedEvent} from "@vaadin/combo-box";

@customElement('db-editor-dialog')
export class DbEditorDialog extends HostEditorDialog {

    private localEditorSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '30px', columns: 2}
    ];

    protected switchTitle() {
        this.dialogTitle = `Database host ${this.node.hostName}`;
    }
    
    protected renderMetaLayout = () => {

        return html`
            <vaadin-form-layout colspan="2" .responsiveSteps="${this.localEditorSteps}"
                                style="padding: 0; margin: 0;">
                <vaadin-text-field
                        label="Host name"
                        class="text-field-width"
                        name="hostName"
                        value="${this.node.hostName}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node.hostName = e.detail.value;
                        }}"
                        allowed-char-pattern="[A-Za-z0-9]"
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Database name"
                        class="text-field-width"
                        name="dbName"
                        value="${this.node.dbName}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node.dbName = e.detail.value;
                        }}"
                        allowed-char-pattern="[A-Za-z/\-]"
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Host Route (URL)"
                        name="host"
                        class="text-field-width"
                        value="${this.node.host}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node.host = e.detail.value;
                        }}"
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Port"
                        class="text-field-width"
                        name="port"
                        value="${this.node.port}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node.port = e.detail.value;
                        }}"
                        minlength="4"
                        maxlength="4"
                        allowed-char-pattern="[0-9]"
                >
                </vaadin-text-field>
                <vaadin-combo-box
                        label="Database Type"
                        id="dbType"
                        .items="${Object.values(DbType)}"
                        .value="${this.node.dbType}"
                        @value-changed="${(e: ComboBoxValueChangedEvent) => {
                            e.stopImmediatePropagation();
                            const dbType = structuredClone(this.node.dbType);
                            if (isStrNotEmpty(e.detail.value)) {
                                this.node.dbType = e.detail.value;
                            } else {
                                this.node.dbType = dbType;
                            }
                            (e.target as ComboBox).value = this.node.dbType as string;
                            this.requestUpdate();
                        }}"
                ></vaadin-combo-box>
                <vaadin-text-field
                        label="Username"
                        class="text-field-width"
                        name="userName"
                        value="${this.node.userName}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node.userName = e.detail.value;
                        }}"
                        allowed-char-pattern="[a-zA-Z0-9]"
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Cluster ID"
                        class="text-field-width"
                        name="clusterId"
                        value="${this.node.clusterId}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node.clusterId = e.detail.value;
                        }}"
                        allowed-char-pattern="[0-9]"
                >
                </vaadin-text-field>
            </vaadin-form-layout>
        `
    }

}
