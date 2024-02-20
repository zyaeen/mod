import {Node} from "vis-network";
import {LeanDiNode} from "Frontend/interfaces/Interfaces";
import {
    DEFAULT_FONT_COLOR, DEFAULT_NODE_COLOR, DEFAULT_SELECTED_NODE_BACKGROUND_COLOR,
    DEFAULT_SELECTED_NODE_BORDER_COLOR, WHITE
} from "Frontend/components/network-editor-components/common/ColorPicker";

declare global {
    interface CanvasRenderingContext2D {
        roundRect: any
    }
}


const domainIconSvg = `<svg width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{stroke-width: 2; fill: ${WHITE};stroke:${DEFAULT_NODE_COLOR};stroke-linecap:round;stroke-linejoin:round;}</style></defs><polygon class="a" points="40.86 14.3 23.89 4.5 7.03 14.23 24 24.03 40.86 14.3"/><polygon class="a" points="24 24.03 7.03 14.23 7.03 33.7 24 43.5 24 24.03"/><polygon class="a" points="40.86 14.3 24 24.03 24 43.5 40.86 33.77 40.86 14.3"/></svg>`
const domainSelectedIconSvg = `<svg width="800px" height="800px" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><defs><style>.a{stroke-width: 2; fill:${WHITE};stroke:${DEFAULT_SELECTED_NODE_BORDER_COLOR};stroke-linecap:round;stroke-linejoin:round;}</style></defs><polygon class="a" points="40.86 14.3 23.89 4.5 7.03 14.23 24 24.03 40.86 14.3"/><polygon class="a" points="24 24.03 7.03 14.23 7.03 33.7 24 43.5 24 24.03"/><polygon class="a" points="40.86 14.3 24 24.03 24 43.5 40.86 33.77 40.86 14.3"/></svg>`

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

export class ProjectRenderer {

    constructor(borderColor: string, backgroundColor: string, size?: number) {
        this.domainBorderColor = borderColor //"#f66";
        this.domainBackgroundColor = backgroundColor //"#f66";
        if (size) {
            this.nodeRadius = 2 * size;
            this.nodeSize = size;
        }
    }

    private domainBorderColor;// = "#f66";
    private domainBackgroundColor;// = "#f66";

    private selectedBorderColor = DEFAULT_SELECTED_NODE_BORDER_COLOR;
    private selectedBackgroundColor = DEFAULT_SELECTED_NODE_BACKGROUND_COLOR;

    private nodeSize = 40;
    private nodeRadius = 80;

    private fontColor = DEFAULT_FONT_COLOR;


    renderDefaultFigure(node: LeanDiNode) {
        node['shape'] = 'database';
        node["color"] = {
            border: this.domainBorderColor,
            background: this.domainBackgroundColor
        };
        node['size'] = this.nodeSize;
        node["borderWidth"] = 5;
        return node;
    }

    setColor(color: string) {
        this.domainBorderColor = color //"#f66";
        this.domainBackgroundColor = color //"#f66";
    }

    renderDomain(node: Node) {
        let _this = this;
        node["shape"] = "image";
        node['image'] = {
            unselected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(domainIconSvg),
            selected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(domainSelectedIconSvg),
        };
        return node;
        // node["shape"] = "custom";
        // // @ts-ignore
        // node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
        //     return {
        //         drawNode() {
        //
        //             var numberOfSides = 9,
        //                 step  = 2 * Math.PI / numberOfSides,//Precalculate step value
        //                 shift = (Math.PI / 180.0) * -18;//Quick fix ;)
        //
        //             ctx.beginPath();
        //             ctx.moveTo (x +  _this.nodeSize * Math.cos(0), y +  _this.nodeSize *  Math.sin(0));
        //
        //             for (var i = 0; i <= numberOfSides;i++) {
        //                 var curStep = i * step + shift;
        //                 ctx.lineTo (x + _this.nodeSize * Math.cos(curStep), y + _this.nodeSize * Math.sin(curStep));
        //             }
        //
        //             // ctx.ellipse(x, y, _this.nodeSize, _this.nodeRadius, Math.PI / 4, 0, Math.PI*2);
        //
        //
        //             // ctx.beginPath();
        //             //
        //             // ctx.moveTo(x, y - _this.nodeSize / 2); // A1
        //             //
        //             // ctx.bezierCurveTo(
        //             //     x + _this.nodeRadius / 2, y - _this.nodeSize / 2, // C1
        //             //     x + _this.nodeRadius / 2, y + _this.nodeSize / 2, // C2
        //             //     x, y + _this.nodeSize / 2); // A2
        //             //
        //             // ctx.bezierCurveTo(
        //             //     x - _this.nodeRadius / 2, y + _this.nodeSize / 2, // C3
        //             //     x - _this.nodeRadius / 2, y - _this.nodeSize / 2, // C4
        //             //     x, y - _this.nodeSize / 2); // A1
        //             //
        //             // ctx.fillStyle = "red";
        //             // ctx.fill();
        //             // ctx.closePath();
        //
        //             if (!selected) {
        //                 ctx.strokeStyle = _this.domainBorderColor;
        //                 ctx.fillStyle = _this.domainBackgroundColor;
        //             } else {
        //                 ctx.strokeStyle = _this.selectedBorderColor;
        //                 ctx.fillStyle = _this.selectedBackgroundColor;
        //             }
        //             ctx.fill();
        //             ctx.lineWidth = 2;
        //             ctx.stroke();
        //             ctx.closePath();
        //         },
        //         drawExternalLabel() {
        //             ctx.textAlign = 'center';
        //             ctx.fillStyle = _this.fontColor;
        //             if (!selected) {
        //                 ctx.font = "12px arial";
        //             } else {
        //                 ctx.font = "bold 12px arial";
        //             }
        //             ctx.fillText(label == null ? StringUtils.EMPTY_STRING : label, x, y + 35);
        //         }
        //     };
        // }
        return node;
    }

}