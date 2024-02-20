export const createColorPicker = (defaultColor: string, handler: Function) => {
    let colorPicker = document.createElement('input');
    colorPicker.setAttribute('type', 'color');
    colorPicker.value = defaultColor;
    colorPicker.id = 'picker';
    colorPicker.style.width = '50px';
    colorPicker.style.height = '20px';
    colorPicker.style.border='none';
    colorPicker.addEventListener('input', (e: Event) => {
        handler(e);
    });
    return colorPicker;
}

const CBR_COLOR = "#0088BB";
const VAADIN_COLOR = "#1676F3";
const SELECTED_BORDER_COLOR = "#7331DE";
const SELECTED_BACKGROUND_COLOR = "#AE80F7";
const SELECTED_EDGE_COLOR = "#AE80F7";

export const EDGE_UP_COLOR = "#e9170c";

export const BLACK = "#000000";
export const WHITE = "#FFFFFF";


export const DEFAULT_LD_COMPONENTS_COLOR = VAADIN_COLOR;
export const DEFAULT_NODE_COLOR = VAADIN_COLOR;
export const DEFAULT_SELECTED_NODE_BORDER_COLOR = SELECTED_BORDER_COLOR;
export const DEFAULT_SELECTED_NODE_BACKGROUND_COLOR = SELECTED_BACKGROUND_COLOR;
export const DEFAULT_SELECTED_EDGE_COLOR = SELECTED_EDGE_COLOR;
export const DEFAULT_FONT_COLOR = BLACK;