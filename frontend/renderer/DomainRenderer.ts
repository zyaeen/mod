import {Node} from "vis-network";
import {LeanDiNode} from "Frontend/interfaces/Interfaces";
import {NodeType} from "Frontend/enums/NodeType";
import {DataRange} from "Frontend/enums/DataRange";
import {
    BLACK, DEFAULT_FONT_COLOR, DEFAULT_NODE_COLOR,
    DEFAULT_SELECTED_NODE_BACKGROUND_COLOR,
    DEFAULT_SELECTED_NODE_BORDER_COLOR, WHITE
} from "Frontend/components/network-editor-components/common/ColorPicker";
import {StringUtils} from "Frontend/enums/DefaultValues";

declare global {
    interface CanvasRenderingContext2D {
        roundRect: any
    }
}

const implodedAnchorSvg = `<svg id="e9MBvqeD0xc1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M0,0Q12,4,24,0q-4,12,0,24-12-4-24,0Q4,12,0,0" fill="${DEFAULT_NODE_COLOR}"/></svg>`
const implodedTxAnchorSvg = `<svg id="eDf7PiZFWdr1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M0,0Q12,4,24,0q-4,12,0,24-12-4-24,0Q4,12,0,0" fill="${DEFAULT_NODE_COLOR}"/><rect width="14.589" height="6.91654" rx="0" ry="0" transform="matrix(.591276 0 0 0.708796 11.542042 0.477927)" fill="#fff" stroke="#000" stroke-width="0.7"/><text dx="0" dy="0" font-family="&quot;eDf7PiZFWdr1:::Roboto&quot;" font-size="5" font-weight="400" transform="matrix(.960289 0 0 0.960289 12.917395 4.602453)" stroke-width="0"><tspan y="0" font-family="&quot;eDf7PiZFWdr1:::Roboto&quot;" font-size="5" font-weight="400" font-style="normal" stroke-width="0"><![CDATA[\n` +
    `TX\n` +
    `\n` +
    `]]></tspan></text>\n` +
    `<style><![CDATA[\n` +
    '@font-face {font-family: \'eDf7PiZFWdr1:::Roboto\';font-style: normal;font-weight: 400;src: url(data:font/ttf;charset=utf-8;base64,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) format(\'truetype\');}\n' +
    `]]></style>\n` +
    `</svg>\n`;
const implodedSelectedAnchorSvg = `<svg id="e9MBvqeD0xc1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M0,0Q12,4,24,0q-4,12,0,24-12-4-24,0Q4,12,0,0" fill="${DEFAULT_SELECTED_NODE_BORDER_COLOR}"/></svg>`
const implodedSelectedTxAnchorSvg = `<svg id="eDf7PiZFWdr1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M0,0Q12,4,24,0q-4,12,0,24-12-4-24,0Q4,12,0,0" fill="${DEFAULT_SELECTED_NODE_BORDER_COLOR}"/><rect width="14.589" height="6.91654" rx="0" ry="0" transform="matrix(.591276 0 0 0.708796 11.542042 0.477927)" fill="#fff" stroke="#000" stroke-width="0.7"/><text dx="0" dy="0" font-family="&quot;eDf7PiZFWdr1:::Roboto&quot;" font-size="5" font-weight="400" transform="matrix(.960289 0 0 0.960289 12.917395 4.602453)" stroke-width="0"><tspan y="0" font-family="&quot;eDf7PiZFWdr1:::Roboto&quot;" font-size="5" font-weight="400" font-style="normal" stroke-width="0"><![CDATA[\n` +
    `TX\n` +
    `\n` +
    `]]></tspan></text>\n` +
    `<style><![CDATA[\n` +
    '@font-face {font-family: \'eDf7PiZFWdr1:::Roboto\';font-style: normal;font-weight: 400;src: url(data:font/ttf;charset=utf-8;base64,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) format(\'truetype\');}\n' +
    `]]></style>\n` +
    `</svg>\n`;
