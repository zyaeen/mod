import {customElement} from 'lit/decorators.js';

import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";
@customElement('deploy-left-side-menu-bar')
export class DeployLeftSideMenuBar extends LeanDiMenuBar {

    private dbHostAddEvent = new CustomEvent<string>("add-node-event", {detail: 'db-host-add'});
    private fsHostAddEvent = new CustomEvent<string>("add-node-event", {detail: 'fs-host-add'});

    private addDbHostMenuBarItem = {component: createItem(this.onClickCallback,'database', 'lean-di-icons', this.dbHostAddEvent, "Add new database host")};
    private addFsHostMenuBarItem = {component: createItem(this.onClickCallback,'folder-o', 'lean-di-icons', this.fsHostAddEvent, "Add new filesystem host")};

    render() {
        this.items = [this.addDbHostMenuBarItem, this.addFsHostMenuBarItem];
        return super.render();
    }
}