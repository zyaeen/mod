import {customElement, state} from 'lit/decorators.js';


import {GridItemModel} from "@vaadin/grid";
import {
    InnerLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/InnerLayout";
import {Knot, Value, Values} from "Frontend/interfaces/Interfaces";
import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {editValueEvent, event} from "Frontend/events/LdEvents";
import {DataRange} from "Frontend/enums/DataRange";
import {LdEventTarget} from "Frontend/events/LdEventTarget";
import {generateUid, isStrEmpty} from "Frontend/utils/common";
import {
    LdKnotValueDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdKnotValueDialog";


@customElement('knot-value-layout')
export class KnotValueLayout extends InnerLayout {

    private knot!: Knot;
    @state()
    private busyIds: string[] = [];

    private parseItems (values?: Values) {
        if (values != null && values.value != null) {
            this.items = values.value.sort(function(a: Value, b: Value) {
                let keyA = a.id,
                    keyB = b.id;
                if (keyA! < keyB!) return -1;
                if (keyA! > keyB!) return 1;
                return 0;
            });
            this.busyIds = this.items.map(value => value.id!.toString());
        }
    }

    protected override initDialog = () => {
        this.valueDialog = new LdKnotValueDialog();
        this.valueDialog.addEventListener(LdEventTarget.SAVE_VALUE, (e: Event) => {
            const value = event(e).detail as Value;
            if (isStrEmpty(value.id!.toString())) {
                value.id = this.busyIds.length == 0 ? 1 : parseInt(this.busyIds[this.busyIds.length - 1]) + 1;
            }
            if (this.items != null && this.items.length != 0) {
                if (isStrEmpty(value.uid)) {
                    value.uid = generateUid();
                    this.items = this.items.concat([value]);
                    this.busyIds = this.busyIds.concat([value.id!.toString()]);
                } else {
                    this.items = this.items.map(val => {
                        if (val.uid == value.uid) {
                            return value;
                        }
                        return val;
                    });
                }
            } else {
                value.uid = generateUid();
                this.parseItems({
                    value: [value]
                } as Values);
            }
            this.dispatchEvent(editValueEvent(this.items));
        });
    }

    protected addHandler(): void {
        super.addHandler();
        this.valueDialog.openValueDialog(this.knot.dataRange as DataRange,
            this.knot.length as string, this.busyIds);
    };
    protected deleteHandler(): void {
        super.deleteHandler();
        this.dispatchEvent(editValueEvent(this.items));
    }
    protected editHandler(itemModel?: GridItemModel<any>): void {
        super.editHandler();
        this.valueDialog.openValueDialog(
            this.knot.dataRange as DataRange,
            this.knot.length as string,
            this.busyIds,
            structuredClone(itemModel as Value)
        )
    };

    constructor(knot: Knot) {
        super();
        this.itemName = InnerLayouts.value;
        this.items = [];
        this.knot = knot;
        this.isKnot = true;
        this.parseItems(knot.values);
    }
}