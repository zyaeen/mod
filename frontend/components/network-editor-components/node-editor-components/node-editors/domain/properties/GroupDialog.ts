import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid/vaadin-grid-selection-column';
import '@vaadin/multi-select-combo-box';
import '@vaadin/checkbox/'
import '@vaadin/grid/vaadin-grid-filter-column'

import {dialogFooterRenderer, dialogHeaderRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {ComboBoxSelectedItemChangedEvent} from "@vaadin/combo-box";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {Grid, GridColumn, GridEventContext, GridSelectedItemsChangedEvent} from "@vaadin/grid";
import {MultiSelectComboBoxSelectedItemsChangedEvent} from "@vaadin/multi-select-combo-box";
import {
    GroupCreationDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/properties/GroupCreationDialog";
import {Tooltip} from "@vaadin/tooltip";
import {Group, Property} from "Frontend/interfaces/Interfaces";
import {isStrNotEmpty} from "Frontend/utils/common";
import {StringUtils} from "Frontend/enums/DefaultValues";


@customElement('dialog-group')
export class GroupDialog extends LitElement {

    private addGroupsGrid!: Grid;
    private addPropertiesGrid!: Grid;

    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    @state()
    private propertiesGridItems: Property[] = [];
    @state()
    private propertiesGridSelectedItems: Property[] = [];
    @state()
    private removePropertyButtonDisabled: boolean = true;


    @state()
    private groupsGridItems: Group[] = [];
    @state()
    private groupsGridSelectedItems: Group[] = [];
    @state()
    private removeGroupButtonDisabled: boolean = true;
    @state()
    private removeSubGroupButtonDisabled: boolean = true;

    // @state()
    private addGroupsGridItems: Group[] = [];

    // @state()
    private addPropertiesGridItems: Property[] = [];

    @state()
    private groupComboBoxSelectedItem?: Group;
    @state()
    private groupComboBoxItems: Group[] = [];


    @state()
    private addGroupComboBoxItems!: Group[];


    @state()
    private addPropertyComboBoxItems!: Property[];


    @state()
    private addPropertyButtonDisabled: boolean = true;
    @state()
    private addGroupButtonDisabled: boolean = true;
    @state()
    private deleteGroupButtonDisabled: boolean = true;

    @state()
    private dialogOpened = false;

    public open() {
        this.dialogOpened = true;
    }


    @state()
    private groupCreationDialog = new GroupCreationDialog();

    @state()
    public groups: any[] = [];
    @state()
    public properties: any[] = [];


    private tooltipGenerator = (context: GridEventContext<any>): string => {
        let text = '';

        const {column, item} = context;
        if (column && item) {
            switch (column.path) {
                case 'name':
                    text = `Group name: ` + item.name;
                    break;
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
            displayName: `${group.id} - ${group.name} ${group.description ? "- " + group.description : StringUtils.EMPTY_STRING}`,
        }));
    }

    public setProperties(properties: any[]) {
        this.properties = properties.map(prop => ({
            ...prop,
            requiredString: prop.required == true ? 'TRUE' : 'FALSE'
        }));
        this.addPropertyComboBoxItems = this.properties.map((property) => ({
            ...property,
            displayName: `${property.id} - ${property.namep} - ${property.namedisp[0]}`,
        })).filter(
            prop => properties.findIndex((pr: any) => pr.id == prop.id) == -1
        );
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

        this.deleteGroupButtonDisabled = element == null;

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

        this.addPropertiesGridItems = [];

        this.addPropertyComboBoxItems = element ? this.properties.map((property) => ({
            ...property,
            displayName: `${property.id} - ${property.namep} - ${property.namedisp[0]}`,
        })).filter(
            prop => this.propertiesGridItems!.findIndex((pr: any) => pr.id == prop.id) == -1
        ) : []

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


        this.addGroupComboBoxItems = element ? this.groups.map((group) => ({
            ...group,
            displayName: `${group.id} - ${group.name} ${group.description ? "- " + group.description : StringUtils.EMPTY_STRING}`,
        })).filter(
            prop => prop.id != element.id && groups.findIndex(el => el == prop.id) == -1
        ).filter(
            group => !groupsToRemove.has(group.id)
        ).filter(
            group => group.group == null || group.group.length == 0
        ) : [];
    }


    render() {

        this.addGroupsGrid = new Grid();
        this.addGroupsGrid.setAttribute('colspan', '2')

        let idPath = new GridColumn();
        idPath.path = 'id';
        this.addGroupsGrid.appendChild(idPath);

        let namePath = new GridColumn();
        namePath.path = 'name';
        this.addGroupsGrid.appendChild(namePath);

        let descriptionPath = new GridColumn();
        descriptionPath.path = 'description';
        this.addGroupsGrid.appendChild(descriptionPath);

        this.addPropertiesGrid = new Grid();
        this.addPropertiesGrid.setAttribute('colspan', '3')
        const tooltip = new Tooltip();
        tooltip.slot = 'tooltip';
        tooltip.generator = this.tooltipGenerator;
        this.addPropertiesGrid.appendChild(tooltip)
        let propertiesIdPath = new GridColumn();
        propertiesIdPath.path = 'id';
        this.addPropertiesGrid.appendChild(propertiesIdPath);

        let namepPath = new GridColumn();
        namepPath.path = 'namep';
        this.addPropertiesGrid.appendChild(namepPath);

        let namedispPath = new GridColumn();
        namedispPath.path = 'namedisp';
        this.addPropertiesGrid.appendChild(namedispPath);

        let typepPath = new GridColumn();
        typepPath.path = 'typep';
        this.addPropertiesGrid.appendChild(typepPath);

        let logicalTypePath = new GridColumn();
        logicalTypePath.path = 'logicalType';
        this.addPropertiesGrid.appendChild(logicalTypePath);

        let requiredPath = new GridColumn();
        requiredPath.path = 'requiredString';
        this.addPropertiesGrid.appendChild(requiredPath);

        this.groupCreationDialog.addEventListener('create-group', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.dispatchEvent(new CustomEvent('create-group', {detail: event.detail}));
        });
        // this.renderedColumns = this.index.map((column:string) => {return {column: column.split(" ")[0], order: column.split(" ")[1]}});
        return html`
            <vaadin-dialog
                    no-close-on-outside-click="${true}"
                    header-title="Group description: ${this.groupComboBoxSelectedItem && isStrNotEmpty(this.groupComboBoxSelectedItem.description) ? this.groupComboBoxSelectedItem.description : "no description"}"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => (this.dialogOpened = e.detail.value)}"
                    ${dialogRenderer(this.renderDialog, [
                        this.properties, this.propertiesGridItems, this.propertiesGridSelectedItems,
                        this.groups, this.groupsGridItems, this.groupsGridSelectedItems,
                        this.removePropertyButtonDisabled, this.removeGroupButtonDisabled, this.removeSubGroupButtonDisabled,
                        this.addGroupsGridItems,
                        this.addPropertiesGridItems,
                        this.groupComboBoxSelectedItem, this.groupComboBoxItems,
                        this.addGroupComboBoxItems,
                        this.addPropertyComboBoxItems,
                        this.addPropertyButtonDisabled, this.addGroupButtonDisabled
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
            ${this.groupCreationDialog}
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
                        colspan="1"
                        @selected-item-changed="${(e: ComboBoxSelectedItemChangedEvent<Group>) => {
                            this.removeGroupButtonDisabled = true;
                            this.removePropertyButtonDisabled = true;
                            const element = (<any>e).detail.value;
                            this.groupComboBoxSelectedItem = element ? element : null;
                            this.refreshData(element);
                        }}"
                        .selectedItem="${this.groupComboBoxSelectedItem}"
                        label="Select group"
                >
                </vaadin-combo-box>
                <vaadin-horizontal-layout colspan="3">
                    <vaadin-button @click="${() => {
                        this.groupCreationDialog.open();
                    }}">Create group
                    </vaadin-button>
                    <vaadin-button
                            ?disabled="${this.deleteGroupButtonDisabled}"
                            @click="${() => {
                                this.groupCreationDialog = new GroupCreationDialog();
                                this.groupCreationDialog.open(this.groupComboBoxSelectedItem);
                            }}">Edit current group
                    </vaadin-button>
                    <vaadin-button
                            ?disabled="${this.deleteGroupButtonDisabled}"
                            @click="${() => {
                                this.dispatchEvent(new CustomEvent('remove-group',
                                        {detail: this.groupComboBoxSelectedItem?.id}));
                                // this.groupComboBoxItems = this.groupComboBoxItems?.filter(group => group.id != this.groupComboBoxSelectedItem?.id);
                                this.groupComboBoxSelectedItem = undefined;
                            }}"
                    >Delete current group
                    </vaadin-button>
                </vaadin-horizontal-layout>
                <hr colspan="8"/>
            </vaadin-form-layout>
            <vaadin-form-layout
                    .responsiveSteps="${this.responsiveSteps}" style="height: 100%">
                <vaadin-vertical-layout style="max-height: 100%; height: 70vh" colspan="5">
                    <vaadin-horizontal-layout style="width: 100%; justify-content: space-between">
                        <p>Properties inside chosen group</p>
                        <vaadin-button
                                aria-label="remove-property-from-group-button"
                                ?disabled="${this.removePropertyButtonDisabled}"
                                @click="${() => {
                                    this.dispatchEvent(new CustomEvent('remove-properties-from-group', {
                                        detail: {
                                            id: this.groupComboBoxSelectedItem?.id,
                                            elements: this.propertiesGridSelectedItems.map(prop => prop.id)
                                        }
                                    }));
                                    this.propertiesGridSelectedItems = [];
                                    // this.groupComboBoxSelectedItem!.property = this.groupComboBoxSelectedItem?.property!.filter(
                                    //         (prop: any) => this.propertiesGridSelectedItems.findIndex(pr => pr.id == prop.id) == -1
                                    // );
                                    // this.refreshData(this.groupComboBoxSelectedItem);
                                    // this.propertiesGridSelectedItems = [];
                                }}"
                        >Remove property from group
                        </vaadin-button>
                    </vaadin-horizontal-layout>
                    <vaadin-grid
                            aria-label="properties-grid"
                            style="height: 72vh"
                            colspan="3"
                            .items="${this.propertiesGridItems}"
                            .selectedItems="${this.propertiesGridSelectedItems}"
                            @selected-items-changed="${(e: GridSelectedItemsChangedEvent<Property>) => {
                                const items = e.detail.value;
                                let oneGroup = true;
                                for (let item of items) {
                                    if (item.grId != this.groupComboBoxSelectedItem?.id) {
                                        oneGroup = false;
                                    }
                                }
                                this.propertiesGridSelectedItems = items;
                                this.removePropertyButtonDisabled = items.length == 0 || !oneGroup;
                            }}"
                    >
                        <vaadin-grid-selection-column
                                auto-select="${true}"
                        ></vaadin-grid-selection-column>
                        <vaadin-grid-filter-column
                                width="40px"
                                path="grId"
                        >
                        </vaadin-grid-filter-column>
                        <vaadin-grid-filter-column
                                width="60px"
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
                                width="50px"
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
                        <vaadin-button
                                aria-label="remove-subgroup-from-group-button"
                                @click="${() => {
                                    this.dispatchEvent(new CustomEvent('remove-groups-from-group', {
                                        detail: {
                                            id: this.groupComboBoxSelectedItem?.id,
                                            elements: this.groupsGridSelectedItems.map(group => group.id)
                                        }
                                    }));
                                    this.groupsGridSelectedItems = [];
                                    // this.groupComboBoxSelectedItem!.property = this.groupComboBoxSelectedItem?.property!.filter(
                                    //         (prop: any) => this.groupsGridSelectedItems.findIndex(pr => pr.id == prop.grId) == -1
                                    // );
                                    // this.groupComboBoxSelectedItem!.group = this.groupComboBoxSelectedItem?.group!.filter(
                                    //         (prop: any) => this.groupsGridSelectedItems.findIndex(pr => pr.id == prop.id) == -1
                                    // );
                                    // this.refreshData(this.groupComboBoxSelectedItem);
                                    // this.groupsGridSelectedItems = [];
                                }}"
                                ?disabled="${this.removeSubGroupButtonDisabled}"
                        >Remove subgroup from group
                        </vaadin-button>
                    </vaadin-horizontal-layout>
                    <vaadin-grid
                            aria-label="groups-grid"
                            colspan="3"
                            .items="${this.groupsGridItems}"
                            .selectedItems="${this.groupsGridSelectedItems}"
                            @selected-items-changed="${(e: GridSelectedItemsChangedEvent<Group>) => {
                                this.removeSubGroupButtonDisabled = e.detail.value.length == 0;
                                this.groupsGridSelectedItems = e.detail.value;
                            }}"
                    >
                        <vaadin-grid-selection-column
                                auto-select="${true}"
                        ></vaadin-grid-selection-column>
                        <vaadin-grid-column
                                path="id"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                path="name"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                path="description"
                        >
                        </vaadin-grid-column>
                    </vaadin-grid>
                </vaadin-vertical-layout>
                <vaadin-vertical-layout style="min-height: 100%; height: 70vh;" colspan="3">
                    <p>Add property to the current group</p>
                    <vaadin-multi-select-combo-box
                            .selectedItems="${this.addPropertiesGridItems}"
                            .items="${this.addPropertyComboBoxItems}"
                            style="width: 100%"
                            class="text-field-width"
                            item-label-path="displayName"
                            colspan="1"
                            label="Select properties to add"
                            @selected-items-changed="${
                                    (e: MultiSelectComboBoxSelectedItemsChangedEvent<Group>) => {
                                        const element = (<any>e).detail.value;
                                        this.addPropertiesGridItems = element;
                                        this.addPropertiesGrid.items = this.addPropertiesGridItems;
                                        this.addPropertyButtonDisabled = element == null || element.length == 0;
                                        if (element && element.length != 0) {
                                            this.addGroupsGridItems = [];
                                        }
                                    }
                            }"
                    >
                    </vaadin-multi-select-combo-box>
                    <p></p>
                    <vaadin-horizontal-layout style="width: 100%; justify-content: space-between">
                        <p>Selected properties to add</p>
                        <vaadin-button
                                theme="primary"
                                ?disabled="${this.addPropertyButtonDisabled}"
                                @click="${() => {
                                    this.dispatchEvent(new CustomEvent('add-properties-to-group', {
                                        detail: {
                                            id: this.groupComboBoxSelectedItem?.id,
                                            elements: this.addPropertiesGridItems.map(prop => prop.id)
                                        }
                                    }));
                                    this.addPropertiesGridItems = [];
                                    this.addGroupsGrid.items = [];
                                    // this.groupComboBoxSelectedItem!.property = this.groupComboBoxSelectedItem?.property!.concat(
                                    //         this.addPropertyComboBoxItems.map(item => ({
                                    //             ...item,
                                    //             grId: this.groupComboBoxSelectedItem?.id,
                                    //             name: this.groupComboBoxSelectedItem?.name
                                    //         }))
                                    // );
                                    // this.refreshData(this.groupComboBoxSelectedItem)
                                }}"
                        >Add selected properties
                        </vaadin-button>
                    </vaadin-horizontal-layout>
                    ${this.addPropertiesGrid}
                    <p>Add subgroup to the current group</p>
                    <vaadin-multi-select-combo-box
                            .selectedItems="${this.addGroupsGridItems}"
                            .items="${this.addGroupComboBoxItems}"
                            style="width: 100%"
                            class="text-field-width"
                            item-label-path="displayName"
                            colspan="1"
                            label="Select groups to add"
                            @selected-items-changed="${
                                    (e: MultiSelectComboBoxSelectedItemsChangedEvent<Group>) => {
                                        e.stopImmediatePropagation();
                                        const element = (<any>e).detail.value;
                                        this.addGroupsGridItems = element != null && element.length != 0 ? element : [];
                                        this.addGroupsGrid.items = this.addGroupsGridItems;
                                        this.addGroupButtonDisabled = element == null || element.length == 0;
                                        if (element && element.length != 0) {
                                            this.addPropertiesGridItems = [];
                                        }
                                    }
                            }"
                    >
                    </vaadin-multi-select-combo-box>
                    <p></p>
                    <vaadin-horizontal-layout style="width: 100%; justify-content: space-between">
                        <p>Selected subgroups to add</p>
                        <vaadin-button
                                theme="primary"
                                ?disabled="${this.addGroupButtonDisabled}"
                                @click="${() => {
                                    this.dispatchEvent(new CustomEvent('add-groups-to-group', {
                                        detail: {
                                            id: this.groupComboBoxSelectedItem?.id,
                                            elements: this.addGroupsGridItems.map(prop => prop.id)
                                        }
                                    }));
                                    this.addGroupsGridItems = [];
                                    this.addGroupsGrid.items = this.addGroupsGridItems;
                                    // this.groupComboBoxSelectedItem!.group = this.groupComboBoxSelectedItem?.group!.concat(this.addGroupComboBoxItems);
                                    // this.refreshData(this.groupComboBoxSelectedItem)
                                }}"
                        >Add selected groups
                        </vaadin-button>
                    </vaadin-horizontal-layout>
                    ${this.addGroupsGrid}
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
        this.dialogOpened = false;
    }

    public isOpen() {
        return this.dialogOpened;
    }

}
