import {state} from "lit/decorators.js";
import {Area, DbHost, FsHost} from "Frontend/interfaces/Interfaces";
import {html, LitElement} from "lit";
import "@vaadin/icon";
import {DEFAULT_LD_COMPONENTS_COLOR} from "Frontend/components/network-editor-components/common/ColorPicker";


export class LeanDiListBox extends LitElement {


    @state()
    public items: Area[] | (DbHost | FsHost)[] = [];
    @state()
    protected contextItemUid!: string;
    @state()
    protected selectedItems: Area[] = [];
    @state()
    protected itemName!: string;

    @state()
    protected contextMenuItems: any[] = [];
    @state()
    protected contextMenuHandler: Function = () => {
        return;
    };
    @state()
    protected itemRenderer: Function = () => {
        return null;
    };

    protected getId = (target: any) => {
        let id;
        if (target.tagName == 'SPAN') {
            if (target.part == 'checkmark') {
                id = target.parentNode.host.id;
            } else {
                id = target.parentNode.id;
            }
        } else if (target.tagName == 'DIV') {
            id = target.parentNode.host.id;
        } else {
            id = target.id;
        }
        return id;
    }


    protected override render() {
        return html`
            <vaadin-vertical-layout
                    style="width: 100%;"
            >
                <hr style="width: 100%; color: ${DEFAULT_LD_COMPONENTS_COLOR}"/>
                <label>${this.itemName} list</label>
                <hr style="width: 100%; color: ${DEFAULT_LD_COMPONENTS_COLOR}"/>
                <vaadin-context-menu
                        style="width: 100%"
                        .items=${this.contextMenuItems}
                        @item-selected="${(e: Event) => this.contextMenuHandler(e)}"
                >
                    <vaadin-list-box
                            multiple
                            style="width: 100%"
                    >
                        ${this.items != null ? this.items.map(
                                (item) => this.itemRenderer(item)
                        ) : []}
                    </vaadin-list-box>
                </vaadin-context-menu>
            </vaadin-vertical-layout>
        `;
    }

}