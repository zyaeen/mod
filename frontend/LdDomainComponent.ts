import {css, html, LitElement, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {createTemplate} from "Frontend/icons/get-icons";
import {Edge, IdType, Network, Node} from "vis-network";
import {DataSet} from "vis-data";

import '@vaadin/vertical-layout';
import '@vaadin/form-layout';
import '@vaadin/checkbox';
import '@vaadin/horizontal-layout';
import '@vaadin/tabsheet';
import '@vaadin/button';
import '@vaadin/tabs';
import '@vaadin/text-area';
import '@vaadin/menu-bar';

import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/LdColumnDialog";

import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/menu-bar/DomainLeftSideMenuBar";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/menu-bar/DomainRightSideMenuBar";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/menu-bar/PropertiesMenuBar";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/menu-bar/RightPluginBar";

import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/areas-and-hosts/AreasListBox";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/areas-and-hosts/HostsListBox";

import {
    DomainNavigationBar
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/menu-bar/DomainNavigationBar";

import {DomainRenderer} from "Frontend/renderer/DomainRenderer";

import {NodeType} from "Frontend/enums/NodeType";
import {Id} from "vis-network/declarations/network/modules/components/edges";

import {
    copy,
    getDifferenceInEdges,
    getDifferenceInEdgesByKeys,
    getDifferenceInHostsByKeys,
    getDifferenceInNodes,
    getDifferenceInNodesByKeys,
    UndoRedoStructure
} from "Frontend/undo-redo/UndoRedoStructure";
import {FullItem} from "vis-data/declarations/data-interface";

import {
    mapArea,
    mapNodeToAnchor,
    mapNodeToCdAnchor,
    mapNodeToKnot,
    mapNodeToTie,
    mapNodeToTxAnchor,
    mapToConnexion
} from "Frontend/interfaces/Mappers";

import {DataRange} from "Frontend/enums/DataRange";
import {ConnectionType} from "Frontend/enums/ConnectionType";
import {
    Anchor,
    AnchorRole,
    Area,
    Attribute,
    CdAnchor,
    Connexion,
    DbHost,
    Knot,
    KnotRole,
    LeanDiEdge,
    LeanDiNode,
    Tie,
    TxAnchor,
} from "Frontend/interfaces/Interfaces";
import {DomainParser} from "Frontend/node-parsing/DomainParser";
import {createAnchorMnemonic} from "Frontend/utils/mnemonic-generator";
import {SaveDialog} from "Frontend/components/network-editor-components/common/dialogs/SaveDialog";


import {canvas2svg} from 'Frontend/canvas-2-svg/canvas2svg.js';
import {
    createDefaultextendedColumn,
    createDefaultTieRole,
    generateUid,
    getCenter,
    getNewFileHandle, getRoleAndIdentifier, isArrayEmpty,
    isArrayNotEmpty,
    isObjectNotEmpty,
    isStrEmpty,
    isStrNotEmpty,
} from "Frontend/utils/common";
import {DialogType} from "Frontend/enums/DialogType";
import {
    GroupDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/properties/GroupDialog";
import {
    PropertiesDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/properties/PropertiesDialog";
import {
    AnchorPropertiesDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/properties/AnchorPropertiesDialog";
import {
    CdAnchorCreationDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/dialogs/CdAnchorCreationDialog";
import {
    AreaDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/areas-and-hosts/AreaDialog";
import {
    NodeEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/NodeEditorDialog";
import {
    AnchorEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/AnchorEditorDialog";
import {
    AttributeEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/AttributeEditorDialog";
import {
    TieEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/TieEditorDialog";
import {
    TxAnchorEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/TxAnchorEditorDialog";
import {
    KnotEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/KnotEditorDialog";
import {
    CdAnchorEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/nodes/CdAnchorEditorDialog";

import {event} from "Frontend/events/LdEvents";
import {NodeKeys} from "Frontend/enums/NodeKeys";
import {Arrow, DefaultValues, StringUtils} from "Frontend/enums/DefaultValues";
import {LdEventTarget} from "Frontend/events/LdEventTarget";
import {
    BLACK,
    DEFAULT_FONT_COLOR,
    DEFAULT_NODE_COLOR,
    DEFAULT_SELECTED_EDGE_COLOR,
    WHITE
} from "Frontend/components/network-editor-components/common/ColorPicker";
import {
    RoleEditor
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/edges/RoleEditor";

canvas2svg();

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('ld-domain')
export class LdDomainComponent extends LitElement {

    @state()
    private tooltipOpened = false;
    @state()
    private tooltipText: string = StringUtils.EMPTY_STRING;
    @state()
    private tooltipLeft: string = StringUtils.EMPTY_STRING;
    @state()
    private tooltipTop: string = StringUtils.EMPTY_STRING;

    static get styles() {
        return css`
      
      :focus {
        outline: none;
      }  
         
      .text-field-width{
        width: 100%;
      }

      [slot="label"] {
        font-size: medium;
        font-weight: normal ;
      }
      [theme="spacing-padding"] {
        height: 350px;
        width: 100%;
        padding-top: 0;
      }
      [theme="spacing-xs padding"]{
        padding-top: 0;
                height: 350px;

      }
         
       #customId {
        padding: 0;
        width: 99vw;
        margin: 0;
        
      }
      #bottomPanel {
        z-index: 2; 
        left: 20px;
        bottom: 15px;
        width: 98%;
        background-color: white; 
        border-style: solid; 
        border-color:  #f4f4f4; 
        border-radius: 3px;
        border-width: 1px;
      }
      #customId::-webkit-scrollbar {
        width: 15px;
        background-color: #f4f4f4;
        border-radius: 5px;
      }
      #customId::-webkit-scrollbar-thumb {
        width: 15px;
        background-color: #dbdbdb;
        border-radius: 5px;
      }
  
`;
    }

    private getAllNodes = () => {
        return this.nodeDataSet.get();
    }
    private getAllEdges = () => {
        return this.edgeDataSet.get();
    }
    private getNodesByType = (type: NodeType, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.type == type,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        }) as LeanDiNode[];
    }
    private getNodeByUid = (uid: string) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.uid == uid
        })[0] as LeanDiNode;
    }

    private getNodeByMnemonic = (mnemonic: string, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.uid == mnemonic,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        })[0] as LeanDiNode;
    }

    private getNodeIdByMnemonic = (mnemonic: string) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.mnemonic == mnemonic,
            fields: [NodeKeys.ID]
        })[0].id as string;
    }

    private getAnchorByMnemonic = (mnemonic: string, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.mnemonic == mnemonic && node.type == NodeType.ANCHOR,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        })[0] as LeanDiNode;
    }
    private getTieById = (id: string, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.id == id && node.type == NodeType.TIE,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        })[0] as LeanDiNode;
    }
    private getKnotByMnemonic = (mnemonic: string, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.mnemonic == mnemonic && node.type == NodeType.KNOT,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        })[0] as LeanDiNode;
    }
    private getAttributesByMnemonic = (mnemonic: string, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.mnemonic == mnemonic && node.type == NodeType.ANCHOR,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        }) as LeanDiNode[];
    }
    private getTxAnchorByMnemonic = (mnemonic: string, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.mnemonic == mnemonic && node.type == NodeType.TX_ANCHOR,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        })[0] as LeanDiNode;
    }
    private getCdAnchorByMnemonic = (mnemonic: string, ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.mnemonic == mnemonic && node.type == NodeType.CD_ANCHOR,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        })[0] as LeanDiNode;
    }

    private getAnchorsNodes = () => {
        return this.getNodesByType(NodeType.ANCHOR);
    }
    private getAttributesNodes = () => {
        return this.getNodesByType(NodeType.ATTRIBUTE);
    }
    private getTiesNodes = () => {
        return this.getNodesByType(NodeType.TIE);
    }
    private getKnotsNodes = () => {
        return this.getNodesByType(NodeType.KNOT);
    }
    private getTxNodes = () => {
        return this.getNodesByType(NodeType.TX_ANCHOR);
    }
    private getCdNodes = () => {
        return this.getNodesByType(NodeType.CD_ANCHOR);
    }

    private getNodesByIds = (type: NodeType, ids: string[], ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get(ids, {
            filter: (node: LeanDiNode) => node.type == type,
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        }) as LeanDiNode[];
    }

    private getNodesOfDifferentTypesByIds = (type: NodeType[], ids: string[], ...fields: NodeKeys[]) => {
        return this.nodeDataSet.get(ids, {
            filter: (node: LeanDiNode) => {
                for (let t of type) {
                    if (t == node.type) {
                        return true;
                    }
                }
                return false;
            },
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        }) as LeanDiNode[];
    }

    private getConnectedAnchors = (id: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        return this.getNodesByIds(NodeType.ANCHOR, connectedIds, ...fields);
    }
    private getConnectedTxAnchors = (id: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        return this.getNodesByIds(NodeType.TX_ANCHOR, connectedIds, ...fields);
    }
    private getConnectedAnchorsAndTxAnchors = (id: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        return this.getNodesOfDifferentTypesByIds([NodeType.TX_ANCHOR, NodeType.ANCHOR], connectedIds, ...fields);
    }
    private getConnectedCdAnchors = (id: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        return this.getNodesByIds(NodeType.CD_ANCHOR, connectedIds, ...fields);
    }
    private getConnectedTies = (id: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        return this.getNodesByIds(NodeType.TIE, connectedIds, ...fields);
    }
    private getConnectedAttributes = (id: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        return this.getNodesByIds(NodeType.ATTRIBUTE, connectedIds, ...fields);
    }
    private getConnectedKnots = (id: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        return this.getNodesByIds(NodeType.KNOT, connectedIds, ...fields);
    }
    private getConnectedKnotByMnemonic = (id: string, mnemonic: string, ...fields: NodeKeys[]) => {
        const connectedIds = this.network.getConnectedNodes(id) as string[];
        const knots = this.getNodesByIds(NodeType.KNOT, connectedIds, ...fields, NodeKeys.MNEMONIC)
            .filter((node: LeanDiNode) => node.mnemonic == mnemonic);
        return knots.length == 0 ? null : knots[0];
    }

    private getSelectedNodes(...fields: NodeKeys[]) {
        return this.nodeDataSet.get(this.network.getSelectedNodes(), {
            fields: fields != null && fields.length != 0 ? [...fields] : [...Object.values(NodeKeys)]
        }) as LeanDiNode[];
    }

    private doMarshall = false;

    private expanded: boolean = false;

    private domains: { [index: string]: string[] } = {};
    private connexions: any[] = [];

    @state()
    private roleEditor: RoleEditor = new RoleEditor();// EdgeEditorDialog = new EdgeEditorDialog();
    @state()
    private saveDialog: SaveDialog = new SaveDialog();


    private groupDialog = new GroupDialog();
    private propertiesDialog = new PropertiesDialog();
    private anchorPropertiesDialog = new AnchorPropertiesDialog();


    @state()
    private cdAnchorCreationDialog = new CdAnchorCreationDialog();

    private isNewTree: boolean = false;

    @property()
    private domainColor: string = DEFAULT_NODE_COLOR;
    private chosenEdgeColor: string = DEFAULT_SELECTED_EDGE_COLOR;

    private hosts: any[] = [];
    private referenceHosts: any[] = [];
    private itemsToAdd: any[] = [];
    private itemsToDelete: any[] = []
    private groups: any[] = [];
    private properties: any[] = [];

    private domainRenderer: DomainRenderer =
        new DomainRenderer(
            this.domainColor, //"#f66",
            WHITE
        );

    @state()
    private areas: any[] = [];

    private MIN_ZOOM = 0.2
    private MAX_ZOOM = 2.0
    private lastZoomPosition = {x: 0, y: 0}

    private domainParser: DomainParser = new DomainParser(this.domainRenderer);

    @property()
    private edgeList: Edge[] = [];

    @state()
    private knots!: string[];

    @property()
    private eventsInitialized = false;

    @state()
    private nodeDataSet = new DataSet<Node>([]);
    @state()
    private edgeDataSet = new DataSet<Edge>([]);

    @property()
    private lastId = 1000;

    @property()
    private indexId = 3000;

    @property()
    private edgeId = 5000;

    private scale = 1;

    @property()
    private layoutHeight = '97';
    @property()
    private layoutWidth = '120';
    @property()
    private activeNode: LeanDiNode | null = null;
    @property()
    private activeEdge: Edge | null = null;
    @property()
    private activeTxAnchors: string[] = []

    private activeFieldName: string | null = null;

    private domainShortName!: string;

    @state()
    private foundNodes!: any[];

    @property()
    private pinAll = false;

    private labeledAll = false;

    private oldKnotDataRange: string | null = null;

    @state()
    private buffered: boolean = false;

    @state()
    private fixedNodes: string[] = [];

    @state()
    private network!: Network;


    private undoRedo = new UndoRedoStructure();

    private history!: {
        past: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[], hosts?: any[], areas?: any[] }[],
        current: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[], hosts?: any[], areas?: any[] } | null,
        future: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[], hosts?: any[], areas?: any[] }[],
    };

    private $server?: VisJsComponentServerInterface;

    private anchorsToDelete: string[] = []
    private tiesToDelete: string[] = []
    private knotsToDelete: string[] = []
    private attributesToDelete: string[] = []
    private txAnchorsToDelete: string[] = []
    private cdAnchorsToDelete: string[] = []

    private connexionsToDelete: string[] = [];

    @state()
    private nodeEditor!: NodeEditorDialog;

    @state()
    private areaDialog = new AreaDialog();

    private nodeAddingEventHandlerStructure: { [element: string]: () => void } = {
        'anchor-add': () => {
            this.buffered = true;
            let anchor = this.addAnchor();
            this.fillAnchorKnotRoleByAnchor(anchor);
            this.network.focus(anchor.id as string);
            this.changeLabeling();
        },
        'anchor-cd-add': () => {
            this.cdAnchorCreationDialog = new CdAnchorCreationDialog();
            this.cdAnchorCreationDialog.setDomains(this.domains);
            this.cdAnchorCreationDialog.open('cross-domain anchor');
        },
        'connect': () => {
            this.buffered = true;
            this.connectKnotWithTieOrAttribute();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'connect-anchor': () => {
            this.buffered = true;
            this.connectAnchorToTie();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'connect-tx-anchor': () => {
            this.buffered = true;
            this.connectTxAnchors();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'connect-tie-tx': () => {
            this.buffered = true;
            this.connectTieAndTxAnchor();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'knot-add': () => {
            this.buffered = true;
            this.addKnot();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'anchor-tx-add': () => {
            this.buffered = true;
            this.network.focus(this.addTxAnchor().id as string);
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'tie-add': () => {
            this.buffered = true;
            this.addTie();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'tie-self-add': () => {
            this.buffered = true;
            this.addSelfTie();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'tie-his-add': () => {
            this.buffered = true;
            this.addHistoricalTie();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'tie-a-add': () => {
            this.buffered = true;
            this.addAnchoredTie();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'tie-his-a-add': () => {
            this.buffered = true;
            this.addAnchoredHistoricalTie();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'attribute-add': () => {
            this.buffered = true;
            this.addAttribute();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'attribute-his-add': () => {
            this.buffered = true;
            this.addHistoricalAttribute();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        },
        'attribute-composed-add': () => {
            this.buffered = true;
            this.addComposedAttribute();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.changeLabeling();
        }
    }

    @property()
    private chosenNodeType = NodeType.NO_TYPE;

    private navigationBar!: DomainNavigationBar;

    private hostsDisplay = 'none';
    private areasDisplay = 'none';

    constructor() {
        super();
    }

    @state()
    private contextMenuItems: any[] = [];

    changeLabeling() {
        this.labeledAll = !this.labeledAll;
        this.handleLabelEvent();
        this.labeledAll = !this.labeledAll;
        this.handleLabelEvent();
    }

    exportSvg() {
        // @ts-ignore
        let networkContainer = this.network.body.container;
        this.network.fit();
        // @ts-ignore
        let ctx = new C2S({
            width: networkContainer.clientWidth,
            height: networkContainer.clientHeight,
            embedImages: true
        });
        // @ts-ignore
        let canvasProto = this.network.canvas.__proto__;
        let currentGetContext = canvasProto.getContext;
        canvasProto.getContext = function () {
            return ctx;
        }
        let svgOptions = {
            nodes: {
                shapeProperties: {
                    interpolation: true //so images are not scaled svg will get full image
                },
                scaling: {label: {drawThreshold: 0}},
                font: {color: DEFAULT_FONT_COLOR}
            },
            edges: {
                scaling: {label: {drawThreshold: 0}}
            }
        };
        this.network.setOptions(svgOptions);
        this.network.redraw();
        // this.network.setOptions(options);
        canvasProto.getContext = currentGetContext;
        ctx.waitForComplete(() => {
            var svg = ctx.getSerializedSvg();
            this.showSvg(svg);
        });
    }

    showSvg(svg: any) {
        var svgBlob = new Blob([svg], {type: 'image/svg+xml'});
        this.openBlob(svgBlob, "network.svg");
    }

    openBlob(blob: any, fileName: any) {
        // @ts-ignore
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // @ts-ignore
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            var a = document.getElementById("blobLink");
            if (!a) {
                a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("id", "blobLink");
                // a.style = "display: none";
            }
            var data = window.URL.createObjectURL(blob);
            // @ts-ignore
            a.href = data;
            // @ts-ignore
            a.download = fileName;
            a.click();
            setTimeout(function () {
                    // For Firefox it is necessary to delay revoking the ObjectURL
                    window.URL.revokeObjectURL(data);
                }
                , 100);
        }
    }

    updateSearchList() {
        this.foundNodes = (this.nodeDataSet.get() as LeanDiNode[]).map((node) => {
            if (node.type == NodeType.TIE) {
                return {
                    id: node.id,
                    displayName: `${node.descriptor} ${(node.description != null ? StringUtils.SPACED_DASH + node.description : StringUtils.EMPTY_STRING)} 
                    ${(node.anchorRole != null && node.anchorRole.length != 0 ? node.anchorRole.map(role => role.description?.replace(StringUtils.NEWLINE, StringUtils.EMPTY_STRING)).join(StringUtils.SPACE) : StringUtils.EMPTY_STRING)}`,
                };
            }
            if (node.type == NodeType.ATTRIBUTE) {

                const anchor: LeanDiNode = this.nodeDataSet.get(this.network.getConnectedNodes(node.id as string) as Id[])
                    .filter((node: LeanDiNode) => node.type == NodeType.TX_ANCHOR || node.type == NodeType.ANCHOR)[0];

                return {
                    id: node.id,
                    displayName: anchor.mnemonic + StringUtils.UNDERLINE + node.mnemonic! + (anchor.descriptor! != null ? StringUtils.UNDERLINE + anchor.descriptor : StringUtils.EMPTY_STRING) + (node.descriptor != null ? StringUtils.UNDERLINE + node.descriptor : StringUtils.EMPTY_STRING) + (node.description != null ? StringUtils.SPACED_DASH + node.description : StringUtils.EMPTY_STRING),
                };
            }
            return {
                id: node.id,
                displayName: (node.mnemonic != null ? node.mnemonic : StringUtils.EMPTY_STRING) + (node.descriptor != null ? StringUtils.UNDERLINE + node.descriptor : StringUtils.EMPTY_STRING) + (node.description != null ? StringUtils.SPACED_DASH + node.description : StringUtils.EMPTY_STRING),
            };
        });
    }

    handleSaveDialogEvents() {
        if (this.saveDialog.getDialogType() == DialogType.PROJECT_NAVIGATOR) {
            this.$server!.redirectToProject();
        } else if (this.saveDialog.getDialogType() == DialogType.DOMAIN_NAVIGATOR) {
            this.$server!.redirectToDomain(this.saveDialog.getData());
        }
    }

    updateRoleData(role: KnotRole | AnchorRole, data: any) {
        const label = role.type + StringUtils.UNDERLINE + role.role;
        const newLabel = role.type + StringUtils.UNDERLINE + data.role;
        role.identifier = data.identifier;
        role.role = data.role;
        role.description = data.description;
        if (isStrNotEmpty(data.color)) {
            role.color = data.color;
        }
        if (this.activeNode?.type != NodeType.TX_ANCHOR) {
            this.activeNode!.descriptor = this.activeNode!.descriptor!.replace(label, newLabel);
            this.activeNode!.label = this.activeNode!.label!.replace(label, newLabel);
        }
        this.activeNode = this.replaceColumnInAssociatedIndexes(this.activeNode!, label.toUpperCase(), newLabel.toUpperCase());
        return role;
    }

    render() {
        this.cdAnchorCreationDialog.addEventListener('create-cd-anchor', (e: Event) => {
            e.stopImmediatePropagation();
            this.addCdAnchoredTie((<any>e).detail);
            this.handleDownload();
        });
        this.navigationBar = new DomainNavigationBar();
        this.navigationBar.domainList = Object.keys(this.domains);
        this.navigationBar.requestUpdate();
        this.navigationBar.addEventListener('jump-to-project', (e: Event) => {
            // this.saveDialog.openDialog(DialogType.PROJECT_NAVIGATOR);
            this.$server!.redirectToProject();
        });
        this.navigationBar.addEventListener('jump-to-domain', (e: Event) => {
            // this.saveDialog.openDialog(DialogType.DOMAIN_NAVIGATOR, (<any>e).detail);
            this.$server!.redirectToDomain((<any>e).detail);
        });
        this.saveDialog.addEventListener('agree-save', (e: Event) => {
            e.stopImmediatePropagation();
            this.handleDownload(this.doMarshall);
            if (!this.doMarshall) {
                this.handleSaveDialogEvents();
            }
        });
        this.saveDialog.addEventListener('disagree-save', (e: Event) => {
            this.handleSaveDialogEvents();
        });


        this.roleEditor.addEventListener('deselect-edge', () => this.network.unselectAll());
        this.roleEditor.addEventListener(LdEventTarget.EDIT_EDGE, (e: Event) => {
            e.stopImmediatePropagation();
            const data = event(e).detail;
            if (this.activeEdge?.to!.toString().length == 3) { // is it knot checking
                this.activeNode!.knotRole![0] = this.updateRoleData(this.activeNode!.knotRole![0], data) as KnotRole;
            } else {
                const index = this.activeNode!.anchorRole!.findIndex((x: any) => x.id == this.activeEdge?.id);
                this.activeNode!.anchorRole![index] = this.updateRoleData(this.activeNode!.anchorRole![index], data);
            }
            this.activeEdge!.label = data.role + (data.identifier == true ? ", |||" : ", |");
            if (data.color) {
                this.activeEdge!.color = {color: data.color, highlight: this.chosenEdgeColor, hover: data.color};
            }
            this.nodeDataSet.update(this.activeNode!);
            this.edgeDataSet.update(this.activeEdge!);
            this.handleDownload();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
        });
        this.groupDialog.addEventListener('create-group', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.updateGroup(JSON.stringify(event.detail));
        });
        this.groupDialog.addEventListener('remove-group', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.removeGroup(event.detail);
        });
        this.groupDialog.addEventListener('remove-properties-from-group', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.removePropertiesFromGroup(JSON.stringify(event.detail));
        });
        this.groupDialog.addEventListener('remove-groups-from-group', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.removeGroupsFromGroup(JSON.stringify(event.detail));
        });
        this.groupDialog.addEventListener('add-properties-to-group', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.addPropertiesToGroup(JSON.stringify(event.detail));
        });
        this.groupDialog.addEventListener('add-groups-to-group', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.addGroupsToGroup(JSON.stringify(event.detail));
        });


        this.propertiesDialog.addEventListener('delete-properties', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.deleteProperty(JSON.stringify(event.detail));
        });
        this.propertiesDialog.addEventListener('create-property', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            const grId = event.detail.grId;
            delete event.detail.grId;
            this.$server!.updateProperty(JSON.stringify(event.detail));
            if (isStrNotEmpty(grId)) {
                this.$server!.addPropertiesToGroupWithPropertyResponse(JSON.stringify({
                    id: grId,
                    elements: [event.detail.id]
                }));
            }
        });
        this.propertiesDialog.addEventListener('focus', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.setSelection(event.detail as string)
        });

        this.anchorPropertiesDialog.addEventListener('pick-properties-to-anchor', (e: Event) => {
            const event: any = (<any>e);
            event.stopImmediatePropagation();
            this.$server!.updateAnchorsProperties(JSON.stringify([event.detail]));
        });

        this.areaDialog.addEventListener('save-area', (e: Event) => {
            const event: any = (<any>e);
            const comingArea = event.detail.area;
            event.stopImmediatePropagation();
            if (isArrayEmpty(comingArea.anchorRole)) {
                comingArea.anchorRole = [];
            }
            if (isStrEmpty(event.detail.area.uid)) {
                comingArea.uid = generateUid();
                this.areas = this.areas.concat([event.detail.area]);
            } else {
                this.areas = this.areas.map((area: Area) => {
                    if (area.uid == area.uid) {
                        area = comingArea;
                    }
                    return area;
                })
            }
            this.$server!.updateArea(JSON.stringify([mapArea(comingArea)]));
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
        });
        this.updateSearchList();
        return html`
            <vaadin-context-menu
                    .items=${this.contextMenuItems}
                    @item-selected="${(e: Event) => {
                        this.contextMenuItemSelected(e)
                    }}"
            >
                <vaadin-vertical-layout
                        style=" position: fixed; z-index: 1; background-color: transparent; left: 10px; top: 10px">
                    <div>
                        <left-side-menu-bar
                                @add-node-event="${(e: CustomEvent) => {
                                    this.nodeAddingEventHandlerStructure[e.detail]();
                                    this.handleDownload();
                                }}"
                                .chosenNodeType="${this.chosenNodeType}"
                                style=" background-color: hsla(0, 0%, 100%, 0.3); "
                        >
                        </left-side-menu-bar>
                    </div>
                    <div>
                        <properties-menu-bar
                                @open-groups="${(e: Event) => {
                                    this.$server!.requestForGroups();
                                }}"
                                @open-properties="${(e: Event) => {
                                    this.$server!.requestForProperties();
                                }}"
                        >
                        </properties-menu-bar>
                    </div>
                </vaadin-vertical-layout>
                <div style="position: fixed; z-index: 1; background-color: hsla(0, 0%, 100%, 0.3);  left: 20px; bottom: 20px">
                    <b style="color: ${this.domainColor}">Domain: ${this.domainShortName}</b>
                </div>
                <vaadin-vertical-layout
                        style=" position: fixed; z-index: 1; background-color: transparent; right: 10px; top: 15px; align-items: end"
                >
                    <vaadin-horizontal-layout
                    >
                        <div>
                            ${this.navigationBar}
                        </div>
                        <div>
                            <right-side-menu-bar
                                    style=" background-color: hsla(0, 0%, 100%, 0.3);"
                                    @search-start="${() => {
                                        this.network.setOptions({
                                            "interaction": {
                                                "keyboard": false,
                                            }
                                        });
                                    }}"
                                    @zoom-event="${(e: CustomEvent) => this.handleZoom(e)}"
                                    @pin-event="${(e: CustomEvent) => this.handlePin(e)}"
                                    @search-event="${(e: CustomEvent) => this.handleSearch(e)}"
                                    @download-dom-event="${(e: CustomEvent) => {
                                        this.handleDownload(true);
                                    }}"
                                    @download-event="${(e: CustomEvent) => {
                                        this.handleDownload();
                                    }}"
                                    @upload-event="${(e: CustomEvent) => {
                                        this.handleUpload(e)
                                    }}"
                                    @undo-event="${(e: CustomEvent) => this.handleUndoEvent(e)}"
                                    @redo-event="${(e: CustomEvent) => this.handleRedoEvent(e)}"
                                    .listBoxItems="${this.foundNodes}"
                                    .domainColor="${this.domainColor}"
                                    @color-event="${(e: CustomEvent) => {
                                        this.handleColorPicking(e)
                                    }}"
                                    @label-event="${(e: CustomEvent) => {
                                        this.handleLabelEvent()
                                    }}"
                                    @new-tree-event="${(e: CustomEvent) => this.handleNewTreeEvent(e)}"
                                    @picture-event="${(e: CustomEvent) => this.handlePictureEvent(e)}"
                            >
                            </right-side-menu-bar>
                        </div>
                    </vaadin-horizontal-layout>
                    <div>
                        <right-plugin-bar
                                @dto-event="${(e: CustomEvent) => this.handleDtoEvent(e)}"
                                @explode-event="${() => this.handleExplodeEvent()}"
                                @hosts-event="${() => {
                                    this.hostsDisplay = this.hostsDisplay == 'none' && this.hosts.length != 0 ?
                                            'inline' : 'none';
                                    // this.areasDisplay = 'none';
                                    this.requestUpdate()
                                }}"
                                @areas-event="${() => {
                                    // this.areasDialog = new AreasDialog();
                                    // this.areasDialog.open(this.areas);
                                    this.areasDisplay = this.areasDisplay == 'none' && this.areas.length != 0 ?
                                            'inline' : 'none';
                                    // this.hostsDisplay = 'none';
                                    this.requestUpdate()
                                }}"
                                style=" background-color: hsla(0, 0%, 100%, 0.3); "
                        >
                        </right-plugin-bar>
                    </div>
                </vaadin-vertical-layout>
                <div
                        style=" position: fixed; z-index: 1;  background-color: hsla(0, 0%, 100%, 0.3); right: 20px; top: 80px;">
                    <areas-list-box
                            style=" border: none !important; display: ${this.areasDisplay}; width: 100%"
                            .items="${this.areas}"
                            @change-color="${(e: Event) => {
                                this.handleAreaColorization((<any>e).detail);
                            }}"
                            @save-area="${(e: Event) => {
                                const event: any = (<any>e);
                                event.stopImmediatePropagation();
                                this.$server!.updateArea(JSON.stringify([mapArea(event.detail.area)]));
                            }}"
                            @edit-area="${(e: Event) => {
                                const event: any = (<any>e);
                                this.areaDialog = new AreaDialog();
                                this.areaDialog.openArea(this.areas.filter(area => area.uid == event.detail)[0]);
                            }}"
                            @create-area="${(e: Event) => {
                                this.areaDialog = new AreaDialog();
                                this.areaDialog.openArea();
                            }}"
                            @delete-area="${(e: Event) => {
                                const event: any = (<any>e);
                                this.areas = this.areas.filter(area => area.uid != event.detail);
                                this.$server!.deleteArea(event.detail);
                                this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
                            }}"
                    >
                    </areas-list-box>
                    <hosts-list-box
                            style="border: none !important;  display: ${this.hostsDisplay}; width: 100%"
                            .items="${this.hosts}"
                            @change-color="${(e: Event) => {
                                this.handleHostColorization((<any>e).detail)
                            }}"
                    >
                    </hosts-list-box>
                </div>

                <div
                        id="customId"
                        style="height: ${this.layoutHeight}vh"
                >
                </div>
                <vaadin-tooltip
                        for="customId"
                        text="Wrap in “quotes” for exact phrase"
                        manual
                        .opened="${this.tooltipOpened}"
                        .text="${this.tooltipText}"
                        style="top: 100px;"
                ></vaadin-tooltip>
                ${this.roleEditor}
                ${this.saveDialog}
                ${this.cdAnchorCreationDialog}
                ${this.anchorPropertiesDialog}
                ${this.groupDialog}
                ${this.propertiesDialog}
                ${this.areaDialog}
                ${this.nodeEditor}
            </vaadin-context-menu>
        `
    }

    handleHostColorization(details: any) {
        for (let host of this.hosts) {
            if (host.label == details.label) {
                host.colored = !host.colored;
                let domain = host.domain.filter((dom: any) => dom.shortName == this.domainShortName);
                if (domain.length != 0) {
                    let nodes: Node[] = [];
                    for (let item of domain[0].item) {
                        const fqn = item.fqn;
                        nodes = this.nodeDataSet.get();
                        if (fqn.length == 6) {
                            nodes = nodes.filter((node: LeanDiNode) =>
                                node.type == NodeType.ATTRIBUTE && node.mnemonic == fqn.split(StringUtils.DOT)[1])
                        } else {
                            nodes = nodes.filter((node: LeanDiNode) =>
                                node.type != NodeType.ATTRIBUTE && node.mnemonic == fqn)
                        }
                        const domRenderer = new DomainRenderer(
                            host.colored == false ? this.domainColor : host.hostColor, //"#f66",
                            WHITE
                        );
                        for (let node of nodes) {
                            node = this.domainRenderer.renderDefaultFigure(node) as FullItem<Node, "id">;
                            node = this.setPositions(node);
                            this.nodeDataSet.update(node)
                            node = domRenderer.switchRender(node) as FullItem<Node, "id">;
                            this.nodeDataSet.update(node)
                        }
                    }
                    this.nodeDataSet.update(nodes as Node[]);
                }
                break;
            }
        }
    }


    handleAreaColorization(details: any) {
        this.areas = this.areas.map((area: any) => {
            if (area.uid == details.uid) {
                area.colored = !area.colored;
            }
            return area;
        });
        this.network.redraw();

    }


    handleNavigation(e: CustomEvent) {

    }

    handleColorPicking(e: CustomEvent) {
        // this.domainRenderer.setColor(e.detail as string);
        // this.nodeDataSet.update(this.nodeDataSet.get().map((node: LeanDiNode) => {
        //     node = this.setPositions(node);
        //     node = this.domainRenderer.switchRender(node);
        //     return node;
        // }));
    }

    handleNewTreeEvent(e: CustomEvent) {
        this.saveDialog.openDialog(DialogType.EMPTY_DIALOG)
        this.isNewTree = true;
    }

    handlePictureEvent(e: CustomEvent) {
        this.exportSvg();
    }

    handleExplodeEvent() {
        this.nodeDataSet.update(
            this.nodeDataSet.get().map((node: LeanDiNode) => {
                if (node.type != NodeType.ANCHOR && node.type != NodeType.TIE && node.type != NodeType.TX_ANCHOR) {
                    if (node.type == NodeType.KNOT && this.getConnectedTies(node.id as string).length != 0) {
                        return node;
                    }
                    if (node.type == NodeType.CD_ANCHOR) {
                        return node;
                    }
                    if (this.expanded) {
                        node.hidden = false;
                        const index = this.fixedNodes.findIndex(id => id == node.id as string);
                        if (index == -1 && node.fixed) {
                            this.fixedNodes.push(node.id as string);
                        }
                    } else {
                        node.hidden = true;
                        const index = this.fixedNodes.findIndex(id => id == node.id as string);
                        if (index != -1) {
                            this.fixedNodes.splice(index, 1);
                        }
                    }
                }
                if (node.type == NodeType.ANCHOR) {
                    if (this.expanded) {
                        node = this.domainRenderer.renderAnchor(node);
                    } else {
                        node = this.domainRenderer.renderImplodedAnchor(node);
                    }
                }
                if (node.type == NodeType.TX_ANCHOR) {
                    if (this.expanded) {
                        node = this.domainRenderer.renderTxAnchor(node);
                    } else {
                        node = this.domainRenderer.renderImplodedTxAnchor(node);
                    }
                }
                return node
            })
        );
        this.expanded = !this.expanded;
    }

    handleDtoEvent(e: CustomEvent) {

    }

    handleLabelEvent() {
        const nodes = this.getAllNodes();
        if (this.labeledAll) {
            this.nodeDataSet.update(nodes.map((node: LeanDiNode) => {
                if (node.type == NodeType.TIE) {
                    node.label = ' ';
                } else {
                    node.label = node.descriptor;
                }
                node = this.setPositions(node);
                return node;
            }));
            this.labeledAll = false;
        } else {
            this.nodeDataSet.update(nodes.map((node: LeanDiNode) => {
                if (node.type != NodeType.TIE && node.type != NodeType.ATTRIBUTE) {
                    node.label = node.mnemonic! + (node.descriptor! != null ? StringUtils.UNDERLINE + node.descriptor : StringUtils.EMPTY_STRING);
                }
                if (node.type == NodeType.ATTRIBUTE) {
                    const anchor: LeanDiNode = this.nodeDataSet.get(this.network.getConnectedNodes(node.id as string) as Id[])
                        .filter((node: LeanDiNode) => node.type == NodeType.TX_ANCHOR || node.type == NodeType.ANCHOR)[0];
                    node.label = anchor.mnemonic + StringUtils.UNDERLINE + node.mnemonic! + (anchor.descriptor! != null ? StringUtils.UNDERLINE + anchor.descriptor : StringUtils.EMPTY_STRING) + (node.descriptor! != null ? StringUtils.UNDERLINE + node.descriptor : StringUtils.EMPTY_STRING);
                }
                if (node.type == NodeType.TIE) {
                    node.label = node.descriptor;
                }
                node = this.setPositions(node);
                return node;
            }));
            this.labeledAll = true;
        }
    }

    saveToFile(xmlContent: string) {
        getNewFileHandle(xmlContent).then(r => console.log(r)).catch(r => console.log(r));
        if (this.isNewTree) {
            this.$server!.fillComponentRequest();
            this.isNewTree = false;
        }
        this.handleSaveDialogEvents();
    }

    contextMenuItemSelected(e: Event) {
        switch ((<any>e).detail.value.text) {
            case 'Edit edge': {
                this.roleEditor = new RoleEditor()//new EdgeEditorDialog();
                // const [role, identifier] = getRoleAndIdentifier(this.activeEdge!.label!);
                // const akRole = {
                //     role: role,
                //     identifier: identifier,
                //     //@ts-ignore
                //     color: this.activeEdge!.color ? this.activeEdge!.color.color as string : BLACK,
                // } as KnotRole;
                let edgeRole: AnchorRole | KnotRole;
                if (isArrayNotEmpty(this.activeNode!.knotRole!)) {
                    edgeRole = this.activeNode!.knotRole![0] as KnotRole;
                } else if (isArrayNotEmpty(this.activeNode!.anchorRole)) {
                    edgeRole = this.activeNode!.anchorRole!.find((x) => x.id == this.activeEdge!.id) as AnchorRole;
                } else {
                    edgeRole = {};
                }


                // if (this.activeEdge?.to!.toString().length == 3) {
                //     edgeRole = this.activeNode!.knotRole![0]
                //     akRole.description = edgeRole.description;
                // } else {
                //     try {
                //         edgeRole = this.activeNode!.anchorRole!.find((x) => x.id == this.activeEdge!.id);
                //         akRole.description = edgeRole!.description;
                //     } catch (e) {
                //         edgeRole = null;
                //     }
                // }
                this.roleEditor.openRole(structuredClone(edgeRole))
                // this.edgeDialog.identifier = this.activeEdge!.label ? this.activeEdge!.label.split(StringUtils.SPACED_COMMA)[1].length == 3 : false;
                // this.edgeDialog.edgeRole = this.activeEdge!.label ? this.activeEdge!.label.split(StringUtils.SPACED_COMMA)[0] : null;
                // // @ts-ignore
                // this.edgeDialog.color = this.activeEdge!.color ? this.activeEdge!.color.color as string : BLACK;
                // this.edgeDialog.dialogOpened = true;
                // let edgeRole;
                // if (this.activeEdge?.to!.toString().length == 3) {
                //     edgeRole = this.activeNode!.knotRole![0]
                //     this.edgeDialog.description = edgeRole.description;
                // } else {
                //     try {
                //         edgeRole = this.activeNode!.anchorRole!.find((x) => x.id == this.activeEdge!.id);
                //         this.edgeDialog.description = edgeRole!.description as string | null;
                //     } catch (e) {
                //         edgeRole = null;
                //     }
                // }
                // this.edgeDialog.identifier = edgeRole!.identifier;
                // this.edgeDialog.edgeRole = edgeRole!.role as string;
                break;
            }
            case 'Delete edge': {
                this.deleteEdgeOfTieOrTxAnchor();
                this.handleDownload();
                break;
            }
            case 'Make first': {
                this.makeEdgeFirstInTie();
                this.handleDownload();
                break;
            }
            case 'Edit node': {
                this.openLayout();
                break;
            }
            case 'Delete node': {
                this.deleteNodes([this.activeNode!.id as IdType]);
                this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
                this.handleDownload();
                break;
            }
            case 'Fix/unfix node': {
                this.fixUnfixNode([this.activeNode!.id as string]);
                break;
            }
            case 'Jump to domain': {
                this.redirectToDomain(this.activeNode!);
                break;
            }
            case 'Show properties': {
                this.anchorPropertiesDialog.setGroups(this.groups);
                this.anchorPropertiesDialog.setProperties(this.properties);
                this.anchorPropertiesDialog.open(this.activeNode as Anchor);
                break;
            }
            case 'Explode/implode': {
                this.activeNode!.expanded = !this.activeNode!.expanded;
                let connectedNodes = this.nodeDataSet.get(this.network.getConnectedNodes(this.activeNode!.id as string) as string[],
                    {
                        filter: (node: LeanDiNode) => node.type == NodeType.ATTRIBUTE,
                        fields: [NodeKeys.ID, NodeKeys.TYPE, 'hidden' as NodeKeys]
                    }) as LeanDiNode[];
                connectedNodes = connectedNodes.map((node: LeanDiNode) => {
                    // if (node.type == NodeType.KNOT && this.network.getConnectedNodes(node.id as string).length > 1) {
                    //     node.hidden = false;
                    // } else if (node.type == NodeType.KNOT) {
                    //     node.hidden = true;
                    // }
                    if (this.activeNode!.expanded) {
                        node.hidden = false;
                    } else {
                        node.hidden = true;
                        const index = this.fixedNodes.findIndex(id => id == node.id as string);
                        if (index != -1) {
                            this.fixedNodes.splice(index, 1);
                        }
                    }
                    return node
                });
                if (this.activeNode!.expanded) {
                    this.activeNode = this.domainRenderer.renderAnchor(this.activeNode!);
                } else {
                    this.activeNode = this.domainRenderer.renderImplodedAnchor(this.activeNode!);
                }
                connectedNodes = connectedNodes.concat([this.activeNode! as LeanDiNode]);
                this.nodeDataSet.update(connectedNodes);
                break;
            }
            case 'Create area': {
                this.areaDialog = new AreaDialog();
                this.areaDialog.openArea();
                break;
            }
            default:
                break;
        }
        if ((<any>e).detail.value.component?.className.includes('attach-area')) {
            this.attachToArea((<any>e).detail.value.component.id);
        }
        if ((<any>e).detail.value.component?.className.includes('detach-area')) {
            this.detachFromArea((<any>e).detail.value.component.id);
        }
        if ((<any>e).detail.value.text?.includes(StringUtils.DOT)) {
            this.addNodeToHost((<any>e).detail.value.text)
        }
    }

    attachToArea(areaUid: string) {
        const area = this.areas.filter(area => area.uid == areaUid)[0];
        area.anchorRole.push({
            type: this.activeNode!.mnemonic
        });
        this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
        this.$server!.updateArea(JSON.stringify([mapArea(area)]));
    }

    detachFromArea(areaUid: string) {
        const area = this.areas.filter(area => area.uid == areaUid)[0];
        area.anchorRole = area.anchorRole.filter((aRole: AnchorRole) => aRole.type != this.activeNode!.mnemonic);
        this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
        this.$server!.updateArea(JSON.stringify([mapArea(area)]));
    }

    getFqn() {
        let fqn = this.activeNode!.mnemonic;
        if (this.activeNode!.type == NodeType.ATTRIBUTE) {
            const anchor: Anchor = this.nodeDataSet
                .get(this.network.getConnectedNodes(this.activeNode!.id as string) as string[])
                .filter((node: LeanDiNode) => node.type == NodeType.ANCHOR
                    || node.type == NodeType.TX_ANCHOR)[0];
            fqn = anchor.mnemonic + StringUtils.DOT + fqn;
        }
        return fqn;
    }

    addNodeToHost(hostId: string) {
        for (let host of this.hosts) {
            const domainIndex = host.domain.findIndex((domain: any) => domain.shortName == this.domainShortName);
            if (domainIndex != -1) {
                const itemIndex = host.domain[domainIndex].item.findIndex((item: any) => item.fqn == this.getFqn());
                if (host.label == hostId) {
                    if (itemIndex == -1) {
                        host.domain[domainIndex].item.push({fqn: this.getFqn()});
                        // this.fillItemsList(host, this.itemsToAdd);
                    }
                } else {
                    if (itemIndex != -1) {
                        if (host.domain[domainIndex].item.length == 1) {
                            host.domain.splice(domainIndex, 1);
                        } else {
                            host.domain[domainIndex].item.splice(itemIndex, 1);
                        }
                        // this.fillItemsList(host, this.itemsToDelete);
                    }
                }
            } else {
                if (host.label == hostId) {
                    host.domain.push({
                        shortName: this.domainShortName,
                        item: [{fqn: this.getFqn()}]
                    });
                    // this.fillItemsList(host, this.itemsToAdd);
                }
            }
        }
        this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
    }

    renewItemInDomainOfHost(oldFqn: string, newFqn: string) {
        for (let host of this.hosts) {
            let domain = host.domain.filter((dom: any) => dom.shortName == this.domainShortName);
            if (domain.length != 0) {
                for (let item of domain[0].item) {
                    if (item.fqn == oldFqn) {
                        item.fqn = newFqn;
                    }
                    const fqnParts = item.fqn.split(StringUtils.DOT);
                    if (fqnParts.length == 2 && fqnParts[0] == oldFqn) {
                        item.fqn = newFqn + StringUtils.DOT + fqnParts[1];
                    }
                }
            }
        }
    }

    removeItemFromDomainOfHost() {
        for (let host of this.hosts) {
            const domainIndex = host.domain.findIndex((domain: any) => domain.shortName == this.domainShortName);
            if (domainIndex != -1) {
                const itemIndex = host.domain[domainIndex].item.findIndex((item: any) => item.fqn == this.getFqn());
                if (itemIndex != -1) {
                    if (host.domain[domainIndex].item.length == 1) {
                        host.domain.splice(domainIndex, 1);
                    } else {
                        host.domain[domainIndex].item.splice(itemIndex, 1);
                    }
                }
            }
        }
    }


    deleteEdgeOfTieOrTxAnchor(edgeId?: IdType) {
        let edgeToDeleteId: IdType | null | undefined = null;
        if (edgeId != null) {
            edgeToDeleteId = edgeId;
        } else {
            edgeToDeleteId = this.activeEdge?.id;
        }
        let nodes = this.nodeDataSet.get(this.network.getConnectedNodes(edgeToDeleteId as string) as string[]);
        let tie = nodes.filter(node => (node as LeanDiNode).type == NodeType.TIE)[0] as Tie;
        let txAnchor = nodes.filter((node: LeanDiNode) => node.type == NodeType.TX_ANCHOR)[0] as TxAnchor;

        if (tie != null) {
            let anchor = (this.nodeDataSet.get(this.network.getConnectedNodes(tie.id as string) as IdType[]) as LeanDiNode[])
                .filter(node => node.type == NodeType.CD_ANCHOR);
            if (tie.anchorRole!.length <= 2) {
                this.deleteSwitch(tie);
                this.nodeDataSet.remove(tie?.id as string)
                if (anchor.length != 0) {
                    this.nodeDataSet.remove(anchor[0].id as string);
                    this.deleteSwitch(anchor[0]);
                }
            } else {
                const indexToDelete = tie.anchorRole!.findIndex(obj => obj.id == edgeToDeleteId);
                if (indexToDelete != -1) {
                    const role = tie.anchorRole![indexToDelete].type + StringUtils.UNDERLINE + tie.anchorRole![indexToDelete].role;
                    tie = this.replaceColumnInAssociatedIndexes(tie, role.toUpperCase())
                    tie.descriptor = tie.descriptor?.replace(tie.anchorRole![indexToDelete].type + StringUtils.UNDERLINE + tie.anchorRole![indexToDelete].role, "*");
                    tie.descriptor = tie.descriptor!.replace("*_", StringUtils.EMPTY_STRING);
                    tie.descriptor = tie.descriptor!.replace("_*", StringUtils.EMPTY_STRING);
                    tie.label = tie.descriptor;
                    tie.anchorRole!.splice(indexToDelete, 1);
                    tie = this.setPositions(tie);
                    this.nodeDataSet.update(tie as Node);
                }
            }
        }
        if (txAnchor != null) {
            const indexToDelete = txAnchor.anchorRole!.findIndex(obj => obj.id == edgeToDeleteId);
            if (indexToDelete != -1) {
                const role = txAnchor.anchorRole![indexToDelete].type + StringUtils.UNDERLINE + txAnchor.anchorRole![indexToDelete].role;
                txAnchor = this.replaceColumnInAssociatedIndexes(txAnchor, role.toUpperCase())
                txAnchor.anchorRole!.splice(indexToDelete, 1);
                txAnchor = this.setPositions(txAnchor);
                this.nodeDataSet.update(txAnchor as Node);
            }
        }
        this.edgeDataSet.remove(edgeToDeleteId as IdType);
        this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
    }

    makeEdgeFirstInTie(edgeId?: IdType) {
        let edgeToDeleteId: IdType | null | undefined = null;
        if (edgeId != null) {
            edgeToDeleteId = edgeId;
        } else {
            edgeToDeleteId = this.activeEdge?.id;
        }
        let nodes: IdType[] = this.network.getConnectedNodes(edgeToDeleteId as IdType) as IdType[];
        const tieId = nodes.filter(node => (node as string).length == 4)[0];
        const edge = this.edgeDataSet.get(edgeToDeleteId as Id) as Edge;
        if (tieId != null) {
            let tie: Tie = this.nodeDataSet.get(tieId) as Tie;
            const id = edge.id;
            let first = StringUtils.EMPTY_STRING as string;
            if (tie.knotRole != null && tie.knotRole.length != 0 && tie.knotRole[0].role == edge.label?.split(StringUtils.COMMA)[0]) {
                first = tie.knotRole[0].type + StringUtils.UNDERLINE + tie.knotRole[0].role;
                if (tie.descriptor! != null) {
                    tie.descriptor = tie.descriptor!.replace(first, "*");
                    tie.descriptor = tie.descriptor!.replace("*_", StringUtils.EMPTY_STRING);
                    tie.descriptor = tie.descriptor!.replace("_*", StringUtils.EMPTY_STRING);
                    tie.descriptor = first + StringUtils.UNDERLINE + tie.descriptor!;
                } else {
                    tie.descriptor = first;
                    if (tie.anchorRole != null && tie.anchorRole.length != 0) {
                        tie.descriptor += StringUtils.UNDERLINE + tie.anchorRole!.map((x: AnchorRole) => {
                            return x.type + StringUtils.UNDERLINE + x.role
                        }).join(StringUtils.UNDERLINE);
                    }
                }
            } else if (tie.anchorRole != null && tie.anchorRole.length != 0) {
                const aRole = tie.anchorRole.filter(x => x.id == id)[0];
                first = aRole.type + StringUtils.UNDERLINE + aRole.role;
                if (tie.descriptor! != null) {
                    tie.descriptor = tie.descriptor!.replace(first, "*");
                    tie.descriptor = tie.descriptor!.replace("*_", StringUtils.EMPTY_STRING);
                    tie.descriptor = tie.descriptor!.replace("_*", StringUtils.EMPTY_STRING);
                    tie.descriptor = first + StringUtils.UNDERLINE + tie.descriptor!;
                } else {
                    tie.descriptor = first;
                    tie.descriptor += StringUtils.UNDERLINE + tie.anchorRole!.filter(x => x.id != id).map((x: AnchorRole) => {
                        return x.type + StringUtils.UNDERLINE + x.role
                    }).join(StringUtils.UNDERLINE);
                }
            }
            tie.label = tie.descriptor;
            tie = this.setPositions(tie);
            tie = this.domainRenderer.renderTie(tie);
            this.nodeDataSet.update(tie);
        }
    }


    // неудобоваримое безобразие достойное переработки — два метода ниже
    removeKnotRangeRoleFromNodes(knot: Knot) {
        let attributesAndKnots = (this.nodeDataSet.get() as LeanDiNode[])
            .filter(item => item.type == NodeType.ATTRIBUTE || item.type == NodeType.TIE);
        let attributes = attributesAndKnots
            .filter(node => (node.type == NodeType.ATTRIBUTE && node.knotRange == knot.mnemonic)).map(node => {
                node.knotRange = null;
                return node
            });
        let attributesExt = [];
        for (let attrib of attributesAndKnots.filter(node => node.type == NodeType.ATTRIBUTE)) {
            if (isArrayNotEmpty(attrib.extendedColumn)) {
                for (let extCol of attrib.extendedColumn!) {
                    if (extCol.knotRange == knot.mnemonic) {
                        extCol.knotRange = null
                        attributesExt.push(attrib);
                    }
                }
            }
        }
        let knots = attributesAndKnots
            .filter(node => (node.type == NodeType.TIE && node.knotRole != null && node.knotRole.length != 0 && node.knotRole[0].type == knot.mnemonic))
            .map(node => {
                node.knotRole = null;
                return node
            });

        this.nodeDataSet.update(attributes);
        this.nodeDataSet.update(attributesExt);
        this.nodeDataSet.update(knots);
    }

    addKnotRoleRange(knots: Knot[]) {
        let nodesToUpdate: Node[] = []
        for (let knot of knots) {
            for (let edge of (this.edgeDataSet.get() as LeanDiEdge[])) {
                let id = null;
                const lengthOfId = (edge!.from!.toString() + edge!.to!.toString()).length;
                if (lengthOfId == ConnectionType.ANCHOR_AND_TX_ANCHOR || lengthOfId == ConnectionType.TIE_AND_ANCHOR) {
                    if (edge.from == knot.id) {
                        id = edge.to;
                    }
                    if (edge.to == knot.id) {
                        id = edge.from;
                    }
                }
                if (lengthOfId == ConnectionType.ATTRIBUTE_AND_KNOT) {
                    if (edge.from == knot.id) {
                        id = edge.to;
                    }
                    if (edge.to == knot.id) {
                        id = edge.from;
                    }
                }
                if (id != null) {
                    let node = this.nodeDataSet.get(id as Id) as LeanDiNode;
                    if (node != null) {
                        if (node.type == NodeType.ATTRIBUTE) {
                            node.knotRange = knot.mnemonic;
                        } else {
                            node.knotRole = [{
                                description: edge.description,
                                role: edge.label,
                                type: knot.mnemonic,
                                identifier: edge.identifier
                            }]
                        }
                        nodesToUpdate.push(node as Node);
                    }
                }
            }
        }
        this.nodeDataSet.update(nodesToUpdate);
    }

    handleRedoEvent(e: CustomEvent<string>) {
        if (this.history.future.length > 0) {
            let usedSheet = null;
            const currentNodes = this.nodeDataSet.get();
            const currentEdges = this.edgeDataSet.get();
            const futureNodes = this.history.future[0].nodes;
            const futureEdges = this.history.future[0].edges;

            let nodeDifferences: LeanDiNode[];
            let knots: Knot[] = [];
            let attributes: Attribute[] = [];
            let anchors: Anchor[] = [];

            if (currentNodes.length > futureNodes.length) {
                nodeDifferences = getDifferenceInNodes(currentNodes, futureNodes) as LeanDiNode[];
                nodeDifferences.map(node => this.deleteSwitch(node));
                this.nodeDataSet.remove(nodeDifferences as Node[]);
                const ids = nodeDifferences.map(node => {
                    return node.id
                });
                this.fixedNodes = this.fixedNodes.filter((node: any) => ids.indexOf(node.id) < 0)
                for (let node of nodeDifferences.filter(node => node.type == NodeType.KNOT)) {
                    this.removeKnotRangeRoleFromNodes(node as Knot);
                }
                for (let node of nodeDifferences.filter((node: any) => node.type == NodeType.ATTRIBUTE)) {
                    this.removeAttributesFromAnchors(node as Attribute);
                }
                for (let node of nodeDifferences.filter((node: any) => node.type == NodeType.ANCHOR)) {
                    this.removeAnchorRoleFromTieAndTxAnchor(node as Anchor);
                }
            } else {
                if (currentNodes.length < futureNodes.length) {
                    nodeDifferences = getDifferenceInNodes(futureNodes, currentNodes) as LeanDiNode[];
                    nodeDifferences.map(node => this.reincarnationSwitch(node));
                    knots = nodeDifferences.filter(node => node.type == NodeType.KNOT);
                    attributes = nodeDifferences.filter(node => node.type == NodeType.ATTRIBUTE);
                    anchors = nodeDifferences.filter(node => node.type == NodeType.ANCHOR
                        || node.type == NodeType.CD_ANCHOR);
                } else {
                    nodeDifferences = getDifferenceInNodesByKeys(futureNodes, currentNodes);
                }
                nodeDifferences = nodeDifferences.map(node => this.fillFigures(node as LeanDiNode));
                this.nodeDataSet.update(nodeDifferences);
            }

            let edgeDifferences;

            if (currentEdges.length > futureEdges.length) {
                edgeDifferences = getDifferenceInEdges(currentEdges, futureEdges);
                this.edgeDataSet.remove(edgeDifferences);
            } else {
                if (currentEdges.length < futureEdges.length) {
                    edgeDifferences = getDifferenceInEdges(futureEdges, currentEdges);
                    this.edgeDataSet.update(edgeDifferences);
                } else {
                    edgeDifferences = getDifferenceInEdgesByKeys(currentEdges, futureEdges);
                    this.edgeDataSet.remove(edgeDifferences.map(node => node.id));
                    edgeDifferences = getDifferenceInEdgesByKeys(futureEdges, currentEdges);
                    this.edgeDataSet.update(edgeDifferences);
                }
            }
            this.addKnotRoleRange(knots as Node[]);
            this.addAttributeToAnchor(attributes as Attribute[]);
            this.addAnchorRoleToTieOrTxAnchor(anchors as Anchor[]);

            this.history = this.undoRedo.redoHistory();
            this.areas = this.history.current!.areas as Area[];
            this.handleDownload();
        }
    }

    fillFigures(node: LeanDiNode) {
        node = this.domainRenderer.renderDefaultFigure(node);
        this.nodeDataSet.update(node);
        switch (node.type) {
            case (NodeType.ANCHOR): {
                node = this.domainParser.fillAnchorFigure(node);
                break;
            }
            case (NodeType.TIE): {
                node = this.domainParser.fillTieFigure(node);
                break;
            }
            case (NodeType.KNOT): {
                node = this.domainParser.fillKnotFigure(node);
                break;
            }
            case (NodeType.ATTRIBUTE): {
                node = this.domainParser.fillAttributeFigure(node, ++this.indexId);
                break;
            }
            case (NodeType.TX_ANCHOR): {
                node = this.domainParser.fillTxAnchorFigure(node);
                break;
            }
            case (NodeType.CD_ANCHOR): {
                node = this.domainParser.fillCdAnchorFigure(node);
                break;
            }
            default : {
                break;
            }
        }
        return node;
    }

    // Поразмыслить тут
    deleteSwitch(node: any) {
        switch (node.type) {
            case NodeType.ANCHOR : {
                this.anchorsToDelete.push(node['uid']);
                break;
            }
            case NodeType.TIE : {
                this.tiesToDelete.push(node['uid']);
                break;
            }
            case NodeType.KNOT : {
                this.knotsToDelete.push(node['uid']);
                break;
            }
            case NodeType.ATTRIBUTE : {
                this.attributesToDelete.push(node['uid']);
                break;
            }
            case NodeType.TX_ANCHOR : {
                this.txAnchorsToDelete.push(node['uid']);
                break;
            }
            case NodeType.CD_ANCHOR : {
                this.cdAnchorsToDelete.push(node['uid']);
                this.connexionsToDelete.push(node['connexionUid']);
                break;
            }
        }
    }


    reincarnationSwitch(node: any) {
        switch (node.type) {
            case NodeType.ANCHOR : {
                this.anchorsToDelete.splice(this.anchorsToDelete.indexOf(node['uid']), 1);
                break;
            }
            case NodeType.TIE : {
                this.tiesToDelete.splice(this.tiesToDelete.indexOf(node['uid']), 1);
                break;
            }
            case NodeType.KNOT : {
                this.knotsToDelete.splice(this.knotsToDelete.indexOf(node['uid']), 1);
                break;
            }
            case NodeType.ATTRIBUTE : {
                this.attributesToDelete.splice(this.attributesToDelete.indexOf(node['uid']), 1);
                break;
            }
            case NodeType.TX_ANCHOR : {
                this.txAnchorsToDelete.splice(this.txAnchorsToDelete.indexOf(node['uid']), 1);
                break;
            }
            case NodeType.CD_ANCHOR : {
                this.cdAnchorsToDelete.splice(this.cdAnchorsToDelete.indexOf(node['uid']), 1);
                break;
            }
        }
    }

    handleUndoEvent(e?: CustomEvent<string>) {
        if (this.history.past.length >= 1) {
            let usedSheet = null;
            const currentNodes = this.nodeDataSet.get();
            const currentEdges = this.edgeDataSet.get();
            const pastNodes = this.history.past[this.history.past.length - 1].nodes;
            const pastEdges = this.history.past[this.history.past.length - 1].edges;

            let nodeDifferences: LeanDiNode[];
            let knots: Knot[] = [];
            let attributes: Attribute[] = [];
            let anchors: Anchor[] = [];

            if (currentNodes.length > pastNodes.length) {
                nodeDifferences = getDifferenceInNodes(currentNodes, pastNodes) as LeanDiNode[];
                nodeDifferences.map(node => this.deleteSwitch(node));
                this.nodeDataSet.remove(copy(nodeDifferences) as Node[]);
                const ids = nodeDifferences.map(node => {
                    return node.id
                });
                this.fixedNodes = this.fixedNodes.filter((node: any) => ids.indexOf(node.id) < 0)
                for (let node of nodeDifferences.filter((node: LeanDiNode) => node.type == NodeType.KNOT)) {
                    this.removeKnotRangeRoleFromNodes(node as Knot);
                }
                for (let node of nodeDifferences.filter((node: any) => node.type == NodeType.ATTRIBUTE)) {
                    this.removeAttributesFromAnchors(node as Attribute);
                }
                for (let node of nodeDifferences.filter((node: any) => node.type == NodeType.ANCHOR
                    || node.type == NodeType.CD_ANCHOR)) {
                    this.removeAnchorRoleFromTieAndTxAnchor(node as Anchor);
                }
            } else {
                if (currentNodes.length < pastNodes.length) {
                    nodeDifferences = getDifferenceInNodes(pastNodes, currentNodes) as LeanDiNode[];
                    nodeDifferences.map(node => this.reincarnationSwitch(node));
                    knots = nodeDifferences.filter(node => node.type == NodeType.KNOT);
                    attributes = nodeDifferences.filter(node => node.type == NodeType.ATTRIBUTE);
                    anchors = nodeDifferences.filter(node => node.type == NodeType.ANCHOR
                        || node.type == NodeType.CD_ANCHOR);
                } else {
                    nodeDifferences = getDifferenceInNodesByKeys(pastNodes, currentNodes);
                }
                nodeDifferences = nodeDifferences.map(node => this.fillFigures(node as LeanDiNode));
                this.nodeDataSet.update(nodeDifferences);
            }

            let edgeDifferences;

            if (currentEdges.length > pastEdges.length) {
                edgeDifferences = getDifferenceInEdges(currentEdges, pastEdges);
                this.edgeDataSet.remove(edgeDifferences);
            } else {
                if (currentEdges.length < pastEdges.length) {
                    edgeDifferences = getDifferenceInEdges(pastEdges, currentEdges);
                    this.edgeDataSet.update(edgeDifferences);
                } else {
                    edgeDifferences = getDifferenceInEdgesByKeys(currentEdges, pastEdges);
                    this.edgeDataSet.remove(edgeDifferences.map(node => node.id));
                    edgeDifferences = getDifferenceInEdgesByKeys(pastEdges, currentEdges);
                    this.edgeDataSet.update(edgeDifferences);
                }
            }
            this.addKnotRoleRange(knots as Node[]);
            this.addAttributeToAnchor(attributes as Attribute[]);
            this.addAnchorRoleToTieOrTxAnchor(anchors as Anchor[]);
            this.history = this.undoRedo.undoHistory();

            this.hosts = this.history.current!.hosts as any[];
            this.areas = this.history.current!.areas as any[];


        }
        this.handleDownload();
    }

    removeAnchorRoleFromTieAndTxAnchor(anchor: Anchor) {
        let tiesAndTxAnchors = (this.nodeDataSet.get() as LeanDiNode[]).filter((item) => item.type == NodeType.TIE || item.type == NodeType.TX_ANCHOR);
        for (let tieOrTxAnchor of tiesAndTxAnchors) {
            let indexToDel = tieOrTxAnchor.anchorRole!.findIndex((anchorRole: AnchorRole) => anchorRole.type == anchor.mnemonic)
            if (indexToDel != -1) {
                tieOrTxAnchor.anchorRole!.splice(indexToDel, 1);
            }
            tieOrTxAnchor = this.setPositions(tieOrTxAnchor);
        }
        this.nodeDataSet.update(tiesAndTxAnchors);
    }

    addAnchorRoleToTieOrTxAnchor(anchors: Anchor[]) {
        let nodesToUpdate: Node[] = []
        for (let anchor of anchors) {
            for (let edge of (this.edgeDataSet.get() as LeanDiEdge[])) {
                let id = null;
                const lengthOfId = (edge!.from!.toString() + edge!.to!.toString()).length;
                if (lengthOfId == ConnectionType.ANCHOR_AND_TX_ANCHOR || lengthOfId == ConnectionType.TIE_AND_ANCHOR) {
                    if (edge.from == anchor.id) {
                        id = edge.to;
                    }
                    if (edge.to == anchor.id) {
                        id = edge.from;
                    }
                }
                if (id != null) {
                    let node = this.nodeDataSet.get(id as Id) as LeanDiNode;
                    if (node != null) {
                        if (node.type == NodeType.TX_ANCHOR) {
                            const [role, identifier] = getRoleAndIdentifier(edge.label!)
                            const roleTemplate = createDefaultTieRole(anchor.mnemonic!, edge.id, role as string, identifier as boolean, edge.description)
                            roleTemplate.id = edge.id!;
                            if (node.anchorRole != null && node.anchorRole.length != 0) {
                                node.anchorRole.push(roleTemplate);
                            } else {
                                node.anchorRole = [roleTemplate];
                            }
                            node = this.setPositions(node);
                            nodesToUpdate.push(node as Node);
                        }
                    }
                }
            }
        }
        this.nodeDataSet.update(nodesToUpdate);
    }

    removeAttributesFromAnchors(attribute: Attribute) {
        let anchors = (this.nodeDataSet.get() as Anchor[]).filter((item) => item.type == NodeType.ANCHOR || item.type == NodeType.TX_ANCHOR);
        for (let anchor of anchors) {
            let indexToDel = anchor.attribute!.findIndex((obj: Attribute) => obj.id == attribute.id);
            if (indexToDel != -1) {
                anchor.attribute!.splice(indexToDel, 1);
            }
            anchor = this.setPositions(anchor);
        }
        this.nodeDataSet.update(anchors);
    }

    addAttributeToAnchor(attributes: Attribute[]) {
        let nodesToUpdate: Node[] = []
        for (let attribute of attributes) {
            for (let edge of this.edgeDataSet.get()) {
                let id = null;
                if (edge.from == attribute.id) {
                    id = edge.to;
                }
                if (edge.to == attribute.id) {
                    id = edge.from;
                }
                if (id != null) {
                    let node = this.nodeDataSet.get(id as Id) as LeanDiNode;
                    if (node.type == NodeType.ANCHOR || node.type == NodeType.TX_ANCHOR) {
                        if (node.attribute != null && node.attribute.length != 0) {
                            node.attribute.push(attribute);
                        } else {
                            node.attribute = [attribute];
                        }
                        nodesToUpdate.push(node as Node);
                    }
                }
            }
        }
        this.nodeDataSet.update(nodesToUpdate);
    }


    changeKnotRangeRole(mnemonic: string) {
        let nodes = this.nodeDataSet.get(this.network.getConnectedNodes(this.activeNode!.id!) as IdType[]) as LeanDiNode[];

        const iterateextendedColumn = (node: LeanDiNode) => {
            if (isArrayNotEmpty(node.extendedColumn)) {
                for (let extendedColumn of node.extendedColumn!) {
                    if (extendedColumn.knotRange == this.activeNode!.mnemonic) {
                        extendedColumn.knotRange = mnemonic;
                        break;
                    }
                }
            }
            return node;
        }

        for (let node of nodes) {
            if (node['type'] == NodeType.TIE) {
                if (node.knotRole != null && node.knotRole.length != 0 && node.knotRole[0].type == this.activeNode!.mnemonic) {
                    let label = node.knotRole![0].type + StringUtils.UNDERLINE + node.knotRole![0].role;
                    let newLabel = mnemonic + StringUtils.UNDERLINE + node.knotRole![0].role;
                    node = this.replaceColumnInAssociatedIndexes(node, node.knotRole![0].type!.toUpperCase(), mnemonic.toUpperCase());
                    node.knotRole![0].type = mnemonic;
                    node.descriptor = node.descriptor!.replace(label, newLabel);
                    node.label = node.label!.replace(label, newLabel);
                } else {
                    node = iterateextendedColumn(node);
                }
            } else if (node['type'] == NodeType.ATTRIBUTE) {
                if (this.activeNode!.mnemonic == node.knotRange) {
                    node = this.replaceColumnInAssociatedIndexes(node, node.knotRange!, mnemonic.toUpperCase());
                    node.knotRange = mnemonic;
                } else {
                    node = iterateextendedColumn(node);
                }
                this.renewAttributeInAnchor(node);
            } else {
                node = iterateextendedColumn(node);
            }
            node = this.setPositions(node);
        }
        this.nodeDataSet.update(nodes);
    }

    changeConnexion(mnemonic: string) {
        for (let connexion of this.connexions) {
            for (let anchorRole of connexion.anchorRole) {
                if (anchorRole.type == this.activeNode!.mnemonic) {
                    anchorRole.type = mnemonic;
                }
            }
        }
    }

    changeAnchorRole(mnemonic: string) {
        let nodes = (this.nodeDataSet.get(this.network.getConnectedNodes(this.activeNode!.id!) as IdType[]) as LeanDiNode[])
            .filter((node: Tie | TxAnchor) => (node.type == NodeType.TX_ANCHOR || node.type == NodeType.TIE));
        for (let node of nodes) {
            for (let anchorRole of node.anchorRole!) {
                if (anchorRole.type == this.activeNode!.mnemonic) {
                    let label = anchorRole.type + StringUtils.UNDERLINE + anchorRole.role;
                    let newLabel = mnemonic + StringUtils.UNDERLINE + anchorRole.role;
                    node = this.replaceColumnInAssociatedIndexes(node, label.toUpperCase(), newLabel.toUpperCase());
                    anchorRole.type = mnemonic;
                    if (node.type == NodeType.TIE) {
                        node.descriptor = node.descriptor!.replace(label, newLabel);
                        node.label = node.label!.replace(label, newLabel);
                    }
                }
            }
            node = this.setPositions(node);
        }
        this.nodeDataSet.update(nodes);
    }

    removeNodeAndEdge(node: LeanDiNode[]) {
        // if (this.network.getConnectedEdges(node[0]['id'] as IdType).length == 1) {
        //     this.deleteSwitch(node[0]);
        //     this.nodeDataSet.remove(node[0]['id'] as IdType);
        //     this.fixedNodes.splice(this.fixedNodes.indexOf(node[0]['id'] as string), 1);
        let edge: Edge[] = this.edgeDataSet.get({
            filter: (edge) => {
                return (edge.from == node[0]['id'] && edge.to == this.activeNode!.id || edge.to == node[0]['id'] && edge.from == this.activeNode!.id);
            }, fields: ['id']
        })
        this.edgeDataSet.remove(edge[0]['id']!);

    }


    changeAttributeKnotation(checked: boolean, dataRange?: DataRange) {
        if (this.activeNode != null) {
            if (checked) {
                let knot = this.addKnot();
                this.activeNode.knotRange = knot.mnemonic;
                this.edgeDataSet.add(this.fillEdge(this.activeNode.id!.toString(), knot.id));
                this.activeNode!.dataRange = null;
                this.activeNode!.json = null;
            } else {
                let node: Knot[] = (this.nodeDataSet.get() as LeanDiNode[])
                    .filter((node) => node.type == NodeType.KNOT && node.mnemonic == this.activeNode!.knotRange!);
                if (node.length != 0) {
                    // this.replaceColumnInAssociatedIndexes(this.activeNode!.knotRange as string);
                    this.removeNodeAndEdge(node);
                    this.activeNode.knotRange = null;
                    this.activeNode.dataRange = dataRange ? dataRange : node[0].dataRange;
                }
            }
            this.activeNode = this.domainRenderer.renderDefaultFigure(this.activeNode);
            this.activeNode = this.setPositions(this.activeNode);
            this.nodeDataSet.update([this.activeNode!]);
            this.activeNode = this.domainRenderer.switchRender(this.activeNode!);
            this.nodeDataSet.update([this.activeNode!]);
        }
        this.knots = (this.nodeDataSet.get() as LeanDiNode[])
            .filter(node => node.type == NodeType.KNOT)
            .map(node => {
                return node.mnemonic
            }) as string[];
    }

    changeTieKnotation(checked: boolean) {
        if (this.activeNode != null) {
            if (checked) {
                let knot = this.addKnot() as LeanDiNode;
                this.activeNode['knotRole'] = [
                    createDefaultTieRole(knot.mnemonic!, undefined, DefaultValues.ROLE,
                        false, knot.description) as KnotRole];
                this.edgeDataSet.add(this.fillEdge(this.activeNode.id!.toString(), knot.id as string, DefaultValues.ROLE_I));
                this.activeNode!.descriptor += StringUtils.UNDERLINE + this.activeNode!.knotRole[0].type + StringUtils.UNDERLINE + this.activeNode!.knotRole[0].role;
                if (this.labeledAll) {
                    this.activeNode!.label = this.activeNode!.descriptor;
                } else {
                    this.activeNode!.label = " ";
                }
            } else {
                let node: Knot[] = (this.nodeDataSet.get() as LeanDiNode[])
                    .filter((node) => node['type'] == NodeType.KNOT && node['mnemonic'] == this.activeNode!.knotRole![0]['type']);
                this.activeNode!.descriptor = this.activeNode!.descriptor?.replace(node[0].mnemonic + StringUtils.UNDERLINE + this.activeNode!.knotRole![0]['role'], "*");
                this.activeNode!.descriptor = this.activeNode!.descriptor!.replace("*_", StringUtils.EMPTY_STRING);
                this.activeNode!.descriptor = this.activeNode!.descriptor!.replace("_*", StringUtils.EMPTY_STRING);
                if (this.labeledAll) {
                    this.activeNode!.label = this.activeNode!.descriptor;
                } else {
                    this.activeNode!.label = " ";
                }
                // this.replaceColumnInAssociatedIndexes(this.activeNode.knotRole![0]['type'] as string);
                this.removeNodeAndEdge(node);
                this.activeNode.knotRole = null;
            }
            this.knots = (this.nodeDataSet.get() as LeanDiNode[])
                .filter(node => node.type == NodeType.KNOT)
                .map(node => {
                    return node.mnemonic
                }) as string[];
            this.nodeDataSet.update([this.activeNode]);
        }
        this.knots = (this.nodeDataSet.get() as LeanDiNode[])
            .filter(node => node.type == NodeType.KNOT)
            .map(node => {
                return node.mnemonic
            }) as string[];
    }


    changeTieHistoricity(node: LeanDiNode) {
        if (isStrEmpty(node.timeRange)) {
            // this.replaceColumnInAssociatedIndexes('changedat');
        }
        return node;
    }

    changeAttributeHistoricity(node: LeanDiNode) {
        if (isStrEmpty(node.timeRange)) {
            node.layered = undefined;
            // this.replaceColumnInAssociatedIndexes('changedat');
        }
        return node;
    }


    setKnots() {
        this.knots = (this.nodeDataSet.get() as LeanDiNode[])
            .filter(node => node.type == NodeType.KNOT)
            .map(node => {
                return node.mnemonic
            }) as string[];
        // if (this.activeNode!.type == NodeType.ATTRIBUTE) {
        const connectedKnots = ((this.nodeDataSet
            .get(this.network.getConnectedNodes(this.activeNode!.id as string) as string[]) as LeanDiNode[])
            .filter(node => node.type == NodeType.KNOT))
            .map(node => {
                return node.mnemonic
            });
        this.knots = this.knots.filter(knot => connectedKnots.indexOf(knot) == -1);
        // }
    }

    getAnchorsFqn() {
        const descriptors: string[] = [];
        const mnemonics: string[] = [];
        (this.nodeDataSet.get({
            filter: (node: LeanDiNode) => (node.type == NodeType.ANCHOR ||
                    node.type == NodeType.TX_ANCHOR || node.type == NodeType.CD_ANCHOR) &&
                node.uid != this.activeNode!.uid,
            fields: ['descriptor', 'mnemonic']
        }) as LeanDiNode[]).forEach(node => {
            descriptors.push(node.descriptor as string);
            mnemonics.push(node.mnemonic as string);
        });
        return [descriptors, mnemonics];
    }

    getAttributeFqn() {
        const descriptors: string[] = [];
        const mnemonics: string[] = [];
        const anchor: Anchor = this.nodeDataSet.get(this.network.getConnectedNodes(this.activeNode!.id as string) as string[], {
            filter: (node: LeanDiNode) => node.type == NodeType.ANCHOR
                || node.type == NodeType.TX_ANCHOR,
            fields: ['id']
        })[0];
        (this.nodeDataSet.get(this.network.getConnectedNodes(anchor.id as string) as string[], {
            filter: (node: LeanDiNode) => node.type == NodeType.ATTRIBUTE && node.uid != this.activeNode!.uid,
            fields: ['descriptor', 'mnemonic']
        }) as LeanDiNode[]).forEach(node => {
            descriptors.push(node.descriptor as string);
            mnemonics.push(node.mnemonic as string);
        });
        return [descriptors, mnemonics];
    }

    getKnotFqn() {
        const descriptors: string[] = [];
        const mnemonics: string[] = [];
        (this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.type == NodeType.KNOT && node.uid != this.activeNode!.uid,
            fields: ['descriptor', 'mnemonic']
        }) as LeanDiNode[]).forEach(node => {
            // descriptors.push(node.descriptor as string);
            mnemonics.push(node.mnemonic as string);
        });
        return [descriptors, mnemonics];
    }

    updateMetadataLayout() {
        switch (this.activeNode!.type) {
            case NodeType.ANCHOR: {
                this.nodeEditor = new AnchorEditorDialog();
                this.nodeEditor.setFqn(this.getAnchorsFqn());
                break;
            }
            case NodeType.ATTRIBUTE: {
                this.nodeEditor = new AttributeEditorDialog();
                this.nodeEditor.setFqn(this.getAttributeFqn());
                break
            }
            case NodeType.TIE: {
                this.nodeEditor = new TieEditorDialog();
                break
            }
            case NodeType.TX_ANCHOR: {
                this.nodeEditor = new TxAnchorEditorDialog();
                this.nodeEditor.setFqn(this.getAnchorsFqn());
                break
            }
            case NodeType.KNOT: {
                // this.createKnotEditorComponent();
                this.nodeEditor = new KnotEditorDialog();
                this.nodeEditor.setFqn(this.getKnotFqn());
                break
            }
            case NodeType.CD_ANCHOR: {
                this.nodeEditor = new CdAnchorEditorDialog();
                this.nodeEditor.setFqn(this.getAnchorsFqn());
                break
            }
        }
        this.nodeEditor.open(copy(this.activeNode!));
        this.nodeEditor.setKnots(this.knots);
        this.nodeEditor?.addEventListener('edit-node', (e: Event) => {
            const node = event(e).detail as LeanDiNode;
            this.handleNodeUpdating(node);
            this.handleDownload();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
        });
    }

    initInputEvent() {

    }

    replaceColumnInAssociatedIndexes(node: LeanDiNode, oldColumnName: string, newColumnName?: string) {
        if (isArrayNotEmpty(node.indexes)) {
            const indexes = [];
            for (let idx of node.indexes!) {
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
                node.indexes = indexes;
            }
        }
        return node;
    }

    renewAttributeInAnchor(attribute?: Attribute) {
        let anchor: Anchor | TxAnchor;
        const node = attribute != null ? attribute : this.activeNode!;
        anchor = (this.nodeDataSet.get(this.network.getConnectedNodes(node?.id as IdType) as Id[]) as LeanDiNode[]).filter(
            node => node.type == NodeType.ANCHOR || node.type == NodeType.TX_ANCHOR)[0] as Node
        anchor.attribute![anchor.attribute!.findIndex((obj: Attribute) => obj.id == node?.id)] = node;
        // anchor = this.replaceColumnInAssociatedIndexes(anchor, this.activeNode!.mnemonic!, attribute!.mnemonic);
        // anchor = this.replaceColumnInAssociatedIndexes(anchor, this.activeNode!.descriptor!, attribute!.descriptor);
        anchor = this.setPositions(anchor);
        this.nodeDataSet.update(anchor);
    }

    addKnotRangeToextendedColumn(details: any) {
        if (details.knotRange != null) {
            let knot = (this.nodeDataSet.get({
                fields: ['id'],
                filter: (node: LeanDiNode) =>
                    node.mnemonic == details.knotRange && node.type == NodeType.KNOT
            }) as LeanDiNode[])[0] as LeanDiNode;
            const edges: Edge[] = this.edgeDataSet.get({
                fields: ['id'],
                filter: (edge) => edge.from == this.activeNode!.id && edge.to == knot.id
            });
            if (edges.length == 0) {
                this.edgeDataSet.add(this.fillEdge(this.activeNode!.id!.toString(), knot.id as string, StringUtils.EMPTY_STRING, true, true));
            }
        }
        this.activeNode = this.domainRenderer.renderDefaultFigure(this.activeNode!);
        this.activeNode = this.setPositions(this.activeNode);
        this.nodeDataSet.update([this.activeNode!]);
        this.activeNode = this.domainRenderer.switchRender(this.activeNode!);
        this.nodeDataSet.update([this.activeNode]);
        return details;
    }

    getSelectedNode() {
        let nodeId = this.network.getSelectedNodes();
        let node: LeanDiNode = this.nodeDataSet.get(nodeId)[0]
        return node;
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.initTree();
        this.$server?.fillComponentRequest();
        this.lastId = 1000;
        addEventListener('keydown', (event) => {
            const key = event.key; // const {key} = event; ES6+
            if (key === "Delete") {
                // Do things
                this.switchDeleting();
                this.handleDownload();
            }
            if ((key == 'z' || key == 'Z') && event.ctrlKey && !event.shiftKey) {
                this.handleUndoEvent(<any>event);
            }
            if (((key == 'z' || key == 'Z') && event.ctrlKey && event.shiftKey)) {
                this.handleRedoEvent(<any>event);
            }
        });
        this.navigationBar.domainList = Object.keys(this.domains);
        this.navigationBar.requestUpdate();
    }

    switchDeleting() {
        const selectedEdge = this.network.getSelectedEdges();
        const selectedNode = this.network.getSelectedNodes();

        if (selectedEdge.length != 0 && selectedNode.length == 0) {
            this.deleteEdges(selectedEdge);
        }
        if (selectedNode.length != 0) {
            this.deleteNodes(selectedNode);
        }
        this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
    }

    detachAnchorFromAllAreas(node: Anchor) {
        this.areas = this.areas.map((area: Area) => {
            area.anchorRole = area.anchorRole?.filter((role: AnchorRole) => role.type != node.mnemonic);
            return area;
        });
    }

    deleteNodes(selectedNode: Id[]) {
        const nodes: LeanDiNode[] = this.nodeDataSet.get(selectedNode) as Node[];
        for (let node of nodes) {
            switch (node.type) {
                case NodeType.TIE : {
                    this.deleteEdges(this.network.getConnectedEdges(node.id as string));
                    break;
                }
                default: {
                    this.removeItemFromDomainOfHost();
                    this.deleteEdges(this.network.getConnectedEdges(node.id as string));
                    if (node.type == NodeType.ANCHOR) {
                        this.detachAnchorFromAllAreas(node);
                    }
                    this.nodeDataSet.remove(node.id as string);
                    break;
                }
            }
            this.deleteSwitch(node);
            this.network.setSelection({nodes: [], edges: []})
        }
    }

    deleteEdges(selectedEdge: Id[]) {
        for (let edgeId of selectedEdge) {
            const edge: Edge = this.edgeDataSet.get(edgeId) as Edge;
            const idLength = (edge.to!.toString() + edge.from!.toString()).length;
            switch (idLength) {
                case ConnectionType.ANCHOR_AND_ATTRIBUTE : {
                    this.deleteAttributeOfAnchor(edgeId);
                    break;
                }
                case ConnectionType.ATTRIBUTE_AND_KNOT : {
                    this.deleteKnotOfAttribute(edgeId);
                    break;
                }
                case ConnectionType.TIE_AND_KNOT : {
                    this.deleteKnotOfTie(edgeId);
                    break;
                }
                case ConnectionType.ANCHOR_AND_TX_ANCHOR : {
                    this.deleteEdgeOfTieOrTxAnchor(edgeId);
                    break;
                }
                case ConnectionType.TIE_AND_ANCHOR : {
                    this.deleteEdgeOfTieOrTxAnchor(edgeId);
                    break;
                }
                case ConnectionType.ANCHOR_AND_KNOT: {
                    this.deleteKnotOfAnchorOrTxAnchor(edgeId);
                }
            }
            this.network.setSelection({nodes: [], edges: []});
            // обязательный апдейт
        }
    }

    deleteAttributeOfAnchor(edgeId: IdType) {
        const nodes = (this.nodeDataSet.get(this.network.getConnectedNodes(edgeId) as IdType[]) as LeanDiNode[]);
        let attribute: Attribute = nodes
            .filter(node => node.type == NodeType.ATTRIBUTE)[0];
        let anchor: Anchor | TxAnchor = nodes
            .filter(node => node.type == NodeType.ANCHOR || node.type == NodeType.TX_ANCHOR)[0];
        let indexToDel = anchor.attribute!.findIndex((obj: Attribute) => obj.id == attribute.id);
        if (indexToDel != -1) {
            anchor.attribute!.splice(indexToDel, 1);
            this.nodeDataSet.remove(attribute.id as IdType);
        }
        anchor = this.setPositions(anchor);
        this.nodeDataSet.update(anchor);
        // this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts);
    }

    iterateextendedColumnAndRemoveKnot = (knot: LeanDiNode) => {
        if (isArrayNotEmpty(this.activeNode!.extendedColumn)) {
            for (let extendedColumnIndex = 0; extendedColumnIndex < this.activeNode!.extendedColumn!.length; extendedColumnIndex++) {
                if (this.activeNode!.extendedColumn![extendedColumnIndex].knotRange == knot.mnemonic) {
                    this.activeNode!.extendedColumn![extendedColumnIndex].dataRange = knot.dataRange!;
                    this.activeNode!.extendedColumn![extendedColumnIndex].knotRange = null;
                    this.removeNodeAndEdge([knot]);
                    break;
                }
            }
        }
    }

    deleteKnotOfAnchorOrTxAnchor(edgeId: IdType) {
        const nodes = (this.nodeDataSet.get(this.network.getConnectedNodes(edgeId) as IdType[]) as LeanDiNode[]);
        this.activeNode = nodes
            .filter(node => node.type == NodeType.ANCHOR || node.type == NodeType.TX_ANCHOR)[0];
        if (this.activeNode != null) {
            const knot = nodes
                .filter(node => node.type == NodeType.KNOT)[0];
            this.iterateextendedColumnAndRemoveKnot(knot);
        }
        this.activeNode = null;
        // this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts);
    }

    deleteKnotOfAttribute(edgeId: IdType) {
        const nodes = (this.nodeDataSet.get(this.network.getConnectedNodes(edgeId) as IdType[]) as LeanDiNode[]);
        this.activeNode = nodes
            .filter(node => node.type == NodeType.ATTRIBUTE)[0];
        if (this.activeNode != null) {
            const knot = nodes
                .filter(node => node.type == NodeType.KNOT)[0];
            if (this.activeNode.knotRange == knot.mnemonic) {
                this.changeAttributeKnotation(false);
            } else {
                this.iterateextendedColumnAndRemoveKnot(knot);
            }
            this.activeNode = this.domainRenderer.renderDefaultFigure(this.activeNode);
            this.activeNode = this.setPositions(this.activeNode);
            this.nodeDataSet.update([this.activeNode!]);
            this.activeNode = this.domainRenderer.switchRender(this.activeNode!);
            this.nodeDataSet.update([this.activeNode!]);
            this.renewAttributeInAnchor(this.activeNode);
            this.activeNode = null;
        }

    }

    deleteKnotOfTie(edgeId: IdType) {
        const nodes = (this.nodeDataSet.get(this.network.getConnectedNodes(edgeId) as IdType[]) as LeanDiNode[]);
        this.activeNode = nodes.filter(node => node.type == NodeType.TIE)[0];
        if (this.activeNode != null) {
            const knot = nodes.filter(node => node.type == NodeType.KNOT)[0];
            if (this.activeNode!.knotRole != null && this.activeNode.knotRole!.length == 1
                && this.activeNode.knotRole[0].type == knot.mnemonic) {
                this.activeNode = this.replaceColumnInAssociatedIndexes(this.activeNode, knot.mnemonic!.toUpperCase());
                this.changeTieKnotation(false);
            } else {
                this.iterateextendedColumnAndRemoveKnot(knot);
            }
        }
        this.activeNode = null;
        // this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts);
    }

    initTree() {
        const data = {nodes: this.nodeDataSet, edges: this.edgeDataSet,};

        const options = {
            "edges": {
                "smooth": {
                    "forceDirection": "none"
                },
                "color": {
                    "highlight": this.chosenEdgeColor,
                    "inherit": false
                }

            },
            "nodes": {
                "font": {
                    "size": 12,
                    "color": DEFAULT_FONT_COLOR
                }
            },
            "physics": {
                "barnesHut": {
                    "gravitationalConstant": -1700,
                    "centralGravity": 0,
                    "springLength": 235,
                    "damping": 0.15,
                    "avoidOverlap": 5
                },
                "maxVelocity": 21,
                "minVelocity": 0.75,
                "timestep": 0.72
            },
            "interaction": {
                "keyboard": true,
                "multiselect": true,
                "hover": true
            },
        }
        // @ts-ignore
        this.network = new Network(this.shadowRoot!.getElementById("customId")!, data, options);
        this.network.moveTo({scale: 0.25})
    }

    setPositions(node: any) {
        let nodePosition = this.network.getPositions([node['id']]);
        node['x'] = nodePosition[node['id']].x;
        node['y'] = nodePosition[node['id']].y;
        return node;
    }

    addKnot() {
        let node = this.domainParser.createKnotNodeTemplate(this.activeNode!, this.network.getViewPosition());
        node = this.domainParser.fillKnotFigure(node);
        this.nodeDataSet.add([node]);
        this.knots = (this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.type == NodeType.KNOT,
            fields: ['mnemonic']
        }) as LeanDiNode[]).map(node => node.mnemonic) as string[];
        this.changeLabeling();
        return node;
    }

    handleZoom(e: CustomEvent) {
        if (e.detail == 'zoom-plus') {
            if (this.network.getScale() * 1.3 <= 1.5) {
                // return;
                this.scale = this.scale * 1.3;
                this.network.moveTo({scale: this.scale});
            }
        } else {
            if (this.network.getScale() / 1.3 >= 0.2) {
                // return;
                this.scale = this.scale / 1.3;
                this.network.moveTo({scale: this.scale});
            }
        }
    }

    handleUpload(e: CustomEvent) {
        // this.upload!.click();
        this.activeNode = null;
        this.$server?.openUpload();
    }

    setSelection(nodeId: string) {
        this.network.focus(nodeId as string, {scale: 1, animation: true, offset: {x: 0, y: -100}});
        this.activeNode = this.nodeDataSet.get(nodeId) as LeanDiNode;
        this.switchMenuBar();
        this.updateMetadataLayout();
        this.network.selectNodes([nodeId as string], true);
        if (this.buffered) {
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
            this.buffered = false;
        }
    }

    handleSearch(e: CustomEvent) {

        this.setSelection(e.detail as string)

    }

    handlePin(e: CustomEvent) {
        if (this.pinAll) {
            this.nodeDataSet.forEach(node => {
                if (!this.fixedNodes.includes(node.id as string)) {
                    this.nodeDataSet.update({id: node.id, fixed: true});
                    this.fixedNodes.push(node.id as string)
                }
            });

            this.pinAll = false;
        } else {
            this.nodeDataSet.forEach(node => {
                if (this.fixedNodes.includes(node.id as string)) {
                    this.nodeDataSet.update({id: node.id, fixed: false});
                }
            });
            this.fixedNodes = [];
            this.pinAll = true;
        }
    }

    addAnchor() {
        let node = this.domainParser.createAnchorNodeTemplate(this.network.getViewPosition());
        node = this.domainParser.fillAnchorFigure(node);
        this.nodeDataSet.add([node]);
        this.connectNodes(node);
        this.chosenNodeType = NodeType.NO_TYPE;
        this.network.unselectAll();
        return node;
    }

    addCdAnchor(detail: { [index: string]: string }) {
        let node = this.domainParser.createCdAnchorNodeTemplate(this.network.getViewPosition(), detail) as CdAnchor;
        node = this.domainParser.fillCdAnchorFigure(node);
        node.cdMnemonic = detail.anchor.split(StringUtils.UNDERLINE)[0];
        node.connectedAnchorDescriptor = detail.anchor.split(StringUtils.UNDERLINE)[1];
        node.cdDomain = detail.domain;
        node.connexionUid = generateUid();
        node.ownDomain = this.domainShortName;
        this.nodeDataSet.add([node]);
        this.connectNodes(node);
        this.chosenNodeType = NodeType.NO_TYPE;
        this.network.unselectAll();
        const anchorRole = createDefaultTieRole(
            node.mnemonic!,
            undefined,
            DefaultValues.ROLE,
            true) as AnchorRole;
        anchorRole.domain = this.domainShortName;
        const cdAnchorRole = createDefaultTieRole(
            node.cdMnemonic!,
            undefined,
            DefaultValues.ROLE,
            false) as AnchorRole;
        cdAnchorRole.domain = node.cdDomain;
        let connexion: Connexion = {
            anchorRole: [anchorRole, cdAnchorRole],
            descriptor: this.domainShortName + Arrow.SPACED_TO + node.cdDomain,
            uid: node.connexionUid
        }
        this.connexions.push(connexion)
        return node;
    }

    addCdAnchoredTie(detail: { [index: string]: string }) {
        this.buffered = true;
        let tie = this.addTie();
        let anchor = this.addCdAnchor(detail);
        let edge = this.fillEdge(tie['id'], anchor['id'] as string, DefaultValues.ROLE_I);
        this.edgeDataSet.add([edge]);
        this.fillAnchorKnotRoleByTie(tie);
        this.changeLabeling();
    }

    addTxAnchor() {
        let node = this.domainParser.createTxAnchorNodeTemplate(++this.lastId, this.network.getViewPosition());
        node = this.domainParser.fillTxAnchorFigure(node);
        this.addTieToLayoutProperties(node);
        this.fillAnchorKnotRoleByTie(node);
        return node;
    }

    addTieToLayoutProperties(node: object) {
        this.nodeDataSet.add([node]);
        this.connectNodes(node);
        this.chosenNodeType = NodeType.NO_TYPE;
        this.network.unselectAll();
    }

    addTie() {
        let node = this.domainParser.createTieNodeTemplate(++this.lastId, this.activeNode!);
        node = this.domainParser.fillTieFigure(node);
        this.addTieToLayoutProperties(node);
        this.fillAnchorKnotRoleByTie(node);
        return node;
    }

    addSelfTie() {
        let node = this.domainParser.createTieNodeTemplate(++this.lastId, this.activeNode!);
        node = this.domainParser.fillTieFigure(node);
        this.nodeDataSet.add(node as unknown as Node);
        this.edgeDataSet.add([this.fillEdge(node.id, this.activeNode!.id!.toString(), DefaultValues.ROLE_I),
            this.fillEdge(node.id, this.activeNode!.id!.toString(), DefaultValues.ROLE_I)]);
        this.fillAnchorKnotRoleByTie(node, true);
        this.chosenNodeType = NodeType.NO_TYPE;
        this.network.unselectAll();
    }

    addHistoricalTie() {
        let node = this.domainParser.createTieNodeTemplate(++this.lastId, this.activeNode!) as unknown as Tie;
        node.timeRange = DataRange.BIGINT;
        node = this.domainParser.fillTieFigure(node);
        this.addTieToLayoutProperties(node);
        this.fillAnchorKnotRoleByTie(node);
        return node;
    }

    addAnchoredTie() {
        let tie = this.addTie();
        let anchor = this.addAnchor();
        let edge = this.fillEdge(tie['id'], anchor['id'] as string, DefaultValues.ROLE_I);
        this.edgeDataSet.add([edge]);
        this.fillAnchorKnotRoleByTie(tie);
    }

    fillAnchorKnotRoleByTie(node: any, self?: boolean) {
        for (let edgeId of this.network.getConnectedEdges(node.id)) {
            const edge = this.edgeDataSet.get(edgeId);
            if ((edge!.to! as string).length == 2) {
                const childNode = this.nodeDataSet.get(edge!.to as string) as LeanDiNode;
                const [role, identifier] = getRoleAndIdentifier(edge!.label!);
                const anchorRole = createDefaultTieRole(childNode.mnemonic!,
                    edgeId,
                    role as string,
                    identifier as boolean,
                    undefined);

                if (node.anchorRole != null) {
                    if (!self && node.anchorRole?.filter((anchorRole: { type: any; }) => anchorRole.type == childNode.mnemonic).length != 0) {
                        continue;
                    }
                    node.anchorRole.push(anchorRole);
                } else {
                    node.anchorRole = [anchorRole]
                }
            }
        }
        if (node.type == NodeType.TIE) {
            node.descriptor = node.anchorRole!.map((x: AnchorRole) => {
                return x.type + StringUtils.UNDERLINE + x.role
            }).join(StringUtils.UNDERLINE);
            if (isArrayNotEmpty(node.knotRole)) {
                node.descriptor = node.descriptor + StringUtils.UNDERLINE + node.knotRole[0].type + StringUtils.UNDERLINE + node.knotRole[0].role;
            }
        }

        this.nodeDataSet.update(node)
    }

    fillAnchorKnotRoleByAnchor(anchor: Anchor) {
        const keys = [NodeKeys.TYPE, NodeKeys.ANCHOR_ROLE, NodeKeys.ID];
        let ties = this.getConnectedTies(anchor.id as string, ...keys);
        let txAs = this.getConnectedTxAnchors(anchor.id as string, ...keys);
        const edges: LeanDiEdge[] = this.edgeDataSet
            .get(this.network.getConnectedEdges(anchor.id as string), {
                filter: (edge: Edge) => edge.to == anchor.id
            });
        const x = (node: LeanDiNode) => {
            let edge = edges.filter(e => e.from == node.id)[0];
            const template = createDefaultTieRole(anchor.mnemonic!, edge.id);
            edge.label = DefaultValues.ROLE_I;
            if (node.type == NodeType.TX_ANCHOR) {
                edge.arrows = Arrow.TO;
            }
            if (node.anchorRole == null || node.anchorRole.length == 0) {
                node.anchorRole = [template]
            } else {
                node.anchorRole.push(template);
            }
            if (node.type == NodeType.TIE) {
                node.descriptor += StringUtils.UNDERLINE + template.type + StringUtils.UNDERLINE + template.role;
            }
            edges.push(edge);
            node = this.setPositions(node);
            return node;
        }
        ties = ties.map((node: LeanDiNode) => x(node));
        txAs = txAs.map((node: LeanDiNode) => x(node));
        this.edgeDataSet.update(edges);
        this.nodeDataSet.update([...ties, ...txAs]);
    }

    addAnchoredHistoricalTie() {
        let tie = this.addHistoricalTie();
        let anchor = this.addAnchor();
        let edge = this.fillEdge(tie.id as string, anchor.id as string, DefaultValues.ROLE_I);
        this.edgeDataSet.add([edge]);
        this.fillAnchorKnotRoleByTie(tie);
    }

    addAttribute() {
        let node = this.domainParser.createAttributeNodeTemplate(this.network, this.activeNode!);
        node.extendedColumn = [];
        node = this.domainParser.fillAttributeFigure(node, ++this.indexId);
        this.addAttributeToLayoutProperties(node);
        return node;
    }

    addHistoricalAttribute() {
        let node = this.domainParser.createAttributeNodeTemplate(this.network, this.activeNode!);
        node.timeRange = DataRange.BIGINT;
        node.extendedColumn = [];
        node = this.domainParser.fillAttributeFigure(node, ++this.indexId);
        this.addAttributeToLayoutProperties(node);
        return node;
    }

    addComposedAttribute() {
        let node = this.domainParser.createAttributeNodeTemplate(this.network, this.activeNode!);
        node.extendedColumn = [createDefaultextendedColumn()];
        node = this.domainParser.fillAttributeFigure(node, ++this.indexId);
        this.addAttributeToLayoutProperties(node);
        return node;
    }

    addAttributeToLayoutProperties(node: Attribute) {
        this.nodeDataSet.add([node]);
        this.connectNodes(node);
        this.chosenNodeType = NodeType.NO_TYPE;
        this.network.unselectAll();
    }

    connectTieAndTxAnchor() {
        const nodes = this.getSelectedNodes();

        let anchor = nodes.filter(node => node.type == NodeType.TX_ANCHOR)[0];
        let tie = nodes.filter(node => node.type == NodeType.TIE)[0];

        let edge = this.fillEdge(tie.id as string, anchor.id as string, DefaultValues.ROLE_I);
        const template = createDefaultTieRole(anchor.mnemonic!, edge.id);
        if (tie.anchorRole == null || tie.anchorRole.length == 0) {
            tie.anchorRole = [template]
        } else {
            tie.anchorRole.push(template);
        }
        tie = this.setPositions(tie);
        this.nodeDataSet.update(tie as Node);
        this.edgeDataSet.add([edge]);
    }

    connectTxAnchors() {
        const nodes = this.nodeDataSet.get(this.activeTxAnchors);
        let parentTx = nodes[0] as TxAnchor;
        const childTx = nodes[1] as TxAnchor;
        let edge = this.fillEdge(parentTx['id'] as string, childTx['id'] as string, DefaultValues.ROLE_I, true);
        const template = createDefaultTieRole(childTx.mnemonic!, edge.id);
        if (parentTx.anchorRole == null || parentTx.anchorRole.length == 0) {
            parentTx.anchorRole = [template]
        } else {
            parentTx.anchorRole.push(template);
        }
        parentTx = this.setPositions(parentTx);
        this.nodeDataSet.update(parentTx as Node);
        this.edgeDataSet.add([edge]);
    }

    connectAnchorToTie() {
        const nodes = this.getSelectedNodes();
        let anchor = nodes.filter(node => node.type == NodeType.ANCHOR)[0];
        let tie = nodes.filter(node => node.type == NodeType.TIE || node.type == NodeType.TX_ANCHOR)[0];
        let edge = this.fillEdge(tie.id as string, anchor.id as string,
            DefaultValues.ROLE_I, tie.type == NodeType.TX_ANCHOR);
        const template = createDefaultTieRole(anchor.mnemonic!, edge.id);
        if (tie.anchorRole == null || tie.anchorRole.length == 0) {
            tie.anchorRole = [template]
        } else {
            tie.anchorRole.push(template);
        }
        tie = this.setPositions(tie);
        this.nodeDataSet.update(tie as Node);
        this.edgeDataSet.add([edge]);
    }

    connectKnotWithTieOrAttribute() {
        const nodes = this.getSelectedNodes();
        const knot = nodes.filter(node => (node.type == NodeType.KNOT))[0];
        let tie = nodes.filter(node => node.type == NodeType.TIE)[0];
        let attribute = nodes.filter(node => node.type == NodeType.ATTRIBUTE)[0];
        if (tie != null) {
            tie = this.connectTieWithKnot(tie, knot)
            this.nodeDataSet.update(tie as Node);
        } else if (attribute != null) {
            attribute = this.domainRenderer.renderDefaultFigure(attribute);
            this.nodeDataSet.update(attribute as Node);
            attribute = this.connectAttributeWithKnot(attribute, knot);
            attribute = this.domainRenderer.switchRender(attribute);
            this.nodeDataSet.update(attribute as Node);
            this.renewAttributeInAnchor(attribute as Node);
        }
    }

    disconnectTieFromKnot(knot: Knot) {
        let descriptor;
        descriptor = this.activeNode!.descriptor!.replace(knot.mnemonic + StringUtils.UNDERLINE + this.activeNode!.knotRole![0]['role'], "*");
        descriptor = descriptor!.replace("*_", StringUtils.EMPTY_STRING);
        descriptor = descriptor!.replace("_*", StringUtils.EMPTY_STRING);
        this.removeNodeAndEdge([knot]);
        return descriptor;
    }

    connectTieWithKnot(tie: Tie, knot: Knot, oldRole?: KnotRole) {
        tie.knotRole = [oldRole ? oldRole : createDefaultTieRole(knot.mnemonic!) as KnotRole];
        tie.descriptor += StringUtils.UNDERLINE + tie.knotRole[0].type + StringUtils.UNDERLINE + tie!.knotRole[0].role;
        tie = this.setPositions(tie);
        let edge = this.fillEdge(tie.id as string, knot.id as string);
        edge.label = oldRole ? (oldRole.role! + (oldRole.identifier ? ", |" : ", |||")) : DefaultValues.ROLE_I;
        edge.color = oldRole ? oldRole.color : BLACK;
        this.edgeDataSet.add([edge]);
        return tie;
    }

    connectAttributeWithKnot(attribute: Attribute, knot: Knot) {
        attribute.knotRange = knot.mnemonic;
        attribute.dataRange = null;
        attribute = this.setPositions(attribute);
        let edge = this.fillEdge(attribute.id as string, knot.id as string);
        this.edgeDataSet.add([edge]);
        return attribute;
    }

    disconnectAttributeFromKnot(attribute: Attribute, knot: Knot) {
        this.removeNodeAndEdge([knot]);
        if (isStrEmpty(attribute.dataRange)) {
            attribute.dataRange = knot.dataRange;
        }
        return attribute;
    }

    disconnectextendedColumnFromKnot(knot: Knot) {
        this.removeNodeAndEdge([knot]);
    }

    connectNodes(node: any) {
        for (let i = 0; i < this.network.getSelectedNodes().length; i++) {
            try {
                let edge = null;
                switch (node.type) {
                    case NodeType.TIE: {
                        edge = this.fillEdge(node['id'], this.network.getSelectedNodes()[i].toString(), DefaultValues.ROLE_I);
                        break;
                    }
                    case NodeType.TX_ANCHOR: {
                        edge = this.fillEdge(node['id'], this.network.getSelectedNodes()[i].toString(), DefaultValues.ROLE_I, true);
                        break;
                    }
                    default: {
                        edge = this.fillEdge(this.network.getSelectedNodes()[i].toString(), node['id']);
                        break;
                    }
                }
                this.edgeDataSet.add([edge]);
                let parentNode = this.nodeDataSet.get(this.network.getSelectedNodes()[i]) as LeanDiNode;
                if ((parentNode.type == NodeType.ANCHOR || parentNode.type == NodeType.TX_ANCHOR) && node.type == NodeType.ATTRIBUTE) {
                    if (parentNode.attribute != null) {
                        parentNode.attribute.push(node);
                    } else {
                        parentNode.attribute = [node];
                    }
                }
            } catch (err) {
                console.log(err)
            }
        }
        if (node['type'] != NodeType.KNOT && node['type'] != NodeType.ATTRIBUTE) {
            this.network.unselectAll();
        }
    }

    noteNodeAsOld(node: LeanDiNode) {
        node['isNew'] = false;
        node = this.setPositions(node);
        return node;
    }

    handleDownload(doMarshall?: boolean) {

        // this.nodeDataSet.update(this.nodeDataSet.get().map(node => this.setPositions(node)));

        let newKnots: Knot[] = [];
        let oldKnots: Knot[] = [];

        let newAnchors: Anchor[] = [];
        let oldAnchors: Anchor[] = [];

        let newTies: Tie[] = [];
        let oldTies: Tie[] = [];

        let newTxAnchors: TxAnchor[] = [];
        let oldTxAnchors: TxAnchor[] = [];

        let newCdAnchors: CdAnchor[] = [];
        let oldCdAnchors: CdAnchor[] = [];

        const checkNew = (item: LeanDiNode) => item.isNew != null && item.isNew;
        const nodes = (this.nodeDataSet.get() as LeanDiNode[]);
        nodes.forEach((node: LeanDiNode) => {
            switch (node.type) {
                case NodeType.KNOT:
                    if (checkNew(node)) {
                        newKnots.push(node);
                    } else {
                        oldKnots.push(node);
                    }
                    break;
                case NodeType.ANCHOR:
                    if (checkNew(node)) {
                        newAnchors.push(node);
                    } else {
                        oldAnchors.push(node);
                    }
                    break;
                case NodeType.TIE:
                    if (checkNew(node)) {
                        newTies.push(node);
                    } else {
                        oldTies.push(node);
                    }
                    break;
                case NodeType.TX_ANCHOR:
                    if (checkNew(node)) {
                        newTxAnchors.push(node);
                    } else {
                        oldTxAnchors.push(node);
                    }
                    break;
                case NodeType.CD_ANCHOR:
                    if (checkNew(node)) {
                        newCdAnchors.push(node);
                    } else {
                        oldCdAnchors.push(node);
                    }
                    break;
            }
        })

        this.$server?.addKnot(JSON.stringify(newKnots.map(node => mapNodeToKnot(node))));
        this.$server?.updateKnot(JSON.stringify(oldKnots.map(node => mapNodeToKnot(node))));
        this.$server?.deleteKnot(this.knotsToDelete.join(StringUtils.COMMA));

        this.$server?.addAnchor(JSON.stringify(newAnchors.map(node => mapNodeToAnchor(node))));
        this.$server?.updateAnchor(JSON.stringify(oldAnchors.map(node => mapNodeToAnchor(node))));
        this.$server?.deleteAnchor(this.anchorsToDelete.join(StringUtils.COMMA));

        this.$server?.addTie(JSON.stringify(newTies.map(node => mapNodeToTie(node))));
        this.$server?.updateTie(JSON.stringify(oldTies.map(node => mapNodeToTie(node))));
        this.$server?.deleteTie(this.tiesToDelete.join(StringUtils.COMMA));

        this.$server?.addTxAnchor(JSON.stringify(newTxAnchors.map(node => mapNodeToTxAnchor(node))));
        this.$server?.updateTxAnchor(JSON.stringify(oldTxAnchors.map(node => mapNodeToTxAnchor(node))));
        this.$server?.deleteTxAnchor(this.txAnchorsToDelete.join(StringUtils.COMMA));

        this.$server?.addCdAnchor(JSON.stringify(newCdAnchors.map(node => mapNodeToCdAnchor(node))));
        this.$server?.updateCdAnchor(JSON.stringify(oldCdAnchors.map(node => mapNodeToCdAnchor(node))));
        this.$server?.deleteCdAnchor(this.cdAnchorsToDelete.join(StringUtils.COMMA));

        this.$server?.updateConnexions(JSON.stringify(this.connexions.map(node => mapToConnexion(node))));
        this.$server?.deleteConnexions(this.connexionsToDelete.join(StringUtils.COMMA));

        this.$server?.updateArea(JSON.stringify(this.areas.map(area => mapArea(area))));

        const currentHosts = this.history.current!.hosts as any[];

        this.itemsToAdd = getDifferenceInHostsByKeys(currentHosts, this.referenceHosts);
        this.itemsToDelete = getDifferenceInHostsByKeys(this.referenceHosts, currentHosts);

        this.$server?.addItem(JSON.stringify(this.itemsToAdd));
        this.$server?.deleteItem(JSON.stringify(this.itemsToDelete));

        newKnots = newKnots.map(node => this.noteNodeAsOld(node as LeanDiNode));
        oldKnots = oldKnots.map(node => this.noteNodeAsOld(node as LeanDiNode));
        newAnchors = newAnchors.map(node => this.noteNodeAsOld(node as LeanDiNode));
        oldAnchors = oldAnchors.map(node => this.noteNodeAsOld(node as LeanDiNode));
        newTies = newTies.map(node => this.noteNodeAsOld(node as LeanDiNode));
        oldTies = oldTies.map(node => this.noteNodeAsOld(node as LeanDiNode));
        newTxAnchors = newTxAnchors.map(node => this.noteNodeAsOld(node as LeanDiNode));
        oldTxAnchors = oldTxAnchors.map(node => this.noteNodeAsOld(node as LeanDiNode));
        newCdAnchors = newCdAnchors.map(node => this.noteNodeAsOld(node as LeanDiNode));
        oldCdAnchors = oldCdAnchors.map(node => this.noteNodeAsOld(node as LeanDiNode));

        this.itemsToAdd = [];
        this.itemsToDelete = [];


        this.referenceHosts = structuredClone(currentHosts);

        this.nodeDataSet.update(newKnots);
        this.nodeDataSet.update(oldKnots);
        this.nodeDataSet.update(newAnchors);
        this.nodeDataSet.update(oldAnchors);
        this.nodeDataSet.update(newTies);
        this.nodeDataSet.update(oldTies);
        this.nodeDataSet.update(newTxAnchors);
        this.nodeDataSet.update(oldTxAnchors);
        this.nodeDataSet.update(newCdAnchors);
        this.nodeDataSet.update(oldCdAnchors);

        this.$server?.updateDomainInProject();

        if (doMarshall) {
            this.$server?.marshall();
        }
    };

    allNodesIsTypedAs(nodeType: any) {
        let array = this.nodeDataSet.get(this.network.getSelectedNodes(), {
            filter: (node: LeanDiNode) => (node.type != nodeType),
            fields: ['id']
        });
        return array.length == 0;
    }

    isKnotThere() {
        const nodes = this.nodeDataSet.get(this.network.getSelectedNodes()) as LeanDiNode[];
        let array = nodes.filter(node => (node.type == NodeType.KNOT));
        if (array.length != 0) {
            let attribute = nodes.filter(node =>
                node.type == NodeType.ATTRIBUTE && (node.knotRange == null || node.knotRange == StringUtils.EMPTY_STRING)
                && this.nodeDataSet.get(this.network.getConnectedNodes(node.id as string) as string[])
                    .filter((n: LeanDiNode) => n.type == NodeType.KNOT).length == 0
            );
            if (attribute.length != 0) {
                return true;
            } else {
                attribute = nodes.filter(node =>
                    node.type == NodeType.TIE && (node.knotRole == null || node.knotRole.length == 0)
                );
                if (attribute.length != 0) {
                    return true;
                }
            }
        }
        return false;
    }

    isAnchorAndTie() {
        const nodes = (this.nodeDataSet.get(this.network.getSelectedNodes()) as LeanDiNode[]);
        let array = nodes
            .filter(node => node.type == NodeType.ANCHOR);
        if (array.length != 0) {
            let tie = nodes.filter(node => node.type == NodeType.TIE || node.type == NodeType.TX_ANCHOR);
            if (tie.length != 0) {
                return true;
            }
        }
        return false;
    }

    isTxAnchorAndTie() {
        const nodes = (this.nodeDataSet.get(this.network.getSelectedNodes()) as LeanDiNode[]);
        let array = nodes
            .filter(node => node.type == NodeType.TX_ANCHOR);
        if (array.length != 0) {
            let tie = nodes.filter(node => node.type == NodeType.TIE);
            if (tie.length != 0) {
                return true;
            }
        }
        return false;
    }

    // Точка старта на фронт приложения. Бэк вызывает этот метод, передавая в него узлы.
    getTree(json?: string) {

        let data = JSON.parse(json!);

        let connexions = data.connexions;
        let anchors = data.anchors;
        let knots = data.knots;
        let ties = data.ties;
        let txAnchors = data.txAnchors;
        let cdAnchors = data.cdAnchors;
        let domainsMap = data.domainsMap;
        let focusAnchor = data.focusAnchor;
        this.groups = JSON.parse(data.groups);
        // const getDepth = function (obj: any) {
        //     var depth = 0;
        //     if (obj.group != null && obj.group.length != 0) {
        //         obj.group.forEach(function (d: any) {
        //             var tmpDepth = getDepth(d)
        //             if (tmpDepth > depth) {
        //                 depth = tmpDepth
        //             }
        //         })
        //     }
        //     return 1 + depth
        // }
        this.properties = JSON.parse(data.properties);
        this.groupDialog.setGroups(this.groups);
        this.groupDialog.setProperties(this.properties.length != 0 ? this.properties[0].property : []);
        this.propertiesDialog.setGroups(this.groups);
        this.propertiesDialog.setProperties(this.properties.length != 0 ? this.properties[0].property : []);
        this.anchorPropertiesDialog.setGroups(this.groups);
        this.anchorPropertiesDialog.setProperties(this.properties.length != 0 ? this.properties[0].property : []);
        this.domainShortName = data.domainShortName;

        this.hosts = JSON.parse(data.dbHosts).map((host: any) => this.domainParser.parseHost(host));
        this.hosts = this.hosts.concat(JSON.parse(data.fsHosts).map((host: any) => this.domainParser.parseHost(host)));


        this.connexions = JSON.parse(connexions) != null ? JSON.parse(connexions) : [];

        if (domainsMap == null) {
            this.domains = {};
        } else {
            this.domains = JSON.parse(domainsMap);
        }

        this.nodeDataSet.clear();
        this.edgeDataSet.clear();

        this.pinAll = false;
        this.labeledAll = false;

        this.edgeList = [];

        this.fixedNodes = [];

        this.nodeDataSet.add(this.getKnots(knots));
        this.nodeDataSet.add(this.getAnchors(anchors));
        this.nodeDataSet.add(this.getTies(ties));
        this.nodeDataSet.add(this.getTxAnchors(txAnchors));
        this.nodeDataSet.add(this.getCdAnchors(cdAnchors));


        this.edgeDataSet.add(this.edgeList);

        this.areas = data.areas ? JSON.parse(data.areas).map((area: any) => {
            area.colored = false;
            const R = 350;
            if (isArrayNotEmpty(area.anchorRole)) {
                let x: number = 0;
                let y: number = 0;
                const mnemonics = area.anchorRole.map((role: AnchorRole) => role.type);
                let anchors: Node[] = this.nodeDataSet.get(mnemonics as string[], {
                    fields: ['fixed', NodeKeys.ID, 'x', 'y']
                }) as Node[];
                anchors.forEach(node => {
                    this.fillConstEdge(area.uid, node.id as string);
                    x += node.x!;
                    y += node.y!;
                });
                x = x / anchors.length;
                y = y / anchors.length;
                area.x = x;
                area.y = y;
                let k = 1;
                let childNodes: Node[] = [];
                anchors = anchors.map((node: Node) => {
                    node.x = x + 2 * R * Math.cos(Math.PI * 2 * k / anchors.length);
                    node.y = y + R * Math.sin(Math.PI * 2 * k / anchors.length);
                    k++;
                    node.fixed = true;
                    const index = this.fixedNodes.indexOf(node.id as string);
                    if (index == -1) {
                        this.fixedNodes.push(node.id as string);
                    }
                    let connected = this.getConnectedTies(node.id as string, NodeKeys.ID, 'fixed' as NodeKeys,
                        NodeKeys.DESCRIPTOR, 'x' as NodeKeys, 'y' as NodeKeys);
                    let connectedAttributes = this.getConnectedAttributes(node.id as string, NodeKeys.ID, 'fixed' as NodeKeys,
                        NodeKeys.DESCRIPTOR, 'x' as NodeKeys, 'y' as NodeKeys);
                    connected = connected.map(conn => {
                        conn.fixed = false;
                        if (node.x! >= area.x) {
                            conn.x = node.x! + 200;
                        } else {
                            conn.x = node.x! - 200;
                        }
                        if (node.y! >= area.y) {
                            conn.y = node.y! + 200;
                        } else {
                            conn.y = node.y! - 200;
                        }
                        conn.y = node.y! + 100;
                        const index = this.fixedNodes.indexOf(conn.id as string);
                        if (index != -1) {
                            this.fixedNodes.splice(index, 1);
                        }
                        return conn;
                    });
                    let attrCenter: {
                        x: number,
                        y: number
                    } = {
                        x: 0,
                        y: 0
                    };
                    if (node.x! >= area.x) {
                        attrCenter.x = node.x! + 200;
                    } else {
                        attrCenter.x = node.x! - 200;
                    }
                    if (node.y! >= area.y) {
                        attrCenter.y = node.y! + 200;
                    } else {
                        attrCenter.y = node.y! - 200;
                    }
                    let kq = 1;
                    connectedAttributes = connectedAttributes.map(conn => {
                        conn.fixed = true;
                        conn.x = attrCenter.x + connectedAttributes.length * 17 * Math.cos(Math.PI * 2 * kq / connectedAttributes.length);
                        conn.y = attrCenter.y + connectedAttributes.length * 17 * Math.sin(Math.PI * 2 * kq / connectedAttributes.length);
                        kq++;
                        const index = this.fixedNodes.indexOf(conn.id as string);
                        if (index == -1) {
                            this.fixedNodes.push(conn.id as string);
                        }
                        return conn;
                    });
                    childNodes = childNodes.concat(connected);
                    childNodes = childNodes.concat(connectedAttributes);
                    return node;
                })
                this.nodeDataSet.update(anchors);
                this.nodeDataSet.update(childNodes);
            } else {
                area.anchorRole = [];
            }
            return area;
        }) : [];


        this.knots = (this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.type == NodeType.KNOT,
            fields: ['mnemonic']
        }) as LeanDiNode[]).map(node => node.mnemonic) as string[];

        this.history = copy(this.undoRedo.initHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas));

        try {
            this.network.moveTo({
                position: getCenter(this.nodeDataSet.get({
                    fields: ['x', 'y'],
                    filter: (anchor: Anchor) => anchor.type == NodeType.ANCHOR || anchor.type == NodeType.TX_ANCHOR
                })),
                scale: 0.7
            });
        } catch (e) {
            this.network.moveTo({position: {x: 0, y: 0}, scale: 0.7});
        }

        if (!this.eventsInitialized) {
            this.initEvents();
            this.eventsInitialized = true;
        }
        if (focusAnchor != null) {
            let node;
            const nodes = this.nodeDataSet.get();
            if (focusAnchor.length == 6) {
                node = nodes.filter((node: LeanDiNode) => node.mnemonic == focusAnchor.split(StringUtils.UNDERLINE)[1]
                    && node.type == NodeType.ATTRIBUTE)[0];
            } else {
                node = nodes.filter((node: LeanDiNode) => node.mnemonic == focusAnchor)[0];
            }
            this.setSelection(node.id as string);
        }

        this.referenceHosts = structuredClone(this.hosts);
        data = undefined;
        json = undefined;
    }

    getTxAnchors(txAnchors: string) {
        let txAnchorList = JSON.parse(txAnchors);
        let attributeContainer: any = []
        txAnchorList = txAnchorList.map((node: object) => this.parseTxAnchor(node, attributeContainer));
        let bufferList: any[] = []
        for (let list of txAnchorList) {
            bufferList = bufferList.concat([list[0]])
            bufferList = bufferList.concat(list[1])
        }
        return bufferList
    }

    parseTxAnchor(node: LeanDiNode, attributeContainer: any[]) {
        node = this.domainParser.parseNodeMainData(createAnchorMnemonic(), ++this.indexId, node);
        node = this.domainParser.parseNodeLayout(node) as LeanDiNode;
        if (node.fixed) {
            this.fixedNodes.push(node.id as string);
        }
        node = this.domainParser.fillTxAnchorFigure(node);
        this.getConnections(node);
        this.getKnotsFromextendedColumn(node);
        attributeContainer = this.getAttributes(node);
        return [node, attributeContainer];
    }

    getAnchors(anchors: string) {
        let anchorList = JSON.parse(anchors);
        let attributeContainer: any = []
        anchorList = anchorList.map((node: object) => this.parseAnchor(node, attributeContainer));
        let bufferList: any[] = []
        for (let list of anchorList) {
            bufferList = bufferList.concat([list[0]])
            bufferList = bufferList.concat(list[1])
        }
        return bufferList
    }

    parseAnchor(node: LeanDiNode, attributeContainer: any[]) {
        node = this.domainParser.parseNodeMainData(++this.lastId, ++this.indexId, node);
        node = this.domainParser.parseNodeLayout(node);
        if (node.fixed) {
            this.fixedNodes.push(node.id as string);
        }
        node = this.domainParser.fillAnchorFigure(node);
        node.expanded = false;
        this.getKnotsFromextendedColumn(node);
        attributeContainer = this.getAttributes(node);
        return [node, attributeContainer];
    }

    getCdAnchors(anchors: string) {
        let anchorList = JSON.parse(anchors);
        let attributeContainer: any = []
        anchorList = anchorList.map((node: object) => this.parseCdAnchor(node, attributeContainer));
        let bufferList: any[] = []
        for (let list of anchorList) {
            bufferList = bufferList.concat([list[0]])
            bufferList = bufferList.concat(list[1])
        }
        return bufferList
    }

    parseCdAnchor(node: LeanDiNode, attributeContainer: any[]) {
        node = this.domainParser.parseNodeMainData(++this.lastId, ++this.indexId, node);
        node = this.domainParser.parseNodeLayout(node);
        if (node.fixed) {
            this.fixedNodes.push(node.id as string);
        }
        node = this.domainParser.fillCdAnchorFigure(node);
        for (let connexion of this.connexions) {
            for (let index = 0; index < connexion.anchorRole.length; index++) {
                if (connexion.anchorRole[index].type == node.mnemonic && connexion.anchorRole[index].identifier == true) {
                    node.ownDomain = connexion.anchorRole[index].domain;
                    node.cdMnemonic = connexion.anchorRole[1 - index].type;
                    node.connexionUid = connexion.uid;
                    node.cdDomain = connexion.anchorRole[1 - index].domain;
                    break;
                }
            }
        }
        attributeContainer = this.getAttributes(node);
        return [node, attributeContainer];
    }

    getAttributes(anchor: object | any) {
        let attributes = [];
        for (let attributeIndex in anchor['attribute']) {
            let attribute = anchor['attribute'][attributeIndex];
            attribute = this.parseAttribute(attribute, anchor);
            this.fillEdge(anchor['id'], attribute['id']);
            attributes.push(attribute);
        }
        return attributes;
    }

    parseAttribute(node: LeanDiNode, anchor: object) {
        node = this.domainParser.parseNodeMainData(++this.lastId, ++this.indexId, node, anchor);
        node = this.domainParser.parseNodeLayout(node, anchor);
        if (node.fixed) {
            this.fixedNodes.push(node['id'] as string);
        }
        node = this.domainParser.fillAttributeFigure(node, ++this.indexId);
        this.getKnot(node);
        this.getKnotsFromextendedColumn(node);
        return node;
    }

    getKnot(attribute: object | any) {
        if (attribute.knotRange != null) {
            this.fillEdge(attribute['id'], attribute.knotRange);
        }
    }

    getKnotsFromextendedColumn(node: any) {
        if (isArrayNotEmpty(node.extendedColumn)) {
            for (let extendedColumn of node.extendedColumn!) {
                if (isStrNotEmpty(extendedColumn.knotRange)) {
                    this.fillEdge(node['id'], extendedColumn.knotRange, StringUtils.EMPTY_STRING, true, true);
                }
            }
        }
    }

    getKnots(knots: string) {
        let knotList = JSON.parse(knots);
        knotList = knotList.map((node: object) => this.parseKnot(node));
        return knotList
    }

    parseKnot(node: LeanDiNode) {
        node = this.domainParser.parseNodeMainData(++this.lastId, ++this.indexId, node);
        node = this.domainParser.parseNodeLayout(node);
        if (node.fixed) {
            this.fixedNodes.push(node['id'] as string);
        }
        node = this.domainParser.fillKnotFigure(node);
        return node;
    }

    getTies(ties: string) {
        let tieList = JSON.parse(ties);
        tieList = tieList.map((node: object) => this.parseTie(node));
        return tieList;
    }

    // getAreas(areas: LeanDiNode[]) {
    //
    // }
    //
    parseTie(node: LeanDiNode) {
        node = this.domainParser.parseNodeMainData(++this.lastId, ++this.indexId, node);
        node = this.domainParser.parseNodeLayout(node);
        if (node.fixed) {
            this.fixedNodes.push(node['id'] as string);
        }
        node = this.domainParser.fillTieFigure(node);
        this.getConnections(node);
        if (!node.descriptor?.includes(StringUtils.UNDERLINE)) {
            node.descriptor = node.anchorRole!.map(x => {
                return x.type + StringUtils.UNDERLINE + x.role
            }).join(StringUtils.UNDERLINE);
            if (isArrayNotEmpty(node.knotRole as KnotRole[])) {
                node.descriptor = node.descriptor + StringUtils.UNDERLINE + node.knotRole![0].type + StringUtils.UNDERLINE + node.knotRole![0].role;
            }
        }
        this.getKnotsFromextendedColumn(node);
        node.label = ' ';
        return node;
    }

    getConnections(tieOrTxAnchor: object | any) {
        for (let anchorIndex in tieOrTxAnchor['anchorRole']) {
            let anchorRole = tieOrTxAnchor['anchorRole'][anchorIndex];
            const count = anchorRole['identifier'] == true ? ", |||" : ", |"
            const edge = this.fillEdge(tieOrTxAnchor['id'], anchorRole['type'], anchorRole['role'] + count, tieOrTxAnchor.type == NodeType.TX_ANCHOR);
            if (anchorRole.color != null && anchorRole.color != BLACK) {
                edge.color = {color: anchorRole.color, highlight: this.chosenEdgeColor}
            }
            tieOrTxAnchor['anchorRole'][anchorIndex]['id'] = edge.id;
        }
        if (tieOrTxAnchor['knotRole'] != null) {
            tieOrTxAnchor['knotRole'] = [tieOrTxAnchor['knotRole']];
            const count = tieOrTxAnchor['knotRole'][0]['identifier'] == true ? ", |||" : ", |"
            const edge = this.fillEdge(tieOrTxAnchor['id'], tieOrTxAnchor['knotRole'][0]['type'], tieOrTxAnchor['knotRole'][0]['role'] + count);
            if (tieOrTxAnchor['knotRole'][0].color != null && tieOrTxAnchor['knotRole'][0].color != BLACK) {
                edge.color = {color: tieOrTxAnchor['knotRole'][0].color, highlight: this.chosenEdgeColor}
            }
            tieOrTxAnchor['knotRole'][0]['id'] = edge.id;
        }
    }

    fillConstEdge(idFrom: string, idTo: string) {
        let edge: Edge = {
            'from': idFrom,
            'to': idTo,
            'color': {
                'color': BLACK,
                highlight: this.chosenEdgeColor
            },
            'id': ++this.edgeId,
            length: 200
        }
        ++this.edgeId;
        this.edgeList.push(edge)
        return edge;
    }

    fillEdge(idFrom: string, idTo: string, label?: string, arrow?: boolean, dashed?: boolean) {
        let edge: Edge = {
            'from': idFrom,
            'to': idTo,
            'color': {
                'color': BLACK,
                highlight: this.chosenEdgeColor
            },
            'id': ++this.edgeId
        }
        ++this.edgeId;
        if (label) {
            edge['label'] = label;
        }
        if (arrow) {
            edge['arrows'] = "to"
        }
        if (dashed) {
            edge['dashes'] = true;
        }
        this.edgeList.push(edge)
        return edge;
    }

    createContextMenuChild(areaName: string, todo: string, itemUid?: string) {
        const item = document.createElement('vaadin-item');
        item.className = todo;
        if (itemUid != null) {
            item.id = itemUid;
        }
        item.innerText = areaName;
        return item;
    }

    initEvents() {

        let usedSheet: number | null | undefined = null;

        this.network.on('click', () => {
            this.network.setOptions({
                "interaction": {
                    "keyboard": true,
                }
            });
        });

        this.network.on('oncontext', (ctx) => {

            const edgeId = this.network.getEdgeAt({x: ctx.pointer.DOM.x, y: ctx.pointer.DOM.y});
            const nodeId = this.network.getNodeAt({x: ctx.pointer.DOM.x, y: ctx.pointer.DOM.y});

            if (edgeId != null && nodeId == null) {
                this.activeEdge = this.edgeDataSet.get(edgeId);
                let node = (this.nodeDataSet.get(this.network.getConnectedNodes(edgeId) as Id[], {
                    filter: (x: LeanDiNode) => x.type == NodeType.TIE || x.type == NodeType.TX_ANCHOR
                }) as LeanDiNode[]);
                if (node.length != 0) {
                    this.activeNode = node[0];
                    this.contextMenuItems = [{text: 'Edit edge'}, {text: 'Delete edge'}, {text: 'Make first'}];
                } else {
                    this.contextMenuItems = [{text: 'Create area'}];
                }
            } else {
                this.contextMenuItems = [{text: 'Create area'}];
            }

            if (nodeId != null) {
                this.activeNode = this.nodeDataSet.get(nodeId);
                if (this.activeNode!.type == NodeType.CD_ANCHOR) {
                    if (this.hosts.length != 0) {
                        this.contextMenuItems = [{text: 'Edit node'}, {text: 'Delete node'}, {text: 'Fix/unfix node'},
                            {text: 'Jump to domain'},
                            {
                                text: 'Store in',
                                children: this.hosts.map((host: any) => {
                                    return {text: host.label}
                                })
                            }
                        ];
                    } else {
                        this.contextMenuItems = [{text: 'Edit node'}, {text: 'Delete node'}, {text: 'Fix/unfix node'}, {text: 'Jump to domain'}];
                    }
                } else {
                    if (this.hosts.length != 0 && this.activeNode!.type != NodeType.TIE) {
                        this.contextMenuItems = [{text: 'Edit node'}, {text: 'Delete node'},
                            {text: 'Fix/unfix node'},
                            {
                                text: 'Store in',
                                children: this.hosts.map((host: DbHost) => {
                                    return {text: host.label}
                                })
                            }
                        ];
                    } else {
                        this.contextMenuItems = [{text: 'Edit node'}, {text: 'Delete node'}, {text: 'Fix/unfix node'}];
                    }
                }
                if (this.activeNode!.type == NodeType.ANCHOR) {
                    const toAttach = [];
                    const toDetach = [];
                    for (let area of this.areas) {
                        if (isArrayEmpty(area.anchorRole) || area.anchorRole.filter((a: AnchorRole) =>
                            a.type == this.activeNode!.mnemonic).length == 0) {
                            toAttach.push({
                                component: this.createContextMenuChild(area.descriptor, 'attach-area', area.uid)
                            });
                        } else {
                            toDetach.push({
                                component: this.createContextMenuChild(area.descriptor, 'detach-area', area.uid)
                            });
                        }
                    }
                    this.contextMenuItems = this.contextMenuItems.concat([
                        {text: 'Show properties'},
                        {
                            text: 'Areas',
                            children: [
                                {
                                    text: 'Attach to',
                                    children: toAttach,
                                },
                                {
                                    text: 'Detach from',
                                    children: toDetach
                                }
                            ]
                        }
                    ]);
                }
            }

        });
        this.network.on("beforeDrawing", (ctx) => {
            const anchorsAndColors = {} as any;
            for (let area of this.areas) {
                if (area.colored == true) {
                    if (isArrayNotEmpty(area.anchorRole)) {
                        for (let anchorRole of area.anchorRole) {
                            if (Object.keys(anchorsAndColors).includes(anchorRole.type)) {
                                anchorsAndColors[anchorRole.type].push(area.color);
                            } else {
                                anchorsAndColors[anchorRole.type] = [area.color];
                            }
                        }
                    }
                }
            }
            for (let anchorRole of Object.keys(anchorsAndColors)) {
                let radius = 32;
                let first = true;
                for (let color of anchorsAndColors[anchorRole]) {
                    const node = this.nodeDataSet.get({
                        filter:
                            (nd: LeanDiNode) => (nd.type == NodeType.ANCHOR || nd.type == NodeType.TX_ANCHOR || nd.type == NodeType.CD_ANCHOR)
                                && nd.mnemonic == anchorRole,
                        fields: ['id']
                    })[0];
                    var nodePosition = this.network.getPositions([node.id]);

                    ctx.fillStyle = color;// "#294475";
                    ctx.strokeStyle = color;// "#294475";
                    ctx.lineWidth = 3;

                    ctx.beginPath();
                    ctx.arc(
                        nodePosition[node.id].x,
                        nodePosition[node.id].y,
                        radius,
                        7 * Math.PI / 8,
                        Math.PI / 8,
                        false
                    );

                    if (first) {
                        first = false;
                        ctx.closePath();
                        ctx.fill();
                    }

                    // ctx.fill();
                    ctx.stroke();
                    radius += 5;
                }
            }
        });
        let step;
        let nodePosition;
        // this.network.on('hoverNode', (point: any) => {
        //     if (this.activeNode == null) {
        //         this.tooltipOpened = true;
        //         const node = (this.nodeDataSet.get(point.node) as Node) as LeanDiNode;
        //         this.tooltipText = node.type == NodeType.TIE ? `${node.descriptor}, ${node.description}` : `${node.mnemonic}_${node.descriptor} ${node.description}`
        //     }
        // });
        // this.network.on('blurNode', (point: any) => {
        //     this.tooltipOpened = false;
        //     this.tooltipText = StringUtils.EMPTY_STRING;
        // });
        this.network.on("afterDrawing", (ctx) => {
            for (step = 0; step < this.fixedNodes.length; step++) {
                nodePosition = this.network.getPositions([this.fixedNodes[step]]);
                ctx.strokeStyle = BLACK;
                ctx.lineWidth = 3;
                ctx.beginPath();
                try {
                    ctx.fillStyle = BLACK;
                    ctx.arc(
                        nodePosition[this.fixedNodes[step]].x,
                        nodePosition[this.fixedNodes[step]].y,
                        2,
                        0,
                        2 * Math.PI
                    );
                    ctx.stroke();
                    ctx.fill();
                } catch (e) {

                }
            }
        });
        this.network.on("selectNode", (params) => {
            this.activeTxAnchors = params.nodes;
            this.activeNode = this.getSelectedNode();
            if (this.buffered) {
                this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts, this.areas);
                this.buffered = false;
            }
            this.switchMenuBar();
        });
        this.network.on("deselectNode", (params) => {
            this.activeTxAnchors = params.nodes;
            this.switchMenuBar();
            this.activeFieldName = null;
            this.nodeEditor?.close();
            this.activeNode = this.getSelectedNode();
        });
        this.network.on('doubleClick', (properties) => {
            const nodesId = properties.nodes;
            if (nodesId != null && nodesId.length != 0) {
                this.activeNode = this.nodeDataSet.get(nodesId)[0] as LeanDiNode;
                this.openLayout();
            }
        });
        this.network.on('zoom', (e) => {
            let scale = this.network.getScale()
            if (scale <= this.MIN_ZOOM) {
                this.network.moveTo({
                    position: this.lastZoomPosition,
                    scale: this.MIN_ZOOM
                });
            } else if (scale >= this.MAX_ZOOM) {
                this.network.moveTo({
                    position: this.lastZoomPosition,
                    scale: this.MAX_ZOOM,
                });
            } else {
                this.lastZoomPosition = this.network.getViewPosition()
            }
        });

        this.network.on('dragStart', (params) => {
            this.activeNode = this.getSelectedNode();
            this.switchMenuBar();
            if (params.nodes.length > 0) {
                let selectedNodes = this.nodeDataSet.get(this.network.getSelectedNodes());
                for (let node of selectedNodes) {
                    node["fixed"] = false;
                    const index = this.fixedNodes.indexOf(node.id as string);
                    if (index != -1) {
                        this.fixedNodes.splice(index, 1);
                    }
                    node = this.setPositions(node);
                    this.nodeDataSet.update(node);
                }
            }
        });
        this.network.on('dragEnd', (properties) => {
            const ids = properties.nodes;
            this.activeNode = this.getSelectedNode();
            if (ids.length > 0) {
                let selectedNodes = this.nodeDataSet.get(this.network.getSelectedNodes());
                for (let node of selectedNodes) {
                    node["fixed"] = true;
                    node = this.setPositions(node);
                    this.nodeDataSet.update(node);
                    this.fixedNodes.push(node.id as string);
                }
            }
            this.lastZoomPosition = this.network.getViewPosition()
        });
    }

    openLayout() {
        this.network.setOptions({
            "interaction": {
                "keyboard": false,
            }
        });
        // TODO: Выяснить, почему при animation=true происходит залипание фокусирования
        this.network.focus(this.activeNode!.id as string, {scale: 1, animation: false, offset: {x: 0, y: -100}});
        this.network.selectNodes([this.activeNode!.id as IdType]);
        if (this.buffered) {
            // this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts);
            this.buffered = false;
        }

        this.switchMenuBar();
        this.updateMetadataLayout();
    }

    redirectToDomain(node: LeanDiNode) {
        this.$server?.redirectToDomain([node.cdDomain, node.cdMnemonic].join(StringUtils.COMMA));
    }

    fixUnfixNode(nodesId: string[]) {
        if (nodesId.length > 0) {
            let node = this.nodeDataSet.get(nodesId[0]) as Node;
            if (this.fixedNodes.includes(nodesId[0])) {
                node["fixed"] = false;
                this.nodeDataSet.update(node);
                const index = this.fixedNodes.indexOf(node['id'] as string);
                this.fixedNodes.splice(index, 1);
            } else {
                this.fixedNodes.push(nodesId[0]);
                node["fixed"] = true;
                node = this.setPositions(node);
                this.nodeDataSet.update(node);

            }
        }
    }

    switchMenuBar() {
        if (this.activeNode != null) {
            if (this.network.getSelectedNodes().length == 1) {
                this.chosenNodeType = this.activeNode!.type as NodeType;
            } else if (this.network.getSelectedNodes().length == 0) {
                this.chosenNodeType = NodeType.NO_TYPE;
                this.network.setOptions({
                    "interaction": {
                        "keyboard": true,
                    }
                });
            } else {
                if (this.network.getSelectedNodes().length > 1) {
                    if (this.network.getSelectedNodes().length == 2) {
                        if (this.isKnotThere()) {
                            this.chosenNodeType = NodeType.KNOT_AND_OTHERS;
                        } else if (this.isAnchorAndTie()) {
                            this.chosenNodeType = NodeType.ANCHOR_AND_TIE;
                        } else if (this.isTxAnchorAndTie()) {
                            this.chosenNodeType = NodeType.TX_ANCHOR_AND_TIE;
                        } else if (this.allNodesIsTypedAs(this.activeNode!.type)) {
                            if (this.activeNode!.type == NodeType.ANCHOR) {
                                this.chosenNodeType = NodeType.ANCHORS_GROUP;
                            } else if (this.activeNode!.type == NodeType.TIE) {
                                this.chosenNodeType = NodeType.TIE;
                            } else if (this.activeNode!.type == NodeType.TX_ANCHOR) {
                                this.chosenNodeType = NodeType.TX_ANCHORS;
                            } else {
                                this.chosenNodeType = NodeType.KNOT;
                            }
                        } else {
                            this.chosenNodeType = NodeType.KNOT;
                        }

                    } else if (this.allNodesIsTypedAs(this.activeNode!.type) && this.network.getSelectedNodes().length > 2) {
                        if (this.activeNode!.type == NodeType.ANCHOR) {
                            this.chosenNodeType = NodeType.ANCHORS_GROUP;
                        } else if (this.activeNode!.type == NodeType.TIE) {
                            this.chosenNodeType = NodeType.TIE;
                        } else {
                            this.chosenNodeType = NodeType.KNOT;
                        }
                    } else {
                        this.chosenNodeType = NodeType.KNOT;
                    }
                } else {
                    this.chosenNodeType = NodeType.KNOT;
                }
                this.activeFieldName = null;
                // this.layoutHeight = '97';
            }
        }
    }

    getGroups(json: string) {
        const data = JSON.parse(json);
        this.groups = JSON.parse(data.groups);
        this.properties = JSON.parse(data.properties);
        this.groupDialog.setGroups(this.groups);
        this.groupDialog.setProperties(this.properties.length != 0 ? this.properties[0].property : []);
        if (!this.groupDialog.isOpen()) {
            this.network.setOptions({
                "interaction": {
                    "keyboard": false,
                }
            });
            this.groupDialog.open();
        }
    }

    getProperties(json: string) {
        const data = JSON.parse(json);
        this.groups = JSON.parse(data.groups);
        this.properties = JSON.parse(data.properties);
        this.propertiesDialog.setProperties(this.properties.length != 0 ? this.properties[0].property : []);
        this.propertiesDialog.setGroups(this.groups);
        this.propertiesDialog.setAnchors(this.nodeDataSet.get({
            filter: (node: LeanDiNode) => node.type == NodeType.ANCHOR,
            fields: ['mnemonic', 'descriptor', 'description', '_group', 'id']
        }).map((node: LeanDiNode) => {
            return {
                mnemonic: node.mnemonic,
                descriptor: node.descriptor,
                description: node.description,
                _group: node._group,
                id: node.id
            }
        }));
        if (!this.propertiesDialog.isOpen()) {
            this.network.setOptions({
                "interaction": {
                    "keyboard": false,
                }
            });
            this.propertiesDialog.open();
        }
    }

    getAnchorsProperties(json: string) {
        const data = JSON.parse(json);
        this.groups = JSON.parse(data.groups);
        this.properties = JSON.parse(data.properties);
        this.anchorPropertiesDialog.setGroups(this.groups);
        this.anchorPropertiesDialog.setProperties(this.properties);
        this.anchorPropertiesDialog.setAnchor(this.activeNode as Anchor);
    }

    getAreas(json: string) {
        const data = JSON.parse(json);
        let uid;
        const areas = JSON.parse(data.areas) as Area[];
    }


    private handleNodeUpdating(node: LeanDiNode) {
        node = this.domainRenderer.renderDefaultFigure(node);
        node.fixed = true;
        switch (node.type) {
            case NodeType.ANCHOR: {
                if (node.mnemonic != this.activeNode!.mnemonic) {
                    this.changeAnchorRole(node.mnemonic!);
                    this.changeConnexion(node.mnemonic!);
                    this.renewItemInDomainOfHost(this.getFqn()!, node.mnemonic!);
                }
                break;
            }
            case NodeType.ATTRIBUTE: {
                //todo удаление и изменение связанных индексов
                node = this.changeAttributeHistoricity(node);
                if (node.mnemonic != this.activeNode!.mnemonic) {
                    this.renewItemInDomainOfHost(this.getFqn()!,
                        this.getFqn()!.split(StringUtils.DOT)[0] + StringUtils.DOT + node.mnemonic);
                }
                if (this.activeNode!.knotRange != node.knotRange) {
                    if (isStrNotEmpty(this.activeNode!.knotRange)) {
                        const knot = this.getKnotByMnemonic(this.activeNode!.knotRange!);
                        node = this.disconnectAttributeFromKnot(node, knot);
                    }
                    if (isStrNotEmpty(node.knotRange)) {
                        const knot = this.getKnotByMnemonic(node.knotRange!);
                        node = this.connectAttributeWithKnot(node, knot);
                    }
                }
                if (isStrEmpty(node.dataRange) && isStrEmpty(node.knotRange)) {
                    node.dataRange = DataRange.BIGINT;
                }
                this.renewAttributeInAnchor(node);
                break;
            }
            case NodeType.TIE: {
                //todo удаление связанных индексов
                node = this.changeTieHistoricity(node);

                const isOldNotEmpty = isArrayNotEmpty(this.activeNode!.knotRole as any[]) && isStrNotEmpty(this.activeNode!.knotRole![0].type);
                const isNewNotEmpty = isArrayNotEmpty(node.knotRole as any[]) && isStrNotEmpty(node.knotRole![0].type);

                if (JSON.stringify(this.activeNode!.knotRole) != JSON.stringify(node.knotRole)) {
                    if (isOldNotEmpty) {
                        const knot = this.getKnotByMnemonic(this.activeNode!.knotRole![0].type!);
                        node.descriptor = this.disconnectTieFromKnot(knot);
                        if (isNewNotEmpty) {
                            const knot = this.getKnotByMnemonic(node.knotRole![0].type!);
                            node = this.connectTieWithKnot(node, knot, this.activeNode!.knotRole![0]);
                            node.knotRole![0] = this.activeNode!.knotRole![0];
                            node.knotRole![0].type = knot.mnemonic;
                        }
                    } else {
                        if (isNewNotEmpty) {
                            const knot = this.getKnotByMnemonic(node.knotRole![0].type!);
                            node = this.connectTieWithKnot(node, knot);
                        }
                    }
                }
                break;
            }
            case NodeType.TX_ANCHOR: {
                break;
            }
            case NodeType.KNOT: {
                if (node.mnemonic != this.activeNode!.mnemonic) {
                    this.changeKnotRangeRole(node.mnemonic!);
                    this.renewItemInDomainOfHost(this.getFqn()!, node.mnemonic!);
                }
                if (isStrEmpty(node.dataRange) && isStrEmpty(node.knotRange)) {
                    node.dataRange = DataRange.BIGINT;
                }
                break;
            }
            case NodeType.CD_ANCHOR:
            default: {
                break;
            }
        }

        if (isArrayNotEmpty(this.activeNode!.extendedColumn)) {
            for (let extendedColumn of this.activeNode!.extendedColumn!) {
                const knotRange = extendedColumn.knotRange;
                if (isStrNotEmpty(knotRange)) {
                    const knot = this.getKnotByMnemonic(knotRange!);
                    this.disconnectextendedColumnFromKnot(knot);
                }
            }
        }
        if (isArrayNotEmpty(node.extendedColumn)) {
            for (let extendedColumn of node.extendedColumn!) {
                const knotRange = extendedColumn.knotRange;
                if (isStrNotEmpty(knotRange)) {
                    const knot = this.getKnotByMnemonic(knotRange!);
                    knot.fixed = true;
                    const edges: Edge[] = this.edgeDataSet.get({
                        fields: ['id'],
                        filter: (edge) => edge.from == node.id && edge.to == knot.id
                    });
                    if (edges.length == 0) {
                        this.edgeDataSet.add(this.fillEdge(node.id!.toString(), knot.id as string, StringUtils.EMPTY_STRING, true, true));
                    }
                }
            }
        }


        this.nodeEditor.setNode(node);
        this.activeNode = copy(node);
        node = this.setPositions(node);
        this.nodeDataSet.update(node);
        node = this.domainRenderer.switchRender(node);
        this.nodeDataSet.update(this.setPositions(node));
        this.changeLabeling();
        this.knots = (this.nodeDataSet.get() as LeanDiNode[])
            .filter(node => node.type == NodeType.KNOT).map(node => {
                return node.mnemonic
            }) as string[];
    }
}

