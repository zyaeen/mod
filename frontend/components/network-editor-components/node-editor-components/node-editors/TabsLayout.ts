import {html, LitElement} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {
    IndexLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/IndexLayout";
import {
    ColumnLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/ColumnLayout";
import {
    KnotValueLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/KnotValueLayout";
import {TabsSelectedChangedEvent} from "@vaadin/tabs";
import {Index, extendedColumn, LeanDiNode, Values} from "Frontend/interfaces/Interfaces";
import {LdEventTarget} from "Frontend/events/LdEventTarget";
import {
    deleteIndexColumnEvent,
    deleteJsonEvent,
    editJsonEvent,
    event, resetKnotRangeRoleEvent,
    updateIndexColumnEvent
} from "Frontend/events/LdEvents";
import {NodeType} from "Frontend/enums/NodeType";
import {
    JsonLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/JsonLayout";
import {sheetType, SheetType} from "Frontend/enums/SheetType";
import {isArrayNotEmpty, isStrNotEmpty} from "Frontend/utils/common";


@customElement('tabs-editor-layout')
export class TabsLayout extends LitElement {

    @property()
    @state()
    public node!: LeanDiNode;
    @property()
    @state()
    private knots!: string[];

    constructor(node: LeanDiNode) {
        super();
        this.node = node;
        if (this.node.type == NodeType.KNOT) {
            sheetType[0] = SheetType.VALUE;
        }
    }

    @state()
    @property()
    public selectedSheet!: SheetType;

    @property()
    public indexVisibility = false;
    @property()
    public columnVisibility = false;
    @property()
    public jsonVisibility = false;
    @property()
    public valueVisibility = false;

    private indexLayout!: IndexLayout;
    private columnLayout!: ColumnLayout;
    private valueLayout!: KnotValueLayout;
    private jsonLayout!: JsonLayout;

    setKnots(knots: string[]) {
        this.knots = knots;
    }

    hideLayout(element?: LitElement) {
        if (element != null) {
            element.style.display = 'none';
        }
    }

    showLayout(element?: LitElement) {
        if (element != null) {
            element.style.display = 'contents';
            element.style.background = 'none';

        }
    }

    public isToResetKnotRangeRoleIfExistsKnottedColumn() {
        if (isArrayNotEmpty(this.node.extendedColumn)) {
            for (let column of this.node.extendedColumn!) {
                if (isStrNotEmpty(column.knotRange)) {
                    return true;
                }
            }
        }
        return false;
    }


    fillGrids() {
        if (this.indexVisibility) {
            this.indexLayout = new IndexLayout(this.node);
            this.indexLayout.addEventListener(LdEventTarget.EDIT_INDEX, (e: Event) => {
                const indexes = event(e).detail as Index[];
                this.node.indexes = indexes
            });
        }
        if (this.columnVisibility) {
            this.columnLayout = new ColumnLayout(this.node.extendedColumn);
            this.columnLayout.setKnots(this.knots);
            this.columnLayout.addEventListener(LdEventTarget.EDIT_COLUMN, (e: Event) => {
                this.node.extendedColumn = event(e).detail as extendedColumn[];
                if (this.isToResetKnotRangeRoleIfExistsKnottedColumn()) {
                    this.dispatchEvent(resetKnotRangeRoleEvent());
                }
            });
            this.columnLayout.addEventListener(LdEventTarget.UPDATE_INDEX_COLUMN, (e: Event) => {
                this.dispatchEvent(updateIndexColumnEvent(event(e).detail));
            });
            this.columnLayout.addEventListener(LdEventTarget.DELETE_INDEX_COLUMN, (e: Event) => {
                this.dispatchEvent(deleteIndexColumnEvent(event(e).detail));
            });
        }
        if (this.valueVisibility) {
            this.valueLayout = new KnotValueLayout(this.node);
            this.valueLayout.addEventListener(LdEventTarget.EDIT_VALUE, (e: Event) => {
                this.node.values ={
                    value: event(e).detail
                } as Values;
            });
        }
        if (this.jsonVisibility) {
            this.jsonLayout = new JsonLayout(this.node.json);
            this.jsonLayout.addEventListener(LdEventTarget.EDIT_JSON, (e: Event) => {
                this.node.json = event(e).detail;
                this.dispatchEvent(editJsonEvent(event(e).detail));
                // this.selectedSheet = SheetType.JSON;
            });
            this.jsonLayout.addEventListener(LdEventTarget.DELETE_JSON, (e: Event) => {
                this.node.json = event(e).detail;
                this.dispatchEvent(deleteJsonEvent());
            });
        }
    }

    selectedChanged(e: TabsSelectedChangedEvent) {
        sheetType[0] = e.detail.value
        switch (e.detail.value) {
            case SheetType.INDEX: {
                this.showLayout(this.indexLayout);
                this.hideLayout(this.columnLayout);
                this.hideLayout(this.valueLayout);
                this.hideLayout(this.jsonLayout);
                break;
            }
            case SheetType.COLUMN: {
                this.hideLayout(this.indexLayout);
                this.showLayout(this.columnLayout);
                this.columnLayout.setKnots(this.knots);
                this.hideLayout(this.valueLayout);
                this.hideLayout(this.jsonLayout);
                break;
            }
            case SheetType.VALUE: {
                this.hideLayout(this.indexLayout);
                this.hideLayout(this.columnLayout);
                this.showLayout(this.valueLayout);
                this.hideLayout(this.jsonLayout);
                break;
            }
            case SheetType.JSON: {
                this.hideLayout(this.indexLayout);
                this.hideLayout(this.columnLayout);
                this.hideLayout(this.valueLayout);
                this.showLayout(this.jsonLayout);
                break;
            }
        }
    }
    protected render() {
        this.fillGrids();
        return html`
            <vaadin-tabs
                    .selected="${sheetType[0]}"
                    @selected-changed="${this.selectedChanged}"
                    style="width: 100%"
                    theme="equal-width-tabs"
            >
                <vaadin-tab
                        style="display: ${this.indexVisibility ? 'block' : 'none'}"
                        class="text-field-width"
                >Indexes
                </vaadin-tab>
                <vaadin-tab
                        style="display: ${this.columnVisibility ? 'block' : 'none'}"
                        class="text-field-width"
                >Extended columns
                </vaadin-tab>
                <vaadin-tab
                        style="display: ${this.valueVisibility ? 'block' : 'none'}"
                        class="text-field-width"
                >Values
                </vaadin-tab>
                <vaadin-tab
                        style="display: ${this.jsonVisibility ? 'block' : 'none'}"
                        class="text-field-width"
                >JSON
                </vaadin-tab>
            </vaadin-tabs>
            ${this.indexLayout}
            ${this.columnLayout}
            ${this.valueLayout}
            ${this.jsonLayout}
        `
    }

}