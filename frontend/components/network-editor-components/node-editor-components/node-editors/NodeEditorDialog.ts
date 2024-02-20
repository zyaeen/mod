import {css, html, LitElement} from 'lit';
import {property, state} from 'lit/decorators.js';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid/vaadin-grid-filter';

import {dialogFooterRenderer, dialogHeaderRenderer, dialogRenderer} from '@vaadin/dialog/lit.js';
import type {DialogOpenedChangedEvent} from '@vaadin/dialog';
import {applyTheme} from 'Frontend/generated/theme';
import {FormLayoutResponsiveStep} from "@vaadin/form-layout";
import {LeanDiNode} from "Frontend/interfaces/Interfaces";
import '@vaadin/grid/vaadin-grid-selection-column'
import '@vaadin/grid/vaadin-grid-filter-column'
import {TabsLayout} from "Frontend/components/network-editor-components/node-editor-components/node-editors/TabsLayout";
import {DataRange} from "Frontend/enums/DataRange";
import {NodeType} from "Frontend/enums/NodeType";
import {NodeKeys} from "Frontend/enums/NodeKeys";
import {isArrayNotEmpty, isObjectNotEmpty, isStrNotEmpty} from "Frontend/utils/common";
import {LdEventTarget} from "Frontend/events/LdEventTarget";
import {event} from "Frontend/events/LdEvents";
import {sheetType, SheetType} from "Frontend/enums/SheetType";
import {StringUtils} from "Frontend/enums/DefaultValues";

export class NodeEditorDialog extends LitElement {

    static get styles() {
        return css`
        [slot="label"] {
            font-size: var(--lumo-font-size-s);
            font-family: sans-serif;     
        }
        .text-field-width{
            width: 100%;
            font-size: var(--lumo-font-size-s);
            font-family: sans-serif;   
        }
      `
    }

    private selectedSheet: SheetType | null = null;

    @state()
    protected isNumeric!: boolean;
    @state()
    protected isLongable!: boolean;
    @state()
    protected isMnemonicValid!: boolean;
    @state()
    protected isDescriptorValid!: boolean;

    protected setNumericOrNullable() {
        if (this.node.dataRange == DataRange.NUMERIC) {
            this.isNumeric = true;
            this.node!.length = undefined;
            this.node!.precision = '1';
            this.node!.scale = '0';
        } else {
            this.node!.length = undefined;
            this.node!.precision = undefined;
            this.node!.scale = undefined;
            this.isNumeric = false;
        }
        if (this.node.dataRange == DataRange.STRING
            || this.node.dataRange == DataRange.BIGINT) {
            this.isLongable = true;
            this.node!.length = '64';
            this.node!.precision = undefined;
            this.node!.scale = undefined;
        } else {
            this.isLongable = false;
        }
    }

    protected replaceDataRangeInextendedColumn() {
        if (isArrayNotEmpty(this.node.extendedColumn)) {
            for (let column of this.node.extendedColumn!) {
                if (isStrNotEmpty(column.knotRange)) {
                    column.knotRange = null;
                    column.dataRange = DataRange.BIGINT;
                }
            }
        }
    }




    protected replaceColumnInAssociatedIndexes(oldColumnName: string, newColumnName?: string) {
        if (isArrayNotEmpty(this.node.indexes)) {
            const indexes = [];
            for (let idx of this.node.indexes!) {
                let columnToRemove!: string;
                for (let colIndex = 0; colIndex < idx.columns.column.length; colIndex++) {
                    const [curColumnName, colOrder] = idx.columns.column[colIndex].split(" ");
                    if (oldColumnName == curColumnName) {
                        if (isStrNotEmpty(newColumnName)) {
                            idx.columns.column[colIndex] = newColumnName + " " + colOrder;
                        } else {
                            delete idx.columns.column[colIndex];
                        }
                    }
                }
                idx.columns.column = idx.columns.column.filter(col => isObjectNotEmpty(col));
                if (isArrayNotEmpty(idx.columns.column)) {
                    indexes.push(idx);
                }
                this.node.indexes = indexes;
            }
            this.renderDialog();
        }
    }


    @state()
    protected node: LeanDiNode = {};
    @property()
    protected knots!: string[];
    @property()
    protected descriptors!: string[];
    @property()
    protected mnemonics!: string[];

    protected dialogTitle!: string;

    @property()
    protected tabsLayout!: TabsLayout;

