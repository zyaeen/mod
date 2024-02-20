import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {DbType} from "Frontend/enums/DbType";
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('host-creation-dialog')
export class DbHostCreationDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }


    private renderDialog = () => html`
        <vaadin-vertical-layout style="width: 300px">
            <vaadin-text-field
                    label="Name of Host"
                    id="hostName"
                    allowed-char-pattern="[a-zA-Z]"
                    style="width: 100%"
                    @input="${(e: Event) => this.node.hostName = (<any>e).target.value}"
            ></vaadin-text-field>
            <vaadin-text-field
                    label="Name of Database"
                    id="name"
                    allowed-char-pattern="[a-zA-Z0-9/]"
                    style="width: 100%"
                    @input="${(e: Event) => this.node.name = (<any>e).target.value}"
            ></vaadin-text-field>
            <vaadin-text-field
                    label="Host"
                    id="hostRoute"
                    style="width: 100%"
                    @input="${(e: Event) => this.node.host = (<any>e).target.value}"
            ></vaadin-text-field>
            <vaadin-combo-box
                    label="Database Type"
                    id="dbType"
                    style="width: 100%"
                    .items="${Object.values(DbType)}"
                    @value-changed="${(e: Event) => {
                        this.node.dbType = (<any>e).target.value;
                    }}"
            ></vaadin-combo-box>
            <vaadin-text-field
                    label="Port"
                    id="port"
                    minlength="4"
                    maxlength="4"
                    allowed-char-pattern="[0-9]"
                    style="width: 100%"
                    @input="${(e: Event) => this.node.port = (<any>e).target.value}"
            ></vaadin-text-field>
            <vaadin-text-area
                    label="Username"
                    id="user"
                    allowed-char-pattern="[a-zA-Z0-9]"
                    style="width: 100%"
                    @input="${(e: Event) => this.node.userName = (<any>e).target.value}"
            ></vaadin-text-area>
            <vaadin-text-field
                    label="Cluster ID"
                    id="clusterId"
                    allowed-char-pattern="[0-9]"
                    style="width: 100%"
                    @input="${(e: Event) => this.node.clusterId = (<any>e).target.value}"
            ></vaadin-text-field>
        </vaadin-vertical-layout>
    `;

    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            if (this.checkFields(
                'name', 'port', 'userName', 'host', 'dbType'
            )) {
                this.dispatchEvent(new CustomEvent('create-host',
                        {
                            detail: {
                                dbName: this.node.name,
                                port: this.node.port,
                                userName: this.node.userName,
                                host: this.node.host,
                                dbType: this.node.dbType,
                                clusterId: this.node.clusterId != null && this.node.clusterId != StringUtils.EMPTY_STRING ?
                                        this.node.clusterId : null,
                                hostName: this.node.hostName
                            }
                        }));
                this.close();
            }
        }}"
        >Yes
        </vaadin-button>
        <vaadin-button @click="${this.close}">Cancel
        </vaadin-button>
    `;

    render(): TemplateResult<1> {
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }
}
