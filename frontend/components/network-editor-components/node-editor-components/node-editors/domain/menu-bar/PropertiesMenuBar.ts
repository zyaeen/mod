import {customElement} from 'lit/decorators.js';
import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";


@customElement('properties-menu-bar')
export class PropertiesMenuBar extends LeanDiMenuBar {

    private openGroupsEvent!: CustomEvent;
    private groupsItem = {};
    private openPropertiesEvent!: CustomEvent;
    private propertiesItem = {};

    render() {
        this.openGroupsEvent = new CustomEvent<string>("open-groups", {});
        // this.groupsItem = {
        //     component: createItem(this.onClickCallback,'cube', 'vaadin',
        //         this.openGroupsEvent, 'Dynamic properties in groups')
        // };
        this.groupsItem = {
            component: createItem(this.onClickCallback,'groups', 'lean-di-icons',
                this.openGroupsEvent, 'Dynamic properties in groups')
        };
        this.openPropertiesEvent = new CustomEvent<string>("open-properties", {});
        // this.propertiesItem = {
        //     component: createItem(this.onClickCallback,'cubes', 'vaadin',
        //         this.openPropertiesEvent, 'Dynamic properties')
        // };
        this.propertiesItem = {
            component: createItem(this.onClickCallback,'props', 'lean-di-icons',
                this.openPropertiesEvent, 'Dynamic properties')
        };
        this.items = [this.groupsItem, this.propertiesItem];
        return super.render();
    }
}