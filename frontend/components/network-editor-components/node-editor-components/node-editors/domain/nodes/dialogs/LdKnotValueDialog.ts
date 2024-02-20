import {html} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {Value} from "Frontend/interfaces/Interfaces";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {DataRange} from "Frontend/enums/DataRange";
import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {event, saveValueEvent} from "Frontend/events/LdEvents";
import {DatePicker, DatePickerDate} from "@vaadin/date-picker";
import dateFnsFormat from "date-fns/format";
import {TimePicker, TimePickerTime} from "@vaadin/time-picker";
import dateFnsParse from "date-fns/parse";
import {isStrEmpty} from "Frontend/utils/common";
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('ld-knot-value-dialog')
export class LdKnotValueDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    @state()
    private value!: Value;

    @state()
    private busyIds: string[] = [];

    @state()
    private invalid: boolean = false;

    private type: string = DataRange.STRING;
    private length!: string;

    public openValueDialog = (type: DataRange, length: string, busyIds: string[], value?: Value): void => {
        this.value = {};
        this.value = {} as Value;
        this.type = type;
        this.length = length;
        this.busyIds = busyIds;
        if (value != null) {
            this.value = value as Value;
            this.toEdit = true;
            this.dialogTitle = 'Edit ' + InnerLayouts.knot_value;
        } else {
            this.toEdit = false;
            this.dialogTitle = 'Create ' + InnerLayouts.knot_value;
        }
        this.dialogOpened = true;
    }

    render(): TemplateResult<1> {
        this.dependencies = this.dependencies.concat([this.type, this.length, this.value]);
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 3}
    ];


    private renderTimePicker() {
        let timePicker = new TimePicker();
        timePicker.label = 'Choose time';
        timePicker.onchange = (e: Event) => {
            this.value.value = (<any>e).target!.value;
            this.saveDisabled = isStrEmpty(this.value.value);
        };
        timePicker.step = 900;
        timePicker.value = this.value.value ? this.value.value as string : StringUtils.EMPTY_STRING;
        // timePicker.i18n = {
        //     ...timePicker.i18n,
        //     formatTime: this.formatTimeIso8601,
        //     parseTime: this.parseTimeIso8601,
        // };
        return timePicker;
    }

    formatDateIso8601(dateParts: DatePickerDate) {
        const {year, month, day} = dateParts;
        const date = new Date(year, month, day);
        return dateFnsFormat(date, 'yyyy-MM-dd');
    };

    formatTimeIso8601(dateParts: TimePickerTime) {
        if (dateParts != null) {
            return [dateParts.hours, dateParts.minutes, dateParts.seconds, dateParts.milliseconds].join(":");
        } else {
            return '';
        }
    };

    parseTimeIso8601(inputValue: string) {
        const time = inputValue.split(":");
        return {
            hours: time[0],
            minutes: time[1],
            seconds: time[2] ? time[2] : "00",
            milliseconds: time[3] ? time[3] : "00"
        };
    };

    parseDateIso8601(inputValue: string) {
        const date = dateFnsParse(inputValue, 'yyyy-MM-dd', new Date());
        return {year: date.getFullYear(), month: date.getMonth(), day: date.getDate()};
    };

    private renderDatePicker() {
        let datePicker = new DatePicker();
        datePicker.label = 'Choose date';
        datePicker.onchange = (e: Event) => {
            this.value.value = event(e).target!.value
            this.saveDisabled = isStrEmpty(this.value.value);
            this.value.value = (<any>e).target!.value;
        };
        datePicker.i18n = {
            ...datePicker.i18n,
            formatDate: this.formatDateIso8601,
            parseDate: this.parseDateIso8601,
        };
        datePicker.value = this.value.value ? this.value.value as string : StringUtils.EMPTY_STRING;
        return datePicker;
    }

    renderValueField() {
        switch (this.type) {
            case DataRange.BIGINT:
                return html`
                    <vaadin-text-field
                            label="Value"
                            @value-changed="${(e: Event) => {
                                this.value.value = event(e).target!.value
                                this.saveDisabled = isStrEmpty(this.value.value);
                            }}"
                            value="${this.value.value}"
                            allowed-char-pattern="[0-9]"
                            maxlength="${this.length}"
                    >
                    </vaadin-text-field>`
            case DataRange.STRING:
                return html`
                    <vaadin-text-field
                            label="Value"
                            @value-changed="${(e: Event) => {
                                this.value.value = event(e).target!.value
                                this.saveDisabled = isStrEmpty(this.value.value);
                            }}"
                            value="${this.value.value}"
                            allowed-char-pattern="[ а-яА-Яa-zA-Z0-9]"
                            maxlength="${this.length}"
                    >
                    </vaadin-text-field>
                `
            case DataRange.NUMERIC:
                return html`
                    <vaadin-text-field
                            label="Value"
                            @value-changed="${(e: Event) => {
                                this.value.value = event(e).target!.value
                                this.saveDisabled = isStrEmpty(this.value.value);
                            }}"
                            value="${this.value.value}"
                            allowed-char-pattern="[0-9.]"
                            maxlength="${this.length + 1}"
                    >
                    </vaadin-text-field>
                `
            case DataRange.DATE:
                return this.renderDatePicker();
            case DataRange.TIME:
                return this.renderTimePicker();
            default:
                return html`
                    <vaadin-text-field
                            label="Value"
                            @value-changed="${(e: Event) => {
                                this.value.value = event(e).target!.value
                                this.saveDisabled = isStrEmpty(this.value.value);
                            }}"
                            value="${this.value.value}"
                            allowed-char-pattern="[a-zA-Z]"
                    >
                    </vaadin-text-field>
                `
        }
    }


    private renderDialog = () => {
        return html`
            <vaadin-vertical-layout style="align-items: stretch; width: 18rem; max-width: 100%;">
                <vaadin-text-field
                        allowed-char-pattern="[0-9]"
                        ?disabled="${this.isEdit()}"
                        error-message="This id is not unique!"
                        ?invalid="${!this.isEdit() && this.invalid}"
                        label="Id"
                        @value-changed="${(e: Event) => {
                            const val = event(e).target.value as string;
                            this.invalid = this.busyIds.indexOf(val) != -1;
                            this.value.id = event(e).target!.value;
                        }}"
                        value="${this.value.id}"
                ></vaadin-text-field>
                ${this.renderValueField()}
            </vaadin-vertical-layout>
        `
    }


    private renderFooter = () => {
        return html`
            <vaadin-button
                    ?disabled="${(!this.isEdit() && this.invalid) || this.saveDisabled}"
                    theme="primary"
                    @click="${() => {
                        this.dispatchEvent(saveValueEvent(this.value));
                        this.close();
                    }}"
            >Save
            </vaadin-button>
            <vaadin-button @click="${this.close}">Cancel
            </vaadin-button>
        `;
    }


}
