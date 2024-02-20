import {html} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {extendedColumn} from "Frontend/interfaces/Interfaces";
import {isStrNotEmpty} from "Frontend/utils/common";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {DataRange} from "Frontend/enums/DataRange";
import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {saveColumnEvent} from "Frontend/events/LdEvents";
import {ComboBoxValueChangedEvent} from "@vaadin/combo-box";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('ld-column-dialog')
export class LdColumnDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    @state()
    private column!: extendedColumn;
    @state()
    private knots: string[] = [];

    @state()
    protected isNumeric!: boolean;
    @state()
    protected isLongable!: boolean;
    @state()
    protected isColumnValid!: boolean;

    protected setNumericOrNullable() {
        if (this.column.dataRange == DataRange.NUMERIC) {
            this.isNumeric = true;
            this.column!.length = undefined;
            this.column!.precision = '1';
            this.column!.scale = '0';
        } else {''
            this.column!.length = undefined;
            this.column!.precision = undefined;
            this.column!.scale = undefined;
            this.isNumeric = false;
        }
        if (this.column.dataRange == DataRange.STRING
            || this.column.dataRange == DataRange.BIGINT) {
            this.isLongable = true;
            this.column!.length = '64';
            this.column!.precision = undefined;
            this.column!.scale = undefined;
        } else {
            this.isLongable = false;
        }
        this.validateFields();
    }

    setKnots(knots: string[]) {
        this.knots = knots;
    }

    public openColumn(column?: extendedColumn) {
        this.column = {};
        this.column = {} as extendedColumn;
        if (column != null) {
            this.column = column as extendedColumn;
            this.toEdit = true;
            this.dialogTitle = 'Edit ' + InnerLayouts.extended_column;
        } else {
            this.toEdit = false;
            this.dialogTitle = 'Create ' + InnerLayouts.extended_column;
        }
        this.dialogOpened = true;
    }

    render(): TemplateResult<1> {
        this.dependencies = this.dependencies.concat([this.column, this.column?.knotRange,
            this.column?.dataRange, this.column?.length, this.column?.precision,
            this.column?.scale, this.isColumnValid
        ]);
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 3}
    ];


    private renderDialog = () => {
        return html`
            <vaadin-form-layout style="align-items: stretch; width: 18rem; max-width: 100%;"
                                .responsiveSteps="${this.responsiveSteps}">
                <vaadin-text-field label="UID" readonly
                                   value="${this.column.uid}" colspan="3"></vaadin-text-field>
                <vaadin-text-field label="Column name"
                                   @input="${(e: Event) => {
                                       this.column!.columnName = (<any>e).target!.value;
                                       this.validateFields();
                                   }}"
                                   allowed-char-pattern="[а-яА-Яa-zA-Z0-9]"
                                   value="${this.column.columnName}" colspan="2"></vaadin-text-field>
                <vaadin-checkbox label="Nullable"
                                 @checked-changed="${(e: Event) => {
                                     this.column!.nullable = (<any>e).target!.checked;
                                 }}"
                                 .checked="${this.column.nullable == null ? false : this.column.nullable}"
                                 colspan="1"
                ></vaadin-checkbox>
                <vaadin-form-layout colspan="3" style="align-items: stretch; width: 18rem"
                                    .responsiveSteps="${this.responsiveSteps}">


                    <vaadin-combo-box
                            label="Data range"
                            .colspan="1"
                            class="text-field-width"
                            .value="${this.column!.dataRange}"
                            .items="${[DataRange.BIGINT, DataRange.STRING, DataRange.NUMERIC,
                                DataRange.DATE, DataRange.TIME
                            ]}"
                            @value-changed="${(e: ComboBoxValueChangedEvent) => {
                                if (isStrNotEmpty(e.detail.value)) {
                                    this.column!.knotRange = null;
                                    this.column!.dataRange = e.detail.value;
                                } else {
                                    this.column!.dataRange = null;
                                }
                                this.setNumericOrNullable();
                                this.requestUpdate();
                            }}"
                    >
                    </vaadin-combo-box>
                    <vaadin-combo-box
                            label="Knot range"
                            .colspan="1"
                            class="text-field-width"
                            .value="${this.column!.knotRange}"
                            .items="${this.column!.knotRange != null && this.column!.knotRange != StringUtils.EMPTY_STRING && this.knots.findIndex(node => node == this.column.knotRange) == -1 ?
                                    this.knots.concat([this.column.knotRange]) :
                                    this.knots
                            }"
                            @value-changed="${(e: ComboBoxValueChangedEvent) => {
                                if (isStrNotEmpty(e.detail.value)) {
                                    this.column!.knotRange = e.detail.value;
                                    this.column!.dataRange = null;
                                } else {
                                    this.column!.knotRange = null;
                                }
                                this.setNumericOrNullable();
                                this.requestUpdate();
                            }}"
                    >
                    </vaadin-combo-box>
                    <vaadin-checkbox label="Deprecated"
                                     @checked-changed="${(e: Event) => {
                                         this.column!.deprecated = (<any>e).target!.checked;
                                         e.stopImmediatePropagation();
                                     }}"
                                     ?checked="${this.column.deprecated == null ? false : this.column.deprecated}"
                                     colspan="1"
                    ></vaadin-checkbox>
                </vaadin-form-layout>
                <vaadin-form-layout colspan="3" style="align-items: stretch; width: 18rem"
                                    .responsiveSteps="${this.responsiveSteps}">
                    <vaadin-text-field
                            label="Length"
                            .colspan="1"
                            allowed-char-pattern="[0-9]"
                            ?disabled="${!this.isLongable}"
                            value="${this.column.length}"
                            @value-changed="${(e: Event) => {
                                this.column.length = (<any>e).detail.value;
                            }}"
                    >
                    </vaadin-text-field>
                    <vaadin-text-field
                            label="Precision"
                            .colspan="1"
                            allowed-char-pattern="[0-9]"
                            ?disabled="${!this.isNumeric}"
                            value="${this.column.precision}"
                            @value-changed="${(e: Event) => {
                                this.column.precision = (<any>e).detail.value;
                            }}"
                            allowed-char-pattern="[0-9]"
                    >
                    </vaadin-text-field>
                    <vaadin-text-field
                            label="Scale"
                            .colspan="1"
                            allowed-char-pattern="[0-9]"
                            ?disabled="${!this.isNumeric}"
                            value="${this.column.scale}"
                            @value-changed="${(e: Event) => {
                                this.column.scale = (<any>e).detail.value;
                            }}"
                            allowed-char-pattern="[0-9]"
                    >
                    </vaadin-text-field>
                </vaadin-form-layout>
                <vaadin-text-area label="Description"
                                  @input="${(e: Event) => this.column!.description = (<any>e).target!.value}"
                                  value="${this.column.description}" colspan="3"></vaadin-text-area>
            </vaadin-form-layout>
        `;
    }

    private validateFields = () => {
        this.isColumnValid = isStrNotEmpty(this.column.columnName) &&
            (isStrNotEmpty(this.column.dataRange) || isStrNotEmpty(this.column.knotRange));
    }

    private renderFooter = () => html`
        <vaadin-button
                ?disabled="${!this.isColumnValid}"
                theme="primary"
                @click="${() => {
                    this.dispatchEvent(saveColumnEvent(this.column));
                    this.close();
                }}"
        >Save
        </vaadin-button>
        <vaadin-button @click="${this.close}">Cancel
        </vaadin-button>
    `;


}
