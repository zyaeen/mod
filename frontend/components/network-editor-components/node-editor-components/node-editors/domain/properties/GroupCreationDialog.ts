import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {dialogFooterRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {TextField, TextFieldValueChangedEvent} from "@vaadin/text-field";
import {Group} from "Frontend/interfaces/Interfaces";
import {isStrNotEmpty} from "Frontend/utils/common";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('dialog-group-create')
export class GroupCreationDialog extends LitElement {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    @state()
    private group!: Group;

    @state()
    private dialogOpened = false;

    @state()
    private textField!: TextField;


    render() {
        this.textField = new TextField();
        this.textField.label = "Group name";
        return html`
            <vaadin-dialog
                    no-close-on-outside-click="${true}"
                    header-title="Group creation"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => (this.dialogOpened = e.detail.value)}"
                    ${dialogRenderer(this.renderDialog, [this.group])}
                    ${dialogFooterRenderer(this.renderFooter, [])}
            ></vaadin-dialog>
        `;
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 8}
    ];

    private renderDialog = () => html`
        <vaadin-vertical-layout style="align-items: stretch; width: 15vw">
            <vaadin-text-field
                    label="id"
                    value="${this.group ? this.group.id : null}"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.group!.id = e.detail.value;
                    }}"
                    .readonly="${this.group.id != undefined && this.group.id != StringUtils.EMPTY_STRING}"
                    allowed-char-pattern="[0-9]"
            >
            </vaadin-text-field>
            <vaadin-text-field
                    label="Group name"
                    value="${this.group ? this.group.name : null}"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.group!.name = e.detail.value;
                    }}"
                    allowed-char-pattern="[a-zA-Z0-9]"
            >
            </vaadin-text-field>
            <vaadin-text-field
                    label="Description"
                    value="${this.group && isStrNotEmpty(this.group.description) ? this.group.description : null}"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.group!.description = e.detail.value;
                    }}"
            >
            </vaadin-text-field>
        </vaadin-vertical-layout>

    `;

    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            if (this.group && this.group!.name != null && this.group!.name.length != 0) {
                this.dispatchEvent(new CustomEvent('create-group', {
                    detail: {
                        id: this.group!.id,
                        name: this.group!.name,
                        description: this.group!.description
                    }
                }));
                this.close();
            }
        }}">Save group
        </vaadin-button>
        <vaadin-button @click="${() => {
            this.close();
        }}">Cancel
        </vaadin-button>
    `;

    public open(group?: any) {
        this.group = group != null ? group : {} as Group;
        this.dialogOpened = true;
    }

    public close() {
        this.dialogOpened = false;
        this.group = {};
    }


}
