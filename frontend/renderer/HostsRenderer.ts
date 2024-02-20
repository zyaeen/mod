import {Node} from "vis-network";
import {LeanDiNode} from "Frontend/interfaces/Interfaces";
import {NodeType} from "Frontend/enums/NodeType";
import {
    BLACK,
    DEFAULT_NODE_COLOR,
    DEFAULT_SELECTED_NODE_BORDER_COLOR,
    WHITE
} from "Frontend/components/network-editor-components/common/ColorPicker";
import {StringUtils} from "Frontend/enums/DefaultValues";

declare global {
    interface CanvasRenderingContext2D {
        roundRect: any,
        drawDb: any
    }
}


const db = `<svg id="e9MBvqeD0xc2" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-width="0.1" stroke="${DEFAULT_NODE_COLOR}" fill="${DEFAULT_NODE_COLOR}" d="M12 2.2C7.03 2.2 2 3.334 2 5.5v12.8c0 2.273 5.152 3.5 10 3.5s10-1.227 10-3.5V5.5c0-2.166-5.03-3.3-10-3.3zm0 18.6c-5.576 0-9-1.456-9-2.5v-6.282c1.708 1.173 5.366 1.782 9 1.782s7.292-.61 9-1.782V18.3c0 1.044-3.424 2.5-9 2.5zm0-8c-5.494 0-9-1.363-9-2.3V7.018C4.708 8.191 8.366 8.8 12 8.8s7.292-.61 9-1.782V10.5c0 .938-3.506 2.3-9 2.3zm0-5c-5.494 0-9-1.363-9-2.3s3.506-2.3 9-2.3 9 1.362 9 2.3-3.506 2.3-9 2.3z"/></svg>`
const dbSelected = `<svg id="e9MBvqeD0xc2" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-width="0.1" stroke="${DEFAULT_SELECTED_NODE_BORDER_COLOR}" fill="${DEFAULT_SELECTED_NODE_BORDER_COLOR}" d="M12 2.2C7.03 2.2 2 3.334 2 5.5v12.8c0 2.273 5.152 3.5 10 3.5s10-1.227 10-3.5V5.5c0-2.166-5.03-3.3-10-3.3zm0 18.6c-5.576 0-9-1.456-9-2.5v-6.282c1.708 1.173 5.366 1.782 9 1.782s7.292-.61 9-1.782V18.3c0 1.044-3.424 2.5-9 2.5zm0-8c-5.494 0-9-1.363-9-2.3V7.018C4.708 8.191 8.366 8.8 12 8.8s7.292-.61 9-1.782V10.5c0 .938-3.506 2.3-9 2.3zm0-5c-5.494 0-9-1.363-9-2.3s3.506-2.3 9-2.3 9 1.362 9 2.3-3.506 2.3-9 2.3z"/></svg>`

const fs = `<svg id="e9MBvqeD0xc3" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-width="0.1" stroke="${DEFAULT_NODE_COLOR}" fill="${DEFAULT_NODE_COLOR}" d="M11 19.913c-4.966-.084-8-1.388-8-2.334v-6.248C4.643 12.429 8.082 13 11.5 13s6.857-.57 8.5-1.67V14h1V5c0-1.97-4.78-3-9.5-3S2 3.03 2 5v12.58c0 2.116 4.448 3.255 9 3.333zM11.5 3C17 3 20 4.321 20 5s-3 2-8.5 2S3 5.679 3 5s3-2 8.5-2zM3 6.411C4.643 7.457 8.082 8 11.5 8s6.857-.543 8.5-1.589v3.437C20 10.726 16.689 12 11.5 12S3 10.726 3 9.848zM18 15l-1-1h-3l-1 1h-1v8h11v-8zm4 7h-9v-4h9zm-9-5v-1h.414l1-1h2.172l1 1H22v1z"/></svg>`;
const fsSelected = `<svg id="e9MBvqeD0xc3" width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-width="0.1" stroke="${DEFAULT_SELECTED_NODE_BORDER_COLOR}" fill="${DEFAULT_SELECTED_NODE_BORDER_COLOR}" d="M11 19.913c-4.966-.084-8-1.388-8-2.334v-6.248C4.643 12.429 8.082 13 11.5 13s6.857-.57 8.5-1.67V14h1V5c0-1.97-4.78-3-9.5-3S2 3.03 2 5v12.58c0 2.116 4.448 3.255 9 3.333zM11.5 3C17 3 20 4.321 20 5s-3 2-8.5 2S3 5.679 3 5s3-2 8.5-2zM3 6.411C4.643 7.457 8.082 8 11.5 8s6.857-.543 8.5-1.589v3.437C20 10.726 16.689 12 11.5 12S3 10.726 3 9.848zM18 15l-1-1h-3l-1 1h-1v8h11v-8zm4 7h-9v-4h9zm-9-5v-1h.414l1-1h2.172l1 1H22v1z"/></svg>`;

