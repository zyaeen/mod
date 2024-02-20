import {Edge, Node} from "vis-network";
import {FullItem} from "vis-data/declarations/data-interface"
import {LeanDiNode} from "Frontend/interfaces/Interfaces";

export const copy = (obj: any) => {
    if (obj === null) return null;
    let clone = Object.assign({}, obj);
    Object.keys(clone).forEach(
        key =>
            (clone[key] =
                typeof obj[key] === 'object' ? copy(obj[key]) : obj[key])
    );
    if (Array.isArray(obj)) {
        clone.length = obj.length;
        return Array.from(clone);
    }
    return clone;
};

export class UndoRedoStructure {

    public history: {
        past: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[], hosts: any[], areas: any[] }[],
        current: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[], hosts: any[], areas: any[] } | null,
        future: { nodes: FullItem<Node, "id">[], edges: FullItem<Edge, "id">[], hosts: any[], areas: any[] }[],
    };

    constructor() {
        this.history = {
            past: [],
            current: null,
            future: []
        }
    }

    public redoHistory = () => {
        this.history.past.push(copy(this.history.current));
        this.history.current = copy(this.history.future[0]);
        this.history.future.shift();
        return this.history;
    }

    public undoHistory = () => {
        this.history.future.splice(0, 0, copy(this.history.current!));
        this.history.current = copy(this.history.past[this.history.past.length - 1]);
        this.history.past.pop();
        return this.history;
    }

    public initHistory = (edges: FullItem<Edge, "id">[], nodes: FullItem<Node, "id">[], hosts?: any[], areas?: any[]) => {
        if (hosts && areas) {
            this.history.current = copy({
                nodes: nodes,
                edges: edges,
                hosts: hosts,
                areas: areas
            });
        } else {
            this.history.current = copy({
                nodes: nodes,
                edges: edges,
                hosts: [],
                areas: []
            });
        }
        return this.history;
    }

    public updateHistory = (edges: FullItem<Edge, "id">[], nodes: FullItem<Node, "id">[], hosts?: any[], areas?: any[]) => {
        this.history.past.push(copy(this.history.current));
        if (hosts) {
            this.history.current = copy({
                nodes: nodes,
                edges: edges,
                hosts: hosts,
                areas: areas
            });
        } else {
            this.history.current = copy({
                nodes: nodes,
                edges: edges,
                hosts: copy(this.history.current!.hosts),
                areas: copy(this.history.current!.areas)
            });
        }

        this.history.future = [];
        return this.history;
    }

}

export const getDifferenceInNodes = (A: FullItem<Node, "id">[], B: FullItem<Node, "id">[]) => {
    return getDifference(A, B);
}

export const getDifferenceInNodesByKeys = (A: FullItem<Node, "id">[], B: FullItem<Node, "id">[]) => {
    return getDifferenceByKeys(A, B);
}

export const getDifferenceInEdges = (A: FullItem<Edge, "id">[], B: FullItem<Edge, "id">[]) => {
    return getDifference(A, B);
}

const getDifference = (A: FullItem<Edge | Node, "id">[], B: FullItem<Edge | Node, "id">[]) => {
    const idOfB = B.map(x => {
        return x.id
    });
    return A.filter(x => !idOfB.includes(x.id)) as LeanDiNode[] | Edge[];
}

export const getDifferenceInEdgesByKeys = (A: FullItem<Edge, "id">[], B: FullItem<Edge, "id">[]) => {
    return getDifferenceByKeys(A, B);
}

export const getDifferenceInHostsByKeys = (A: any[], B: any[]) => {
    const labels = A.map(x => {
        return x.label
    });

    let items = [];

    for (let label of labels) {
        const hostFromA = copy(A.find(x => x.label == label));
        const hostFromB = copy(B.find(x => x.label == label));
        const domainsOfB = hostFromB.domain.map((x: any) => {
            return x.shortName
        });
        const differenceAB = hostFromA.domain.filter((x: any) => !domainsOfB.includes(x.shortName)).map((x: any) => {
            return x.shortName
        }) as any[];
        const intersectionAB = hostFromA.domain.filter((x: any) => domainsOfB.includes(x.shortName)).map((x: any) => {
            return x.shortName
        }) as any[];
        for (let shortName of intersectionAB) {
            const domainFromA = copy(hostFromA.domain.find((x: any) => x.shortName == shortName));
            const domainFromB = copy(hostFromB.domain.find((x: any) => x.shortName == shortName));
            const itemsOfB = domainFromB.item.map((x: any) => {
                return x.fqn;
            });
            const differenceDomainADomainB = domainFromA.item.filter((x: any) => !itemsOfB.includes(x.fqn)) as any[];
            for (let item of differenceDomainADomainB) {
                items.push({
                    shortName: shortName,
                    host: hostFromA.host,
                    userName: hostFromA.userName,
                    folder: hostFromA.folder,
                    dbType: hostFromA.dbType,
                    port: hostFromA.port,
                    dbName: hostFromA.dbName,
                    fqn: item.fqn
                });
            }
        }
        for (let shortName of differenceAB) {
            const domainFromA = copy(hostFromA.domain.find((x: any) => x.shortName == shortName));
            for (let item of domainFromA.item) {
                items.push({
                    shortName: shortName,
                    host: hostFromA.host,
                    userName: hostFromA.userName,
                    folder: hostFromA.folder,
                    dbType: hostFromA.dbType,
                    port: hostFromA.port,
                    dbName: hostFromA.dbName,
                    fqn: item.fqn
                });
            }
        }
    }
    return items;
}

export const getDifferenceInAreasByKeys = (A: any[], B: any[]) => {
    const uids = A.map(x => {
        return x.uid
    });

    let difference = [];

    for (let uid of uids) {
        const areaFromA = copy(A.find(x => x.uid == uid));
        const areaFromB = copy(B.find(x => x.uid == uid));
        const anchorsOfB = areaFromB.anchorRole.map((x: any) => {
            return x.type
        });
        difference = areaFromA.anchorRole.filter((x: any) => !anchorsOfB.includes(x.type)).map((x: any) => {
            return x.type
        }) as any[];
    }
    return difference;
}


const getDifferenceByKeys = (A: FullItem<Edge | Node, "id">[], B: FullItem<Edge | Node, "id">[]) => {
    const idOfA = A.map(x => {
        return x.id
    });
    const idOfB = B.map(x => {
        return x.id
    })
    let difference = [];
    for (let id of idOfA) {
        const objFromA = copy(A.find(x => x.id == id));
        delete objFromA['x'];
        delete objFromA['y'];
        delete objFromA['fixed']
        delete objFromA['layout']
        if (objFromA['isNew'] == false || objFromA['isNew'] == null) {
            delete objFromA['isNew']
        }
        const objFromB = copy(B.find(x => x.id == id));
        delete objFromB['x'];
        delete objFromB['y'];
        delete objFromB['fixed']
        delete objFromB['layout']
        if (objFromB['isNew'] == false || objFromB['isNew'] == null) {
            delete objFromB['isNew']
        }
        if (JSON.stringify(objFromA) != JSON.stringify(objFromB)) {
            difference.push(objFromA as Node);
        }
    }
    return difference;
}

