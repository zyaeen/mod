import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {isStrNotEmpty} from "Frontend/utils/common";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('fs-host-creation-dialog')
export class FsHostCreationDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    private folder!: string;

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
                    label="Folder path"
                    id="folder"
                    style="width: 100%"
                    @input="${(e: Event) => this.folder = (<any>e).target.value}"
            ></vaadin-text-field>
            <vaadin-text-field
                    label="Host"
                    id="hostRoute"
                    style="width: 100%"
                    @input="${(e: Event) => this.node.host = (<any>e).target.value}"
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
            if (this.checkFields('userName', 'host') && isStrNotEmpty(this.folder)) {
                this.dispatchEvent(new CustomEvent('create-host',
                        {
                            detail: {
                                userName: this.node.userName,
                                host: this.node.host,
                                folder: this.folder,
                                clusterId: this.node.clusterId != null && this.node.clusterId != StringUtils.EMPTY_STRING ? this.node.clusterId : null,
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
