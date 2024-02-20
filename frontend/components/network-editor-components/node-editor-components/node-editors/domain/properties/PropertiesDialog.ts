import {html, LitElement} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid/vaadin-grid-filter';

import {dialogFooterRenderer, dialogHeaderRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {GridEventContext} from "@vaadin/grid";


import {
    PropertyCreationDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/properties/PropertyCreationDialog";
import {Anchor, Group, Property} from "Frontend/interfaces/Interfaces";
import '@vaadin/grid/vaadin-grid-selection-column'
import '@vaadin/grid/vaadin-grid-filter-column'
import {StringUtils} from "Frontend/enums/DefaultValues";

@customElement('dialog-properties')
export class PropertiesDialog extends LitElement {
    @state()
    private anchors!: Anchor[];

    protected createRenderRoot() {
        const root = super.createRenderRoot();
        // Apply custom theme (only supported if your app uses one)
        applyTheme(root);
        return root;
    }

    @state()
    private dialogOpened = false;

    public open() {
        this.dialogOpened = true;
    }

    @state()
    private filteredItems: any[] = [];

    @state()
    public groups: any[] = [];
    @state()
    public properties: Property[] = [];


    @state()
    private propertyCreationDialog!: PropertyCreationDialog;

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
                case 'mnemonic':
                case 'descriptor':
                    text = 'Double click to open anchor: ' + item.mnemonic + StringUtils.UNDERLINE + item.descriptor;
                    break;
                case 'description':
                    text = item.description;
                    break;
                default:
                    break;
            }
        }

        return text;
    };


    public setAnchors(anchors: any[]) {
        this.anchors = anchors;
    }

    public setGroups(groups: any[]) {
        this.groups = groups;
    }

    public setProperties(properties: any[]) {
        this.selectedProperties = [];
        this.selectedGroups = [];
        this.selectedAnchors = [];
        this.properties = properties.map(prop => ({
            ...prop,
            requiredString: prop.required ? 'TRUE' : 'FALSE'
        }));

    }

    render() {
        this.propertyCreationDialog = new PropertyCreationDialog();
        this.propertyCreationDialog.addEventListener('create-property', (e: Event) => {
            e.stopImmediatePropagation();
            const event: any = (<any>e);
            this.selectedProperties = [];
            this.selectedGroups = [];
            this.selectedAnchors = [];
            this.dispatchEvent(new CustomEvent('create-property', {detail: event.detail}));
        });
        return html`
            <vaadin-dialog
                    no-close-on-outside-click="${true}"
                    header-title="Properties"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => (this.dialogOpened = e.detail.value)}"
                    ${dialogRenderer(this.renderDialog, [this.properties, this.groups, this.selectedProperties, this.selectedGroups, this.selectedAnchors])}
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
            ${this.propertyCreationDialog}
        `;
    }

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 8}
    ];

    @state()
    private selectedProperties: Property[] = [];
    @state()
    private selectedGroups: Group[] = [];
    @state()
    private selectedAnchors: Anchor[] = [];

    private renderDialog = () => html`
        <vaadin-vertical-layout style="align-items: stretch; width: 95vw; height: 80vh;">
            <vaadin-form-layout .responsiveSteps="${this.responsiveSteps}" style="width: 100%">
                <vaadin-horizontal-layout colspan="3">
                    <vaadin-button @click="${() => {
                        this.propertyCreationDialog.setGroups(this.groups);
                        this.propertyCreationDialog.open();
                    }}">Create property
                    </vaadin-button>
                </vaadin-horizontal-layout>
                <hr colspan="8"/>
            </vaadin-form-layout>
            <vaadin-form-layout
                    .responsiveSteps="${this.responsiveSteps}" style="height: 100%">
                <vaadin-vertical-layout style="max-height: 100%; height: 70vh" colspan="5">
                    <vaadin-horizontal-layout style="width: 100%; justify-content: space-between">
                        <p>Properties</p>
                        <vaadin-horizontal-layout>
                            <vaadin-button
                                    ?disabled=${this.selectedProperties.length != 1}
                                    @click="${() => {
                                        this.propertyCreationDialog.setGroups(this.groups);
                                        this.propertyCreationDialog.open(this.selectedProperties[0]);
                                    }}"
                            >
                                Edit chosen property
                            </vaadin-button>
                            <vaadin-button
                                    ?disabled=${this.selectedProperties.length == 0}
                                    @click="${() => {
                                        this.dispatchEvent(new CustomEvent('delete-properties', {
                                            detail: {
                                                elements: this.selectedProperties.map(prop => prop.id)
                                            }
                                        }))
                                    }}"
                            >
                                Delete chosen properties
                            </vaadin-button>
                        </vaadin-horizontal-layout>
                    </vaadin-horizontal-layout>
                    <vaadin-grid
                            .items="${this.properties}"
                            @selected-items-changed="${(e: CustomEvent) => {
                                this.selectedProperties = e.detail.value ? e.detail.value : [];
                                const selectedItemsLength = this.selectedProperties.length;
                                if (selectedItemsLength == 1) {
                                    this.selectedGroups = [];
                                    this.selectedAnchors = [];
                                    this.selectedGroups = this.groups.filter(
                                            group => group.property.filter((prop: any) =>
                                                    prop.id == this.selectedProperties![0]!.id).length > 0
                                    );
                                    this.selectedAnchors = this.anchors.filter(
                                            (anchor: Anchor) => anchor._group != null && this.selectedGroups.filter((gr: any) =>
                                                    gr.id == anchor._group!.id).length > 0
                                    );
                                } else if (selectedItemsLength > 1
                                        || selectedItemsLength == 0) {
                                    this.selectedGroups = [];
                                    this.selectedAnchors = [];
                                }
                            }}"
                            .selectedItems="${this.selectedProperties}"
                    >
                        <vaadin-grid-selection-column
                                auto-select="${true}"
                        >
                        </vaadin-grid-selection-column>
                        <vaadin-grid-filter-column
                                path="id"
                                width="60px"
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
                        <vaadin-tooltip slot="tooltip" .generator="${this.tooltipGenerator}"></vaadin-tooltip>
                    </vaadin-grid>
                </vaadin-vertical-layout>
                <vaadin-vertical-layout style="min-height: 100%; height: 70vh;" colspan="3">
                    <p>Groups where chosen property consists</p>
                    <vaadin-grid
                            .items="${this.selectedGroups}"
                    >
                        <vaadin-grid-column
                                path="id"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                path="name"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                width="50%"
                                path="description"
                        >
                        </vaadin-grid-column>
                        <vaadin-tooltip slot="tooltip" .generator="${this.tooltipGenerator}"></vaadin-tooltip>
                    </vaadin-grid>
                    <p>Anchors where chosen property consists</p>
                    <vaadin-grid
                            .items="${this.selectedAnchors}"
                            @dblclick="${(e: Event) => {
                                let item = (<any>e).composedPath().filter((el: HTMLElement) => el.tagName == 'TR')[0]._item;
                                if (item != null) {
                                    this.dispatchEvent(new CustomEvent('focus', {detail: item.id}));
                                    this.close();
                                }
                            }}"
                    >
                        <vaadin-grid-column
                                path="mnemonic"
                                width="50px"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                path="descriptor"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                width="50%"
                                path="description"
                        >
                        </vaadin-grid-column>
                        <vaadin-tooltip slot="tooltip" .generator="${this.tooltipGenerator}"></vaadin-tooltip>
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
        this.dialogOpened = false;
    }

    public isOpen() {
        this.renderDialog();
        return this.dialogOpened;
    }

}
