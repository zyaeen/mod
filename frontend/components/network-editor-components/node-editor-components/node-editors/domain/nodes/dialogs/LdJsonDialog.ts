import {css, html} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import {LdCreationDialog} from "Frontend/components/network-editor-components/common/dialogs/LdCreationDialog";
import {TemplateResult} from "lit/development";
import {extendedColumn} from "Frontend/interfaces/Interfaces";
import {isObjectNotEmpty} from "Frontend/utils/common";
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {InnerLayouts} from "Frontend/enums/InnerLayouts";
import {saveColumnEvent, saveJsonEvent} from "Frontend/events/LdEvents";
import JSONEditor from "jsoneditor";
import {VerticalLayout} from "@vaadin/vertical-layout";
import {unsafeCSS} from "@vaadin/vaadin-themable-mixin/register-styles";
import * as editorCss from "jsoneditor/dist/jsoneditor.min.css";

@customElement('ld-json-dialog')
export class LdJsonDialog extends LdCreationDialog {

    private editorLayout!: HTMLDivElement;

    private jsonDisabled: boolean = false;
    private jsonText: string = "{}";

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

    private json!: any;

    private renderJsonEditor = () => {
        this.editorLayout = document.createElement('div');
        this.editorLayout.id = "jsoneditor";
        this.editorLayout.style.display = 'flex';
        this.editorLayout.style.width = '40vw';
        this.editorLayout.style.height = '50vh';
        this.editorLayout.style.fontSize = '10';
        const editor: any = new JSONEditor(this.editorLayout, {
            theme: "bootstrap2",
            mode: "text",
            enableSort: false,
            enableTransform: false,
            // mainMenuBar: false,
            onValidationError: (e: any) => {
                this.jsonDisabled = e.length != 0;
            },
            onChangeText: (e: any) => {
                this.jsonText = e;
            },
        });
        const initialJson = this.json;
        editor.set(initialJson);
    }

    public override open = (json?: any): void => {
        this.json = {};
        this.json = {} as extendedColumn;
        this.jsonText = "{}";
        if (isObjectNotEmpty(json)) {
            this.json = json;
            this.jsonText = JSON.stringify(json);
            this.toEdit = true;
            this.dialogTitle = 'Edit ' + InnerLayouts.json;
        } else {
            this.toEdit = false;
            this.dialogTitle = 'Create ' + InnerLayouts.json;
        }
        this.dialogOpened = true;
    }

    render(): TemplateResult<1> {
        this.dependencies = this.dependencies.concat();
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
        this.setRenderer(this.renderDialog, this.renderFooter);
        return super.render();
    }



    private renderDialog = () => {
        this.renderJsonEditor();
        return html`
            ${this.editorLayout}
        `;
    }

    private validateFields = () => {
        // this.isJsonValid = isStrNotEmpty(this.json) &&
        //     (isStrNotEmpty(this.json) || isStrNotEmpty(this.json.knotRange));
    }

    private renderFooter = () => html`
        <vaadin-button
                theme="primary"
                @click="${() => {
                    if (!this.jsonDisabled) {
                        this.dispatchEvent(saveJsonEvent(this.jsonText));
                        this.close();
                    }
                }}"
        >Save
        </vaadin-button>
        <vaadin-button @click="${this.close}">Cancel
        </vaadin-button>
    `;


}
