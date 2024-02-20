import {Domain, DbHost, FsHost} from "Frontend/interfaces/Interfaces";

import {HostsRenderer} from "Frontend/renderer/HostsRenderer";
import {NodeType} from "Frontend/enums/NodeType";
import {DbType} from "Frontend/enums/DbType";
import {isStrNotEmpty, generateUid} from "Frontend/utils/common";
import {StringUtils} from "Frontend/enums/DefaultValues";

export class HostsParser {
    private hostsRenderer!: HostsRenderer;

    constructor(hostsRenderer?: HostsRenderer) {
        if (hostsRenderer) {
            this.hostsRenderer = hostsRenderer;
        }
    }

    parseDbHost = (node: object | any) => {
        if (node['id'] == null) {
            node['id'] = node['dbType'] + StringUtils.DOT + node['host']
                + StringUtils.DOT + node['port'] + '.' + node['dbName'];
        }
        node['label'] = isStrNotEmpty(node['hostName']) ? node['hostName'] : node['dbType'] + StringUtils.DOT + node['host']
            + StringUtils.DOT + node['port'] + '.' + node['dbName'];
        node['dbType'] = Object.values(DbType)
            .filter(dbType => dbType.toLowerCase() == node['dbType'].toLowerCase())[0];
        node.fixed = true;
        return node as DbHost;
    }

    parseFsHost = (node: object | any) => {
        if (node['id'] == null) {
            node['id'] = node['host'] + StringUtils.DOT + node['folder'];
        }
        node['label'] = isStrNotEmpty(node['hostName']) ? node['hostName'] : node['host'] + StringUtils.DOT + node['folder'];
        node.fixed = true;
        return node as DbHost;
    }

    fillDbHostFigure = (node: object | any) => {
        if (node['id'] == null){
            node['id'] = node['dbType'] + StringUtils.DOT + node['host']
                + StringUtils.DOT + node['port'] + '.' + node['dbName'];
        }
        node.type = NodeType.DB_HOST;
        node = this.hostsRenderer.renderHost(node);
        node['label'] = isStrNotEmpty(node['hostName']) ? node['hostName'] : node['dbType'] + StringUtils.DOT + node['host']
            + StringUtils.DOT + node['port'] + '.' + node['dbName'];
        return node;
    }

    fillFsHostFigure = (node: object | any) => {
        if (node['id'] == null) {
            node['id'] = node['host'] + StringUtils.DOT + node['folder'];
        }
        node.type = NodeType.FS_HOST;
        node = this.hostsRenderer.renderHost(node);
        node['label'] = isStrNotEmpty(node['hostName']) ? node['hostName'] : node['host'] + StringUtils.DOT + node['folder'];
        return node as FsHost;
    }

    parseDomain = (node: object | any) => {
        if (node['id'] == null) {
            node['id'] = node['shortName'];
        }
        node['label'] = node['shortName'];
        return node as Domain;
    }

    fillDomainFigure = (node: object | any) => {
        node = this.hostsRenderer.renderDomain(node);
        node.type = NodeType.DOMAIN;
        // node['id'] = node['shortName'];
        // node['label'] = node['name'];
        return node;
    }

    createDbHostNodeTemplate = (detail: any) => {
        return {
            domain: [],
            dbType: detail.dbType,
            dbName: detail.dbName,
            port: detail.port,
            userName: detail.userName,
            host: detail.host,
            clusterId: detail.clusterId,
            hostName: detail.hostName,
            isNew: true,
            uid: generateUid()
        };
    }

    createFsHostNodeTemplate = (detail: any) => {
        return {
            domain: [],
            folder: detail.folder,
            userName: detail.userName,
            host: detail.host,
            clusterId: detail.clusterId,
            hostName: detail.hostName,
            isNew: true,
            uid: generateUid()
        };
    }

}