    protected initTabsLayout = () => {
        this.tabsLayout = new TabsLayout(this.node);
        this.tabsLayout.style.width = '100%';
        this.tabsLayout.style.alignItems = 'center';
        this.tabsLayout.addEventListener(LdEventTarget.UPDATE_INDEX_COLUMN, (e: Event) => {
           const [oldColumnName, newColumnName] = event(e).detail;
           this.replaceColumnInAssociatedIndexes(oldColumnName.toUpperCase(), newColumnName.toUpperCase());
        });
        this.tabsLayout.addEventListener(LdEventTarget.DELETE_INDEX_COLUMN, (e: Event) => {
            const oldColumnName = event(e).detail;
            this.replaceColumnInAssociatedIndexes(oldColumnName.toUpperCase());
        });
        this.tabsLayout.addEventListener(LdEventTarget.EDIT_JSON, (e: Event) => {
            const jsonValue = event(e).detail;
            if (isObjectNotEmpty(jsonValue)) {
                this.node.dataRange = DataRange.JSON;
                this.node.knotRange = null;
            }
            this.requestUpdate();
        });
    }

    public setKnots(knots: string[]) {
        this.knots = knots;
    }

    public setFqn(fqn: (string[])[]) {
        [this.descriptors, this.mnemonics] = fqn;
    }

    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    @state()
    private dialogOpened = false;

    public open(node: LeanDiNode) {
        this.node = node != null ? node : {} as LeanDiNode;
        this.validateEmptyStrings();
        this.switchTitle();
        this.dialogOpened = true;
    }

    public setNode(node: LeanDiNode) {
        this.node = node;
    }

    protected responsiveSteps: FormLayoutResponsiveStep[] = [
        {minWidth: '40px', columns: 7}
    ];

    protected renderMetaLayout = () => html``;
    protected renderTabsLayout = (knots: string[]) => html``;


    protected switchTitle() {
        this.dialogTitle = StringUtils.EMPTY_STRING;
    }

    render() {
        this.setNumericOrNullable();
        this.onclick = () => {

        }
        return html`
            <vaadin-dialog
                    theme="editor-dialog"
                    modeless
                    draggable
                    no-close-on-outside-click="${true}"
                    header-title="${this.dialogTitle}"
                    .opened="${this.dialogOpened}"
                    @opened-changed="${(e: DialogOpenedChangedEvent) => (this.dialogOpened = e.detail.value)}"
                    ${dialogRenderer(this.renderDialog, [this.node, this.isNumeric,
                        this.isLongable, this.isMnemonicValid, this.isDescriptorValid,
                        this.node.dataRange, this.node.knotRange, this.node.knotRole,
                        this.node.indexes, this.node.json, this.node.dbType,
                        this.node.precision, this.node.length, this.node.scale
                    ])}
                    ${dialogFooterRenderer(this.renderFooter, [])}
                    ${dialogHeaderRenderer(
                            () => html`
                                <vaadin-button theme="tertiary" @click="${this.close}">
                                    <vaadin-icon icon="lumo:cross"></vaadin-icon>
                                </vaadin-button>
                            `,
                            []
                    )}
            >
            </vaadin-dialog>
        `;
    }

    private renderDialog = () => html`
        <vaadin-form-layout
                style="width: 95vw; height: 100%; border: none; outline: none;"
                .responsiveSteps="${this.responsiveSteps}"
                @click="${() => this.save}"

        >
            ${this.renderMetaLayout()}
            ${this.renderTabsLayout(this.knots)}
        </vaadin-form-layout>

    `;

    protected renderFooter = () => html`
        <vaadin-button
                ?disabled="${(!this.isDescriptorValid || !this.isMnemonicValid) && this.node.type != NodeType.TIE}"
                theme="primary"
                @click="${() => {
                    this.save();
                    // this.close();
                }}">Save
        </vaadin-button>
        <vaadin-button @click="${() => {
            this.close();
        }}">Cancel
        </vaadin-button>
    `;

    public save() {
        this.validateEmptyStrings();
        this.dispatchEvent(new CustomEvent('edit-node', {detail: this.node}));
    }

    private validateEmptyStrings() {
        for (let key of Object.values(NodeKeys)) {
            if (this.node[key] == StringUtils.EMPTY_STRING) {
                this.node[key] = null;
            }
        }
    }

    public close() {
        this.dialogOpened = false;
        sheetType[0] = SheetType.COLUMN;
    }

    public isOpen() {
        this.renderDialog();
        return this.dialogOpened;
    }

}
