import {property} from 'lit/decorators.js';
import {
    createColorPicker,
    DEFAULT_LD_COMPONENTS_COLOR,
    DEFAULT_NODE_COLOR
} from "Frontend/components/network-editor-components/common/ColorPicker";
import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";


export class LeanDiRightMenuBar extends LeanDiMenuBar {

    @property()
    protected domainColor: string = DEFAULT_NODE_COLOR;

    private zoomPlusEvent = new CustomEvent<string>("zoom-event", {detail: 'zoom-plus'});
    private zoomMinusEvent = new CustomEvent<string>("zoom-event", {detail: 'zoom-minus'});
    private undoEvent = new CustomEvent<string>("undo-event", {detail: 'undo'});
    private redoEvent = new CustomEvent<string>("redo-event", {detail: 'redo'});
    private downloadEvent = new CustomEvent<string>("download-event", {detail: 'download'});
    private uploadEvent = new CustomEvent<string>("upload-event", {detail: 'upload'});

    protected onClickCallback = (event: CustomEvent<string>) => this.dispatchEvent(event);

    constructor() {
        super();
        this.defaultItems = [
            {component: createItem(this.onClickCallback, 'search-plus', 'vaadin', this.zoomPlusEvent, 'Zoom in')},
            {component: createItem(this.onClickCallback, 'search-minus', 'vaadin', this.zoomMinusEvent, 'Zoom out')},
            {component: createItem(this.onClickCallback, 'undo', 'lumo', this.undoEvent, 'Undo')},
            {component: createItem(this.onClickCallback, 'redo', 'lumo', this.redoEvent, 'Redo')},
            {
                component: createItem(this.onClickCallback, 'cog', 'lumo', undefined, 'Settings'),
                children: [{component: createColorPicker(this.domainColor, this.handler)}]
            },
            {component: createItem(this.onClickCallback, 'upload', 'lumo', this.uploadEvent, 'Upload file from device')},
            {component: createItem(this.onClickCallback, 'floppy', 'lean-di-icons', this.downloadEvent, 'Download file to device')},
            // {component: createItem(this.onClickCallback, 'cluster', 'vaadin', this.explodeEvent, 'Expand/Implode')},
        ];
    }

    handler = (e: Event) => {
        this.dispatchEvent(new CustomEvent('color-event', {detail: (<any>e).target.value}));
    }

}