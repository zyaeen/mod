import {customElement, property} from 'lit/decorators.js';

import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";


@customElement('project-navigation-bar')
export class ProjectNavigationBar extends LeanDiMenuBar {

    @property()
    public domainList: string[] = [];

    private toDomainJumpItem = {}
    private toHostsJumpItem = {}


    render() {
        this.toHostsJumpItem = {
            component: createItem(this.onClickCallback, 'hosts', 'lean-di-icons',
                new CustomEvent<string>("jump-to-hosts", {}), 'Jump to The Hosts'
            ),
        };
        this.toDomainJumpItem = {
            component: createItem(this.onClickCallback, 'cube', 'lean-di-icons', undefined,
                'Jump to The Domain'),
            children: this.domainList.length != 0 ? this.domainList.map(domain => {
                return {
                    component: createItem(this.onClickCallback, 'domain', 'lean-di-icons',
                         new CustomEvent<string>("jump-to-domain", {detail: domain}),
                        undefined, " " + domain)
                }
            }) : [{
                component: createItem(this.onClickCallback, 'domain', 'lean-di-icons', undefined, undefined,
                    "There is no domain to navigate")
            }]
        };
        this.items = [this.toHostsJumpItem, this.toDomainJumpItem];
        return super.render();
    }
}