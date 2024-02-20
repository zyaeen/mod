import {isArrayNotEmpty, isStrNotEmpty} from "Frontend/utils/common";
import {Area, extendedColumn} from "Frontend/interfaces/Interfaces";
import {BLACK} from "Frontend/components/network-editor-components/common/ColorPicker";
import {StringUtils} from "Frontend/enums/DefaultValues";

const mapextendedColumn = (columns: extendedColumn[]) =>
     isArrayNotEmpty(columns)? columns.map(
        (column: any) => {
            return {
                uid: column.uid,
                columnName: column.columnName,
                description: column.description,
                knotRange: column.knotRange,
                dataRange: isStrNotEmpty(column.dataRange) ? column.dataRange : null,
                length: column.length,
                scale: column.scale,
                precision: column.precision,
                nullable: !column.nullable ? null : column.nullable,
                deprecated: column.deprecated
            }
        }
    ) : [];


export const mapNodeToAttribute = (node: any) => {
    return {
        descriptor: node.descriptor,
        uid: node.uid,
        deprecated: node.deprecated,
        description: node.description,
        mnemonic: node.mnemonic,
        dataRange: node.dataRange,
        timeRange: node.timeRange,
        knotRange: node.knotRange,
        length: node.length,
        extendedColumn: mapextendedColumn(node.extendedColumn),
        layout: {
            x: (node.x / 2).toFixed(2),
            y: (node.y / 2).toFixed(2),
            fixed: node.fixed,
        },
        json: isStrNotEmpty(node.json) && node.json != '{}' ? node.json : null,
        indexes: isArrayNotEmpty(node.indexes) ? {
            index:
                node.indexes.map((index: any) => {
                    return {
                        type: index.type,
                        columns: {
                            column: index.columns.column
                        },
                        method: index.method
                    }
                })
        } : null,
        layered: node.layered == false || node.layered == null ? null : node.layered
    };
}

export const mapNodeToAnchor = (node: any) => {
    return {
        uid: node.uid,
        attribute: node.attribute != null && node.attribute.length != 0 ? node.attribute.map((attr: any) => mapNodeToAttribute(attr)) : [],
        verticalPropertyGroup: node.verticalPropertyGroup,
        descriptor: node.descriptor,
        deprecated: node.deprecated,
        description: node.description,
        mnemonic: node.mnemonic,
        identity: node.identity,
        skip: node.skip,
        extendedColumn: mapextendedColumn(node.extendedColumn),
        layout: {
            x: (node.x / 2).toFixed(2),
            y: (node.y / 2).toFixed(2),
            fixed: node.fixed,
        },
        indexes: isArrayNotEmpty(node.indexes) ? {
            index:
                node.indexes.map((index: any) => {
                    return {
                        type: index.type,
                        columns: {
                            column: index.columns.column
                        },
                        method: index.method
                    }
                })
        } : null,
        group: node._group
    };
    // return {
    //     "oldMnemonic": node.oldMnemonic,
    //     "anchor": anchor
    // };
}

export const mapNodeToKnot = (node: any) => {
    let knot = {
        uid: node.uid,
        layout: {
            x: (node.x / 2).toFixed(2),
            y: (node.y / 2).toFixed(2),
            fixed: node.fixed,
        },
        values: node.values != null ? {
            value: node.values.value
        } : null,
        descriptor: node.descriptor,
        deprecated: node.deprecated,
        description: node.description,
        mnemonic: node.mnemonic,
        identity: node.identity,
        dataRange: node.dataRange,
        length: node.length,
        scale: node.scale,
        precision: node.precision
    };
    return knot;
    // return {
    //     "oldMnemonic": node.oldMnemonic,
    //     "knot": knot
    // };
}

export const mapNodeToTie = (node: any) => {
    let tie = {
        uid: node.uid,
        deprecated: node.deprecated,
        description: node.description,
        descriptor: node.descriptor,
        knotRole: node.knotRole != null && node.knotRole.length != 0 ? {
            description: node.knotRole[0].description,
            role: node.knotRole[0].role,
            type: node.knotRole[0].type,
            identifier: node.knotRole[0].identifier,
            color: node.knotRole[0].color == BLACK ? null : node.knotRole[0].color
        } : null,
        layout: {
            x: (node.x / 2).toFixed(2),
            y: (node.y / 2).toFixed(2),
            fixed: node.fixed,
        },
        timeRange: node.timeRange,
        anchorRole: node.anchorRole != null && node.anchorRole.length != 0 ? node.anchorRole.map((anchor: any) => {
            return {
                role: anchor.role,
                type: anchor.type,
                identifier: anchor.identifier,
                description: anchor.description,
                color: anchor.color == BLACK ? null : anchor.color
            }
        }) : null,
        extendedColumn: mapextendedColumn(node.extendedColumn),
        indexes: isArrayNotEmpty(node.indexes) ? {
            index:
                node.indexes.map((index: any) => {
                    return {
                        type: index.type,
                        columns: {
                            column: index.columns.column
                        },
                        method: index.method
                    }
                })
        } : null
    }
    return tie;
}

export const mapNodeToTxAnchor = (node: any) => {
    return {
        attribute: node.attribute != null && node.attribute.length != 0 ? node.attribute.map((attr: any) => mapNodeToAttribute(attr)) : [],
        mnemonic: node.mnemonic,
        identity: node.identity,
        uid: node.uid,
        anchorRole: node.anchorRole != null && node.anchorRole.length != 0 ? node.anchorRole.map((anchor: any) => {
            return {
                role: anchor.role,
                type: anchor.type,
                identifier: anchor.identifier,
                description: anchor.description,
                color: anchor.color == BLACK ? null : anchor.color
            }
        }) : null,
        deprecated: node.deprecated,
        description: node.description,
        descriptor: node.descriptor,
        extendedColumn: mapextendedColumn(node.extendedColumn),
        layout: {
            x: (node.x / 2).toFixed(2),
            y: (node.y / 2).toFixed(2),
            fixed: node.fixed,
        },
        indexes: isArrayNotEmpty(node.indexes) ? {
            index:
                node!.indexes!.map((index: any) => {
                    return {
                        type: index.type as string,
                        columns: {
                            column: index.columns.column as string
                        },
                        method: index.method as string
                    }
                })
        } : null,
    };
}

