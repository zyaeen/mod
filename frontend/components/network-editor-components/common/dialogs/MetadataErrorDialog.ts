
import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {dialogFooterRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('dialog-error-metadata')
export class MetadataErrorDialog extends LitElement {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    @property()
    public metadataDialogOpened = false;
    @property()
    public metadataMessage = StringUtils.EMPTY_STRING;
    render() {
        return html`
            <vaadin-dialog
                header-title="Error of node's metadata!"
                .opened="${this.metadataDialogOpened}"
                no-close-on-outside-click=${true}
                @opened-changed="${(e: DialogOpenedChangedEvent) => {
                    e.stopImmediatePropagation(); 
                    this.metadataDialogOpened = e.detail.value; 
                    this.metadataMessage = !e.detail.value ? StringUtils.EMPTY_STRING : this.metadataMessage;
                }}"
                ${dialogRenderer(this.renderDialog, [])}
                ${dialogFooterRenderer(this.renderFooter, [])};
            </vaadin-dialog>`
    }
    private renderDialog = () => html`
        <vaadin-vertical-layout
                theme="spacing"
                style="width: 300px; max-width: 100%; align-items: stretch;"
        >
            <p>${this.metadataMessage.split(StringUtils.NEWLINE)[0]}<br>${this.metadataMessage.split(StringUtils.NEWLINE)[1] != null ? this.metadataMessage.split(StringUtils.NEWLINE)[1] : StringUtils.EMPTY_STRING}</p>
        </vaadin-vertical-layout>
    `;

    private renderFooter = () => html`
        <vaadin-button 
                @click="${(event: Event)=>{this.close()}}" 
                style="align-self: flex-end;">
            Close
        </vaadin-button>
    `;



    private close() {
        this.metadataDialogOpened = false;
        this.metadataMessage = StringUtils.EMPTY_STRING;
    }


}
