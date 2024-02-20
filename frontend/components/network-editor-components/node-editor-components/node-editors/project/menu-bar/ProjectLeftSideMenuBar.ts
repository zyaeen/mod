import {customElement} from 'lit/decorators.js';

import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";


@customElement('project-left-side-menu-bar')
export class ProjectLeftSideMenuBar extends LeanDiMenuBar {

    private domainAddEvent = new CustomEvent<string>("add-node-event",{detail: 'domain-add'});
    // private domainMenuBarItem = {component: createItem(this.onClickCallback,'domain-add', 'lean-di-icons', this.domainAddEvent, 'Create domain')};
    private domainMenuBarItem = {component: createItem(this.onClickCallback,'dom-add', 'lean-di-icons', this.domainAddEvent, 'Create domain')};
    items = [this.domainMenuBarItem];
}