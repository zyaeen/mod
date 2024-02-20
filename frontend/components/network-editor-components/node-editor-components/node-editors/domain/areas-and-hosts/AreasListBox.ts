import {customElement} from "lit/decorators.js";
import {Area, DbHost, FsHost} from "Frontend/interfaces/Interfaces";
import {html} from "lit";
import "@vaadin/icon";
import {LeanDiListBox} from "Frontend/components/network-editor-components/common/list-box/LeanDiListBox";
import {TemplateResult} from "lit/development";


@customElement('areas-list-box')
export class AreasListBox extends LeanDiListBox {

    protected override contextMenuHandler = (e: Event) => {
        switch ((<any>e).detail.value.text) {
            case 'Edit':
                this.dispatchEvent(new CustomEvent('edit-area', {
                    detail: this.contextItemUid
                }));
                break;
            case 'Create':
                this.dispatchEvent(new CustomEvent('create-area', {}));
                break;
            case 'Delete':
                this.dispatchEvent(new CustomEvent('delete-area', {
                    detail: this.contextItemUid
                }));
                break;
            default:
                break;
        }
    }

    protected override contextMenuItems = [{text: 'Edit'}, {text: 'Delete'}, {text: 'Create'}];

    protected override itemRenderer = (item: Area | DbHost | FsHost) => {
        const area = item as Area;
        return html`
            <vaadin-item
                    style="background-color: ${area.colored == true ? item.color : 'none'}"
                    id="${area.uid}"
                    style="line-height: var(--lumo-line-height-m); width: 100%"
                    @contextmenu="${(e: Event) => {
                        this.contextItemUid = this.getId((<any>e).composedPath()[0]);
                    }}"
                    @click="${(e: Event) => {
                        this.contextItemUid = this.getId((<any>e).composedPath()[0]);
                        this.dispatchEvent(new CustomEvent('change-color', {
                            detail: {
                                uid: this.contextItemUid
                            }
                        }));
                    }}"
            >
                <span>${area.descriptor}</span>
                <vaadin-tooltip for="${area.uid}" text="${area.description}"
                                position="start"></vaadin-tooltip>
            </vaadin-item>
        `
    }

    protected override render(): TemplateResult<1> {
        this.itemName = "Areas";
        return super.render();
    }

}