import {customElement} from 'lit/decorators.js';

import {GridItemModel} from "@vaadin/grid";
import {
    InnerLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/InnerLayout";
import {extendedColumn} from "Frontend/interfaces/Interfaces";
import {
    LdColumnDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdColumnDialog";
import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {deleteIndexColumnEvent, editColumnEvent, event, updateIndexColumnEvent} from "Frontend/events/LdEvents";
import {LdEventTarget} from "Frontend/events/LdEventTarget";
import {generateUid, isStrEmpty} from "Frontend/utils/common";


@customElement('column-layout')
export class ColumnLayout extends InnerLayout {

    private knots!: string[];

    public setKnots(knots: string[]) {
        this.knots = knots;
    }

    private parseItems (columns?: extendedColumn[]) {
        if (columns != null && columns.length != 0) {
            this.items = columns;
        }
    }

    protected override initDialog = () => {
        this.columnDialog = new LdColumnDialog();
        this.columnDialog.addEventListener(LdEventTarget.SAVE_COLUMN, (e: Event) => {
            let oldColumnName = null;
            const column = event(e).detail as extendedColumn;
            if (this.items != null && this.items.length != 0) {
                if (isStrEmpty(column.uid)) {
                    column.uid = generateUid();
                    this.items = this.items.concat([column]);
                } else {
                    this.items = this.items.map(col => {
                        if (col.uid == column.uid) {
                            oldColumnName = col.columnName;
                            return column;
                        }
                        return col;
                    });
                }
            } else {
                column.uid = generateUid();
                this.parseItems([column])
            }
            this.dispatchEvent(editColumnEvent(this.items));
            if (oldColumnName != null) {
                this.dispatchEvent(updateIndexColumnEvent([oldColumnName, column.columnName!]));
            }
        });
    }

    protected addHandler(): void {
        super.addHandler();
        this.columnDialog.openColumn();
        this.columnDialog.setKnots(this.knots);
    };
    protected override deleteHandler(): void {
        this.dispatchEvent(deleteIndexColumnEvent(structuredClone(this.selectedItems[0].columnName)));
        super.deleteHandler();
        this.dispatchEvent(editColumnEvent(this.items));
    }
    protected editHandler(itemModel?: GridItemModel<any>): void {
        super.editHandler();
        this.columnDialog.openColumn(structuredClone(itemModel as extendedColumn))
        this.columnDialog.setKnots(this.knots);
    };

    constructor(columns?: extendedColumn[]) {
        super();
        this.itemName = InnerLayouts.column;
        this.items = [];
        this.parseItems(columns);
    }
}