import {DomainRenderer} from "Frontend/renderer/DomainRenderer";
import {NodeType} from "Frontend/enums/NodeType";
import {Network, Node} from "vis-network";
import {generateUid, randomColorFromArray} from "Frontend/utils/common";
import {Attribute, LeanDiNode} from "Frontend/interfaces/Interfaces";
import {
    anchorMnemonicList, attributeMnemonicList,
    createAnchorMnemonic,
    createAttributeMnemonic,
    createKnotMnemonic, knotMnemonicList,
} from "Frontend/utils/mnemonic-generator";
import {Identity} from "Frontend/enums/Identity";
import {DataRange} from "Frontend/enums/DataRange";
import {ANCHOR, ATTRIBUTE, KNOT, StringUtils, TX_ANCHOR} from "Frontend/enums/DefaultValues";

const setLabel = (node: any, nodeType: string) => {
    const uid = node.uid!.substring(0, 8);
    node.label += StringUtils.UNDERLINE + uid;
    node.descriptor += StringUtils.UNDERLINE + uid;
    node.description = "Description_of_" + StringUtils.UNDERLINE + nodeType + StringUtils.UNDERLINE + uid;
    return node;
}

export class DomainParser {
    private domainRenderer: DomainRenderer;

    constructor(domainRenderer: DomainRenderer) {
        this.domainRenderer = domainRenderer;
    }

    parseNodeMainData = (lastId: number | string, indexId: number, node: object | any, parentNode?: object | any) => {
        node['title'] = node['mnemonic']
        if (node['mnemonic'] == null) {
            node['id'] = lastId.toString();
            node['_id'] = null;
            node['mnemonic'] = lastId.toString();
        } else {
            node['_id'] = node['id'];
            if (parentNode != null) {
                node['id'] = node.uid.substring(0, 8);//parentNode['mnemonic'] + StringUtils.UNDERLINE + node['mnemonic'];
            } else {
                node['id'] = node['mnemonic']
            }
            // node['oldMnemonic'] = node['mnemonic'];
        }
        node['label'] = node['descriptor'];
        if (node['indexes'] != null && node['indexes']['index'] != null) {
            node.indexes = node.indexes.index;
        }
        if (node['items'] != null && node['items'].length != 0) {
            node['values'] = {
                value: node['items']['item']
            }
        }
        if (node.description != null){
            node.description = node.description.replace(/\s+/g, ' ').trim()
        }
        node['extendedColumn'] = node['extendedColumn'] ? node['extendedColumn'] : [];
        if (node['extendedColumn'] != null && node['extendedColumn'].length != 0) {
            node['extendedColumn'] = node['extendedColumn'].map((column: any) => this.addId(column, indexId++));
        }
        return node as LeanDiNode;
    }

    parseHost = (node: object | any) => {
        node['label'] = node ['host'];
        node['label'] = (node['dbType'] != null ? node['dbType'] + StringUtils.DOT : StringUtils.EMPTY_STRING) + node['label'];
        node['label'] = node['label'] + (node['port'] != null ? StringUtils.DOT + node['port'] : StringUtils.EMPTY_STRING) ;
        node['label'] = node['label'] + (node['dbName'] != null ? StringUtils.DOT + node['dbName'] : StringUtils.EMPTY_STRING);
        node['label'] = node['label'] + (node['folder'] != null ? StringUtils.DOT + node['folder'] : StringUtils.EMPTY_STRING) ;
        node['hostColor'] = randomColorFromArray();
        node['colored'] = false;
        return node;
    }

    parseNodeLayout = (node: object | any, motherNode?: object | any) => {
        if (motherNode != null && motherNode['layout'] != null) {
            node['fixed'] = false;
            node['x'] = motherNode['layout']["x"] * 2;
            node['y'] = motherNode['layout']["y"] * 2;
        } else {
            if (node['layout'] != null) {
                node['fixed'] = node['layout']["fixed"] === true;
                node['x'] = node['layout']["x"] * 2;
                node['y'] = node['layout']["y"] * 2;
            } else {
                node['fixed'] = false;
                node['x'] = 700;
                node['y'] = 700;
            }
        }
        return node as LeanDiNode;
    }

    fillAnchorFigure = (node: object | any) => {
        anchorMnemonicList.push(node['mnemonic']);
        node['_group'] = structuredClone(node['group']);
        delete node['group'];
        node['type'] = NodeType.ANCHOR;
        if (node['identity'] == null) {
            node['identity'] = Identity.BIGINT;
        }
        node = this.domainRenderer.renderAnchor(node);

        return node;
    }

    fillCdAnchorFigure = (node: object | any) => {
        anchorMnemonicList.push(node['mnemonic']);
        node['_group'] = structuredClone(node['group']);
        delete node['group'];
        node['type'] = NodeType.CD_ANCHOR;
        // for(let attr of node['attribute']){
        //     if(attr.columnName != null && attr.columnName != StringUtils.EMPTY_STRING){
        //         node['transactional'] = true;
        //         break;
        //     }
        // }
        if (node['identity'] == null) {
            node['identity'] = Identity.BIGINT;
        }
        node = this.domainRenderer.renderCdAnchor(node);

        return node;
    }

    fillTxAnchorFigure = (node: object | any) => {
        anchorMnemonicList.push(node['mnemonic']);
        node['_group'] = structuredClone(node['group']);
        delete node['group'];
        node['type'] = NodeType.TX_ANCHOR;
        if (node['identity'] == null) {
            node['identity'] = Identity.BIGINT;
        }
        node = this.domainRenderer.renderTxAnchor(node);
        return node;
    }