// const implodedAnchorSvg = '<svg id="e9MBvqeD0xc1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M0,0Q12,4,24,0q-4,12,0,24-12-4-24,0Q4,12,0,0" fill=${defaultColor}/></svg>'
// const implodedTxAnchorSvg = '<svg id="eDf7PiZFWdr1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24" width="24" height="24" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M0,0Q12,4,24,0q-4,12,0,24-12-4-24,0Q4,12,0,0" fill=${defaultColor}/><rect width="14.589" height="6.91654" rx="0" ry="0" transform="matrix(.591276 0 0 0.708796 11.542042 0.477927)" fill="#fff" stroke="#000" stroke-width="0.7"/><text dx="0" dy="0" font-family="&quot;eDf7PiZFWdr1:::Roboto&quot;" font-size="5" font-weight="400" transform="matrix(.960289 0 0 0.960289 12.917395 4.602453)" stroke-width="0"><tspan y="0" font-family="&quot;eDf7PiZFWdr1:::Roboto&quot;" font-size="5" font-weight="400" font-style="normal" stroke-width="0"><![CDATA[\n' +
//     '\n' +
//     'TX\n' +
//     '\n' +
//     ']]></tspan></text>\n' +
//     '<style><![CDATA[\n' +
//     '@font-face {font-family: \'eDf7PiZFWdr1:::Roboto\';font-style: normal;font-weight: 400;src: url(data:font/ttf;charset=utf-8;base64,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) format(\'truetype\');}\n' +
//     ']]></style>\n' +
//     '</svg>\n';

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

export class DomainRenderer {

    constructor(borderColor: string, backgroundColor: string, size?: number) {
        this.anchorBorderColor = borderColor //"#f66";
        this.anchorBackgroundColor = borderColor //"#f66";

        this.tieBorderColor = borderColor //"#f66"// "#5b5b5b";
        this.tieBackgroundColor = backgroundColor //WHITE//"#f4f4f4";

        this.knotBorderColor = borderColor //"#f66";
        this.knotBackgroundColor = backgroundColor //WHITE;

        this.attributeBorderColor = borderColor //"#f66";
        this.attributeBackgroundColor = backgroundColor //WHITE;

        this.cdAnchorBackgroundColor = "#bed9fc";//borderColor.substring(0, 3) + "99" + borderColor.substring(5, 8);

        if (size) {
            this.nodeSize = size;
            this.nodeRadius = size - 2;
        }

    }

    private anchorBorderColor;// = "#f66";
    private anchorBackgroundColor;// = "#f66";

    private cdAnchorBackgroundColor;

    private tieBorderColor;// =  "#f66"// "#5b5b5b";
    private tieBackgroundColor;// = WHITE//"#f4f4f4";

    private knotBorderColor;// = "#f66";
    private knotBackgroundColor;// = WHITE;

    private attributeBorderColor;// = "#f66";
    private attributeBackgroundColor;// = WHITE;

    private selectedBorderColor = DEFAULT_SELECTED_NODE_BORDER_COLOR;
    private selectedBackgroundColor = DEFAULT_SELECTED_NODE_BACKGROUND_COLOR;

    private nodeSize = 20;
    private nodeRadius = 18;

    private fontColor = DEFAULT_FONT_COLOR;

    private angleRadius = 6;

    renderDefaultFigure(node: LeanDiNode) {
        node['shape'] = 'square';
        node["color"] = {
            border: BLACK,
            background: BLACK
        };
        node['size'] = this.nodeRadius;
        node["borderWidth"] = 2;
        return node;
    }

    setColor(color: string) {
        this.anchorBorderColor = color //"#f66";
        this.anchorBackgroundColor = color //"#f66";

        this.tieBorderColor = color //"#f66"// "#5b5b5b";
        this.tieBackgroundColor = WHITE//"#f4f4f4";

        this.knotBorderColor = color //"#f66";
        this.knotBackgroundColor = WHITE;

        this.attributeBorderColor = color //"#f66";
        this.attributeBackgroundColor = WHITE;
    }

