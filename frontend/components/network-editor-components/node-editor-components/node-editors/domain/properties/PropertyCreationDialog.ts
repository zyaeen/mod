import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/combo-box/'
import '@vaadin/checkbox/'

import {dialogFooterRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {TextField, TextFieldValueChangedEvent} from "@vaadin/text-field";
import {CheckboxCheckedChangedEvent} from "@vaadin/checkbox";
import {PropertyType} from "Frontend/enums/PropertyType";
import {TextAreaValueChangedEvent} from "@vaadin/text-area";
import {Property} from "Frontend/interfaces/Interfaces";

@customElement('lean-di-create-property-dialog')
export class PropertyCreationDialog extends LitElement {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    @state()
    public dialogOpened = false;

    @state()
    private property!: Property;

    @state()
    private lengthDisabled!: boolean;
    @state()
    private scaleDisabled!: boolean;

    @state()
    private toEdit!: boolean;
    @state()
    private groups!: any[];

    public setGroups(groups: any[]) {
        this.groups = groups.map((group) => ({
            ...group,
            displayName: `${group.id} - ${group.name}`,
        }));
    }

    render() {
        return html`
            <vaadin-dialog
                    no-close-on-outside-click="${true}"
                    header-title="Property creation"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => (this.dialogOpened = e.detail.value)}"
                    ${dialogRenderer(this.renderDialog, [this.property, this.lengthDisabled,
                        this.scaleDisabled, this.toEdit, this.groups])}
                    ${dialogFooterRenderer(this.renderFooter, [])}
            ></vaadin-dialog>
        `;
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 3}
    ];


    private renderDialog = () => html`
        <vaadin-form-layout style="align-items: stretch; width: 20vw" .responsiveSteps="${this.responsiveSteps}">
            <vaadin-text-field
                    label="Property id"
                    value="${this.property ? this.property.id : null}"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.property!.id = e.detail.value;
                    }}"
                    .readonly="${this.toEdit}"
                    colspan="${this.toEdit ? '3' : '2'}"
                    allowed-char-pattern="[0-9]"
            >
            </vaadin-text-field>
            <vaadin-combo-box
                    label="Group id"
                    value="${this.property ? this.property.grId : null}"
                    .items="${this.groups}"
                    item-label-path="displayName"
                    item-value-path="id"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.property!.grId = e.detail.value;
                    }}"
                    colspan="1"
                    style="display: ${this.toEdit ? 'none' : 'flex'}"
                    allowed-char-pattern="[0-9]"
            >
            </vaadin-combo-box>
            <vaadin-text-field
                    allowed-char-pattern="[a-zA-Z0-9]"
                    label="name"
                    value="${this.property ? this.property.namep : null}"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.property!.namep = e.detail.value;
                    }}"
                    colspan="3"
            >
            </vaadin-text-field>
            <vaadin-combo-box
                    label="type"
                    .items="${Object.values(PropertyType)}"
                    value="${this.property ? this.property.typep : null}"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.property!.typep = e.detail.value as PropertyType;
                        this.scaleDisabled = this.property!.typep != PropertyType.NUMBER;
                        this.lengthDisabled = this.property!.typep != PropertyType.VARCHAR;
                        if (this.property!.typep != PropertyType.VARCHAR) {
                            this.property!.length = undefined;
                        }   
                        if (this.property!.typep != PropertyType.NUMBER) {
                            this.property!.scale = undefined;
                            this.property!.precision = undefined;
                        }
                    }}"
                    colspan="2"
            >
            </vaadin-combo-box>
            <vaadin-checkbox
                    label="required"
                    ?checked="${this.property ? this.property.required : null}"
                    @checked-changed="${(e: CheckboxCheckedChangedEvent) => {
                        this.property!.required = e.detail.value;
                    }}"
                    colspan="1"
            >
            </vaadin-checkbox>
            <vaadin-text-field
                    label="logical type"
                    value="${this.property ? this.property.logicalType : null}"
                    @value-changed="${(e: TextFieldValueChangedEvent) => {
                        this.property!.logicalType = e.detail.value;
                    }}"
                    colspan="3"
            >
            </vaadin-text-field>
            <vaadin-text-area
                    label="namedisp"
                    value="${this.property && this.property.namedisp && this.property.namedisp.length != 0 ? this.property.namedisp[0] : null}"
                    @value-changed="${(e: TextAreaValueChangedEvent) => {
                        this.property!.namedisp = [e.detail.value];
                    }}"
                    colspan="3"
            >
            </vaadin-text-area>
            <vaadin-form-layout colspan="3" .responsiveSteps="${[{minWidth: '10px', columns: 3}]}">
                <vaadin-text-field
                        label="Length"
                        value="${this.property ? this.property.length : null}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.property!.length = e.detail.value;
                        }}"
                        colspan="1"
                        ?disabled="${this.lengthDisabled}"
                        allowed-char-pattern="[0-9]"
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Scale"
                        value="${this.property ? this.property.scale : null}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.property!.scale = e.detail.value;
                        }}"
                        colspan="1"
                        ?disabled="${this.scaleDisabled}"
                        allowed-char-pattern="[0-9]"
                >
                </vaadin-text-field>
                <vaadin-text-field
                        label="Precision"
                        value="${this.property ? this.property.precision : null}"
                        @value-changed="${(e: TextFieldValueChangedEvent) => {
                            this.property!.precision = e.detail.value;
                        }}"
                        colspan="1"
                        ?disabled="${this.scaleDisabled}"
                        allowed-char-pattern="[0-9]"
                >
                </vaadin-text-field>
            </vaadin-form-layout>
        </vaadin-form-layout>

    `;

    public open(property?: any) {
        if (property != null) {
            this.toEdit = true;
            this.property = property;
            this.groups = this.groups
                .filter(group => group.property.filter((prop: any) => prop.id == property.id).length == 0)
                .filter(group => {
                    if (group.group != null && group.group.length != 0
                        && group.group.property != null && group.group.property.length != 0) {
                        for (let prop of group.group.property) {
                            if (prop.id == property.id) {
                                return false;
                            }
                        }
                    }
                    return true;
                });
        } else {
            this.toEdit = false;
            this.property = {} as Property;
        }
        this.dialogOpened = true;
    }


    private renderFooter = () => html`
        <vaadin-button theme="primary" @click="${() => {
            if (this.checkFields()) {
                this.dispatchEvent(new CustomEvent('create-property', {
                    detail: {
                        namep: this.property.namep,
                        typep: this.property.typep,
                        logicalType: this.property.logicalType,
                        id: this.property.id,
                        namedisp: this.property.namedisp,
                        required: this.property.required,
                        length: this.property.length,
                        scale: this.property.scale,
                        precision: this.property.precision,
                        grId: this.property.grId
                    }
                }));
                this.close();
            }
        }}">Save property
        </vaadin-button>
        <vaadin-button @click="${() => {
            this.close();
        }}">Cancel
        </vaadin-button>
    `;

    private checkFields() {
        if (!this.property!.id) {
            return false;
        }
        if (!this.toEdit && !this.property!.grId) {
            return false;
        }
        if (!this.property!.namep) {
            return false;
        }
        if (!this.property!.namedisp) {
            return false;
        }
        return this.property!.typep;
    }

    public close() {
        // this._id.readonly = false;
        this.dialogOpened = false;
        this.property = {}
    }


}
