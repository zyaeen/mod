import {html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {dialogFooterRenderer, dialogHeaderRenderer, DialogLitRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {Area, extendedColumn, LeanDiNode} from "Frontend/interfaces/Interfaces";



export class LdCreationDialog extends LitElement{
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    @state()
    protected saveDisabled: boolean = true;

    constructor() {
        super();
    }

    @state()
    protected dependencies: any[] = [];

    protected node!: LeanDiNode;

    protected toEdit: boolean = false;

    public isEdit() {
        return this.toEdit;
    }

    public open = (title: string, node?: LeanDiNode | Area): void => {
        this.node = {};
        this.node = {} as LeanDiNode;
        if (node != null) {
            this.node = node;
            this.toEdit = true;
            this.dialogTitle = 'Edit ' + title;
        } else {
            this.toEdit = false;
            this.dialogTitle = 'Create ' + title;
        }
        this.dialogOpened = true;
    }

    @state()
    protected dialogOpened = false;
    @state()
    public dialogTitle = '';

    private dialogRenderer!: DialogLitRenderer;
    private footerRenderer!: DialogLitRenderer;

    setRenderer(dialogRenderer: DialogLitRenderer, footerRenderer: DialogLitRenderer) {
        this.dependencies = this.dependencies.concat([this.node, this.toEdit,
            this.dialogOpened, this.dialogTitle, this.saveDisabled]);
        this.dialogRenderer = dialogRenderer;
        this.footerRenderer = footerRenderer;
    }

    render() {
        return html`
            <vaadin-dialog
                    draggable
                    header-title="${this.dialogTitle}"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => {
            this.dialogOpened = e.detail.value
        }}"
                    ${dialogRenderer(this.dialogRenderer, this.dependencies)}
                    ${dialogFooterRenderer(this.footerRenderer, [])}
                    ${dialogHeaderRenderer(
                            () => html`
                                <vaadin-button theme="tertiary" @click="${this.close}">
                                    <vaadin-icon icon="lumo:cross"></vaadin-icon>
                                </vaadin-button>
                            `,
                            []
                    )}
                    no-close-on-outside-click="${true}"
            ></vaadin-dialog>
        `;
    }

    protected checkFields(...fields: string[]) {
        for (let key of fields) {
            // @ts-ignore
            if (this.node[key] == null) {
                return false;
            }
        }
        return true;
    }

    protected close() {
        this.dialogOpened = false;
        this.node = {};
    }

}