    switchRender(node: LeanDiNode) {
        // VGG-16 не очень новая нейронная сеть
        switch (node.type) {
            case (NodeType.ANCHOR): {
                node = this.renderAnchor(node);
                break;
            }
            case (NodeType.TIE): {
                if (node.timeRange != null && node.timeRange != StringUtils.EMPTY_STRING) {
                    node = this.renderHistoricalTie(node);
                } else {
                    node = this.renderTie(node);
                }
                break;
            }
            case (NodeType.KNOT): {
                node = this.renderKnot(node);
                break;
            }
            case (NodeType.ATTRIBUTE): {
                if (node.timeRange != null && node.timeRange != StringUtils.EMPTY_STRING) {
                    if (node.extendedColumn != null && node.extendedColumn.length != 0) {
                        if (node.dataRange == DataRange.JSON) {
                            node = this.renderHistoricalCortegeJAttribute(node);
                        } else {
                            node = this.renderHistoricalCortegeAttribute(node);
                        }
                    } else {
                        if (node.dataRange == DataRange.JSON) {
                            node = this.renderHistoricalJAttribute(node);
                        } else {
                            node = this.renderHistoricalAttribute(node);
                        }
                    }
                } else {
                    if (node.extendedColumn != null && node.extendedColumn.length != 0) {
                        if (node.dataRange == DataRange.JSON) {
                            node = this.renderCortegeJAttribute(node);
                        } else {
                            node = this.renderCortegeAttribute(node);
                        }
                    } else {
                        if (node.dataRange == DataRange.JSON) {
                            node = this.renderJAttribute(node);
                        } else {
                            node = this.renderAttribute(node);
                        }
                    }
                }
                break;
            }
            case (NodeType.TX_ANCHOR): {
                node = this.renderTxAnchor(node);
                break;
            }
            case (NodeType.CD_ANCHOR): {
                node = this.renderCdAnchor(node);
                break;
            }
        }
        return node;
    }

