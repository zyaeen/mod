import {html} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import {
    InnerLayout
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/child-layouts/InnerLayout";

import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {
    deleteJsonEvent,
    editColumnEvent, editJsonEvent,
    event
} from "Frontend/events/LdEvents";
import {LdEventTarget} from "Frontend/events/LdEventTarget";
import {isObjectNotEmpty, isStrNotEmpty} from "Frontend/utils/common";
import {
    LdJsonDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdJsonDialog";
import JSONEditor from "jsoneditor";


@customElement('json-layout')
export class JsonLayout extends InnerLayout {

    @state()
    private json!: any;

    protected override initDialog = () => {
        this.jsonDialog = new LdJsonDialog();
        this.jsonDialog.addEventListener(LdEventTarget.SAVE_JSON, (e: Event) => {
            this.json = event(e).detail;
            this.dispatchEvent(editJsonEvent(this.json));
            this.requestUpdate();
        });
    }
    @state()
    private editorLayout!: HTMLDivElement;

    protected addHandler(): void {
        super.addHandler();
        this.jsonDialog.open(this.json);
    };

    protected override deleteHandler(): void {
        this.json = {};
        this.dispatchEvent(deleteJsonEvent());
    }

    protected override fillGrid = () => {
        return [html``];
    }

    private renderJsonEditor = () => {
        this.editorLayout = document.createElement('div');
        this.editorLayout.id = "jsoneditor";
        this.editorLayout.style.display = 'flex';
        this.editorLayout.style.width = '100%';
        this.editorLayout.style.height = '25vh';
        this.editorLayout.style.fontSize = '10';
        const editor: any = new JSONEditor(this.editorLayout, {
            theme: "bootstrap2",
            mode: "preview",
            statusBar: false,
            mainMenuBar: false
        });
        const initialJson = this.json;
        editor.set(initialJson);
    }

    override render() {
        this.renderJsonEditor();
        this.addEventListener('keydown', (e: Event) => {
            e.stopPropagation();
            e.stopImmediatePropagation();
            if ((<any>e).key == 'ArrowLeft') {
                e.preventDefault();
                (<any>e).composedPath()[0].setSelectionRange(
                    (<any>e).composedPath()[0].selectionStart - 1,
                    (<any>e).composedPath()[0].selectionStart - 1,
                );
            }
            if ((<any>e).key == 'ArrowRight') {
                e.preventDefault();
                (<any>e).composedPath()[0].setSelectionRange(
                    (<any>e).composedPath()[0].selectionStart + 1,
                    (<any>e).composedPath()[0].selectionStart + 1,
                );
            }
        });
        return html`
            <vaadin-vertical-layout style="width: 100%; height: 100%">
                ${this.editorLayout}
                <vaadin-horizontal-layout>
                    <vaadin-button
                            @click="${this.addHandler}"
                    >Edit ${this.itemName}
                    </vaadin-button>
                    <vaadin-button
                            @click="${this.deleteHandler}"
                    >Delete ${this.itemName}
                    </vaadin-button>
                </vaadin-horizontal-layout>
            </vaadin-vertical-layout>
            ${this.jsonDialog}
        `;
    }

    constructor(json?: string) {
        super();
        this.itemName = InnerLayouts.json;
        this.json = {};
        if (isStrNotEmpty(json)) {
            this.json = JSON.parse(json!);
        }
    }
}