import {customElement, property} from 'lit/decorators.js';

import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";

@customElement('domain-navigation-bar')
export class DomainNavigationBar extends LeanDiMenuBar {

    @property()
    public domainList: string[] = [];

    private jumpToProjectEvent!: CustomEvent;
    private toProjectJumpItem = {};

    private toDomainJumpItem = {}

    render() {
        this.jumpToProjectEvent = new CustomEvent<string>("jump-to-project", {});
        this.toProjectJumpItem = {
            component: createItem(this.onClickCallback, 'cubes', 'lean-di-icons',
                this.jumpToProjectEvent, 'Jump To The Project')
        };
        this.toDomainJumpItem = {
            component: createItem(this.onClickCallback, 'cube', 'lean-di-icons', undefined,'Jump To The Domain'),
            children: this.domainList.length != 0 ? this.domainList.map(domain => {
                return {
                    component: createItem(this.onClickCallback, 'domain', 'lean-di-icons',
                         new CustomEvent<string>("jump-to-domain", {detail: domain}), undefined," " + domain,)
                }
            }) : [{
                component: createItem(this.onClickCallback, 'domain', 'lean-di-icons',
                    undefined,undefined, "There is no domain to navigate")
            }]
        };
        this.items = [this.toProjectJumpItem, this.toDomainJumpItem];
        return super.render();
    }
}