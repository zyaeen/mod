import {customElement, property} from 'lit/decorators.js';

import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";
import {Select} from "@vaadin/select";

@customElement('right-plugin-bar')
export class RightPluginBar extends LeanDiMenuBar {

    @property()
    public domainList: string[] = [];

    private select!: Select;

    private explodeEvent = new CustomEvent<string>("explode-event",{detail: 'explode'});
    private hostsEvent = new CustomEvent<string>("hosts-event",{detail: 'hosts'});
    private areasEvent = new CustomEvent<string>("areas-event",{detail: 'areas'});

    private createSearchTextBox(){
        this.select = new Select();
        this.select.placeholder = "Anchor's name or mnemonic";
        this.select.style.width='300px';
        // item.oninput = () => this.dispatchEvent(new CustomEvent<string>("search-event",{detail: item.value}));
        this.select.items = [
            {label: 'No selection'},
            { label: 'Most recent first', value: 'recent' },
            { component: 'hr' },
            { label: 'Rating: low to high', value: 'rating-asc' },
            { label: 'Rating: high to low', value: 'rating-desc' },
            { component: 'hr' },
            { label: 'Price: low to high', value: 'price-asc', disabled: true },
            { label: 'Price: high to low', value: 'price-desc', disabled: true }
        ];
        // this.select.onchange = () => {
        //     this.dispatchEvent(new CustomEvent<string>("search-event",{detail: this.combobox.selectedItem.id}));
        // }
        // item.setAttribute('item-label-path', 'displayName');
        // item.setAttribute('item-value-path', 'id');
    }

    render() {
        this.createSearchTextBox();
        this.items = [
            {component: createItem(this.onClickCallback, 'two-bases', 'lean-di-icons', this.hostsEvent, 'Show/hide hosts')},
            {
                component: createItem(this.onClickCallback, 'area', 'lean-di-icons', this.areasEvent, 'Show/hide areas'),
            },
            {component: createItem(this.onClickCallback, 'explode', 'lean-di-icons', this.explodeEvent, 'Expand/Implode')}
        ];
        return super.render();
    }
}