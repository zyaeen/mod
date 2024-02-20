import {html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {createTemplate} from "Frontend/icons/get-icons";
import {applyTheme} from "Frontend/generated/theme";
import {state} from "lit/decorators.js";
import {MenuBar} from "@vaadin/menu-bar";

const template = createTemplate();
document.head.appendChild(template.content);


export class LeanDiMenuBar extends LitElement {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    @property()
    protected domainColor!: string;

    protected onClickCallback = (event: CustomEvent<string>) => this.dispatchEvent(event);

    constructor() {
        super();
        this.defaultItems = [];
    }



    @state()
    protected defaultItems!: any[];
    @property()
    protected items!: any[];

    render() {
        return html`
            <vaadin-menu-bar
                    .items="${this.items}"
                    theme="icon"
                    style=" background-color: hsla(0, 0%, 100%, 0.3);"
            >
            </vaadin-menu-bar>
        `;

    }
}