export const mapNodeToCdAnchor = (node: any) => {
    return {
        uid: node.uid,
        attribute: node.attribute != null && node.attribute.length != 0 ? node.attribute.map((attr: any) => mapNodeToAttribute(attr)) : [],
        descriptor: node.descriptor,
        deprecated: node.deprecated,
        description: node.description,
        mnemonic: node.mnemonic,
        identity: node.identity,
        cdMnemonic: node.cdMnemonic,
        cdDomain: node.cdDomain,
        skip: node.skip,
        extendedColumn: mapextendedColumn(node.extendedColumn),
        layout: {
            x: (node.x / 2).toFixed(2),
            y: (node.y / 2).toFixed(2),
            fixed: node.fixed,
        },
        indexes: isArrayNotEmpty(node.indexes) ? {
            index:
                node.indexes.map((index: any) => {
                    return {
                        type: index.type,
                        columns: {
                            column: index.columns.column
                        },
                        method: index.method
                    }
                })
        } : null
    };
    // return {
    //     "oldMnemonic": node.oldMnemonic,
    //     "anchor": anchor
    // };
}

export const mapNodeToDomain = (node: any) => {
    return {
        name: node.name,
        shortName: node.shortName,
        dateTime: node.dateTime != null && node.dateTime != StringUtils.EMPTY_STRING ? node.dateTime : null,
        version: node.version != node && node.version != StringUtils.EMPTY_STRING ? node.version : null,
        author: node.author,
        knot: node.knot != null && node.knot.length != 0 ? node.knot : [],
        anchor: node.anchor != null && node.anchor.length != 0 ? node.anchor : [],
        txAnchor: node.txAnchor != null && node.txAnchor.length != 0 ? node.txAnchor : [],
        cdAnchor: node.cdAnchor != null && node.cdAnchor.length != 0 ? node.cdAnchor : [],
        tie: node.tie != null && node.tie.length != 0 ? node.tie : [],
        area: node.area != null && node.area.length != 0 ? node.area : [],
        verticalPropertiesGroup: node.verticalPropertiesGroup != null && node.verticalPropertiesGroup.length != 0 ? node.knot : [],
        uid: node.uid,
        note: node.note,
        layout: {
            x: (node.x / 2).toFixed(2),
            y: (node.y / 2).toFixed(2),
            fixed: node.fixed,
        },
        group: node._group != null ? node._group.map((group: any) => {
            return {
                id: group.id,
                name: group.name,
                description: group.description,
                group: group.group != null && group.group.length != 0 ? group.group.map((gr: any) => {
                    return {
                        id: gr.id
                    }
                }) : [],
                property: group.property != null && group.property.length != 0
                    ? group.property.map((prop: any) => {
                        return {
                            id: prop.id
                        }
                    }) : []
            }
        }) : [],
        properties: node.properties != null && node.properties.length != 0 ?
            [
                {
                    property: node.properties[0].property.map((prop: any) => {
                        return {
                            id: prop.id,
                            namedisp: prop.namedisp,
                            namep: prop.namep,
                            typep: prop.typep,
                            logicalType: prop.logicalType,
                            scale: prop.scale,
                            precision: prop.precision,
                            length: prop.length
                        }
                    })
                }
            ] : [{property: []}]
    };
}

export const mapToConnexion = (node: any) => {
    return {
        uid: node.uid,
        description: node.description,
        descriptor: node.descriptor,
        anchorRole: node.anchorRole != null && node.anchorRole.length != 0 ? node.anchorRole.map((anchor: any) => {
            return {
                role: anchor.role,
                type: anchor.type,
                identifier: anchor.identifier,
                domain: anchor.domain,
            }
        }) : null
    };
}

export const mapToDbHost = (node: any) => {
    return {
        uid: node.uid,
        host: node.host,
        userName: node.userName,
        dbName: node.dbName,
        port: node.port,
        dbType: node.dbType,
        domain: mapDomainOfHost(node),
        clusterId: node.clusterId != null && node.clusterId != StringUtils.EMPTY_STRING ? node.clusterId : null,
        hostName: node.hostName
    }
}

export const mapToFsHost = (node: any) => {
    return {
        uid: node.uid,
        host: node.host,
        userName: node.userName,
        folder: node.folder,
        domain: mapDomainOfHost(node),
        clusterId: node.clusterId != null && node.clusterId != StringUtils.EMPTY_STRING ? node.clusterId : null,
        hostName: node.hostName
    }
}

const mapDomainOfHost = (node: any) => {
    return node.domain != null && node.domain.length != 0 ?
        node.domain.map((domain: any) => {
            return {
                shortName: domain.shortName,
                item: domain.item != null && domain.item.length != 0 ?
                    domain.item.map((item: any) => {
                        return {
                            fqn: item.fqn
                        }
                    }) : null
            }
        }) : null
}

export const mapArea = (area: Area) => {
    return {
        descriptor: area.descriptor,
        uid: area.uid,
        description: area.description,
        color: area.color,
        anchorRole: area.anchorRole != null && area.anchorRole.length != 0 ?
            area.anchorRole : []
    };
}