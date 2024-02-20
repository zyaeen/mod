import {customElement} from 'lit/decorators.js';
import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiRightMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiRightMenuBar";




@customElement('project-right-side-menu-bar')
export class ProjectRightSideMenuBar extends LeanDiRightMenuBar {

    private newTreeEvent = new CustomEvent<string>("new-tree-event",{detail: 'new-tree'});
    items = this.defaultItems.concat([
        {component: createItem(this.onClickCallback, 'new-file', 'lean-di-icons', this.newTreeEvent, 'Create new project')},
    ]);
}