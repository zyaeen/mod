import {html} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {AnchorRole, Area, KnotRole, LeanDiEdge, LeanDiNode} from "Frontend/interfaces/Interfaces";
import {BLACK, createColorPicker} from "Frontend/components/network-editor-components/common/ColorPicker";
import {generateUid, isStrEmpty, isStrNotEmpty} from "Frontend/utils/common";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {event} from "Frontend/events/LdEvents";
import {LdEventTarget} from "Frontend/events/LdEventTarget";

@customElement('role-editor-dialog')
export class RoleEditor extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    @property()
    public akRole!: KnotRole | AnchorRole;

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 2}
    ];

    public openRole(role?: KnotRole | AnchorRole) {
        this.akRole = {};
        this.akRole = {} as KnotRole | AnchorRole;
        if (role != null) {
            this.akRole = role as Area;
            this.toEdit = true;
            this.dialogTitle = 'Edit edge (role) ' + this.akRole.type + "_" + this.akRole.role;
        } else {
            this.toEdit = false;
            this.dialogTitle = 'Create area (role)';
        }
        this.dialogOpened = true;
    }

    render(): TemplateResult<1> {
        this.dependencies = [this.akRole];
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

    handleColorPicking = (e: Event) => {
        this.akRole.color = (<any>e).target.value;
    }

    private renderDialog = () => html`
        <vaadin-form-layout
                style="align-items: stretch;
                width: 18rem; 
                max-width: 100%;"
                .responsiveSteps="${this.responsiveSteps}">
            <vaadin-text-field
                    label="Role"
                    @value-changed="${(e: Event) => {
                        const value = event(e).detail.value;
                        if (isStrEmpty(value)){
                            this.saveDisabled = true;
                        } else {
                            this.akRole.role = value;
                            this.saveDisabled = false;
                        }
                    }}"
                    .value="${this.akRole.role}"
                    colspan="2"
                    allowed-char-pattern="[a-zA-Z0-9]"
            ></vaadin-text-field>
            <p colspan="2"></p>
            <vaadin-checkbox
                    colspan="1"
                    label="Many"
                    ?checked="${this.akRole.identifier}"
                    @checked-changed="${(e: Event) => {
                        this.akRole.identifier = event(e).detail.value;
                    }}"
            ></vaadin-checkbox>
            <br>
            <vaadin-text-area
                    label="Comment"
                    style="min-height: 200px"
                    .value="${this.akRole.description}"
                    @value-changed="${(e: Event) => {
                        this.akRole.description = event(e).detail.value;
                    }}"
                    colspan="2"
            ></vaadin-text-area>
            <br>
            <div colspn="1"></div>
            <div colspan="1" align="right">
                <label for="picker">Edge color: </label>
                ${createColorPicker(this.akRole.color ? this.akRole.color : BLACK, this.handleColorPicking)}
            </div>
        </vaadin-form-layout>

    `;


    private renderFooter = () => html`
        <vaadin-button
                theme="primary"
                ?disabled="${this.saveDisabled}"
                @click="${() => {
                    if (isStrNotEmpty(this.akRole.role)) {
                        // if (this.area.uid == null) {
                        //     this.area.uid = generateUid();
                        // }
                        this.dispatchEvent(new CustomEvent(LdEventTarget.EDIT_EDGE,
                                {
                                    detail: this.akRole
                                }));
                        this.close();
                    }
                }}"
        >Save
        </vaadin-button>
        <vaadin-button @click="${() => {
            this.dispatchEvent(new Event('deselect-edge'))
            this.close();
        }}">Cancel
        </vaadin-button>
    `;


}
