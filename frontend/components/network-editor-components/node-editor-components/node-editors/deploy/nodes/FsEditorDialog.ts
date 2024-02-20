import {html} from 'lit';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid/vaadin-grid-filter';
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import '@vaadin/grid/vaadin-grid-selection-column'
import '@vaadin/grid/vaadin-grid-filter-column'

import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdColumnDialog";
import {customElement} from "lit/decorators.js";
import {
    HostEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/deploy/nodes/HostEditorDialog";
import {TextFieldValueChangedEvent} from "@vaadin/text-field";


@customElement('fs-editor-dialog')
export class FsEditorDialog extends HostEditorDialog {

    private localEditorSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '30px', columns: 2}
    ];

    protected switchTitle() {
        this.dialogTitle = `File system host ${this.node.hostName}`;
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
                        label="Folder path"
                        class="text-field-width"
                        name="folder"
                        value="${this.node.folder}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.node.folder = e.detail.value;
                        }}"
                        allowed-char-pattern="[a-zA-Z0-9/\-]"
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
