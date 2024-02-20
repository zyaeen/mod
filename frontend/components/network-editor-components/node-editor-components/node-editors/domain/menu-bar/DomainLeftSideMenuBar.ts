import {customElement, property, state} from 'lit/decorators.js';
import {createTemplate} from "Frontend/icons/get-icons";

import {applyTheme} from "Frontend/generated/theme";
import {createItem} from "Frontend/components/network-editor-components/common/menu-bar/MenuBarItem";
import {LeanDiMenuBar} from "Frontend/components/network-editor-components/common/menu-bar/LeanDiMenuBar";
import "Frontend/events/ConnectionEvents";
import {ConnectionEvents} from "Frontend/events/ConnectionEvents";

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('left-side-menu-bar')
export class DomainLeftSideMenuBar extends LeanDiMenuBar {
    protected createRenderRoot() {
        const root = super.createRenderRoot();
        applyTheme(root);
        return root;
    }

    private anchorAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.ANCHOR_ADD});
    private attributeAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.ATTRIBUTE_ADD});
    private composedAttAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.ATTRIBUTE_COMPOSED_ADD});
    private historicalAttAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.ATTRIBUTE_HIS_ADD});
    private tieAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.TIE_ADD});
    private historicalTieAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.TIE_HIS_ADD});
    private anchoredTieAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.TIE_ANCHORED_ADD});
    private anchoredHistTieAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.TIE_HIS_ANCHORED_ADD});
    private tieSelfAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.TIE_SELF_ADD});
    private txAnchorAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.ANCHOR_TX_ADD});
    private knotAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.KNOT_ADD});
    private connectEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.CONNECT});
    private connectAnchorEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.CONNECT_ANCHOR});
    private connectTxAnchorEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.CONNECT_TX_ANCHOR});
    private connectTieAndTxAnchorEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.CONNECT_TIE_TX});
    private cdAnchorAddEvent = new CustomEvent<string>("add-node-event",{detail: ConnectionEvents.ANCHOR_CD_ADD});


    private anchorMenuBarItem = {component: createItem(this.onClickCallback, 'anchor-add', 'lean-di-icons', this.anchorAddEvent, 'Add Anchor')};
    private attributeMenuBarItem = {component: createItem(this.onClickCallback, 'attribute-add', 'lean-di-icons', this.attributeAddEvent, 'Add Attribute')};
    private composedAttributeMenuBarItem = {component: createItem(this.onClickCallback, 'attribute-composed-add', 'lean-di-icons', this.composedAttAddEvent, 'Add Cortege')};
    private historicalAttributeMenuBarItem = {component: createItem(this.onClickCallback, 'attribute-his-add', 'lean-di-icons', this.historicalAttAddEvent, 'Add Historical Attribute')};
    private tieMenuBarItem = {component: createItem(this.onClickCallback, 'tie-add', 'lean-di-icons', this.tieAddEvent, 'Add Tie')};
    private historicalTieMenuBarItem = {component: createItem(this.onClickCallback, 'tie-his-add', 'lean-di-icons', this.historicalTieAddEvent, 'Add Historical Tie')};
    private anchoredTieMenuBarItem = {component: createItem(this.onClickCallback, 'tie-a-add', 'lean-di-icons', this.anchoredTieAddEvent, 'Add Tie with Anchor')};
    private anchoredHistTieMenuBarItem = { component: createItem(this.onClickCallback, 'tie-his-a-add', 'lean-di-icons', this.anchoredHistTieAddEvent, 'Add Historical Tie with Anchor')};
    private tieSelfMenuBarItem = { component: createItem(this.onClickCallback, 'tie-self-add', 'lean-di-icons', this.tieSelfAddEvent, 'Add Self-Tie')};
    private txAnchorMenuBarItem = { component: createItem(this.onClickCallback, 'anchor-tx', 'lean-di-icons', this.txAnchorAddEvent, 'Add Transactional Anchor')};
    private knotMenuBarItem = { component: createItem(this.onClickCallback, 'knot', 'lean-di-icons', this.knotAddEvent, 'Add Knot')};
    private connectMenuBarItem = { component: createItem(this.onClickCallback, 'connect', 'lean-di-icons', this.connectEvent, 'Connect Chosen Nodes')};
    private connectAnchorMenuBarItem = { component: createItem(this.onClickCallback, 'connect', 'lean-di-icons', this.connectAnchorEvent, 'Connect Chosen Nodes')};
    private connectTxAnchorMenuBarItem = { component: createItem(this.onClickCallback, 'connect', 'lean-di-icons', this.connectTxAnchorEvent, 'Connect Chosen Nodes')};
    private connectTieAndTxAnchorMenuBarItem = { component: createItem(this.onClickCallback, 'connect', 'lean-di-icons', this.connectTieAndTxAnchorEvent, 'Connect Chosen Nodes')};
    private cdAnchorMenuBarItem = { component: createItem(this.onClickCallback, 'anchor-cd', 'lean-di-icons', this.cdAnchorAddEvent, 'Add Cross-Domain Anchor')};

    @state()
    public items = [this.anchorMenuBarItem];

    @property()
    private chosenNodeType = 0;

    @property()
    private itemSetView: {[element: number] : any[]} = {
        0: [
            this.anchorMenuBarItem,
            this.txAnchorMenuBarItem,
            this.knotMenuBarItem
        ],
        1: [
            this.attributeMenuBarItem,
            this.composedAttributeMenuBarItem,
            this.historicalAttributeMenuBarItem,
            this.anchoredTieMenuBarItem,
            this.anchoredHistTieMenuBarItem,
            this.txAnchorMenuBarItem,
            this.tieSelfMenuBarItem,
            this.cdAnchorMenuBarItem
        ],
        2: [this.anchorMenuBarItem],
        3: [],
        4: [],
        5: [
            this.attributeMenuBarItem,
            this.composedAttributeMenuBarItem,
            this.historicalAttributeMenuBarItem,
            this.anchorMenuBarItem,
            this.cdAnchorMenuBarItem
        ],
        6: [this.connectMenuBarItem],
        7: [
            this.tieMenuBarItem,
            this.anchoredTieMenuBarItem,
            this.historicalTieMenuBarItem,
            this.anchoredHistTieMenuBarItem,
            this.txAnchorMenuBarItem
        ],
        8: [this.connectAnchorMenuBarItem],
        9: [this.connectTxAnchorMenuBarItem],
        10: [this.connectTieAndTxAnchorMenuBarItem]

    }

    render() {
        this.items = this.itemSetView[this.chosenNodeType]
        return super.render();
    }
}