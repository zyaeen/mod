import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";

@customElement('domain-creation-dialog')
export class DomainCreationDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    private renderDialog = () => {
        return html`
            <vaadin-vertical-layout style="width: 300px">
                <vaadin-text-field
                        required
                        label="Name of Domain"
                        id="name"
                        value="${this.node.name}"
                        allowed-char-pattern="[a-zA-Z0-9 ]"
                        style="width: 100%"
                        @value-changed="${(e: Event) => {
                            this.node.name = (<any>e).target.value;
                        }}"
                ></vaadin-text-field>
                <vaadin-text-field
                        required
                        label="Short name of Domain"
                        id="shortName"
                        value="${this.node.shortName}"
                        allowed-char-pattern="[a-zA-Z0-9]"
                        style="width: 100%"
                        @value-changed="${(e: Event) => this.node.shortName = (<any>e).target.value}"
                ></vaadin-text-field>
                <vaadin-text-field
                        required
                        label="Author of Domain"
                        id="author"
                        value="${this.node.author}"
                        allowed-char-pattern="[a-zA-Zа-яА-Я0-9 -,;.:]"
                        style="width: 100%"
                        @value-changed="${(e: Event) => this.node.author = (<any>e).target.value}"
                ></vaadin-text-field>
                <vaadin-text-area
                        required
                        label="Description of Domain"
                        id="note"
                        value="${this.node.note}"
                        style="width: 100%"
                        @value-changed="${(e: Event) => this.node.note = (<any>e).target.value}"
                ></vaadin-text-area>
            </vaadin-vertical-layout>
        `;
    }

    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            if (this.checkFields('name', 'shortName', 'note', 'author')) {
                this.dispatchEvent(new CustomEvent('create-domain',
                        {
                            detail: {
                                name: this.node.name,
                                shortName: this.node.shortName,
                                note: this.node.note,
                                author: this.node.author
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
