import {LdEventTarget} from "Frontend/events/LdEventTarget";

export const event = (e: Event) => (<any>e);


export const addColumnEvent = () => new CustomEvent(LdEventTarget.ADD_COLUMN);
export const deleteColumnEvent = (detail: {}) => new CustomEvent(LdEventTarget.DELETE_COLUMN, {detail: detail});
export const editColumnEvent = (detail: {}) => new CustomEvent(LdEventTarget.EDIT_COLUMN, {detail: detail});
export const saveColumnEvent = (detail: {}) => new CustomEvent(LdEventTarget.SAVE_COLUMN, {detail: detail});

export const addIndexEvent = () => new CustomEvent(LdEventTarget.ADD_INDEX);
export const deleteIndexEvent = (detail: {}) => new CustomEvent(LdEventTarget.DELETE_INDEX, {detail: detail});
export const editIndexEvent = (detail: {}) => new CustomEvent(LdEventTarget.EDIT_INDEX, {detail: detail});
export const saveIndexEvent = (detail: {}) => new CustomEvent(LdEventTarget.SAVE_INDEX, {detail: detail});
export const updateIndexColumnEvent = (detail: {}) => new CustomEvent(LdEventTarget.UPDATE_INDEX_COLUMN, {detail: detail});
export const deleteIndexColumnEvent = (detail: {}) => new CustomEvent(LdEventTarget.DELETE_INDEX_COLUMN, {detail: detail});

export const resetKnotRangeRoleEvent = () => new CustomEvent(LdEventTarget.RESET_KNOT_RANGE_ROLE);


export const addValueEvent = () => new CustomEvent(LdEventTarget.ADD_VALUE);
export const deleteValueEvent = (detail: {}) => new CustomEvent(LdEventTarget.DELETE_VALUE, {detail: detail});
export const editValueEvent = (detail: {}) => new CustomEvent(LdEventTarget.EDIT_VALUE, {detail: detail});
export const saveValueEvent = (detail: {}) => new CustomEvent(LdEventTarget.SAVE_VALUE, {detail: detail});

export const addJsomEvent = () => new CustomEvent(LdEventTarget.ADD_JSON);
export const deleteJsonEvent = () => new CustomEvent(LdEventTarget.DELETE_JSON);
export const editJsonEvent = (detail: {}) => new CustomEvent(LdEventTarget.EDIT_JSON, {detail: detail});
export const saveJsonEvent = (detail: {}) => new CustomEvent(LdEventTarget.SAVE_JSON, {detail: detail});