CanvasRenderingContext2D.prototype.roundRect = function (x: number, y: number, w: number, h: number, radius: number,
                                                         color: string, dashed?: string, lineWidth?: number) {
    var r = x + w;
    var b = y + h;
    this.beginPath();
    this.strokeStyle = color;
    this.lineWidth = lineWidth ? lineWidth : 2;
    if (dashed) {
        this.setLineDash([5]);
    }
    this.moveTo(x + radius, y);
    this.lineTo(r - radius, y);
    this.quadraticCurveTo(r, y, r, y + radius);
    this.lineTo(r, y + h - radius);
    this.quadraticCurveTo(r, b, r - radius, b);
    this.lineTo(x + radius, b);
    this.quadraticCurveTo(x, b, x, b - radius);
    this.lineTo(x, y + radius);
    this.quadraticCurveTo(x, y, x + radius, y);
    this.stroke();
}

const drawDb = function (ctx: any, x: number, y: number, dbRadius: number, nodeSize: number, color: string, hoverColor: string, selected: boolean) {

    // ctx.beginPath();

    ctx.moveTo(x, y - nodeSize / 2); // A1

    ctx.bezierCurveTo(
        x + dbRadius / 2, y - nodeSize / 2, // C1
        x + dbRadius / 2, y + nodeSize / 2, // C2
        x, y + nodeSize / 2); // A2

    ctx.bezierCurveTo(
        x - dbRadius / 2, y + nodeSize / 2, // C3
        x - dbRadius / 2, y - nodeSize / 2, // C4
        x, y - nodeSize / 2); // A1

    if (!selected) {
        ctx.strokeStyle = color;
        ctx.fillStyle = WHITE;
    } else {
        ctx.strokeStyle = hoverColor;
        ctx.fillStyle = WHITE;
    }
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.closePath();

}

const drawCylinder = function (ctx: any, x: number, y: number, dbRadius: number, nodeSize: number, color: string, hoverColor: string, selected: boolean) {

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.moveTo(x - 30, y + 12);
    ctx.bezierCurveTo(x - 30, y + 36, x + 30, y + 36, x + 30, y + 12);
    ctx.moveTo(x - 30, y - 12);
    ctx.lineTo(x - 30, y + 12);
    ctx.moveTo(x + 30, y - 12);
    ctx.lineTo(x + 30, y + 12);
    if (!selected) {
        ctx.strokeStyle = color;
        ctx.fillStyle = WHITE;
    } else {
        ctx.strokeStyle = hoverColor;
        ctx.fillStyle = WHITE;
    }
    ctx.stroke();
    ctx.fillRect(x - 30, y - 12, 60, 30)
    drawDb(ctx, x, y - 12, dbRadius, nodeSize, color, hoverColor, selected);

}

export class HostsRenderer {

    constructor(borderColor: string, backgroundColor: string) {
        this.hostBorderColor = borderColor //"#f66";
        this.hostBackgroundColor = backgroundColor //"#f66";
    }

    private hostBorderColor;// = "#f66";
    private hostBackgroundColor;// = "#f66";

    private selectedBorderColor = "#560EAD";
    private selectedBackgroundColor = "#C4A3D9";

    private nodeSize = 30;
    private nodeRadius = 60;

    private dbRadius = 80;

    private fontColor = BLACK;


    renderDefaultFigure(node: LeanDiNode) {
        node['shape'] = 'database';
        node["color"] = {
            border: this.hostBorderColor,
            background: this.hostBackgroundColor
        };
        node['size'] = this.nodeSize;
        node['scaling'] = {
            min: this.nodeSize,
            max: this.nodeSize
        }
        node["borderWidth"] = 5;
        return node;
    }

    setColor(color: string) {
        this.hostBorderColor = color //"#f66";
        this.hostBackgroundColor = color //"#f66";
    }