    fillAttributeFigure = (node: object | any, indexId: number) => {
        attributeMnemonicList.push(node['mnemonic']);
        node['type'] = NodeType.ATTRIBUTE;
        if (node['dataRange'] == null && node['knotRange'] == null) {
            node['dataRange'] = DataRange.BIGINT;
        }
        // if (node['json'] == null) {
        //     node['json'] = "{}";
        // }
        node = this.domainRenderer.switchRender(node);
        return node;
    }

    addId = (column: any, indexId: number) => {
        column['id'] = (indexId).toString();
        return column;
    }

    fillKnotFigure = (node: object | any) => {
        knotMnemonicList.push(node['mnemonic']);
        node = this.domainRenderer.renderKnot(node);
        node['type'] = NodeType.KNOT;
        if (node['identity'] == null) {
            node['identity'] = Identity.BIGINT;
        }
        if (node['dataRange'] == null) {
            node['dataRange'] = DataRange.STRING;
        }
        return node;
    }

    fillTieFigure = (node: object | any) => {
        node['type'] = NodeType.TIE;
        if (node["timeRange"] != null) {
            // this.historicalTies.push(node["id"]);
            node = this.domainRenderer.renderHistoricalTie(node);
        } else {
            node = this.domainRenderer.renderTie(node);
        }
        node.label = " ";
        return node;
    }

    createAttributeNodeTemplate = (network: Network, activeNode: Node) => {
        let mnemonic = createAttributeMnemonic();
        let node: Attribute = {
            "id": network.getSelectedNodes()[0].toString() + StringUtils.UNDERLINE + mnemonic,
            "label": ATTRIBUTE,
            "descriptor": ATTRIBUTE,
            "description": ATTRIBUTE,
            "mnemonic": mnemonic,
            "type": NodeType.ATTRIBUTE,
            "x": activeNode!.x,
            "y": activeNode!.y,
            "fixed": false,
            "knotRange": null,
            "json": null,
            // "oldMnemonic": mnemonic,
            "uid": generateUid()
        }
        node = setLabel(node, ATTRIBUTE);
        return node;
    }

    createTieNodeTemplate = (lastId: number, activeNode: Node) => {
        let mnemonic = lastId.toString();
        let node = {
            "id": mnemonic,
            "label": null,
            "descriptor": null,
            "type": NodeType.TIE,
            "x": activeNode!.x,
            "y": activeNode!.y,
            "fixed": false,
            "uid": generateUid(),
            "extendedColumn": [],
            "isNew": true,
            "description": "Description of Tie "
        }
        node.description += node.uid.substring(0, 8);
        return node;
    }

    createTxAnchorNodeTemplate = (lastId: number, viewPosition: any) => {
        let mnemonic = createAnchorMnemonic();
        let node: LeanDiNode = {
            "id": mnemonic,
            "label": TX_ANCHOR,
            "descriptor": TX_ANCHOR,
            "mnemonic": mnemonic,
            "type": NodeType.TX_ANCHOR,
            "fixed": false,
            "uid": generateUid(),
            "extendedColumn": [],
            "isNew": true,
            "attribute": [],
            'identity': Identity.BIGINT,
        }
        if (viewPosition != null) {
            node['x'] = viewPosition!.x;
            node['y'] = viewPosition!.y;
        }
        node = setLabel(node, TX_ANCHOR);
        return node;
    }

    createCdAnchorNodeTemplate = (viewPosition: any, detail: any) => {
        let mnemonic = createAnchorMnemonic();
        let node: LeanDiNode = {
            "id": mnemonic,
            "label": detail.anchor.split(StringUtils.UNDERLINE)[1],
            "descriptor": detail.anchor.split(StringUtils.UNDERLINE)[1],
            "description": "Кросс-доменный анкер, связанный с анкером " + detail.anchor + " домена " + detail.domain,
            "mnemonic": mnemonic,
            "type": NodeType.CD_ANCHOR,
            "fixed": false,
            "attribute": [],
            // "oldMnemonic": mnemonic,
            "isNew": true,
            "uid": generateUid(),
            "extendedColumn": [],
            'identity': Identity.BIGINT
        }
        if (viewPosition != null) {
            node['x'] = viewPosition!.x;
            node['y'] = viewPosition!.y;
        }
        return node
    }

    createAnchorNodeTemplate = (viewPosition: any) => {
        let mnemonic = createAnchorMnemonic();
        let node: LeanDiNode = {
            "id": mnemonic,
            "label": ANCHOR,
            "descriptor": ANCHOR,
            "mnemonic": mnemonic,
            "type": NodeType.ANCHOR,
            "fixed": false,
            "attribute": [],
            // "oldMnemonic": mnemonic,
            "isNew": true,
            "uid": generateUid(),
            "extendedColumn": [],
            'identity': Identity.BIGINT
        }
        if (viewPosition != null) {
            node['x'] = viewPosition!.x;
            node['y'] = viewPosition!.y;
        }
        node = setLabel(node, ANCHOR);
        return node
    }

    createKnotNodeTemplate = (activeNode?: Node, coordinates?: any) => {
        let mnemonic = createKnotMnemonic();
        let node = {
            "id": mnemonic,
            "label": KNOT,
            "descriptor": KNOT,
            "mnemonic": mnemonic,
            "type": NodeType.KNOT,
            "x": activeNode? activeNode.x : coordinates.x,
            "y": activeNode? activeNode.y : coordinates.y,
            "fixed": false,
            "knotRole": null,
            "values": {value: []},
            "identity": Identity.BIGINT,
            "skip": false,
            "deprecated": false,

            "isNew": true,
            "uid": generateUid()
        }
        node = setLabel(node, KNOT);
        return node
    }

}
