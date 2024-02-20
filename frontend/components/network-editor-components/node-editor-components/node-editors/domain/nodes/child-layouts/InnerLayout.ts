import {css, html, LitElement} from 'lit';
import {state} from 'lit/decorators.js';

import {GridActiveItemChangedEvent, GridColumn, GridEventContext, GridItemModel} from "@vaadin/grid";
import {
    LdColumnDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdColumnDialog";

import {
    LdIndexDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdIndexDialog";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {
    LdKnotValueDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdKnotValueDialog";
import {VerticalLayout} from "@vaadin/vertical-layout";
import {
    LdJsonDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdJsonDialog";
import {unsafeCSS} from "@vaadin/vaadin-themable-mixin/register-styles";
import * as editorCss from "jsoneditor/dist/jsoneditor.min.css";


export class InnerLayout extends LitElement {


    @state()
    public items!: any[];

    @state()
    protected itemName!: string;

    @state()
    protected selectedItems: any[] = [];
    @state()
    protected deleteDisabled = true;

    @state()
    protected columnDialog: LdColumnDialog = new LdColumnDialog();
    @state()
    protected indexDialog: LdIndexDialog = new LdIndexDialog();
    @state()
    protected valueDialog: LdKnotValueDialog = new LdKnotValueDialog();
    @state()
    protected jsonDialog!: LdJsonDialog;


    protected isKnot: boolean = false;

    static get styles() {
        return [css`
        [slot="label"] {
            font-size: var(--lumo-font-size-s);
            font-family: sans-serif;     
        }
        .text-field-width{
            width: 100%;
            font-size: var(--lumo-font-size-s);
            font-family: sans-serif;   
        }
      `, unsafeCSS(editorCss.default.toString())];
    }


    protected initDialog = () => {

    }

    private responsiveStepsForGrid: FormLayoutResponsiveStep[] = [
        // Use one column by default
        // {minWidth: '150px', columns: 4},
        // {minWidth: '200px', columns: 3},
        // {minWidth: '400px', columns: 5},
    ];

    protected addHandler(): void {
        this.initDialog();
    }
    protected deleteHandler(): void {
        let selectedItemId = this.selectedItems[0].uid;
        selectedItemId = selectedItemId ? selectedItemId : this.selectedItems[0].id;
        this.items = this.items.filter(col => col.uid != selectedItemId && col.id != selectedItemId);
        this.deleteDisabled = true;
    }
    protected editHandler(model?: GridItemModel<any>): void {
        this.initDialog();
    }
    protected fillGrid = () => {
        const columns = [];
        if (this.items.length != 0) {
            for (let itemKey of Object.keys(this.items[0])) {
                let column;
                if (itemKey == 'id') {
                    column = html`
                        <vaadin-grid-column
                                width="5%"
                                path="${itemKey}"
                                .hidden="${!this.isKnot}"
                        >
                        </vaadin-grid-column>
                    `
                } else if (itemKey == 'layout') {
                    column = html`
                        <vaadin-grid-column
                                style="width: 100%"
                                path="${itemKey}"
                                hidden
                        >
                        </vaadin-grid-column>
                    `
                } else if (itemKey == "columns") {
                    column = html`
                        <vaadin-grid-column
                                path="${itemKey}"
                                .renderer="${
                                        (root: HTMLElement, column: GridColumn<any>, model: GridItemModel<any>) => {
                                            let editButton = root.firstElementChild;
                                            if (!editButton) {
                                                editButton = new VerticalLayout();
                                                (editButton as VerticalLayout).theme = 'spacing-xs padding'
                                                for (let column of model.item.columns?.column) {
                                                    const col = document.createElement('p');
                                                    col.textContent = column;
                                                    editButton.appendChild(col);
                                                }
                                                root.appendChild(editButton);
                                            }
                                        }
                                }"
                        >
                        </vaadin-grid-column>
                    `
                } else {
                    column = html`
                        <vaadin-grid-column
                                path="${itemKey}"
                        >
                        </vaadin-grid-column>
                    `
                }
                columns.push(column);
            }
        }
        return columns;
    }

    render() {
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
            if ((<any>e).composedPath()[0].className == 'jsoneditor-text') {
                if ((<any>e).key == '[' || (<any>e).key == ']' || (<any>e).key == '{' || (<any>e).key == '}') {
                    e.preventDefault();
                    const pos = (<any>e).composedPath()[0].selectionStart;
                    const value = (<any>e).composedPath()[0].value;
                    (<any>e).composedPath()[0].value = [value.slice(0, pos), (<any>e).key, value.slice(pos)].join('');
                    (<any>e).composedPath()[0].setSelectionRange(
                        pos + 1,
                        pos + 1,
                    );
                }
            }
        });
        return html`
            <vaadin-vertical-layout style="width: 100%; height: 100%">
                <vaadin-grid
                        style="width: 100%; height: 25vh"
                        .items="${this.items}"
                        .selectedItems="${this.selectedItems}"
                        @active-item-changed="${(e: GridActiveItemChangedEvent<any>) => {
                            const item = e.detail.value;
                            this.selectedItems = item ? [item] : [];
                            this.deleteDisabled = !(<any>e).detail.value;
                        }}"
                        @onkeydown="${(e: KeyboardEvent) => {
                            if (e.key == "Delete") {
                                e.stopImmediatePropagation();
                                // todo удаление элемента
                            }
                        }}"
                >
                    ${this.fillGrid()}
                    <vaadin-grid-column
                            frozen-to-end
                            auto-width
                            flex-grow="0"
                            .renderer="${
                                    (root: HTMLElement, column: GridColumn<any>, model: GridItemModel<any>) => {
                                        let editButton = root.firstElementChild;
                                        if (!editButton) {
                                            editButton = document.createElement('vaadin-button');
                                            editButton.textContent = "Edit";
                                            editButton.addEventListener('click', (evt) => {
                                                this.editHandler(model.item);
                                                evt.stopImmediatePropagation();
                                            });
                                            root.appendChild(editButton);
                                        }
                                    }
                            }"
                    >
                    </vaadin-grid-column>
                    <vaadin-tooltip slot="tooltip" .generator="${this.tooltipGenerator}"></vaadin-tooltip>
                </vaadin-grid>
                <vaadin-horizontal-layout theme="spacing-xs">
                    <vaadin-button
                            @click="${this.addHandler}"
                    >Add ${this.itemName}
                    </vaadin-button>
                    <vaadin-button
                            .disabled="${this.deleteDisabled}"
                            @click="${this.deleteHandler}"
                    >Delete ${this.itemName}
                    </vaadin-button>
                </vaadin-horizontal-layout>
            </vaadin-vertical-layout>
            ${this.columnDialog}
            ${this.indexDialog}
            ${this.valueDialog}
        `;
    }

    private tooltipGenerator = (context: GridEventContext<any>): string => {
        let text = '';

        const {column, item} = context;
        if (column && item) {
            text = item[column.path as string]
        }

        return text;
    };

}