import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {dialogFooterRenderer, dialogHeaderRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {ComboBoxSelectedItemChangedEvent} from "@vaadin/combo-box";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {GridEventContext} from "@vaadin/grid";
import {Anchor, Group, Property} from "Frontend/interfaces/Interfaces";
import '@vaadin/grid/vaadin-grid-selection-column'
import {mapNodeToAnchor} from "Frontend/interfaces/Mappers";
import '@vaadin/grid/vaadin-grid-filter-column'


@customElement('dialog-anchor-requisites')
export class AnchorPropertiesDialog extends LitElement {

    @state()
    private groupComboBoxDisabled: boolean = true;

    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    @state()
    private propertiesGridItems: Property[] = [];

    @state()
    private groupsGridItems: Group[] = [];


    @state()
    private groupComboBoxSelectedItem?: Group;
    @state()
    private groupComboBoxItems: Group[] = [];

    @state()
    private anchor!: Anchor;

    @state()
    private dialogOpened = false;

    public open(anchor: Anchor) {
        this.setAnchor(anchor);
        this.dialogOpened = true;
    }

    public setAnchor(anchor: Anchor) {
        this.anchor = anchor;
        if (anchor != null && anchor._group != null && anchor._group.id != null) {
            const item = this.groups.filter((gr: Group) => gr.id == anchor._group!.id) as Group[];
            if (item.length == 1) {
                this.groupComboBoxSelectedItem = {
                    ...item[0],
                    displayName: item[0].id + " - " + item[0].name
                } as Group;
            }
        } else {
            this.groupComboBoxSelectedItem = undefined;
        }
    }

    @state()
    public groups: any[] = [];
    @state()
    public properties: any[] = [];

    private tooltipGenerator = (context: GridEventContext<any>): string => {
        let text = '';

        const {column, item} = context;
        if (column && item) {
            switch (column.path) {
                case 'namep':
                    text = `Property name: ` + item.namep;
                    break;
                case 'logicalType':
                    text = 'Logical type: ' + item.logicalType;
                    break;
                case 'namedisp':
                    text = 'Display name: ' + item.namedisp;
                    break;
                case 'id':
                    text = 'Property id: ' + item.id;
                    break;
                default:
                    break;
            }
        }

        return text;
    };


    public setGroups(groups: any[]) {
        this.groups = groups;
        this.groupComboBoxItems = groups.map((group) => ({
            ...group,
            displayName: `${group.id} - ${group.name}`,
        }));
    }

    public setProperties(properties: any[]) {
        this.properties = properties;
        if (this.groupComboBoxSelectedItem != null) {
            this.refreshData(this.groups.filter((group: Group) => group.id == this.groupComboBoxSelectedItem!.id)[0]);
        }
    }


    refreshData(element: any) {
        let properties = element ? element.property.map((column: any) => {
            return {
                id: column.id,
                namep: column.namep,
                namedisp: column.namedisp[0],
                typep: column.typep,
                logicalType: column.logicalType,
                grId: element.id,
                name: element.name,
                required: column.required,
                requiredString: column.required == true ? 'TRUE' : 'FALSE'
            }
        }) : [];

        const recursionProperty = (el: any) => {
            let group = el.group;
            if (group != null && group.length != 0) {
                for (let grEl of group) {
                    for (let prEl of grEl.property) {
                        properties.push({
                            id: prEl.id,
                            namep: prEl.namep,
                            namedisp: prEl.namedisp[0],
                            typep: prEl.typep,
                            logicalType: prEl.logicalType,
                            grId: grEl.id,
                            name: grEl.name,
                            required: prEl.required,
                            requiredString: prEl.required == true ? 'TRUE' : 'FALSE'
                        })
                    }
                    recursionProperty(grEl);
                }
            }
        }

        if (element) {
            recursionProperty(element);
        }

        this.propertiesGridItems = properties;

        let groups: any[] = []

        this.groupsGridItems = element ? element.group : [];

        if (element) {
            let group = element.group;
            if (group != null && group.length != 0) {
                for (let grEl of group) {
                    groups.push(grEl.id)
                }
            }
        }

        const propsId = this.propertiesGridItems!.map((prop: any) => prop.id);

        const groupsToRemove = new Set();

        this.groups.forEach(
            group => {
                for (let groupProperty of group.property) {
                    for (let propId of propsId) {
                        if (groupProperty.id == propId) {
                            groupsToRemove.add(group.id);
                        }
                    }
                }
            }
        );


    }


    render() {
        return html`
            <vaadin-dialog
                    no-close-on-outside-click="${true}"
                    header-title="Properties of : ${this.anchor?.mnemonic}_${this.anchor?.descriptor}  ―  ${this.anchor?.description}"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => (this.dialogOpened = e.detail.value)}"
                    ${dialogRenderer(this.renderDialog, [
                        this.properties, this.propertiesGridItems,
                        this.groups, this.groupsGridItems,
                        this.groupComboBoxSelectedItem, this.groupComboBoxItems, this.groupComboBoxDisabled, this.anchor, this.anchor?._group?.id
                    ])}
                    ${dialogFooterRenderer(this.renderFooter, [])}
                    ${dialogHeaderRenderer(
                            () => html`
                                <vaadin-button theme="tertiary" @click="${this.close}">
                                    <vaadin-icon icon="lumo:cross"></vaadin-icon>
                                </vaadin-button>
                            `,
                            []
                    )}
            ></vaadin-dialog>
        `;
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 8}
    ];



    private renderDialog = () => html`

        <vaadin-vertical-layout style="align-items: stretch; width: 95vw; height: 80vh;">
            <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}" style="width: 100%">
                <vaadin-combo-box
                        .items="${this.groupComboBoxItems}"
                        class="text-field-width"
                        style="width: 200px"
                        item-label-path="displayName"
                        colspan="2"
                        @selected-item-changed="${(e: ComboBoxSelectedItemChangedEvent<Group>) => {
                            const element = (<any>e).detail.value;
                            this.groupComboBoxSelectedItem = element ? element : null;
                            this.refreshData(element);
                        }}"
                        .selectedItem="${this.groupComboBoxSelectedItem}"
                        label="Main group of properties"
                >
                </vaadin-combo-box>
                <vaadin-horizontal-layout colspan="1">
                    <vaadin-button
                            @click="${() => {
                                this.anchor._group = this.groupComboBoxSelectedItem != null ? {
                                    id: this.groupComboBoxSelectedItem.id
                                } : undefined;
                                this.dispatchEvent(new CustomEvent('pick-properties-to-anchor', {
                                    detail: mapNodeToAnchor(this.anchor)
                                }));
                            }}">Change anchor's properties group
                    </vaadin-button>
                </vaadin-horizontal-layout>
                <label style="font-weight: bold" colspan="1">Actual properties group ID: ${this.anchor != null && this.anchor._group != null && this.anchor._group.id != null ? this.anchor._group.id : "none properties"}</label>
                <hr colspan="8"/>
            </vaadin-form-layout>
            <vaadin-form-layout
                    .responsiveSteps="${this.responsiveSteps}" style="height: 100%">
                <vaadin-vertical-layout style="max-height: 100%; height: 70vh" colspan="8">
                    <vaadin-horizontal-layout style="width: 100%; justify-content: space-between">
                        <p>Properties inside chosen group</p>
                    </vaadin-horizontal-layout>
                    <vaadin-grid
                            aria-label="properties-grid"
                            style="height: 72vh"
                            colspan="3"
                            .items="${this.propertiesGridItems}"
                    >
                        <vaadin-grid-filter-column
                                width="30px"
                                path="grId"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                path="name"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                width="35px"
                                path="id"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                path="namep"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                path="namedisp"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                path="typep"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                path="logicalType"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                path="requiredString"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-tooltip
                                slot="tooltip"
                                .generator="${this.tooltipGenerator}"
                                position="start-top"
                        ></vaadin-tooltip>
                    </vaadin-grid>
                    <p></p>
                    <vaadin-horizontal-layout style="width: 100%; justify-content: space-between">
                        <p>First level subgroups inside chosen group</p>
                    </vaadin-horizontal-layout>
                    <vaadin-grid
                            aria-label="groups-grid"
                            colspan="3"
                            .items="${this.groupsGridItems}"
                    >
                        <vaadin-grid-column
                                path="id"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                path="name"
                        >
                        </vaadin-grid-column>
                    </vaadin-grid>
                </vaadin-vertical-layout>
            </vaadin-form-layout>
        </vaadin-vertical-layout>

    `;

    private renderFooter = () => html`
        <vaadin-button @click="${() => {
            this.close();
        }}">Cancel
        </vaadin-button>
    `;

    public close() {
        this.groupComboBoxSelectedItem = undefined;
        this.groupComboBoxDisabled = true;
        this.dialogOpened = false;
    }

    public isOpen() {
        return this.dialogOpened;
    }

}
