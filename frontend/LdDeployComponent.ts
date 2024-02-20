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

import "Frontend/components/network-editor-components/node-editor-components/node-editors/deploy/menu-bar/DeployLeftSideMenuBar";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/project/menu-bar/ProjectRightSideMenuBar";
import {HostsRenderer} from "Frontend/renderer/HostsRenderer";

import {
    copy,
    getDifferenceInNodes,
    getDifferenceInNodesByKeys,
    UndoRedoStructure
} from "Frontend/undo-redo/UndoRedoStructure";
import {FullItem} from "vis-data/declarations/data-interface";

import {DbHost, Domain, FsHost, LeanDiNode} from "Frontend/interfaces/Interfaces";
import {HostsParser} from "Frontend/node-parsing/HostsParser";
import {SaveDialog} from "Frontend/components/network-editor-components/common/dialogs/SaveDialog";

import {canvas2svg} from 'Frontend/canvas-2-svg/canvas2svg.js';
import {MetadataErrorDialog} from "Frontend/components/network-editor-components/common/dialogs/MetadataErrorDialog";


import {isStrEmpty, isStrNotEmpty, generateUid, getCenter, getNewFileHandle} from "Frontend/utils/common";
import {DialogType} from "Frontend/enums/DialogType";
import {
    DomainNavigationBar
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/domain/menu-bar/DomainNavigationBar";
import {NodeType} from "Frontend/enums/NodeType";
import {NoticeDialog} from "Frontend/components/network-editor-components/common/dialogs/NoticeDialog";
import {mapToDbHost, mapToFsHost} from "Frontend/interfaces/Mappers";
import {
    DbHostCreationDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/deploy/dialog/DbHostCreationDialog";
import {
    FsHostCreationDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/deploy/dialog/FsHostCreationDialog";
import {
    BLACK,
    DEFAULT_FONT_COLOR,
    DEFAULT_LD_COMPONENTS_COLOR,
    DEFAULT_NODE_COLOR,
    WHITE
} from "Frontend/components/network-editor-components/common/ColorPicker";
import {
    NodeEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/NodeEditorDialog";
import {event} from "Frontend/events/LdEvents";
import {
    DbEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/deploy/nodes/DbEditorDialog";
import {
    FsEditorDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/deploy/nodes/FsEditorDialog";
import {StringUtils} from "Frontend/enums/DefaultValues";

canvas2svg();

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('ld-deploy')
export class LdDeployComponent extends LitElement {
    static get styles() {
        return css`
          :focus {
            outline: none;
          }

          .text-field-width {
            width: 100%;
          }

          [slot="label"] {
            font-size: medium;
            font-weight: normal;
          }

          [theme="spacing-padding"] {
            height: 350px;
            width: 100%;
            padding-top: 0;
          }

          [theme="spacing-xs padding"] {
            padding-top: 0;
            height: 350px;

          }

          host-editor-layout {
            width: 100%;
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
            border-color: #f4f4f4;
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

    private saveDialog: SaveDialog = new SaveDialog();
    private metadataDialog: MetadataErrorDialog = new MetadataErrorDialog();
    private noticeDialog = new NoticeDialog();
    @state()
    private dbHostCreationDialog = new DbHostCreationDialog();
    @state()
    private fsHostCreationDialog = new FsHostCreationDialog();

    private isNewTree: boolean = false;

    private doMarshall = false;

    @property()
    private domainColor: string = DEFAULT_NODE_COLOR;

    private hostsRenderer: HostsRenderer =
        new HostsRenderer(
            this.domainColor, //"#f66",
            WHITE
        );


    private domains: string[] = [];
    @property()
    private projectUid: string = '';

    private hostsParser: HostsParser = new HostsParser(this.hostsRenderer);

    @property()
    private edgeList: Edge[] = [];
    @property()
    private clusters!: Map<string, string[]>;


    @property()
    private eventsInitialized = false;

    @state()
    private nodeDataSet = new DataSet<Node>([]);
    @state()
    private edgeDataSet = new DataSet<Edge>([]);


    private hostsNavigationBar!: DomainNavigationBar;

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

    @state()
    private foundNodes!: any[];

    @property()
    private pinAll = false;

    private labeledAll = false;

    @state()
    private buffered: boolean = false;

    @state()
    private fixedNodes: string[] = [];

    @property()
    private network!: Network;

    private undoRedo = new UndoRedoStructure();

    private history!: {
        past: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[] }[],
        current: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[] } | null,
        future: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[] }[],
    };

    private hostsToDelete: any[] = [];

    @state()
    private nodeEditor!: NodeEditorDialog;


    createHostEditorComponent() {

        switch (this.activeNode!.type) {
            case NodeType.DB_HOST: {
                this.nodeEditor = new DbEditorDialog();
                break;
            }
            case NodeType.FS_HOST: {
                this.nodeEditor = new FsEditorDialog();
                break
            }
        }
        this.nodeEditor.open(copy(this.activeNode!));
        this.nodeEditor.addEventListener('edit-node', (e: Event) => {
            const node = event(e).detail as LeanDiNode;
            this.handleNodeUpdating(node);
            // this.handleDownload();
            // this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get(), this.hosts);
        });
        this.nodeEditor.addEventListener('redirect-to-domain', (ev: Event) => {
            ev.stopImmediatePropagation();
            this.$server!.redirectToDomain(event(ev).detail);
        });

    }

    handleNodeUpdating(node: LeanDiNode) {
        if (isStrEmpty(node.clusterId)) {
            node.fixed = false;
            const {x, y} = this.network.getViewPosition();
            // this.activeNode!.x = x + 100;
            // this.activeNode!.y = y + 100;
            node.clusterId = undefined;
            const index = this.fixedNodes.indexOf(node.id as string);
            if (index != -1) {
                this.fixedNodes.splice(index, 1);
            }
        }
        this.renewLabel(node);
        this.nodeEditor.setNode(node);
    }

    private activeFieldName: string | null = null;


    renewLabel(node: any) {
        if (node.type == NodeType.DB_HOST) {
            node['label'] = isStrNotEmpty(node['hostName']) ? node['hostName'] : node['dbType'] + StringUtils.DOT + node['host']
                + StringUtils.DOT + node['port'] + '.' + node['dbName'];
        } else {
            node['label'] = isStrNotEmpty(node['hostName']) ? node['hostName'] : node['host'] + StringUtils.DOT + node['folder'];
        }
        this.nodeDataSet.update(this.setPositions(node));
        this.createClusters();
        this.getClusteredNodesCoordinates();
    }

    private $server?: VisJsComponentServerInterface;

    constructor() {
        super();
    }

    @state()
    private contextMenuItems: { [text: string]: string }[] = [];

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
                    interpolation: false //so images are not scaled svg will get full image
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
        canvasProto.getContext = currentGetContext;
        ctx.waitForComplete(() => {
            let svg = ctx.getSerializedSvg();
            this.showSvg(svg);
        });
    }

    showSvg(svg: any) {
        let svgBlob = new Blob([svg], {type: 'image/svg+xml'});
        this.openBlob(svgBlob, "network.svg");
    }

    openBlob(blob: any, fileName: any) {
        // @ts-ignore
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            // @ts-ignore
            window.navigator.msSaveOrOpenBlob(blob, fileName);
        } else {
            let a = document.getElementById("blobLink");
            if (!a) {
                a = document.createElement("a");
                document.body.appendChild(a);
                a.setAttribute("id", "blobLink");
            }
            let data = window.URL.createObjectURL(blob);
            // @ts-ignore
            a.href = data;
            // @ts-ignore
            a.download = fileName;
            a.click();
            setTimeout(function () {
                    window.URL.revokeObjectURL(data);
                }
                , 100);
        }
    }

    createDbHost(detail: any) {
        let host = this.hostsParser.createDbHostNodeTemplate(detail) as DbHost;
        host = this.hostsParser.fillDbHostFigure(host);
        this.nodeDataSet.add([host]);
        this.network.unselectAll();
        return host;
    }

    createFsHost(detail: any) {
        let host = this.hostsParser.createFsHostNodeTemplate(detail) as DbHost;
        host = this.hostsParser.fillFsHostFigure(host);
        this.nodeDataSet.add([host]);
        this.network.unselectAll();
        return host;
    }

    private metadataLayoutVisibility = 'none';

    handleSaveDialogEvents() {

        switch (this.saveDialog.getDialogType()) {
            case DialogType.DOMAIN_NAVIGATOR:
                this.$server!.redirectToDomain(this.saveDialog.getData());
                break;
            case DialogType.EMPTY_DIALOG:
                break;
            case DialogType.HOSTS_NAVIGATOR:
                break;
            case DialogType.PROJECT_NAVIGATOR:
                this.$server!.redirectToProject();
                break;
            case DialogType.PROJECT_RECREATOR:
                break;
            case DialogType.HOSTS_RECREATOR:
                this.$server!.buildNewDeployModel();
                break;
            default:
                break;
        }
    }

    render() {
        this.dbHostCreationDialog.addEventListener('create-host', (e: Event) => {
            e.stopImmediatePropagation();
            let host = this.createDbHost((<any>e).detail);
            this.handleDownload();
            // this.nodeDataSet.update(this.noteNodeAsOld(domain as Domain))
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
            this.createClusters();
            this.getClusteredNodesCoordinates();
        });
        this.fsHostCreationDialog.addEventListener('create-host', (e: Event) => {
            e.stopImmediatePropagation();
            let host = this.createFsHost((<any>e).detail);
            this.handleDownload();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
            this.createClusters();
            this.getClusteredNodesCoordinates();
        })
        this.hostsNavigationBar = new DomainNavigationBar();
        this.hostsNavigationBar.domainList = this.domains;
        this.hostsNavigationBar.requestUpdate();
        this.hostsNavigationBar.addEventListener('jump-to-project', (e: Event) => {
            // this.saveDialog.openDialog(DialogType.PROJECT_NAVIGATOR);
            this.$server!.redirectToProject();
        });
        this.hostsNavigationBar.addEventListener('jump-to-domain', (e: Event) => {
            // this.saveDialog.openDialog(DialogType.DOMAIN_NAVIGATOR, (<any>e).detail);
            this.$server!.redirectToDomain((<any>e).detail);
        });
        this.saveDialog.addEventListener('agree-save', (e: Event) => {
            e.stopImmediatePropagation();
            this.handleDownload(true);
            if (!this.doMarshall) {
                this.handleSaveDialogEvents();
            }
        });
        this.saveDialog.addEventListener('disagree-save', (e: Event) => {
            this.handleSaveDialogEvents();
        });
        return html`
            ${this.metadataDialog}
            <vaadin-context-menu
                    .items=${this.contextMenuItems}
                    @item-selected="${(e: Event) => {
                        this.contextMenuItemSelected(e)
                    }}"
            >
                <div style="position: fixed; z-index: 1; background-color: transparent; left: 10px; top: 10px">
                    <deploy-left-side-menu-bar
                            @add-node-event="${(e: Event) => this.handleHostCreating((<any>e).detail)}"
                            style=" background-color: hsla(0, 0%, 100%, 0.3); "
                    >
                    </deploy-left-side-menu-bar>
                </div>
                <div style="position: fixed; z-index: 1; background-color: hsla(0, 0%, 100%, 0.3);  left: 20px; bottom: 20px">
                    <b style="color: ${this.domainColor}">Deploy model of project:
                        ${this.projectUid.split("-")[0]}</b>
                </div>
                <vaadin-horizontal-layout
                        style="position: fixed; z-index: 1; background-color: transparent; right: 10px; top: 10px">
                    <div>
                        ${this.hostsNavigationBar}
                    </div>
                    <div>
                        <project-right-side-menu-bar
                                style=" background-color: hsla(0, 0%, 100%, 0.3);"
                                @zoom-event="${(e: CustomEvent) => this.handleZoom(e)}"
                                @pin-event="${() => {
                                    // this.handlePin()
                                }}"
                                @download-event="${() => this.handleDownload(true)}"
                                @upload-event="${() => this.handleUpload()}"
                                .listBoxItems="${this.foundNodes}"
                                .domainColor="${this.domainColor}"
                                @new-tree-event="${() => this.handleNewTreeEvent()}"
                                @picture-event="${() => this.handlePictureEvent()}"
                                @undo-event="${(e: CustomEvent) => this.handleUndoEvent()}"
                                @redo-event="${(e: CustomEvent) => this.handleRedoEvent()}"
                        >
                        </project-right-side-menu-bar>
                    </div>
                </vaadin-horizontal-layout>
                <div
                        id="customId"
                        style="height: ${this.layoutHeight}vh"
                >
                </div>
                ${this.dbHostCreationDialog}
                ${this.fsHostCreationDialog}
                ${this.saveDialog}
                ${this.noticeDialog}
                ${this.nodeEditor}
            </vaadin-context-menu>
        `
    }


    handleNewTreeEvent() {
        this.saveDialog.openDialog(DialogType.HOSTS_RECREATOR);
        // this.saveDialog.dialogOpened = true;
        this.isNewTree = true;
    }

    handlePictureEvent() {
        this.exportSvg();
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
        if ((<any>e).detail.value.text == 'Fix/unfix node') {
            this.fixUnfixNode([this.activeNode!.id as string]);
        }
        if ((<any>e).detail.value.text == 'Delete node') {
            // this.network.setSelection(this.network.getNodeAt(th))
            this.deleteHosts();
        }
        if ((<any>e).detail.value.text == 'Edit node') {
            // this.network.setSelection(this.network.getNodeAt(th))
            this.openLayout();
        }
    }


    getSelectedNode() {
        let nodeId = this.network.getSelectedNodes();
        return this.nodeDataSet.get(nodeId)[0] as DbHost;
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.initTree();
        this.$server?.fillComponentRequest();
        this.hostsNavigationBar.domainList = this.domains;
        addEventListener('keydown', (event) => {
            const key = event.key; // const {key} = event; ES6+
            if (key === "Delete") {
                this.deleteHosts();
            }
            if ((key == 'z' || key == 'Z') && event.ctrlKey && !event.shiftKey) {
                this.handleUndoEvent();
            }
            if (((key == 'z' || key == 'Z') && event.ctrlKey && event.shiftKey)) {
                this.handleRedoEvent();
            }
        });

    }

    handleUndoEvent() {

        if (this.history.past.length >= 1) {
            const currentNodes = this.nodeDataSet.get();
            const pastNodes = this.history.past[this.history.past.length - 1].nodes;
            const pastEdges = this.history.past[this.history.past.length - 1].edges;
            let nodeDifferences: LeanDiNode[];

            if (currentNodes.length > pastNodes.length) {
                nodeDifferences = getDifferenceInNodes(currentNodes, pastNodes) as LeanDiNode[];
                nodeDifferences.forEach((node: LeanDiNode) => this.hostsToDelete.push(node));
                this.nodeDataSet.remove((copy(nodeDifferences) as Node[]).map(node => node.id as string));
                this.createClusters();
                this.getClusteredNodesCoordinates();
                const ids = nodeDifferences.map(node => {
                    return node.id
                });
                this.fixedNodes = this.fixedNodes.filter((node: any) => ids.indexOf(node.id) < 0)
            } else {
                if (currentNodes.length < pastNodes.length) {
                    nodeDifferences = getDifferenceInNodes(pastNodes, currentNodes) as LeanDiNode[];
                    nodeDifferences.forEach(node => this.hostsToDelete.splice(
                        this.hostsToDelete.findIndex(nd => node.id == nd.id)
                    ));
                } else {
                    nodeDifferences = getDifferenceInNodesByKeys(pastNodes, currentNodes) as LeanDiNode[];
                }
                nodeDifferences = nodeDifferences.map(node => node.type == NodeType.DB_HOST ?
                    this.hostsParser.fillDbHostFigure(node) : this.hostsParser.fillFsHostFigure(node));
                this.nodeDataSet.update(nodeDifferences.map(node => {
                    if (node.clusterId == null || node.clusterId == StringUtils.EMPTY_STRING) {
                        node!.fixed = false;
                        const {x, y} = this.network.getViewPosition();
                        node!.x = x + 100;
                        node!.y = y + 100;
                    }
                    return node;
                }));
                this.createClusters();
                this.getClusteredNodesCoordinates();
            }

            this.history = this.undoRedo.undoHistory();
            this.handleDownload();
        }
    }

    handleRedoEvent() {
        if (this.history.future.length > 0) {
            const currentNodes = this.nodeDataSet.get();
            const currentEdges = this.edgeDataSet.get();
            const futureNodes = this.history.future[0].nodes;
            const futureEdges = this.history.future[0].edges;

            let nodeDifferences: LeanDiNode[];

            if (currentNodes.length > futureNodes.length) {
                nodeDifferences = getDifferenceInNodes(currentNodes, futureNodes) as LeanDiNode[];
                nodeDifferences.forEach(node => this.hostsToDelete.push(node));
                this.nodeDataSet.remove(nodeDifferences as Node[]);
                this.createClusters();
                this.getClusteredNodesCoordinates();
                const ids = nodeDifferences.map(node => {
                    return node.id
                });
                this.fixedNodes = this.fixedNodes.filter((node: any) => ids.indexOf(node.id) < 0)
            } else {
                if (currentNodes.length < futureNodes.length) {
                    nodeDifferences = getDifferenceInNodes(futureNodes, currentNodes) as LeanDiNode[];
                    nodeDifferences.forEach(node => this.hostsToDelete.splice(
                        this.hostsToDelete.findIndex(nd => node.id == nd.id)
                    ));

                } else {
                    nodeDifferences = getDifferenceInNodesByKeys(futureNodes, currentNodes) as LeanDiNode[];
                }
                nodeDifferences = nodeDifferences.map(node => node.type == NodeType.DB_HOST ?
                    this.hostsParser.fillDbHostFigure(node) : this.hostsParser.fillFsHostFigure(node));
                this.nodeDataSet.update(nodeDifferences.map(node => {
                    if (node.clusterId == null || node.clusterId == StringUtils.EMPTY_STRING) {
                        node!.fixed = false;
                        const {x, y} = this.network.getViewPosition();
                        node!.x = x + 100;
                        node!.y = y + 100;
                    }
                    return node;
                }));
                this.createClusters();
                this.getClusteredNodesCoordinates();
            }

            this.history = this.undoRedo.redoHistory();
            this.handleDownload();
        }

        this.createClusters();
        this.getClusteredNodesCoordinates();
    }

    preventRedirect(message: string) {
        this.noticeDialog.open("Error of redirecting to domain", message);
    }

    deleteHosts(activeNode?: LeanDiNode) {
        const selectedNode = this.network.getSelectedNodes();
        const selectedEdge = this.network.getSelectedEdges();

        if (this.activeNode != null) {
            // this.domainsToDelete.push(this.activeNode.shortName!);
            this.edgeDataSet.remove(this.network.getConnectedEdges(this.activeNode!.id!));
            this.nodeDataSet.remove(this.activeNode!.id!);
            this.hostsToDelete.push(this.activeNode);
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
            this.activeNode = null;
        } else {
            if (selectedEdge.length != 0) {
                // TODO: Оценить необходимость удаления междоменных
                //  связей по кнопке delete
                // if (selectedNode.length != 0) {
                //     for (let nodeId of selectedNode) {
                //         const domain = this.nodeDataSet.get(nodeId) as LeanDiNode;
                //         if (domain != null) {
                //             this.domainsToDelete.push(domain.shortName!);
                //             this.edgeDataSet.remove(this.network.getConnectedEdges(nodeId));
                //             this.nodeDataSet.remove(nodeId);
                //         }
                //     }
                // } else {
                //     for (let edgeId of selectedEdge) {
                //         this.connexionsToDelete.push(edgeId as string);
                //         this.edgeDataSet.remove(edgeId);
                //     }
                // }
                // this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get())
            } else {
                if (selectedNode.length != 0) {
                    for (let nodeId of selectedNode) {
                        const dbHost = this.nodeDataSet.get(nodeId) as DbHost | FsHost;
                        if (dbHost != null) {
                            // this.domainsToDelete.push(domain.shortName!);
                            this.edgeDataSet.remove(this.network.getConnectedEdges(nodeId));
                            this.nodeDataSet.remove(nodeId);
                            this.hostsToDelete.push(dbHost);
                        }
                    }
                }
                this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get())
            }
        }
        this.handleDownload();
        this.createClusters();
        this.getClusteredNodesCoordinates();
    }

    handleHostCreating(detail: any) {
        switch (detail) {
            case 'db-host-add':
                this.dbHostCreationDialog = new DbHostCreationDialog();
                this.dbHostCreationDialog.open('database host');
                break;
            case 'fs-host-add':
                this.fsHostCreationDialog = new FsHostCreationDialog();
                this.fsHostCreationDialog.open('file-system host');
                break
            default:
                break;
        }
    }

    initTree() {
        const data = {nodes: this.nodeDataSet, edges: this.edgeDataSet,};

        const options = {
            "edges": {
                "smooth": {
                    "forceDirection": "none"
                },
                "color": {
                    "highlight": DEFAULT_NODE_COLOR,
                    "inherit": false
                }

            },
            "nodes": {
                "font": {
                    "size": 12,
                    "color": DEFAULT_FONT_COLOR
                },
                // fixed: true
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
                "multiselect": true
            }
        }
        // @ts-ignore
        this.network = new Network(this.shadowRoot!.getElementById("customId")!, data, options);
        this.network.moveTo({scale: 0.25})
    }

    handleZoom(e: CustomEvent) {
        if (e.detail == 'zoom-plus') {
            if (this.network.getScale() * 1.3 <= 1.5) {
                this.scale = this.scale * 1.3;
                this.network.moveTo({scale: this.scale});
            }
        } else {
            if (this.network.getScale() / 1.3 >= 0.2) {
                this.scale = this.scale / 1.3;
                this.network.moveTo({scale: this.scale});
            }
        }
    }

    handleUpload() {
        this.activeNode = null;
        this.$server?.openUpload();
    }


    handlePin() {
        if (this.pinAll) {
            this.nodeDataSet.forEach(node => {
                if (!this.fixedNodes.includes(node.id as string)) {
                    this.nodeDataSet.update({id: node.id, fixed: true});
                    this.fixedNodes.push(node.id as string)
                }
            });

            this.pinAll = false;
        } else {
            this.nodeDataSet.forEach((node: LeanDiNode) => {
                if (isStrEmpty(node.clusterId) && this.fixedNodes.includes(node.id as string)) {
                    this.nodeDataSet.update({id: node.id, fixed: false});
                }
            });
            this.fixedNodes = [];
            this.pinAll = true;
        }
    }


    handleDownload(doMarshall?: boolean) {
        let newDbHosts: LeanDiNode[] = (this.nodeDataSet.get() as LeanDiNode[])
            .filter((item) => item.type == NodeType.DB_HOST && item.isNew != null && item.isNew);
        let oldDbHosts: LeanDiNode[] = (this.nodeDataSet.get() as LeanDiNode[])
            .filter((item) => item.type == NodeType.DB_HOST && (item.isNew == null || !item.isNew));
        let dbHostsToDelete: LeanDiNode[] = this.hostsToDelete
            .filter((item) => item.type == NodeType.DB_HOST);

        let newFsHosts: LeanDiNode[] = (this.nodeDataSet.get() as LeanDiNode[])
            .filter((item) => item.type == NodeType.FS_HOST && item.isNew != null && item.isNew);
        let oldFsHosts: LeanDiNode[] = (this.nodeDataSet.get() as LeanDiNode[])
            .filter((item) => item.type == NodeType.FS_HOST && (item.isNew == null || !item.isNew));
        let fsHostsToDelete: LeanDiNode[] = this.hostsToDelete
            .filter((item) => item.type == NodeType.FS_HOST);

        this.$server?.addDbHost(JSON.stringify(newDbHosts.map((node: LeanDiNode) => mapToDbHost(node))));
        this.$server?.updateDbHost(JSON.stringify(oldDbHosts.map((node: LeanDiNode) => mapToDbHost(node))));
        this.$server?.deleteDbHost(dbHostsToDelete.map((node: LeanDiNode) => {
            return node.uid
        }).join(StringUtils.COMMA));

        this.$server?.addFsHost(JSON.stringify(newFsHosts.map((node: LeanDiNode) => mapToFsHost(node))));
        this.$server?.updateFsHost(JSON.stringify(oldFsHosts.map((node: LeanDiNode) => mapToFsHost(node))));
        this.$server?.deleteFsHost(fsHostsToDelete.map((node: LeanDiNode) => {
            return node.uid
        }).join(StringUtils.COMMA));

        newDbHosts.forEach(host => this.noteNodeAsOld(host));
        newFsHosts.forEach(host => this.noteNodeAsOld(host));

        if (doMarshall) {
            this.$server?.marshall();
        }

    };

    // Точка старта на фронт приложения. Бэк вызывает этот метод, передавая в него узлы.
    getTree(hostsAsJson?: string, fsHostsAsJson?: string, domainsAsJson?: string, projectUid?: string) {

        this.nodeDataSet.clear();
        this.edgeDataSet.clear();

        this.pinAll = false;
        this.labeledAll = false;

        this.edgeList = [];

        this.fixedNodes = [];

        this.domains = JSON.parse(domainsAsJson!);

        this.projectUid = projectUid!;

        this.nodeDataSet.add(this.getDbHosts(hostsAsJson!));
        this.nodeDataSet.add(this.getFsHosts(fsHostsAsJson!));

        this.edgeDataSet.add(this.edgeList)

        if (!this.eventsInitialized) {
            this.initEvents();
            this.eventsInitialized = true;
        }
        this.nodeDataSet.update(this.nodeDataSet.get().map(node => this.setPositions(node)));
        this.createClusters();
        this.initializeClusteredNodesCoordinates();
        this.getNotClusteredNodesCoordinates();

        try {
            this.network.moveTo({position: getCenter(this.nodeDataSet.get()), scale: 0.7});
        } catch (e) {
            this.network.moveTo({position: {x: 0, y: 0}, scale: 0.7});
        }

        this.history = copy(this.undoRedo.initHistory(this.edgeDataSet.get(), this.nodeDataSet.get()));

        hostsAsJson = undefined;
        fsHostsAsJson = undefined;
        fsHostsAsJson = undefined;
        domainsAsJson = undefined;
    }

    getNotClusteredNodesCoordinates() {
        const nodes = this.nodeDataSet.get().filter((node: LeanDiNode) => node.clusterId == null || node.clusterId == StringUtils.EMPTY_STRING);
        let posY = 0;
        this.nodeDataSet.update(nodes.map(node => {
            node.x = -300;
            node.y = posY;
            posY += 100;
            return node;
        }))
    }

    createClusters() {
        const clusterCenters = new Map();
        let nodes = this.nodeDataSet.get() as LeanDiNode[];
        nodes.forEach(node => {
            if (node.clusterId != null && node.clusterId != StringUtils.EMPTY_STRING) {
                if (clusterCenters.has(node.clusterId)) {
                    clusterCenters.get(node.clusterId).push(node.id)
                } else {
                    clusterCenters.set(node.clusterId, [node.id])
                }
            }
        });
        this.clusters = new Map([...clusterCenters.entries()].sort());

    }


    getDbHosts(hosts: string) {
        let hostList = JSON.parse(hosts);
        let domainsContainer: any = []
        // hostList = hostList.map((node: object) => this.parseHost(node, domainsContainer));
        hostList = hostList.map((node: object) => this.parseDbHost(node));
        let bufferList: any[] = []
        for (let list of hostList) {
            bufferList = bufferList.concat([list[0]])
            // bufferList = bufferList.concat(list[1])
        }
        return bufferList
    }

    getFsHosts(hosts: string) {
        let hostList = JSON.parse(hosts);
        let domainsContainer: any = []
        // hostList = hostList.map((node: object) => this.parseHost(node, domainsContainer));
        hostList = hostList.map((node: object) => this.parseFsHost(node));
        let bufferList: any[] = []
        for (let list of hostList) {
            bufferList = bufferList.concat([list[0]])
            // bufferList = bufferList.concat(list[1])
        }
        return bufferList
    }

    parseDbHost(node: any, domainsContainer?: any) {
        node = this.hostsParser.parseDbHost(node);
        node = this.hostsParser.fillDbHostFigure(node);
        node.fixed = true;
        if (domainsContainer) {
            domainsContainer = this.getDomains(node);
            return [node, domainsContainer];
        } else {
            return [node];
        }
    }

    parseFsHost(node: any, domainsContainer?: any) {
        node = this.hostsParser.parseFsHost(node);
        node = this.hostsParser.fillFsHostFigure(node);
        node.fixed = true;
        if (domainsContainer) {
            domainsContainer = this.getDomains(node);
            return [node, domainsContainer];
        } else {
            return [node];
        }
    }

    getDomains(host: object | any) {
        let domains = [];
        for (let domainIndex in host['domain']) {
            let domain = host['domain'][domainIndex];
            domain = this.parseDomain(domain, host);
            this.fillEdge(host['id'], domain['id']);
            domains.push(domain);
        }
        return domains;
    }

    parseDomain(node: any, host: any) {
        node = this.hostsParser.parseDomain(node);
        node = this.hostsParser.fillDomainFigure(node);
        node['id'] = host['host'] + StringUtils.UNDERLINE + node['id'];
        node['hostId'] = host['id'];
        return node as Domain;
    }

    fillEdge(idFrom: string, idTo: string, label?: string, arrow?: boolean, uid?: string | null, width?: number) {
        let edge: Edge = {
            'from': idFrom,
            'to': idTo,
            'color': {
                'color': BLACK
            },
            'length': 1,
        }
        if (label) {
            edge['label'] = label;
        }
        if (arrow) {
            edge['arrows'] = "to"
        }
        if (uid != null) {
            edge['id'] = uid;
        } else {
            edge['id'] = generateUid();
        }
        if (width != null) {
            edge['width'] = width * 1.5;
        }
        // edge.hidden = true;
        this.edgeList.push(edge);
        return edge;
    }

    setPositions(node: any) {
        let nodePosition = this.network.getPositions([node['id']]);
        node['x'] = nodePosition[node['id']].x;
        node['y'] = nodePosition[node['id']].y;
        return node;
    }

    noteNodeAsOld(node: LeanDiNode) {
        node.isNew = false;
        node = this.setPositions(node);
        return node;
    }

    getClusteredNodesCoordinates(clusterId?: number | string) {
        this.clusters.forEach((value, key, map) => {
            const nodes = this.nodeDataSet.get(value as string[]).map(node => this.setPositions(node));
            const c = document.createElement('canvas');
            const ctx = c.getContext('2d');
            ctx!.font = '12px Arial';

            let positionY = nodes[0].y as number;
            let positionX = nodes[0].x as number;

            let nodesClone = copy(nodes);
            const newArr = [];
            while (nodesClone.length) newArr.push(nodesClone.splice(0, 3));

            for (let line of newArr) {

                line[0].x = positionX;
                line[0].y = positionY;
                line[0].fixed = true;

                let delta = ctx!.measureText(line[0].label!).width / 2 + 30;

                for (let i = 1; i < line.length; i++) {
                    delta += ctx!.measureText(line[i].label!).width / 2 + 30
                    line[i].x = positionX + delta;
                    line[i].y = positionY;
                    line[i].fixed = true;
                    delta += ctx!.measureText(line[i].label!).width / 2 + 30;
                }
                positionY += 100;

                this.nodeDataSet.update(line);
            }
            this.nodeDataSet.update(this.nodeDataSet.get().map(node => this.setPositions(node)));
        });


    }


    initializeClusteredNodesCoordinates(clusterId?: number | string) {
        let positionY = 0;
        let positionX = 0;
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        ctx!.font = '12px Arial';
        this.clusters.forEach((value, key) => {
            const nodes = this.nodeDataSet.get(value);

            let nodesClone = copy(nodes);
            const newArr = [];
            while (nodesClone.length) newArr.push(nodesClone.splice(0, 3));

            for (let line of newArr) {

                positionX = 0;

                line[0].x = positionX;
                line[0].y = positionY;
                line[0].fixed = true;

                let delta = ctx!.measureText(line[0].label!).width / 2 + 30;

                for (let i = 1; i < line.length; i++) {
                    delta += ctx!.measureText(line[i].label!).width / 2 + 30
                    line[i].x = positionX + delta;
                    line[i].y = positionY;
                    line[i].fixed = true;
                    delta += ctx!.measureText(line[i].label!).width / 2 + 30;
                }
                positionY += 100;

                this.nodeDataSet.update(line);
            }
            positionY += 75;
        });
    }

    initEvents() {
        this.network.on('oncontext', (ctx) => {

            const edgeId = this.network.getEdgeAt({x: ctx.pointer.DOM.x, y: ctx.pointer.DOM.y});
            const nodeId = this.network.getNodeAt({x: ctx.pointer.DOM.x, y: ctx.pointer.DOM.y});

            if (nodeId != null) {
                this.activeNode = this.nodeDataSet.get(nodeId) as DbHost;
                this.contextMenuItems = [{text: 'Edit node'}, {text: 'Delete node'}, {text: 'Fix/unfix node'}];
            } else {
                this.contextMenuItems = [];
            }

        });

        let step;
        let nodePosition;
        this.network.on("afterDrawing", (ctx) => {
            // for (step = 0; step < this.fixedNodes.length; step++) {
            //     nodePosition = this.network.getPositions([this.fixedNodes[step]]);
            //     ctx.strokeStyle = BLACK;
            //     ctx.lineWidth = 3;
            //     ctx.beginPath();
            //     try {
            //         ctx.fillStyle = BLACK;
            //         ctx.arc(
            //             nodePosition[this.fixedNodes[step]].x,
            //             nodePosition[this.fixedNodes[step]].y - 2,
            //             2,
            //             0,
            //             2 * Math.PI
            //         );
            //         ctx.stroke();
            //         ctx.fill();
            //     } catch (e) {
            //
            //     }
            // }
            this.clusters.forEach((value, key) => {
                const nodes = this.nodeDataSet.get(value);
                if (nodes.length != 0) {
                    const maxX = Math.max(...nodes.map(node => node.x) as number[]);
                    const minX = Math.min(...nodes.map(node => node.x) as number[]);
                    const maxY = Math.max(...nodes.map(node => node.y) as number[]);
                    const minY = Math.min(...nodes.map(node => node.y) as number[]);

                    let nodesClone = structuredClone(nodes.map(node => {
                        //@ts-ignore
                        delete node.ctxRenderer;
                        return node;
                    }));
                    ctx.font = '12px Arial';

                    const linesCount = Math.ceil(nodes.length / 3);

                    const newArr = [];
                    const leftX: number[] = []
                    const rightX: number[] = [];
                    while (nodesClone.length) newArr.push(nodesClone.splice(0, 3).map((node: LeanDiNode) => {
                        leftX.push(node.x! - ctx.measureText(node.label).width / 2 - 20);
                        rightX.push(node.x! + ctx.measureText(node.label).width / 2 + 20);
                        return ctx.measureText(node.label).width + 60
                    }));


                    let w = 0;
                    for (let xLeft of leftX) {
                        for (let xRight of rightX) {
                            if (xRight - xLeft >= w) {
                                w = xRight - xLeft;
                            }
                        }
                    }
                    w = Math.max(w, ctx.measureText('CLUSTER ID: ' + key).width + 20)

                    const h = Math.abs(maxY - minY) + 2 * 60;

                    this.hostsRenderer.renderClusterBackground(
                        ctx,
                        Math.min(...leftX) - 15,
                        minY - 60,
                        w + 30,
                        h + 10,
                        10,
                        'hsla(214, 53%, 23%, 0.16)',
                        key
                    );
                }

            });
        });
        this.network.on("selectNode", (params) => {
            this.activeNode = this.getSelectedNode();
            if (this.buffered) {
                this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
                this.buffered = false;
            }
        });
        this.network.on("selectEdge", (params) => {
            let nodeId = this.network.getSelectedEdges();
        });
        this.network.on("deselectNode", (params) => {
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
            const pos = this.network.getViewPosition();
            if (this.network.getScale() > 1.5)//the limit you want to stop at
            {
                this.network.moveTo({
                    scale: 1.5,
                    position: {x: pos.x, y: pos.y}
                }); //set this limit so it stops zooming out here
            }
            if (this.network.getScale() < 0.2)//the limit you want to stop at
            {
                this.network.moveTo({
                    scale: 0.2,
                    position: {x: pos.x, y: pos.y}
                });  //set this limit so it stops zooming out here
            }
        });

        this.network.on('dragStart', (params) => {

            this.activeNode = this.getSelectedNode();
            if (this.activeNode) {
                if (isStrNotEmpty(this.activeNode!.clusterId)) {
                    const nodes = this.nodeDataSet.get().filter((nd: LeanDiNode) => nd.clusterId == this.activeNode!.clusterId);
                    this.network.setSelection({nodes: nodes.map(node => node.id) as string[]})
                    this.nodeDataSet.update(nodes.map(node => this.setPositions(node)));
                }
            }
            if (params.nodes.length > 0) {
                let selectedNodes = this.nodeDataSet.get(this.network.getSelectedNodes()) as LeanDiNode[];
                for (let node of selectedNodes) {
                    node["fixed"] = false;
                    const index = this.fixedNodes.indexOf(node.id as string);
                    if (index != -1) {
                        this.fixedNodes.splice(index, 1);
                    }
                    node = this.setPositions(node);
                    if (node.clusterId == null || node.clusterId == StringUtils.EMPTY_STRING) {
                        node = this.setPositions(node);
                    } else {
                        const nodes = this.nodeDataSet.get().filter((nd: LeanDiNode) => nd.clusterId == node.clusterId);
                        // this.network.setSelection({nodes: nodes.map(node => node.id) as string[]})
                        this.nodeDataSet.update(nodes.map(node => this.setPositions(node)));
                    }
                    this.nodeDataSet.update(node);
                }
            }
        });
        this.network.on('dragEnd', (properties) => {
            const ids = properties.nodes;
            this.activeNode = this.getSelectedNode();
            if (this.activeNode) {
                if (isStrNotEmpty(this.activeNode!.clusterId)) {
                    const nodes = this.nodeDataSet.get().filter((nd: LeanDiNode) => nd.clusterId == this.activeNode!.clusterId);
                    this.network.setSelection({nodes: nodes.map(node => node.id) as string[]})
                    this.nodeDataSet.update(nodes.map(node => this.setPositions(node)));
                }
            }

            if (ids.length > 0) {
                let selectedNodes = this.nodeDataSet.get(this.network.getSelectedNodes()) as LeanDiNode[];
                for (let node of selectedNodes) {
                    node["fixed"] = true;
                    node = this.setPositions(node);
                    if (node.clusterId == null || node.clusterId == StringUtils.EMPTY_STRING) {
                        node = this.setPositions(node);
                    } else {
                        const nodes = this.nodeDataSet.get().filter((nd: LeanDiNode) => nd.clusterId == node.clusterId);
                        // this.network.setSelection({nodes: nodes.map(node => node.id) as string[]})
                        this.nodeDataSet.update(nodes.map(node => this.setPositions(node)));
                    }
                    this.nodeDataSet.update(node);
                    this.fixedNodes.push(node.id as string);
                }
            }
        });
    }

    openLayout() {
        this.metadataLayoutVisibility = 'flex';
        this.network.setOptions({
            "interaction": {
                "keyboard": false,
            }
        });
        // TODO: Выяснить, почему при animation=true происходит залипание фокусирования
        this.network.focus(this.activeNode!.id as string, {scale: 1, animation: false, offset: {x: 0, y: -100}});
        this.network.selectNodes([this.activeNode!.id as IdType]);
        if (this.buffered) {
            // this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
            this.buffered = false;
        }
        // this.requestUpdate();
        this.createHostEditorComponent();

    }

    fixUnfixNode(nodesId: string[]) {
        if (nodesId.length > 0) {
            let node = this.nodeDataSet.get(nodesId[0]) as LeanDiNode;
            if (this.fixedNodes.includes(nodesId[0])) {
                if (isStrEmpty(node.clusterId)) {
                    node["fixed"] = false;
                    this.nodeDataSet.update(node);
                    const index = this.fixedNodes.indexOf(node['id'] as string);
                    this.fixedNodes.splice(index, 1);
                }
            } else {
                if (isStrEmpty(node.clusterId)) {
                    this.fixedNodes.push(node['id'] as string);
                    node["fixed"] = true;
                    this.nodeDataSet.update(node);
                }
            }
        }
    }


}

interface VisJsComponentServerInterface {
    fillComponentRequest(): void;

    marshall(): void;

    openUpload(): void;

    createDto(s: string): void;

    openDomain(shortName: string): void;

    redirectToProject(): void;

    redirectToDomain(shortName: string): void;

    addDbHost(s: string): void;

    addFsHost(s: string): void;

    updateFsHost(s: string): void;

    updateDbHost(s: string): void;

    deleteDbHost(s: string): void;

    deleteFsHost(s: string): void;

    buildNewDeployModel(): void;
}

declare global {
    interface Window {
        showSaveFilePicker: any;
    }
}

