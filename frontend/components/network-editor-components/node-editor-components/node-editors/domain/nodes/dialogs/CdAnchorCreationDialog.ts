import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {ComboBox} from "@vaadin/combo-box";
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('cd-anchor-creation-dialog')
export class CdAnchorCreationDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }


    @property()
    private domains: {[index: string]: string[]} = {};

    setDomains(domains: {[index: string]: string[]}) {
        this.domains = domains;
    }

    private key: string = "";
    private values: string[] = [];
    private domain = "";
    private comboBox!: ComboBox;

    createComboBox(){
        let comboBox = new ComboBox();
        comboBox.label = "Chose anchor to connect";
        comboBox.items = this.values;
        comboBox.style.width = '100%';
        return comboBox;
    }

    render(): TemplateResult<1> {
        this.comboBox = this.createComboBox();
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

    private renderDialog = () => html`
        <vaadin-vertical-layout style="width: 250px;">
            <vaadin-combo-box
                    label="Choose Domain of anchor to connect"
                    .items="${Object.keys(this.domains)}"
                    @value-changed="${(e: Event) => {
                        this.key=(<any>e).detail.value;
                        this.values=this.domains[this.key];
                        this.comboBox.items = this.values;
                        this.domain=this.key;
                    }}"
                    style="width: 100%"
            >
            </vaadin-combo-box>
            ${this.comboBox}
        </vaadin-vertical-layout>
    `;


    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            if (this.domain != null && this.domain != StringUtils.EMPTY_STRING &&
                    this.comboBox.value != null && this.comboBox.value != StringUtils.EMPTY_STRING
            ) {
                this.dispatchEvent(new CustomEvent('create-cd-anchor',
                    {
                        detail: {
                            domain: this.domain,
                            anchor: this.comboBox.value
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


}
