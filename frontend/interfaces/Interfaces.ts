import {Node, Edge} from "vis-network";
import {PropertyType} from "Frontend/enums/PropertyType";
import {IndexOrder} from "Frontend/enums/IndexOrder";


export interface Metadata {
    privacy?: any;
    capsule?: string;
    restatable?: any;
    generator?: boolean;
    idempotent?: any;
    deletable?: any;
}

export interface Columns {
    column: string[];
}

export interface Index {
    type: string;
    columns: Columns;
    method: string;
    id: string | number;
    uid: string;
}

export interface IndexColumn {
    column: string;
    order: IndexOrder
}

export interface Indexes {
    index?: Index[];
}

export interface Layout {
    x?: number;
    y?: number;
    fixed?: boolean;
}

export interface extendedColumn {
    description?: string;
    uid?: string; // на чтение
    deprecated?: boolean;
    columnName?: string;
    knotRange?: string | null; // knotRange исключает dataRange указывается абсолютно любой кнот
    dataRange?: string | null | undefined; // string, bigint, clob, blob
    length?: string; // 512
    id?: number | string;
    nullable?: boolean | null;
    precision?: string;
    scale?: string;
}

export interface Attribute extends Node {
    layout?: Layout;
    description?: string;
    descriptor?: string;
    uid?: string;
    deprecated?: boolean;
    extendedColumn?: extendedColumn[];
    timeRange?: string | null;
    knotRange?: string | null;
    mnemonic?: string;
    dataRange?: string | null;
    length?: string;
    indexes?: Index[];
    type?: number;
    json?: any,
    layered?: boolean,
    precision?: string,
    scale?: string
}


export interface Anchor extends Node {
    layout?: Layout;
    description?: string;
    descriptor?: string;
    uid?: string;
    deprecated?: boolean;
    verticalPropertyGroup?: any[];
    extendedColumn?: extendedColumn[];
    attribute?: Attribute[];
    mnemonic?: string;
    identity?: string;
    skip?: boolean | string;
    indexes?: Index[];
    type?: number;
    expanded?: boolean;
    _group?: Group;
}

export interface Value {
    id?: number;
    value?: string;
    uid?: string;
}

export interface Values {
    value?: Value[];
}

export interface Knot extends Node {
    layout?: Layout;
    description?: string;
    descriptor?: string;
    uid?: string;
    deprecated?: boolean;
    values?: Values;
    mnemonic?: string;
    length?: string;
    identity?: string;
    type?: number;
    dataRange?: string | null;
    precision?: string,
    scale?: string
}


export interface AnchorRole {
    color?: string;
    description?: string;
    role?: string;
    type?: string;
    identifier?: boolean;
    id?: number | string | null;
    domain?: string | null;
}

export interface KnotRole {
    color?: string;
    description?: string;
    role?: string;
    type?: string;
    identifier?: boolean;
    id?: string;
}

export interface Tie extends Node {
    layout?: Layout;
    description?: string;
    descriptor?: string;
    uid?: string;
    deprecated?: boolean;
    extendedColumn?: extendedColumn[];
    anchorRole?: AnchorRole[];
    knotRole?: KnotRole[] | null;
    timeRange?: string | null;
    indexes?: Index[];
    type?: number;
}

export interface TxAnchor extends Node {
    attribute?: Attribute[];
    mnemonic?: string;
    identity?: string;
    layout?: Layout;
    description?: string;
    descriptor?: string;
    uid?: string;
    deprecated?: boolean;
    extendedColumn?: extendedColumn[];
    anchorRole?: AnchorRole[];
    indexes?: Index[];
    type?: number;
}

export interface CdAnchor extends Node {
    connectedAnchorDescriptor?: string;
    layout?: Layout;
    description?: string;
    descriptor?: string;
    uid?: string;
    deprecated?: boolean;
    verticalPropertyGroup?: any[];
    extendedColumn?: extendedColumn[];
    attribute?: Attribute[];
    mnemonic?: string;
    identity?: string;
    skip?: boolean | string;
    indexes?: Index[];
    type?: number;
    cdDomain?: string;
    cdMnemonic?: string;
    connexionUid?: string;
    ownDomain?: string
}

export interface LeanDiNode extends Anchor, Tie, Knot, Attribute,
    TxAnchor, CdAnchor, Domain, Item, DbHost, FsHost {
    isNew?: boolean;
}

export interface LeanDiEdge extends Edge {
    description?: string | undefined,
    role?: string | undefined,
    type?: string | undefined,
    identifier?: boolean | undefined,
}

export interface AnchorToSend {
    id: string;
    mnemonic: string;
    descriptor: string;
    attributes: AttributeToSend[];
}

export interface AttributeToSend {
    mnemonic: string;
    descriptor: string;
    type: string;
}

export interface Domain extends Node {
    knot?: Knot[];
    txAnchor?: TxAnchor[];
    anchor?: Anchor[];
    cdAnchor?: CdAnchor[];
    tie?: Tie[];
    shortName?: string;
    name?: string;
    author?: string | null;
    note?: string | null;
    type?: number;
    hostId?: string;
    item?: string[];
}

export interface DbHost extends Node {
    domain?: Domain[];
    dbName?: string;
    port?: string;
    userName?: string;
    host?: string;
    dbType?: string;
    clusterId?: string;
    hostName?: string;
    colored?: boolean;
    hostColor?: boolean;
}

export interface FsHost extends Node {
    domain?: Domain[];
    folder?: string;
    userName?: string;
    host?: string;
    clusterId?: string;
    hostName?: string;
    colored?: boolean;
    hostColor?: boolean;
}

export interface Item extends Node {
    fqn?: string;
    project?: string;
    shortName?: string;
    name?: string;
    author?: string | null;
    note?: string | null;
    version?: string;
    dateTime?: string;
}


export interface Connexion {
    anchorRole: AnchorRole[];
    descriptor?: string;
    uid?: string;
}

export type Property = {
    namep?: string,
    typep?: PropertyType,
    logicalType?: string,
    id?: string,
    namedisp?: string[],
    required?: boolean,
    grId?: string,
    name?: string,
    length?: string,
    precision?: string,
    scale?: string
}

export interface Group {
    name?: string,
    id?: string,
    property?: Property[],
    group?: Group[],
    description?: string
}

export interface Area {
    colored?: boolean;
    color?: string,
    uid?: string,
    description?: string,
    sense?: string,
    anchorRole?: AnchorRole[],
    descriptor?: string
}

export interface ListBoxItem extends Area, FsHost, DbHost {
    color?: string;
}