    renderCluster(id: string, node?: LeanDiNode) {
        if (!node) {
            node = {};
        }
        node['id'] = id;
        node['shape'] = 'dot';
        node['hidden'] = true;
        node['size'] = this.nodeSize;
        return node;
    }

    renderHost(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "image";
        node['image'] = node.type == NodeType.DB_HOST ? {
            unselected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(db),
            selected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(dbSelected)
        } : {
            unselected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(fs),
            selected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(fsSelected)
        }

        // node["shape"] = "custom";
        // const count = node.domain!.length;
        // // @ts-ignore
        // node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
        //     return {
        //         drawNode() {
        //             drawCylinder(ctx, x, y, _this.dbRadius, _this.nodeSize, _this.hostBorderColor, _this.selectedBorderColor, selected);
        //             ctx.beginPath();
        //             ctx.lineWidth = 2;
        //             if (!selected) {
        //                 ctx.fillStyle = WHITE;
        //                 ctx.strokeStyle = _this.hostBorderColor;
        //             } else {
        //                 ctx.fillStyle = WHITE;
        //                 ctx.strokeStyle = _this.selectedBorderColor;
        //             }
        //             ctx.roundRect(x + 5, y - 30, 25, 15, 5, ctx.strokeStyle, false, 2);
        //             ctx.fill();
        //             ctx.stroke();
        //             ctx.closePath();
        //             ctx.fillStyle = _this.fontColor;
        //             if (count != 0) {
        //                 ctx.font = "bold 9px arial";
        //                 ctx.textAlign = "left";
        //                 ctx.fillText(
        //                     "x" + count.toString(),
        //                     x + 17.5,
        //                     y + 34,
        //                 );
        //             }
        //             ctx.textAlign = "center";
        //             ctx.font = "bold 12px arial";
        //             ctx.fillText(
        //                 (node.type == NodeType.DB_HOST ? 'DB' : 'FS'),
        //                 x + 17.5,
        //                 y - 18,
        //             );
        //
        //         },
        //
        //         drawExternalLabel() {
        //             ctx.textAlign = 'center';
        //             ctx.fillStyle = _this.fontColor;
        //             if (!selected) {
        //                 ctx.font = "12px arial";
        //             } else {
        //                 ctx.font = "bold 12px arial";
        //             }
        //             // const lbl = isStrNotEmpty(node['hostName']) ? node['hostName'] : node['dbType'] + StringUtils.DOT + node['host']
        //             //     + StringUtils.DOT + node['port'] + '.' + node['dbName'];
        //             // ctx.fillText(lbl, x, y + 50);
        //             ctx.fillText(label == null ? StringUtils.EMPTY_STRING : label, x, y + 50);
        //         }
        //     };
        // }
        return node;
    }

    renderDomain(node: Node) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {

                    ctx.beginPath();
                    ctx.beginPath();

                    ctx.moveTo(x, y - _this.nodeSize / 2); // A1

                    ctx.bezierCurveTo(
                        x + _this.nodeRadius / 2, y - _this.nodeSize / 2, // C1
                        x + _this.nodeRadius / 2, y + _this.nodeSize / 2, // C2
                        x, y + _this.nodeSize / 2); // A2

                    ctx.bezierCurveTo(
                        x - _this.nodeRadius / 2, y + _this.nodeSize / 2, // C3
                        x - _this.nodeRadius / 2, y - _this.nodeSize / 2, // C4
                        x, y - _this.nodeSize / 2); // A1

                    ctx.fillStyle = "red";
                    ctx.fill();
                    ctx.closePath();

                    if (!selected) {
                        ctx.strokeStyle = _this.hostBorderColor;
                        ctx.fillStyle = _this.hostBackgroundColor;
                    } else {
                        ctx.strokeStyle = _this.selectedBorderColor;
                        ctx.fillStyle = _this.selectedBackgroundColor;
                    }
                    ctx.fill();
                    ctx.lineWidth = 2;
                    ctx.stroke();
                    ctx.closePath();
                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label == null ? StringUtils.EMPTY_STRING : label, x, y + 35);
                }
            };
        }
        return node;
    }

    renderClusterBackground(ctx: any, x: number, y: number, w: number, h: number, radius: number, color: string, clusterId: string) {
        ctx.roundRect(x, y, w, h, radius, color, true, 1);
        ctx.textAlign = 'left';
        ctx.fillStyle = this.fontColor;
        ctx.font = "12px arial";
        ctx.fillText("CLUSTER ID: " + clusterId, x + 3, y + 15);
    }

}