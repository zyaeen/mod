import {html} from 'lit';

import '@vaadin/button';
import '@vaadin/dialog';
import '@vaadin/text-field';
import '@vaadin/vertical-layout';
import '@vaadin/grid/vaadin-grid-filter';
import {FormLayout, FormLayoutResponsiveStep} from "@vaadin/form-layout";
import '@vaadin/grid/vaadin-grid-selection-column'
import '@vaadin/grid/vaadin-grid-filter-column'
import {
    NodeEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/NodeEditorDialog";
import {TemplateResult} from "lit/development";
import {isArrayNotEmpty} from "Frontend/utils/common";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdColumnDialog";
import {state} from "lit/decorators.js";
import {LeanDiNode} from "Frontend/interfaces/Interfaces";
import {GridColumn, GridItemModel} from "@vaadin/grid";
import {NodeType} from "Frontend/enums/NodeType";
import {StringUtils} from "Frontend/enums/DefaultValues";

export class HostEditorDialog extends NodeEditorDialog {
    // private columnDialog!: LdColumnDialog;


    @state()
    protected items: any[] = [];

    private responsiveStepsForGrid: FormLayoutResponsiveStep[] = [
        // Use one column by default
        {minWidth: 0, columns: 1},
        {minWidth: '320px', columns: 4},
        {minWidth: '500px', columns: 6},
        {minWidth: '500px', columns: 10},
    ];

    protected renderTabsLayout = (knots: string[]) => {
        this.parseItems();
        return html`
            <vaadin-vertical-layout style="width: 100%" colspan="5">
                <vaadin-tabs
                        .selected="0"
                        style="width: 100%"
                        theme="equal-width-tabs"
                >
                    <vaadin-tab
                            class="text-field-width"
                    >Domains
                    </vaadin-tab>
                </vaadin-tabs>
                <vaadin-vertical-layout style="width: 100%; height: 100%">
                    <vaadin-grid
                            style="width: 100%; height: 25vh"
                            .items="${this.items}"
                    >
                        <vaadin-grid-column
                                path="shortName"
                                width="20%"
                        >
                        </vaadin-grid-column>
                        <vaadin-grid-column
                                path="items"
                                width="80%"
                                .renderer="${(root: HTMLElement, column: GridColumn<any>, model: GridItemModel<any>) => {
                                    let buttonsLayout = root.firstElementChild;
                                    column.width = '80%'
                                    if (!buttonsLayout) {
                                        buttonsLayout = new FormLayout();
                                        (buttonsLayout as FormLayout).responsiveSteps = this.responsiveStepsForGrid;
                                        (buttonsLayout as FormLayout).theme = 'spacing-xs padding'
                                        for (let item of model.item.items) {
                                            let fqnButton = document.createElement('vaadin-button');
                                            fqnButton.id = item.fqn;
                                            fqnButton.textContent = item.fqn
                                            fqnButton.addEventListener('click', (evt) => {
                                                evt.stopImmediatePropagation();
                                                this.dispatchEvent(new CustomEvent('redirect-to-domain',
                                                        {
                                                            detail: model.item.shortName + StringUtils.COMMA + item.fqn.replace(StringUtils.DOT, StringUtils.UNDERLINE)
                                                        }
                                                ));
                                            });
                                            fqnButton.setAttribute('title', 'Jump to Node ' + item.fqn + ' in Domain '
                                                    + model.item.shortName);
                                            buttonsLayout.appendChild(fqnButton);
                                        }
                                        root.appendChild(buttonsLayout);
                                    }
                                }}"
                        >
                        </vaadin-grid-column>
                        <vaadin-tooltip slot="tooltip"></vaadin-tooltip>
                    </vaadin-grid>
                </vaadin-vertical-layout>
            </vaadin-vertical-layout>

        `
    }

    render(): TemplateResult<1> {
        return super.render();
    }

    private parseItems() {
        let items = [];
        if (isArrayNotEmpty(this.node.domain)) {
            for (let domain of this.node.domain!) {
                items.push({
                    shortName: domain.shortName,
                    items: domain.item
                });
            }
        }
        this.items = items;
    }

    protected override renderFooter = () => html`
        <vaadin-button
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

}
