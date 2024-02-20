import {customElement, property} from 'lit/decorators.js';
import {ComboBox} from "@vaadin/combo-box";
import {state} from "lit/decorators.js";
import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiRightMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiRightMenuBar";

@customElement('right-side-menu-bar')
export class DomainRightSideMenuBar extends LeanDiRightMenuBar {

    @state()
    public listBoxItems!: any[];
    @property()
    private combobox!: ComboBox;

    private pinEvent = new CustomEvent<string>("pin-event", {detail: 'pin'});
    private labelEvent = new CustomEvent<string>("label-event",{detail: 'label'});
    private newTreeEvent = new CustomEvent<string>("new-tree-event",{detail: 'new-tree'});
    private dtoEvent = new CustomEvent<string>("dto-event",{detail: 'dto'});
    private explodeEvent = new CustomEvent<string>("explode-event",{detail: 'explode'});
    private hostsEvent = new CustomEvent<string>("hosts-event",{detail: 'hosts'});
    private areasEvent = new CustomEvent<string>("areas-event",{detail: 'areas'});
    private pictureEvent = new CustomEvent<string>("picture-event", {detail: 'picture'});
    private downloadDomainEvent = new CustomEvent<string>("download-dom-event", {detail: 'download-dom'});

    onClickCallback = (event: CustomEvent<string>) => this.dispatchEvent(event);

    private createSearchTextBox(){
        this.combobox = new ComboBox();
        this.combobox.placeholder = "Anchor's name or mnemonic";
        this.combobox.style.width='300px';
        // item.oninput = () => this.dispatchEvent(new CustomEvent<string>("search-event",{detail: item.value}));
        this.combobox.items = this.listBoxItems;
        this.combobox.itemValuePath = 'id';
        this.combobox.itemLabelPath = 'displayName';
        this.combobox.addEventListener('opened-changed', () => {
            this.dispatchEvent(new CustomEvent<string>("search-start"));
        });
        this.combobox.onchange = () => {
            this.dispatchEvent(new CustomEvent<string>("search-event",{detail: this.combobox.selectedItem.id}));
        }
        // item.setAttribute('item-label-path', 'displayName');
        // item.setAttribute('item-value-path', 'id');
    }



    render() {
        this.createSearchTextBox();
        this.items = this.defaultItems.concat([
            {component: createItem(this.onClickCallback, 'download-domain', 'lean-di-icons', this.downloadDomainEvent, 'Download domain')},
            {component: createItem(this.onClickCallback, 'picture', 'vaadin', this.pictureEvent, 'Save as picture')},
            {component: createItem(this.onClickCallback, 'search', 'vaadin', undefined, 'Search'),
                children: [{ component: this.combobox}]},
            // {component: createItem(this.onClickCallback, 'file-code', 'vaadin', this.dtoEvent, 'Generate dto')},
            {component: createItem(this.onClickCallback, 'text-label', 'vaadin', this.labelEvent, 'Show/hide mnemonics')},
            // {component: createItem(this.onClickCallback, 'database', 'vaadin', this.hostsEvent, 'Show/hide hosts')},
            // {component: createItem(this.onClickCallback, 'connect-o', 'vaadin', this.areasEvent, 'Show/hide areas')},
            // {component: createItem(this.onClickCallback, 'cluster', 'vaadin', this.explodeEvent, 'Expand/Implode')},
        ]);
        this.items = [
            {component: createItem(this.onClickCallback, 'pin', 'vaadin', this.pinEvent, 'Fix/unfix all nodes')},
        ].concat(this.items);
        return super.render();
    }
}