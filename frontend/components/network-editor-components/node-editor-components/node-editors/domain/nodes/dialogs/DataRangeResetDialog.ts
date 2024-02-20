
import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdNotificationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdNotificationDialog";
import {TemplateResult} from "lit/development";

@customElement('data-range-reset-dialog')
export class DataRangeResetDialog extends LdNotificationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    render(): TemplateResult<1> {
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

    private renderDialog = () => html`
        <vaadin-vertical-layout>
            <p>${this.dialogMessage}</p>
        </vaadin-vertical-layout>
    `;

    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            this.dispatchEvent(new CustomEvent('agree-reset-data-range'));
            this.close();
        }
    }"
        >Yes
        </vaadin-button>
        <vaadin-button theme="primary contrast" @click="${() => {
            this.dispatchEvent(new CustomEvent('disagree-reset-data-range'));
            this.close();
        }
        }"
        >No
        </vaadin-button>
    `;

}
