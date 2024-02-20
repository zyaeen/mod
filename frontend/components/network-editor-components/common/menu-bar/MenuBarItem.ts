import {Icon} from "@vaadin/icon";
import {Tooltip} from "@vaadin/tooltip";
import {DEFAULT_LD_COMPONENTS_COLOR, WHITE} from "Frontend/components/network-editor-components/common/ColorPicker";


export const createItem = (callback: Function, iconName: string, iconRepo: string,
                           event?: CustomEvent<string>,
                           tooltipText?: string,
                           label?: string,
) => {
    const item = document.createElement('vaadin-context-menu-item');
    const icon = new Icon();
    icon.setAttribute('icon', `${iconRepo}:${iconName}`);
    item.setAttribute('theme', "icon");
    if (iconName != 'domain') {
        item.style.transform = 'scale(2)';
    }
    if (event) {
        item.onclick = (): void => {
            callback(event);
        };
    }
    if (tooltipText) {
        let tooltip = new Tooltip();
        tooltip.text = tooltipText;
        tooltip.slot = 'tooltip';
        tooltip.position = 'end';
        icon.appendChild(tooltip);
    }
    icon.style.color = DEFAULT_LD_COMPONENTS_COLOR;
    item.appendChild(icon);
    if (label) {
        const text = document.createTextNode(label);
        var span = document.createElement('span');
        span.style.fontSize = "18px";
        span.appendChild(text);
        item.appendChild(span);
    }
    return item;
}

export const drawDb = function (ctx: any, x: number, y: number, dbRadius: number, nodeSize: number, color: string, hoverColor: string, selected: boolean) {

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

export const drawCylinder = function (ctx: any, x: number, y: number, dbRadius: number, nodeSize: number, color: string, hoverColor: string, selected: boolean) {

    ctx.beginPath();
    ctx.moveTo(x - 30, y + 12);
    ctx.bezierCurveTo(x - 30, y + 36, x + 30, y + 36, x + 30, y + 12);
    ctx.moveTo(x - 30, y - 12);
    ctx.lineTo(x - 30, y + 12);
    ctx.moveTo(x + 30, y - 12);
    ctx.lineTo(x + 30, y + 12);
    ctx.lineWidth = 2;
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