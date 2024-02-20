import {customElement} from "lit/decorators.js";
import {Area, DbHost, FsHost} from "Frontend/interfaces/Interfaces";
import {html} from "lit";
import "@vaadin/icon";
import {LeanDiListBox} from "Frontend/components/network-editor-components/common/list-box/LeanDiListBox";
import {StringUtils} from "Frontend/enums/DefaultValues";


@customElement('hosts-list-box')
export class HostsListBox extends LeanDiListBox {

    private keys = ['dbType', 'host', 'port', 'dbName', 'userName'];
    itemName = 'Hosts';
    protected override itemRenderer = (item: Area | DbHost | FsHost) => {
        const host = item as DbHost | FsHost;
        let text = StringUtils.EMPTY_STRING as string;
        for (let key of this.keys) {
            if ((host as any)[key]) {
                text += key + ": " + (host as any)[key] + ". ";
            }
        }
        return html`
            <vaadin-item
                    style="background-color: ${host.colored == true ? host.hostColor : 'none'}"
                    id="${host.label}"
                    style="line-height: var(--lumo-line-height-m); width: 100%"
                    @click="${(e: Event) => {
                        this.requestUpdate();
                        this.contextItemUid = this.getId((<any>e).composedPath()[0]);
                        this.dispatchEvent(new CustomEvent('change-color', {
                            detail: {
                                label: this.contextItemUid
                            }
                        }));
                    }}"
            >
                <span style="width: 100%;">${host.label}</span>
                <vaadin-tooltip for="${host.label}" text="${text}"
                                position="start"></vaadin-tooltip>
            </vaadin-item>
        `
    }

}