interface VisJsComponentServerInterface {
    fillComponentRequest(): void;

    updateKnot(s: string): void;

    addKnot(s: string): void;

    updateAnchor(s: string): void;

    updateAnchorsProperties(s: string): void;

    addAnchor(s: string): void;

    updateTie(s: string): void;

    updateTxAnchor(s: string): void;

    addTie(s: string): void;

    addTxAnchor(s: string): void;

    deleteAnchor(s: string): void;

    deleteTie(s: string): void;

    deleteKnot(s: string): void;

    deleteTxAnchor(s: string): void;

    updateCdAnchor(s: string): void;

    addCdAnchor(s: string): void;

    deleteCdAnchor(s: string): void;

    marshall(): void;

    openUpload(): void;

    createDto(s: string): void;

    updateConnexions(s: string): void;

    deleteConnexions(s: string): void;

    redirectToDomain(s: string): void;

    redirectToProject(): void;

    addItem(s: string): void;

    deleteItem(s: string): void;

    requestForProperties(): void;

    requestForGroups(): void;

    updateGroup(s: string): void;

    removeGroup(id: string): void;

    removePropertiesFromGroup(s: string): void;

    removeGroupsFromGroup(s: string): void;

    addPropertiesToGroup(s: string): void;

    addPropertiesToGroupWithPropertyResponse(s: string): void;

    addGroupsToGroup(s: string): void;

    deleteProperty(s: string): void;

    updateProperty(s: string): void;

    addProperty(s: string): void;

    updateDomainInProject(): void;

    updateArea(s: string): void;

    deleteArea(detail: string): void;

}

declare global {
    interface Window {
        showSaveFilePicker: any;
    }
}

