import {isArrayNotEmpty} from "Frontend/utils/common";
import {copy} from "Frontend/undo-redo/UndoRedoStructure";

export type FunctionPattern = {
    function: Function,
    arguments?: any
}

const invoke = (func: FunctionPattern) => {
    if (func.arguments) {
        func.function(func.arguments);
    } else {
        func.function();
    }
}

export class CommandUndoRedo {

    private COMMANDS: {
        past: {
            undo: FunctionPattern[],
            redo: FunctionPattern[]
        }[],
        future: {
            undo: FunctionPattern[],
            redo: FunctionPattern[]
        }[]
    } = {
        past: [],
        future: []
    };


    constructor() {
        this.COMMANDS = {
            past: [],
            future: []
        };
    }

    public update(toUndo: FunctionPattern[], toRedo: FunctionPattern[]) {
        this.COMMANDS.past.push({
            undo: toUndo,
            redo: toRedo
        });
        this.COMMANDS.future = [];
    }

    public undo = () => {
        if (isArrayNotEmpty(this.COMMANDS.past)) {
            const current = copy(this.COMMANDS.past[this.COMMANDS.past.length - 1]);
            this.COMMANDS.future.splice(0, 0, current);
            this.COMMANDS.past.pop();
            const {undo, redo} = current;
            for (const func of undo) {
                invoke(func);
            }
            // this.commands.pop();
        }
    }

    public redo = () => {
        if (isArrayNotEmpty(this.COMMANDS.future)) {
            const current = copy(this.COMMANDS.future[0]);
            this.COMMANDS.future.shift();
            this.COMMANDS.past.push(current);
            const {undo, redo} = current;
            for (const func of redo) {
                invoke(func);
            }
            // this.commands.pop();
        }
    }

}