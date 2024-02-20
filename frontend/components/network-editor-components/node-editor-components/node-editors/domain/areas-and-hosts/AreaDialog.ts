import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {Area, LeanDiNode} from "Frontend/interfaces/Interfaces";
import {BLACK, createColorPicker} from "Frontend/components/network-editor-components/common/ColorPicker";
import {generateUid} from "Frontend/utils/common";

@customElement('area-dialog')
export class AreaDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    @property()
    public area!: Area;


    public openArea (area?: Area | LeanDiNode) {
        this.area = {};
        this.area = {} as Area;
        if (area != null) {
            this.area = area as Area;
            this.toEdit = true;
            this.dialogTitle = 'Edit area';
        } else {
            this.toEdit = false;
            this.dialogTitle = 'Create area';
        }
        this.dialogOpened = true;
    }

    render(): TemplateResult<1> {
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

    handleColorPicking = (e: Event) => {
        this.area.color = (<any>e).target.value;
    }

    private renderDialog = () => html`
        <vaadin-vertical-layout style="width: 250px">
            <vaadin-text-field
                    label="Descriptor"
                    class="text-field-width"
                    name="descriptor"
                    value="${this.area.descriptor}"
                    style="width: 100%"
                    @value-changed="${(e: Event) => {
                        this.area.descriptor=(<any>e).detail.value;
                    }}"
            >
            </vaadin-text-field>
            <vaadin-text-area
                    label="Description"
                    class="text-field-width"
                    name="description"
                    value="${this.area.description}"
                    style="width: 100%"
                    @value-changed="${(e: Event) => {
                        this.area.description=(<any>e).detail.value;
                    }}"
            >
            </vaadin-text-area>
            <p></p>
            <vaadin-horizontal-layout style="width: 100%; align-items: baseline">
                <p>Area color</p>
                ${createColorPicker(this.area.color ? this.area.color : BLACK, this.handleColorPicking)}
            </vaadin-horizontal-layout>
        </vaadin-vertical-layout>
    `;


    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            if (this.area.descriptor != null && this.area.color != null
            ) {
                // if (this.area.uid == null) {
                //     this.area.uid = generateUid();
                // }
                this.dispatchEvent(new CustomEvent('save-area',
                        {
                            detail: {
                                area: this.area
                            }
                        }));
                this.close();
            }
        }}"
        >Save
        </vaadin-button>
        <vaadin-button @click="${this.close}">Cancel
        </vaadin-button>
    `;


}
