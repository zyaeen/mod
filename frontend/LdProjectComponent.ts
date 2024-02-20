import {css, html, LitElement, PropertyValues} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {createTemplate} from "Frontend/icons/get-icons";
import {Edge, Network, Node} from "vis-network";
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

import "Frontend/components/network-editor-components/node-editor-components/node-editors/project/menu-bar/ProjectLeftSideMenuBar";
import "Frontend/components/network-editor-components/node-editor-components/node-editors/project/menu-bar/ProjectRightSideMenuBar";
import {ProjectRenderer} from "Frontend/renderer/ProjectRenderer";

import {
    copy,
    getDifferenceInEdges,
    getDifferenceInEdgesByKeys,
    getDifferenceInNodes,
    getDifferenceInNodesByKeys,
    UndoRedoStructure
} from "Frontend/undo-redo/UndoRedoStructure";
import {FullItem} from "vis-data/declarations/data-interface";

import {Connexion, Domain, LeanDiNode} from "Frontend/interfaces/Interfaces";
import {ProjectParser} from "Frontend/node-parsing/ProjectParser";
import {SaveDialog} from "Frontend/components/network-editor-components/common/dialogs/SaveDialog";


import {canvas2svg} from 'Frontend/canvas-2-svg/canvas2svg.js';
import {MetadataErrorDialog} from "Frontend/components/network-editor-components/common/dialogs/MetadataErrorDialog";

