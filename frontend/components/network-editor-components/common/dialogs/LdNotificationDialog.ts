import {html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {dialogFooterRenderer, DialogLitRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';


export class LdNotificationDialog extends LitElement{
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    constructor() {
        super();
    }

    public open = (title: string, message: string) => {
        this.dialogTitle = title;
        this.dialogMessage = message;
        this.dialogOpened = true;
    }

    @state()
    private dialogOpened = false;
    @state()
    protected dialogTitle = '';
    @state()
    protected dialogMessage = '';

    private dialogRenderer!: DialogLitRenderer;
    private footerRenderer!: DialogLitRenderer;


    setRenderer(dialogRenderer: DialogLitRenderer, footerRenderer: DialogLitRenderer) {
        this.dialogRenderer = dialogRenderer;
        this.footerRenderer = footerRenderer;
    }

    render() {
        return html`
            <vaadin-dialog
                    header-title="${this.dialogTitle}"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => {
            this.dialogOpened = e.detail.value
        }}"
                    ${dialogRenderer(this.dialogRenderer, [this.dialogOpened, this.dialogTitle, this.dialogMessage])}
                    ${dialogFooterRenderer(this.footerRenderer, [])}
                    no-close-on-outside-click="${true}"
            ></vaadin-dialog>
        `;
    }

    protected close() {
        this.dialogOpened = false;
        this.dialogTitle = '';
    }

}



