import { html } from 'lit';
import {customElement} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/vertical-layout';
import { applyTheme } from 'Frontend/generated/theme';
import {LdNotificationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdNotificationDialog";
import {TemplateResult} from "lit/development";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('notice-dialog')
export class NoticeDialog extends LdNotificationDialog {
    protected override createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }



    private renderDialog = () => {
        return html`
            <vaadin-vertical-layout
              theme="spacing"
              style="width: 300px; max-width: 100%; align-items: stretch;"
            >
                <p>${this.dialogMessage.split(StringUtils.NEWLINE)[0]}
                <br>${this.dialogMessage.split(StringUtils.NEWLINE)[1] != null ? 
                        this.dialogMessage.split(StringUtils.NEWLINE)[1] : StringUtils.EMPTY_STRING}</p>
            </vaadin-vertical-layout>
          `
    }

    private renderFooter = () => {
        return html`
            <vaadin-button @click="${this.close}" style="align-self: flex-end;">
                Close
            </vaadin-button>
        `
    }

    render(): TemplateResult<1> {
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

}
