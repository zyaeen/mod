import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {dialogFooterRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {DialogType} from "Frontend/enums/DialogType";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('dialog-save')
export class SaveDialog extends LitElement {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    @state()
    private dialogOpened = false;

    @property()
    private dialogTitle: string = StringUtils.EMPTY_STRING;

    private dialogType!: DialogType;

    private data!: string;

    render() {
        return html`
            <vaadin-dialog
                    header-title="${this.dialogTitle}"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => {
                        e.stopImmediatePropagation();
                        this.dialogOpened = e.detail.value
                    }}"
                    ${dialogRenderer(this.renderDialog, [])}
                    ${dialogFooterRenderer(this.renderFooter, [])}
            ></vaadin-dialog>
        `;
    }

    private renderDialog = () => {
        return html`
            <vaadin-vertical-layout>
                ${
                        this.dialogType == DialogType.HOSTS_RECREATOR ?
                                html`
                                    <p>Your new deploy model will be based on active project!</p>
                                ` : null
                }
                <p>Do you want to save your progress?</p>
            </vaadin-vertical-layout>
        `;
    }

    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            this.dispatchEvent(new CustomEvent('agree-save'));
            this.close();
        }
        }"
        >Yes, save
        </vaadin-button>
        <vaadin-button theme="primary contrast" @click="${() => {
            this.dispatchEvent(new CustomEvent('disagree-save'));
            this.close();
        }
        }"
        >No, do not save
        </vaadin-button>
        <vaadin-button @click="${() => {
            this.close();
        }}">Cancel, stay here
        </vaadin-button>
    `;

    private close() {
        this.dialogOpened = false;
    }

    public openDialog(dialogType: DialogType, data?: string) {
        this.dialogType = dialogType;
        this.data = data ? data as string : StringUtils.EMPTY_STRING
        switch (dialogType) {
            case DialogType.DOMAIN_NAVIGATOR:
                this.dialogTitle = "Navigate to domain " + this.data;
                break
            case DialogType.PROJECT_NAVIGATOR:
                this.dialogTitle = "Navigate to project";
                break
            case DialogType.HOSTS_NAVIGATOR:
                this.dialogTitle = "Navigate to hosts";
                break
            case DialogType.PROJECT_RECREATOR:
                this.dialogTitle = "Creating new project";
                break
            case DialogType.HOSTS_RECREATOR:
                this.dialogTitle = "Creating new deploy model";
                break;
            default:
                this.dialogTitle = "Navigate to ";
                break;
        }
        this.dialogOpened = true;
    }

    public getDialogType() {
        return this.dialogType;
    }

    public getData() {
        return this.data;
    }

}
