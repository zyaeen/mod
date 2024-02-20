import {html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {applyTheme} from 'Frontend/generated/theme';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {
    AnchorRole,
    Attribute,
    extendedColumn,
    Index,
    IndexColumn,
    KnotRole,
    LeanDiNode
} from "Frontend/interfaces/Interfaces";
import {decapitalize, isArrayNotEmpty, isStrNotEmpty} from "Frontend/utils/common";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {event, saveIndexEvent} from "Frontend/events/LdEvents";
import {IndexType} from "Frontend/enums/IndexType";
import {IndexOrder} from "Frontend/enums/IndexOrder";
import {GridActiveItemChangedEvent, GridDragStartEvent, GridDropEvent, GridItemModel} from "@vaadin/grid";
import {NodeType} from "Frontend/enums/NodeType";
import {GridColumn} from "@vaadin/grid/src/vaadin-grid-column.js";
import {CHANGEDAT, ID_POSTFIX, StringUtils} from "Frontend/enums/DefaultValues";

@customElement('ld-index-dialog')
export class LdIndexDialog extends LdCreationDialog {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    private static UNIQUE: string = 'UNIQUE';
    private static ORDINARY: string = 'ORDINARY';

    private responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '50px', columns: 3}
    ];
    // @state()
    private index!: Index;
    @state()
    private knots: string[] = [];
    @state()
    private selectedColumnOrder = IndexOrder.ASC;
    @state()
    private selectedColumnName: string | null = null;

    setKnots(knots: string[]) {
        this.knots = knots;
    }

    @property()
    private indexColumns: string[] = [];
    @state()
    private gridItems: IndexColumn[] = [];
    @state()
    private selectedItems: IndexColumn[] = [];
    @state()
    private draggedItem?: IndexColumn;

    public openIndexDialog = (node: LeanDiNode, dbIndex?: Index): void => {
        this.index = {} as Index;
        if (dbIndex != null) {
            this.index = dbIndex as Index;
            this.toEdit = true;
            this.dialogTitle = 'Edit ' + InnerLayouts.index;
        } else {
            this.toEdit = false;
            this.dialogTitle = 'Create ' + InnerLayouts.index;
        }
        if (this.index.columns && this.index.columns.column) {
            this.gridItems = this.index.columns?.column?.map((column: string) => {
                return {
                    column: column.split(" ")[0],
                    order: column.split(" ")[1] ?
                        column.split(" ")[1] : IndexOrder.ASC
                } as IndexColumn
            });
        }
        this.indexColumns = [];
        if (isStrNotEmpty(node.descriptor) && node.type != NodeType.TIE) {
            this.indexColumns = this.indexColumns.concat([node.descriptor!]);
        }
        if (isStrNotEmpty(node.mnemonic) && node.type != NodeType.TIE) {
            this.indexColumns = this.indexColumns.concat([node.mnemonic! + ID_POSTFIX]);
        }
        if (isStrNotEmpty(node.knotRange)) {
            this.indexColumns = this.indexColumns.concat([node.knotRange!]);
        }
        if (isStrNotEmpty(node.timeRange)) {
            this.indexColumns = this.indexColumns.concat([CHANGEDAT]);
        }
        if (isArrayNotEmpty(node.extendedColumn)) {
            this.indexColumns = this.indexColumns.concat(node.extendedColumn!.map((column: extendedColumn) =>
                column.columnName as string
            ));
        }
        if (isArrayNotEmpty(node.attribute)) {
            this.indexColumns = this.indexColumns.concat(node.attribute!.map((attribute: Attribute) =>
                attribute.descriptor as string));
        }
        if (isArrayNotEmpty(node.anchorRole)) {
            this.indexColumns = this.indexColumns.concat(node.anchorRole!.map((anchor: AnchorRole) => {
                return anchor.type + StringUtils.UNDERLINE + anchor.role
            }));
        }
        if (isArrayNotEmpty(node.knotRole!)) {
            this.indexColumns = this.indexColumns.concat(node.knotRole!.map((knot: KnotRole) => {
                return knot.type!
            }));
        }
        this.indexColumns = this.indexColumns.map(column => column.toUpperCase());
        this.dialogOpened = true;
    }

    render(): TemplateResult<1> {
        this.dependencies = this.dependencies.concat([this.gridItems, this.selectedItems,
            this.selectedColumnName, this.index, this.indexColumns, this.selectedColumnOrder,
            this.draggedItem
        ]);
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }

    private renderDialog = () => html`
        <vaadin-form-layout style="align-items: stretch; width: 35rem; max-width: 100%;"
                            .responsiveSteps="${this.responsiveSteps}">
            <vaadin-combo-box
                    label="Index type"
                    class="text-field-width"
                    .value="${this.index.method ? this.index.method : IndexType.B_TREE}"
                    .items="${Object.values(IndexType)}"
                    @value-changed="${(e: Event) => {
                        this.index.method = event(e).target.value;
                    }}"
            >
            </vaadin-combo-box>
            <vaadin-checkbox label="Unique"
                             @checked-changed="${(e: Event) => {
                                 e.stopImmediatePropagation();
                                 const checked = event(e).detail.value;
                                 if (checked) {
                                     this.index.type = LdIndexDialog.UNIQUE;
                                 } else {
                                     this.index.type = LdIndexDialog.ORDINARY;
                                 }
                             }}"
                             ?checked="${this.index.type ? this.index.type.toUpperCase() == LdIndexDialog.UNIQUE : false}"
                             colspan="1"
            ></vaadin-checkbox>
            <hr colspan="3"/>
            <vaadin-combo-box
                    label="Column"
                    class="text-field-width"
                    .value="${this.selectedColumnName}"
                    .items="${this.indexColumns}"
                    @value-changed="${(e: Event) => {
                        this.selectedColumnName = event(e).target.value;
                    }}"
            >
            </vaadin-combo-box>
            <vaadin-combo-box
                    label="Index order"
                    class="text-field-width"
                    .value="${this.selectedColumnOrder ? this.selectedColumnOrder : IndexOrder.ASC}"
                    .items="${Object.values(IndexOrder)}"
                    @value-changed="${(e: Event) => {
                        this.selectedColumnOrder = event(e).target.value;
                    }}"
            >
            </vaadin-combo-box>
            <vaadin-button
                    theme="secondary"
                    @click="${() => {
                        if (isStrNotEmpty(this.selectedColumnName)) {
                            const gridItem = {
                                column: this.selectedColumnName as string,
                                order: this.selectedColumnOrder as IndexOrder
                            };
                            let isThereColumn = false;

                            this.gridItems = this.gridItems?.map(item => {
                                if (item.column == this.selectedColumnName) {
                                    item.order = this.selectedColumnOrder;
                                    isThereColumn = true;
                                }
                                return item;
                            });
                            if (!isThereColumn) {
                                this.gridItems = this.gridItems?.concat([gridItem]);
                            }
                            this.selectedColumnName = null;
                            this.requestUpdate();
                        }
                    }}"
            >
                Save column
            </vaadin-button>
            <!--            todo button "add column"-->
            <hr colspan="3"/>
            <vaadin-grid
                    rows-draggable
                    drop-mode="between"
                    style="width: 100%; height: 250px;"
                    colspan="3"
                    .items="${this.gridItems}"
                    .selectedItems="${this.selectedItems}"
                    @active-item-changed="${(e: GridActiveItemChangedEvent<any>) => {
                        const item = e.detail.value;
                        if (item) {
                            this.selectedItems = [item];
                            this.selectedColumnName = item.column;
                            this.selectedColumnOrder = item.order;
                        } else {
                            this.selectedItems = [];
                            this.selectedColumnName = null;
                            this.selectedColumnOrder = IndexOrder.ASC;
                        }
                    }}"
                    @grid-dragstart="${(event: GridDragStartEvent<IndexColumn>) => {
                        this.draggedItem = event.detail.draggedItems[0];
                    }}"
                    @grid-dragend="${() => {
                        delete this.draggedItem;
                    }}"
                    @grid-drop="${(event: GridDropEvent<IndexColumn>) => {
                        const { dropTargetItem, dropLocation } = event.detail;
                        // Only act when dropping on another item
                        if (this.draggedItem && dropTargetItem !== this.draggedItem) {
                            // Remove the item from its previous position
                            const draggedItemIndex = this.gridItems.indexOf(this.draggedItem);
                            this.gridItems.splice(draggedItemIndex, 1);
                            // Re-insert the item at its new position
                            const dropIndex =
                                    this.gridItems.indexOf(dropTargetItem) + (dropLocation === 'below' ? 1 : 0);
                            this.gridItems.splice(dropIndex, 0, this.draggedItem);
                            // Re-assign the array to refresh the grid
                            this.gridItems = [...this.gridItems];
                        }
                    }}"
            >
                <vaadin-grid-column
                        width="60%"
                        path="column"
                ></vaadin-grid-column>
                <vaadin-grid-column
                        width="20%"
                        path="order"
                ></vaadin-grid-column>
                <vaadin-grid-column
                        width="20%"
                        frozen-to-end
                        auto-width
                        flex-grow="0"
                        .renderer="${
                                (root: HTMLElement, column: GridColumn<any>, model: GridItemModel<any>) => {
                                    let editButton = root.firstElementChild;
                                    if (!editButton) {
                                        editButton = document.createElement('vaadin-button');
                                        editButton.textContent = "Delete";
                                        editButton.addEventListener('click', (evt) => {
                                            // this.editHandler(model.item);
                                            this.gridItems = this.gridItems.filter(item => item.column 
                                                    != model.item.column);
                                            evt.stopImmediatePropagation();
                                        });
                                        root.appendChild(editButton);
                                    }
                                }
                        }"
                >
                </vaadin-grid-column>
            </vaadin-grid>
        </vaadin-form-layout>
    `;


    private renderFooter = () => html`
        <vaadin-button 
                ?disabled="${this.gridItems.length == 0}"
                theme="primary" 
                @click="${() => {
            this.index.columns = {
                column: this.gridItems?.map(item => item.column + " " + item.order)
            }
            this.dispatchEvent(saveIndexEvent(this.index));
            this.close();
        }}"
        >Save
        </vaadin-button>
        <vaadin-button @click="${this.close}">Cancel
        </vaadin-button>
    `;


}