import {mapNodeToDomain} from "Frontend/interfaces/Mappers";
import {generateUid, getCenter, getNewFileHandle} from "Frontend/utils/common";
import {DialogType} from "Frontend/enums/DialogType";
import {
    ProjectNavigationBar
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/project/menu-bar/ProjectNavigationBar";
import {
    DomainCreationDialog
} from "Frontend/components/network-editor-components/node-editor-components/node-editors/project/DomainCreationDialog";
import {
    BLACK,
    DEFAULT_FONT_COLOR,
    DEFAULT_LD_COMPONENTS_COLOR,
    DEFAULT_NODE_COLOR, EDGE_UP_COLOR, WHITE
} from "Frontend/components/network-editor-components/common/ColorPicker";
import {StringUtils} from "Frontend/enums/DefaultValues";

canvas2svg();

const template = createTemplate();
document.head.appendChild(template.content);


@customElement('ld-project')
export class LdProjectComponent extends LitElement {
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
          } `
    }

    private doMarshall = false;

    @state()
    private saveDialog: SaveDialog = new SaveDialog();
    @state()
    private metadataDialog: MetadataErrorDialog = new MetadataErrorDialog();
    @state()
    private domainCreationDialog = new DomainCreationDialog();

    private isNewTree: boolean = false;

    @property()
    private domainColor: string = DEFAULT_NODE_COLOR;
    @property()
    private projectUid: string = '';

    private projectRenderer: ProjectRenderer =
        new ProjectRenderer(
            this.domainColor, //"#f66",
            WHITE
        );

    private projectParser: ProjectParser = new ProjectParser(this.projectRenderer);

    @property()
    private edgeList: string[] = [];

    @property()
    private dialog = false;
    @property()
    private dialogTitle = '';

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

    private projectNavigationBar!: ProjectNavigationBar;

    private scale = 1;

    @property()
    private layoutHeight = '97';
    @property()
    private layoutWidth = '120';
    @property()
    private activeNode: Domain | null = null;
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

    private domainsToDelete: string[] = [];
    private connexionsToDelete: string[] = [];

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

    createDomain(detail: any) {
        let domain = this.projectParser.createDomainNodeTemplate(detail) as Domain;
        domain = this.projectParser.fillDomainFigure(domain);
        this.nodeDataSet.add([domain]);
        this.network.unselectAll();
        return domain;
    }

    handleSaveDialogEvents() {
        switch (this.saveDialog.getDialogType()) {
            case DialogType.DOMAIN_NAVIGATOR:
                this.$server!.openDomain(this.saveDialog.getData());
                break;
            case DialogType.EMPTY_DIALOG:
                break;
            case DialogType.HOSTS_NAVIGATOR:
                this.$server!.redirectToHosts();
                break;
            case DialogType.PROJECT_NAVIGATOR:
                break;
            case DialogType.PROJECT_RECREATOR:
                this.$server!.buildNewProject();
                break;
            default:
                break;
        }
    }

    render() {
        this.domainCreationDialog.addEventListener('create-domain', (e: Event) => {
            e.stopImmediatePropagation();
            this.handleNodeMetadataChanging((<any>e).detail)
            this.handleDownload();
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
        });
        this.projectNavigationBar = new ProjectNavigationBar();
        this.projectNavigationBar.domainList = this.nodeDataSet.get()
            .map((node: LeanDiNode) => node.shortName) as string[];
        this.projectNavigationBar.requestUpdate();
        this.projectNavigationBar.addEventListener('jump-to-hosts', (e: Event) => {
            // this.saveDialog.openDialog(DialogType.HOSTS_NAVIGATOR);
            this.$server!.redirectToHosts();
        });
        this.projectNavigationBar.addEventListener('jump-to-domain', (e: Event) => {
            // this.saveDialog.openDialog(DialogType.DOMAIN_NAVIGATOR, (<any>e).detail);
            this.$server!.openDomain((<any>e).detail);
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
                    <project-left-side-menu-bar
                            @add-node-event="${() => this.handleDomainCreating()}"
                            style=" background-color: hsla(0, 0%, 100%, 0.3); "
                    >
                    </project-left-side-menu-bar>
                </div>
                <div style="position: fixed; z-index: 1; background-color: hsla(0, 0%, 100%, 0.3);  left: 20px; bottom: 20px">
                    <b style="color: ${this.domainColor}">Project: ${this.projectUid.split("-")[0]}</b>
                </div>
                <vaadin-horizontal-layout
                        style="position: fixed; z-index: 1; background-color: transparent; right: 10px; top: 10px">
                    <div>
                        ${this.projectNavigationBar}
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
                ${this.domainCreationDialog}
                ${this.saveDialog}
            </vaadin-context-menu>
        `
    }

    handleNodeMetadataChanging(details: any) {
        if (!this.domainCreationDialog.isEdit()) {
            let domain = this.createDomain(details);
            let newDomains: Domain[] = (this.nodeDataSet.get() as LeanDiNode[])
                .filter((item) => item.isNew != null && item.isNew);
            this.$server?.addDomain(JSON.stringify(newDomains.map((node: Domain) => mapNodeToDomain(node))));
            newDomains.forEach(domain => this.noteNodeAsOld(domain));
        } else {
            for (let key of Object.keys(details)) { //@ts-ignore
                this.activeNode![key] = details[key];
            }
            this.activeNode!.label = this.activeNode!.name;
            this.nodeDataSet.update(this.setPositions(this.activeNode));
        }
    }

    handleNewTreeEvent() {
        this.saveDialog.openDialog(DialogType.PROJECT_RECREATOR);
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
        // this.handleSaveDialogEvents();
    }

    contextMenuItemSelected(e: Event) {
        if ((<any>e).detail.value.text == 'Fix/unfix node') {
            this.fixUnfixNode([this.activeNode!.id as string]);
        }
        if ((<any>e).detail.value.text == 'Delete node') {
            // this.network.setSelection(this.network.getNodeAt(th))
            this.deleteDomains();
        }
        if ((<any>e).detail.value.text == 'Edit domain metadata') {
            // this.network.setSelection(this.network.getNodeAt(th))
            this.handleNodeEditing();
        }
    }


    getSelectedNode() {
        let nodeId = this.network.getSelectedNodes();
        return this.nodeDataSet.get(nodeId)[0] as Domain;
    }

    protected firstUpdated(_changedProperties: PropertyValues) {
        super.firstUpdated(_changedProperties);
        this.initTree();
        this.$server?.fillComponentRequest();
        this.lastId = 1000;
        addEventListener('keydown', (event) => {
            const key = event.key; // const {key} = event; ES6+
            if (key === "Delete") {
                this.deleteDomains();
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
            const currentEdges = this.edgeDataSet.get();
            const pastNodes = this.history.past[this.history.past.length - 1].nodes;
            const pastEdges = this.history.past[this.history.past.length - 1].edges;
            let nodeDifferences: Domain[];

            if (currentNodes.length > pastNodes.length) {

                nodeDifferences = getDifferenceInNodes(currentNodes, pastNodes) as Domain[];
                nodeDifferences.forEach((node: Domain) => this.domainsToDelete.push(node.shortName as string));
                this.nodeDataSet.remove((copy(nodeDifferences) as Node[]).map(node => node.id as string));
                const ids = nodeDifferences.map(node => {
                    return node.id
                });
                this.fixedNodes = this.fixedNodes.filter((node: any) => ids.indexOf(node.id) < 0)
            } else {
                if (currentNodes.length < pastNodes.length) {
                    nodeDifferences = getDifferenceInNodes(pastNodes, currentNodes) as Domain[];
                    nodeDifferences.forEach(node => this.domainsToDelete.splice(
                        this.domainsToDelete.indexOf(node.shortName as string)
                    ));
                } else {
                    nodeDifferences = getDifferenceInNodesByKeys(pastNodes, currentNodes) as Domain[];
                }
                nodeDifferences = nodeDifferences.map(node => this.projectParser.fillDomainFigure(node));
                this.nodeDataSet.update(nodeDifferences);
            }

            let edgeDifferences;

            if (currentEdges.length > pastEdges.length) {
                edgeDifferences = getDifferenceInEdges(currentEdges, pastEdges);
                this.edgeDataSet.remove(edgeDifferences);
            } else {
                if (currentEdges.length < pastEdges.length) {
                    edgeDifferences = getDifferenceInEdges(pastEdges, currentEdges);
                } else {
                    edgeDifferences = getDifferenceInEdgesByKeys(pastEdges, currentEdges);
                }
                this.edgeDataSet.update(edgeDifferences);
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

            let nodeDifferences: Domain[];

            if (currentNodes.length > futureNodes.length) {
                nodeDifferences = getDifferenceInNodes(currentNodes, futureNodes) as Domain[];
                nodeDifferences.forEach(node => this.domainsToDelete.push(node.shortName as string));
                this.nodeDataSet.remove(nodeDifferences as Node[]);
                const ids = nodeDifferences.map(node => {
                    return node.id
                });
                this.fixedNodes = this.fixedNodes.filter((node: any) => ids.indexOf(node.id) < 0)
            } else {
                if (currentNodes.length < futureNodes.length) {
                    nodeDifferences = getDifferenceInNodes(futureNodes, currentNodes) as Domain[];
                    nodeDifferences.forEach(node => this.domainsToDelete.splice(
                        this.domainsToDelete.indexOf(node.shortName as string)
                    ));

                } else {
                    nodeDifferences = getDifferenceInNodesByKeys(futureNodes, currentNodes) as Domain[];
                }
                nodeDifferences = nodeDifferences.map(node => this.projectParser.fillDomainFigure(node));
                this.nodeDataSet.update(nodeDifferences);
            }

            let edgeDifferences;

            if (currentEdges.length > futureEdges.length) {
                edgeDifferences = getDifferenceInEdges(currentEdges, futureEdges);
                this.edgeDataSet.remove(edgeDifferences);
            } else {
                if (currentEdges.length < futureEdges.length) {
                    edgeDifferences = getDifferenceInEdges(futureEdges, currentEdges);
                } else {
                    edgeDifferences = getDifferenceInEdgesByKeys(futureEdges, currentEdges);
                }
                this.edgeDataSet.update(edgeDifferences);
            }

            this.history = this.undoRedo.redoHistory();
            this.handleDownload();
        }
    }

    handleNodeEditing() {
        this.domainCreationDialog = new DomainCreationDialog();
        this.domainCreationDialog.open('domain', this.activeNode as Domain);
        // this.dialogTitle = 'Edit domain metadata';
        // this.dialog = true;
    }

    deleteDomains(activeNode?: LeanDiNode) {
        const selectedNode = this.network.getSelectedNodes();
        const selectedEdge = this.network.getSelectedEdges();

        if (this.activeNode != null) {
            this.domainsToDelete.push(this.activeNode.shortName!);
            this.edgeDataSet.remove(this.network.getConnectedEdges(this.activeNode!.id!));
            this.nodeDataSet.remove(this.activeNode!.id!);
            this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
            this.activeNode = null;
        } else {
            if (selectedEdge.length != 0) {
                // TODO: Оценить необходимость удаления междоменных
                //  связей по кнопке delete
                // if (selectedNode.length != 0) {
                //     for (let nodeId of selectedNode) {
                //         const domain = this.nodeDataSet.get(nodeId) as Domain;
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
                        const domain = this.nodeDataSet.get(nodeId) as Domain;
                        if (domain != null) {
                            this.domainsToDelete.push(domain.shortName!);
                            this.edgeDataSet.remove(this.network.getConnectedEdges(nodeId));
                            this.nodeDataSet.remove(nodeId);
                        }
                    }
                }
                this.history = this.undoRedo.updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get())
            }
        }
        this.handleDownload();
    }

    handleDomainCreating() {
        this.domainCreationDialog = new DomainCreationDialog();
        this.domainCreationDialog.open('domain');
    }

    initTree() {
        const data = {nodes: this.nodeDataSet, edges: this.edgeDataSet,};


        const options = {
            "edges": {
                // "smooth": {
                //     "forceDirection": "none"
                // },
                "color": {
                    "highlight": DEFAULT_NODE_COLOR,
                    "inherit": false
                }

            },
            "nodes": {
                "font": {
                    "size": 12,
                    "color": DEFAULT_FONT_COLOR
                }
            },
            // "physics": {
            //     // "barnesHut": {
            //     //     "gravitationalConstant": -1700,
            //     //     "centralGravity": 0,
            //     //     "springLength": 235,
            //     //     "damping": 0.15,
            //     //     "avoidOverlap": 5
            //     // },
            //     "maxVelocity": 21,
            //     "minVelocity": 0.75,
            //     "timestep": 0.72
            // },
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
            this.nodeDataSet.forEach(node => {
                if (this.fixedNodes.includes(node.id as string)) {
                    this.nodeDataSet.update({id: node.id, fixed: false});
                }
            });
            this.fixedNodes = [];
            this.pinAll = true;
        }
    }


    handleDownload(doMarshall?: boolean) {


        this.$server?.updateProject();

        let newDomains: Domain[] = (this.nodeDataSet.get() as LeanDiNode[])
            .filter((item) => item.isNew != null && item.isNew);
        let oldDomains: Domain[] = (this.nodeDataSet.get() as LeanDiNode[])
            .filter((item) => item.isNew == null || !item.isNew);
        this.$server?.addDomain(JSON.stringify(newDomains.map(node => this.setPositions(node)).map((node: Domain) => mapNodeToDomain(node))));
        this.$server?.updateDomain(JSON.stringify(oldDomains.map(node => this.setPositions(node)).map((node: Domain) => mapNodeToDomain(node))));

        newDomains.forEach(domain => this.noteNodeAsOld(domain));
        this.$server?.deleteDomain(this.domainsToDelete.join(StringUtils.COMMA));
        this.$server?.deleteConnexion(this.connexionsToDelete.join(StringUtils.COMMA));
        if (doMarshall === true) {
            this.$server?.marshall();
        }
    };


    // Точка старта на фронт приложения. Бэк вызывает этот метод, передавая в него узлы.
    getTree(domains?: string, connexions?: string, projetctUid?: string) {


        this.nodeDataSet.clear();
        this.edgeDataSet.clear();

        this.pinAll = false;
        this.labeledAll = false;

        this.edgeList = [];

        this.fixedNodes = [];

        try {
            this.nodeDataSet.add(this.getDomains(domains!));
        } catch (e) {
            console.debug(e)
        }
        this.getConnexions(connexions!);

        this.projectUid = projetctUid!;

        let connexionsCount: { [index: string]: number } = {}
        for (let edge of this.edgeList) {
            if (Object.keys(connexionsCount).indexOf(edge) == -1) {
                connexionsCount[edge] = 1;
            } else {
                connexionsCount[edge] += 1;
            }
        }
        for (let edge of Object.keys(connexionsCount)) {
            const dom = (edge as string).split(StringUtils.UNDERLINE);
            const count = connexionsCount[edge];
            this.edgeDataSet.add(this.fillEdge(dom[0], dom[1], count != 1 ? "x" + count.toString() : StringUtils.EMPTY_STRING, true, null, count))
        }
        // this.edgeDataSet.add(this.edgeList)

        try {
            this.network.moveTo({position: getCenter(this.nodeDataSet.get()), scale: 0.7});
        } catch (e) {
            this.network.moveTo({position: {x: 0, y: 0}, scale: 0.7});
        }

        if (!this.eventsInitialized) {
            this.initEvents();
            this.eventsInitialized = true;
        }

        this.history = copy(this.undoRedo.initHistory(this.edgeDataSet.get(), this.nodeDataSet.get()));


        domains = undefined;
        connexions = undefined;
    }


    getDomains(domains: string) {
        let domainList = JSON.parse(domains);
        domainList = domainList.map((node: object) => this.parseDomain(node));
        let bufferList: any[] = []
        for (let list of domainList) {
            bufferList = bufferList.concat([list[0]])
        }
        return bufferList
    }

    parseDomain(node: any) {
        node = this.projectParser.parseDomain(node);
        node = this.projectParser.fillDomainFigure(node);
        node.fixed = true;
        return [node];
    }


    getConnexions(connexions: string) {
        let connexionList = JSON.parse(connexions);
        connexionList = connexionList.map((connexion: Connexion) => this.parseConnexion(connexion));
        return connexionList;
    }

    parseConnexion(connexion: Connexion) {
        const from = connexion.anchorRole[0].identifier ? 0 : 1;
        // this.edgeList.push(this.fillEdge(
        //     connexion.anchorRole[from].domain!,
        //     connexion.anchorRole[1 - from].domain!,
        //     connexion.descriptor,
        //     true,
        //     connexion.uid
        // ));
        this.edgeList.push(connexion.anchorRole[from]!.domain + StringUtils.UNDERLINE + connexion.anchorRole[1 - from]!.domain)
    }


    fillEdge(idFrom: string, idTo: string, label?: string, arrow?: boolean, uid?: string | null, width?: number) {
        let edge: Edge = {
            'from': idFrom,
            'to': idTo,
            'color': {
                'color': BLACK
            },
            // 'length': 300,
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

    initEvents() {
        this.network.on('oncontext', (ctx) => {

            const edgeId = this.network.getEdgeAt({x: ctx.pointer.DOM.x, y: ctx.pointer.DOM.y});
            const nodeId = this.network.getNodeAt({x: ctx.pointer.DOM.x, y: ctx.pointer.DOM.y});

            // TODO: Оценить необходимость удаления междоменных
            //  связей по пкм
            // if (edgeId != null && nodeId == null) {
            //     this.activeEdge = this.edgeDataSet.get(edgeId);
            //     let node = (this.nodeDataSet.get(this.network.getConnectedNodes(edgeId) as Id[]) as Domain[]).filter(
            //         x => (x.type == NodeType.TIE || x.type == NodeType.TX_ANCHOR))
            //     if (node.length != 0) {
            //         this.activeNode = node[0];
            //         this.contextMenuItems = [{text: 'Edit edge'}, {text: 'Delete edge'}, {text: 'Make first'}];
            //     } else {
            //         this.contextMenuItems = [];
            //     }
            // } else {
            //     this.contextMenuItems = [];
            // }

            if (nodeId != null) {
                this.activeNode = this.nodeDataSet.get(nodeId) as Domain;
                this.contextMenuItems = [{text: 'Delete node'}, {text: 'Fix/unfix node'}, {text: 'Edit domain metadata'}];
            } else {
                this.contextMenuItems = [];
            }

        });

        let step;
        let nodePosition;
        this.network.on("afterDrawing", (ctx) => {
            for (let edge of this.edgeDataSet.get()) {
                const yFrom = this.network.getPosition(edge.from as string).y;
                const yTo = this.network.getPosition(edge.to as string).y;
                if (yFrom <= yTo) {
                    edge.color = {
                        color: EDGE_UP_COLOR,
                        highlight: EDGE_UP_COLOR
                    };
                } else {
                    edge.color = {
                        color: DEFAULT_NODE_COLOR,
                        highlight: DEFAULT_NODE_COLOR
                    };
                }
                this.edgeDataSet.update(edge);
            }
        });
        this.network.on("selectNode", (params) => {
            this.activeNode = this.getSelectedNode();

            // if (this.buffered) {
            //     this.history = updateHistory(this.edgeDataSet.get(), this.nodeDataSet.get());
            //     this.buffered = false;
            // }
        });
        this.network.on("selectEdge", (params) => {
            let nodeId = this.network.getSelectedEdges();
        });
        this.network.on("deselectNode", (params) => {
            this.activeNode = this.getSelectedNode();
        });
        this.network.on('doubleClick', (properties) => {
            const nodesId = properties.nodes;
            if (nodesId != null && nodesId.length != 0) {
                this.activeNode = this.nodeDataSet.get(nodesId)[0] as Domain;
                this.fixUnfixNode(nodesId);

                // let newDomains: Domain[] = (this.nodeDataSet.get() as LeanDiNode[])
                //     .filter((item) => item.isNew != null &&
                //         item.isNew && item.shortName == this.activeNode!.shortName!);
                //
                // if (newDomains.length != 0) {
                //     this.$server?.addDomain(JSON.stringify(newDomains.map(domain => mapNodeToDomain(domain))));
                //     newDomains.forEach(node => this.noteNodeAsOld(node as LeanDiNode));
                // }


                this.$server!.openDomain(this.activeNode.shortName!);
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


            if (params.nodes.length > 0) {
                let selectedNodes = this.nodeDataSet.get(this.network.getSelectedNodes());
                for (let node of selectedNodes) {
                    node["fixed"] = false;
                    const index = this.fixedNodes.indexOf(node.id as string);
                    if (index != -1) {
                        this.fixedNodes.splice(index, 1);
                    }
                    this.nodeDataSet.update(this.setPositions(node));
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
                    this.nodeDataSet.update(this.setPositions(node));
                    this.fixedNodes.push(node.id as string);
                }
            }
            this.handleDownload();
        });
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
                this.nodeDataSet.update(node);

            }
        }
    }


}

interface VisJsComponentServerInterface {
    fillComponentRequest(): void;

    deleteDomain(s: string): void;

    deleteConnexion(s: string): void;

    marshall(): void;

    openUpload(): void;

    createDto(s: string): void;

    openDomain(shortName: string): void;

    addDomain(domainData: string): void;

    updateDomain(domainData: string): void;

    redirectToHosts(): void;

    buildNewProject(): void;

    updateProject(): void;
}

declare global {
    interface Window {
        showSaveFilePicker: any;
    }
}