    renderAnchor(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                            ctx.fillStyle = `hsl(0, 0%, 85%)`;
                        } else {
                            ctx.strokeStyle = _this.anchorBorderColor;
                            ctx.fillStyle = _this.anchorBackgroundColor;
                        }
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }
                    ctx.rect(x - _this.nodeSize, y - _this.nodeSize, _this.nodeSize * 2, _this.nodeSize * 2);
                    ctx.fill();
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

    renderCdAnchor(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 3;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.anchorBorderColor;
                        }
                        ctx.fillStyle = _this.cdAnchorBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }
                    ctx.setLineDash([5]);
                    ctx.rect(x - _this.nodeSize, y - _this.nodeSize, _this.nodeSize * 2, _this.nodeSize * 2);
                    ctx.fill();
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.anchorBackgroundColor;
                        }
                        ctx.fillStyle = WHITE;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }
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


    renderTxAnchor(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                            ctx.fillStyle = `hsl(0, 0%, 85%)`;
                        } else {
                            ctx.fillStyle = _this.anchorBackgroundColor;
                            ctx.strokeStyle = _this.anchorBorderColor;
                        }
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }
                    ctx.rect(x - _this.nodeSize, y - _this.nodeSize, _this.nodeSize * 2, _this.nodeSize * 2);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    if (!selected) {
                        ctx.fillStyle = WHITE;
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.anchorBackgroundColor;
                        }
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }
                    ctx.rect(x - 6, y - 25, 25, 15);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.fillStyle = _this.fontColor;
                    ctx.font = "bold 12px arial";
                    ctx.fillText(
                        "TX",
                        x - 1,
                        y - 13,
                    );
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

    renderTie(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(x, y);
                    ctx.rotate(Math.PI / 4);

                    ctx.lineWidth = 2;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.tieBorderColor;
                        }
                        ctx.fillStyle = _this.tieBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }

                    ctx.rect(-_this.nodeSize / 1.41, -_this.nodeSize / 1.41, _this.nodeSize * 1.41, _this.nodeSize * 1.41);
                    ctx.fill();
                    ctx.stroke();
                    // restore the context to its untranslated/unrotated state
                    ctx.restore();
                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label, x, y + 35);
                }
            };
        }
        return node;
    }

    renderHistoricalTie(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {

                    ctx.save();
                    ctx.beginPath();
                    ctx.translate(x, y);
                    ctx.rotate(Math.PI / 4);

                    ctx.lineWidth = 2;
                    if (!selected) {
                        ctx.fillStyle = _this.tieBackgroundColor;
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.tieBorderColor;
                        }
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }

                    ctx.rect(-_this.nodeSize / 1.41, -_this.nodeSize / 1.41, _this.nodeSize * 1.41, _this.nodeSize * 1.41);
                    ctx.fill();
                    ctx.stroke();
                    // restore the context to its untranslated/unrotated state
                    // ctx.restore();
                    //
                    // ctx.save();
                    // ctx.beginPath();
                    // ctx.translate(x, y);
                    // ctx.rotate(Math.PI / 4);

                    ctx.lineWidth = 2;
                    if (!selected) {
                        ctx.fillStyle = _this.tieBackgroundColor;
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.tieBorderColor;
                        }
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }

                    ctx.rect(-(_this.nodeSize - 8) / 1.41, -(_this.nodeSize - 8) / 1.41, (_this.nodeSize - 8) * 1.41, (_this.nodeSize - 8) * 1.41);
                    ctx.fill();
                    ctx.stroke();
                    // restore the context to its untranslated/unrotated state
                    ctx.restore();
                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label, x, y + 35);
                }
            };
        }
        return node;
    }

    renderKnot(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.knotBorderColor;
                        }
                        ctx.fillStyle = _this.knotBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor;
                    }
                    ctx.roundRect(x - _this.nodeSize, y - _this.nodeSize, _this.nodeSize * 2, _this.nodeSize * 2, _this.angleRadius, ctx.strokeStyle);


                    ctx.fill();
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

    renderJAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                        ctx.fillStyle = _this.attributeBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }
                    ctx.arc(x, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(x + 15, y - 15, _this.nodeRadius / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.fillStyle = _this.fontColor;
                    ctx.font = "bold 11px arial";
                    ctx.fillText(
                        "Js",
                        x + 9,
                        y - 12,
                    );

                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label, x, y + 35);
                }
            };
        }
        return node;
    }

    renderHistoricalJAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                        ctx.fillStyle = _this.attributeBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }
                    ctx.arc(x, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x, y, _this.nodeRadius - 7, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(x + 15, y - 15, _this.nodeRadius / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.fillStyle = _this.fontColor;
                    ctx.font = "bold 11px arial";
                    ctx.fillText(
                        "Js",
                        x + 9,
                        y - 12,
                    );

                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label, x, y + 35);
                }
            };
        }
        return node;
    }

    renderCortegeJAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                        ctx.fillStyle = _this.attributeBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }

                    ctx.arc(x - 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke()
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.arc(x + 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke()
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(x + 25, y - 15, _this.nodeRadius / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.fillStyle = _this.fontColor;
                    ctx.font = "bold 11px arial";
                    ctx.fillText(
                        "Js",
                        x + 19,
                        y - 12,
                    );

                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label, x, y + 35);
                },
                nodeDimensions: {
                    width: 20 + 2 * _this.nodeRadius,
                    height: _this.nodeRadius * 2
                }
            };
        }
        return node;
    }

    renderHistoricalCortegeJAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                        ctx.fillStyle = _this.attributeBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }

                    ctx.arc(x - 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x - 10, y, _this.nodeRadius - 7, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x + 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill()
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x + 10, y, _this.nodeRadius - 7, 0, 2 * Math.PI);
                    ctx.fill()
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.arc(x + 25, y - 15, _this.nodeRadius / 2, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.fillStyle = _this.fontColor;
                    ctx.font = "bold 11px arial";
                    ctx.fillText(
                        "Js",
                        x + 19,
                        y - 12,
                    );

                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label, x, y + 35);
                },
                nodeDimensions: {
                    width: 20 + 2 * _this.nodeRadius,
                    height: _this.nodeRadius * 2
                }
            };
        }
        return node;
    }

    renderAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    if (!selected) {
                        ctx.fillStyle = _this.attributeBackgroundColor;
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }
                    ctx.arc(x, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
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
                    ctx.fillText(label, x, y + 35);
                }
            };
        }
        return node;
    }

    public renderHistoricalAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.lineWidth = 2;
                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                        ctx.fillStyle = _this.attributeBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }

                    ctx.beginPath();
                    ctx.arc(x, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x, y, _this.nodeRadius - 7, 0, 2 * Math.PI);
                    ctx.stroke();

                    //TODO: Уточнить целесообразность слоистости исторического кортежа и json-исторического атрибута / кортежа.
                    if (node.layered == true) {
                        ctx.beginPath();
                        ctx.moveTo(x - _this.nodeRadius, y + 5);
                        ctx.lineTo(x + _this.nodeRadius, y + 5);
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.moveTo(x - _this.nodeRadius, y - 5);
                        ctx.lineTo(x + _this.nodeRadius, y - 5);
                        ctx.stroke();
                    }

                },
                drawExternalLabel() {
                    ctx.textAlign = 'center';
                    ctx.fillStyle = _this.fontColor;
                    if (!selected) {
                        ctx.font = "12px arial";
                    } else {
                        ctx.font = "bold 12px arial";
                    }
                    ctx.fillText(label, x, y + 35);
                }
            };
        }
        return node;
    }

    renderCortegeAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                        ctx.fillStyle = _this.attributeBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }

                    ctx.arc(x - 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke()
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.arc(x + 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke()
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
                    ctx.fillText(label, x, y + 35);
                },
                nodeDimensions: {
                    width: 20 + 2 * _this.nodeRadius,
                    height: _this.nodeRadius * 2
                }
            };
        }
        return node;
    }

    renderHistoricalCortegeAttribute(node: LeanDiNode) {
        let _this = this;
        node["shape"] = "custom";
        // @ts-ignore
        node['ctxRenderer'] = ({ctx, id, x, y, state: {selected, hover}, style, label}) => {
            return {
                drawNode() {
                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    if (!selected) {
                        if (node.deprecated == true) {
                            ctx.strokeStyle = `hsl(0, 0%, 70%)`;
                        } else {
                            ctx.strokeStyle = _this.attributeBorderColor;
                        }
                        ctx.fillStyle = _this.attributeBackgroundColor;
                    } else {
                        ctx.fillStyle = _this.selectedBackgroundColor;
                        ctx.strokeStyle = _this.selectedBorderColor
                    }
                    ctx.arc(x - 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x - 10, y, _this.nodeRadius - 7, 0, 2 * Math.PI);
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x + 10, y, _this.nodeRadius, 0, 2 * Math.PI);
                    ctx.fill()
                    ctx.stroke();
                    ctx.closePath();

                    ctx.beginPath();
                    ctx.lineWidth = 2;

                    ctx.arc(x + 10, y, _this.nodeRadius - 7, 0, 2 * Math.PI);
                    ctx.fill()
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
                    ctx.fillText(label, x, y + 35);
                },
                nodeDimensions: {
                    width: 20 + 2 * _this.nodeRadius,
                    height: _this.nodeRadius * 2
                }
            };
        }
        return node;
    }

    renderImplodedAnchor(node: Node) {
        let _this = this;
        node["shape"] = "image";
        node['image'] = {
            unselected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(implodedAnchorSvg),
            selected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(implodedSelectedAnchorSvg)
        }
        return node;
    }

    renderImplodedTxAnchor(node: Node) {
        let _this = this;
        node["shape"] = "image";
        node['image'] = {
            unselected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(implodedTxAnchorSvg),
            selected: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(implodedSelectedTxAnchorSvg)
        }
        return node;
    }

    renderAreaNode(area: any) {
        const node = {} as Node;
        node['x'] = area.x;
        node['y'] = area.y;
        node['id'] = area.uid;
        node['shape'] = 'square';
        node['label'] = area.descriptor;
        // node['fixed'] = true;
        node["color"] = {
            border: area.color,
            background: area.color
        };
        node['hidden'] = true;
        node['mass'] = 10;
        node['size'] = this.nodeRadius;
        node["borderWidth"] = 2;
        return node;
    }

}