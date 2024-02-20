import {IdType, Node} from "vis-network";
import {DefaultValues, StringUtils, RoleIdentifier} from "Frontend/enums/DefaultValues";
import {DataRange} from "Frontend/enums/DataRange";

export const getRoleAndIdentifier = (label: string) => {
    let [role = DefaultValues.ROLE, identifier = RoleIdentifier.ONE] = label.split(StringUtils.SPACED_COMMA);
    return [role, identifier == RoleIdentifier.MANY]
}

export const generateUid = () => {
    return `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == `x` ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const createDefaultTieRole = (type: string, edgeId?: string | IdType, role?: string,
                                     identifier?: boolean, description?: string) => {
    return {
        description: description ? description : DefaultValues.DESCRIPTION,
        role: role ? role : DefaultValues.ROLE,
        type: type,
        identifier: identifier ? identifier : false,
        id: edgeId ? edgeId : null
    }
}

export const createDefaultextendedColumn = (id?: number) => {
    return {
        // id: ++this.indexId,
        description: "colDescExample",
        uid: generateUid(), // на чтение
        deprecated: undefined,
        columnName: "colNameExaxmple",
        knotRange: null, // knotRange исключает dataRange указывается абсолютно любой кнот
        dataRange: DataRange.BIGINT, // string, bigint, clob, blob
        length: '512', // 512
    }
}


export const createKnotRole = (desc: string, role: string, identifier: boolean, type: string) => {
    return {
        description: desc,
        role: role,
        type: type,
        identifier: identifier
    }
}

export const isStrEmpty = (value?: string | undefined | null) => {
    return value == null || value == StringUtils.EMPTY_STRING;
}

export const isStrNotEmpty = (value?: string | undefined | null | boolean) => {
    return value != null && value != StringUtils.EMPTY_STRING;
}

export const isArrayNotEmpty = (value?: any[]) => {
    return value != null && value.length != 0;
}

export const isArrayEmpty = (value?: any[]) => {
    return value == null || value.length == 0;
}

export const isObjectNotEmpty = (value?: any) => {
    return value != null && Object.keys(value).length != 0;
}

export const isObjectEmpty = (value?: any) => {
    return value == null || Object.keys(value).length == 0;
}

export const decapitalize = (value: string) => value.charAt(0).toLowerCase() + value.slice(1);
export const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const randColorOfTone = (hex: string) => {
    let hsl = rgb2hsl(hexToRgb(hex) as number[]) as number[];
    let newHsl = [Math.min(hsl[0] * minMaxRandom(0.95, 1.05), 1), hsl[1] * minMaxRandom(0.7, 1), Math.min(hsl[2] * minMaxRandom(0.8, 1.2), 1)];
    return rgbToHex(hsl2rgb(newHsl));
}

export const randomColorFromArray =() => {
    const items = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6',
        '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
        '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A',
        '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
        '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC',
        '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
        '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680',
        '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
        '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3',
        '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];
    return items[Math.floor(Math.random()*items.length)];
}

export const randomColor = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

const componentToHex = (c: number) => {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

const rgbToHex = (rgb: number[]) => {
    return "#" + componentToHex(rgb[0]) + componentToHex(rgb[1]) + componentToHex(rgb[2]);
}

const hexToRgb = (hex: string) => {
    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
}

const minMaxRandom = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
}

const rgb2hsl = (rgb: number[]) => {
    let r, g, b;
    r = rgb[0];
    g = rgb[1];
    b = rgb[2];

    r /= 255; g /= 255; b /= 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max == min) {
        h = s = 0; // achromatic
    } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        } //@ts-ignore
        h = h / 6;
    }
    return [h, s, l];
}


const hsl2rgb = (hsl: number[]) => {
    let h, s, l;
    h = hsl[0];
    s = hsl[1];
    l = hsl[2];

    let r, g, b;

    if (s == 0) {
        r = g = b = l; // achromatic
    } else {
        function hue2rgb(p: number, q: number, t: number) {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return [Math.ceil(r * 255), Math.ceil(g * 255), Math.ceil(b * 255)];
}

export const getCenter = (nodes: Node[]) => {
    let x = 0;
    let y = 0;
    nodes.forEach((node: Node) => {
        x += node.x!;
        y += node.y!;
    });
    return {
        x: x / nodes.length,
        y: y / nodes.length
    }
}

export async function getNewFileHandle(s: string) {
    const opts = {
        types: [{
            description: 'Text file',
            accept: {'application/xml': ['.xml']},
        }],
    };
    try {
        const handle = await window.showSaveFilePicker(opts);
        const writable = await handle.createWritable()
        await writable.write(s)
        await writable.close()
    } catch (e) {
        if (e instanceof TypeError) {
            let filename = "domain_schema.xml";
            let pom = document.createElement('a');
            let bb = new Blob([s], {type: 'text/plain'});
            pom.setAttribute('href', window.URL.createObjectURL(bb));
            pom.setAttribute('download', filename);
            pom.dataset.downloadurl = ['text/plain', pom.download, pom.href].join(':');
            pom.draggable = true;
            pom.classList.add('dragout');
            pom.click();
        }
    }
}