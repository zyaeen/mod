import {customElement} from 'lit/decorators.js';
import {GridItemModel} from "@vaadin/grid";
import {
    InnerLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/InnerLayout";
import {Index, LeanDiNode} from "Frontend/interfaces/Interfaces";
import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {LdEventTarget} from "Frontend/events/LdEventTarget";
import {editIndexEvent, event} from "Frontend/events/LdEvents";
import {generateUid, isObjectNotEmpty, isStrEmpty} from "Frontend/utils/common";
import {
    LdIndexDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdIndexDialog";
import {IndexType} from "Frontend/enums/IndexType";


@customElement('index-layout')
export class IndexLayout extends InnerLayout {

    private node!: LeanDiNode;

    private parseItems(indexes?: any) {
        if (isObjectNotEmpty(indexes)) {
            const items = [];
            for (let index of indexes) {
                items.push(
                    {
                        uid: index['uid'],
                        columns: index.columns,
                        type: index.type,
                        method: index.method ? index.method : IndexType.B_TREE
                    }
                )
            }
            this.items = items;
        }
    }

    private parseItemsFromDialog(indexes: any[]) {
        const items = [];
        if (indexes != null) {
            for (let index of indexes) {
                items.push(
                    {
                        uid: index['uid'],
                        columns: index.columns,
                        type: index.type,
                        method: index.method
                    }
                )
            }
        }
        return items;
    }

    protected override addHandler(): void {
        super.addHandler();
        this.indexDialog.openIndexDialog(this.node);
    }
    protected override deleteHandler(): void {
        super.deleteHandler();
        this.dispatchEvent(editIndexEvent(this.items));
    }
    protected override editHandler(itemModel?: GridItemModel<any>): void {
        super.editHandler();
        this.indexDialog.openIndexDialog(this.node,
            structuredClone(itemModel as any));
    }

    protected override initDialog = () => {
        this.indexDialog = new LdIndexDialog();
        this.indexDialog.addEventListener(LdEventTarget.SAVE_INDEX, (e: Event) => {
            const index = event(e).detail as Index;
            if (this.items != null && this.items.length != 0) {
                if (isStrEmpty(index.uid as string)) {
                    index.uid = generateUid();
                    this.items = this.items.concat(this.parseItemsFromDialog([index]));
                } else {
                    this.items = this.items.map(col => {
                        if (col.uid == index.uid) {
                            return index;
                        }
                        return col;
                    });
                }
            } else {
                index.uid = generateUid();
                this.items = this.parseItemsFromDialog([index])
            }
            this.dispatchEvent(editIndexEvent(this.items));
        });
    }


    constructor(node: LeanDiNode) {
        super();
        this.node = node;
        this.itemName = InnerLayouts.index;
        this.items = [];
        this.parseItems(this.node.indexes);
    }
}