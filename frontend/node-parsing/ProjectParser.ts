import {Domain,} from "Frontend/interfaces/Interfaces";

import {ProjectRenderer} from "Frontend/renderer/ProjectRenderer";
import {generateUid} from "Frontend/utils/common";

export class ProjectParser {
    private projectRenderer: ProjectRenderer;

    constructor(projectRenderer: ProjectRenderer) {
        this.projectRenderer = projectRenderer;
    }

    parseDomain = (node: object | any) => {
        if (node['layout'] != null) {
            node['fixed'] = true
            node['x'] = node['layout']["x"] * 2;
            node['y'] = node['layout']["y"] * 2;
        }
        node['id'] = node['shortName'];
        node['label'] = node['name'];
        node['_group'] = structuredClone(node['group'])
        delete node['group'];
        return node as Domain;
    }

    fillDomainFigure = (node: object | any) => {
        node = this.projectRenderer.renderDomain(node);
        node['label'] = node['name'];
        return node;
    }

    createDomainNodeTemplate = (detail: any) => {
        let domain = {
            anchor: [],
            cdAnchor: [],
            knot: [],
            tie: [],
            txAnchor: [],
            shortName: detail.shortName,
            name: detail.name,
            note: detail.note,
            author: detail.author,
            isNew: true,
            uid: generateUid()
        }
        return domain
    }

}
