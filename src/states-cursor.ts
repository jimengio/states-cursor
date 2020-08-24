import Emitter from "eventemitter3";
import produce from "immer";

let bus = new Emitter();

let keyChanges = "changes";

interface StatesTree {
  state: Record<string, any>;
  tree: Record<string, StatesTree>;
  cachedExtendResult: any;
}

export interface StatesCursor<T = any> {
  path: string[];
  init: (localState: T) => T;
  state: T;
  updateState: (f: (x: T) => void) => void;
  extends: (k: string) => StatesCursor<any>;
  forceUmountTree: () => void;
}

let globalStates: StatesTree = {
  state: undefined,
  tree: {},
  cachedExtendResult: undefined,
};

export let addStatesListener = (f: () => void) => {
  bus.addListener(keyChanges, f);
};

export let removeStatesListener = (f: () => void) => {
  bus.removeListener(keyChanges, f);
};

let prepareBranchByCursor = (path: string[], tree: StatesTree): StatesTree => {
  if (tree == null) {
    throw new Error("Unexpected null value to branch");
  }

  if (path.length === 0) {
    return tree;
  }

  if (tree.tree[path[0]] == null) {
    console.warn("Noticed undefined branch, adding states", path, tree);
    tree.tree[path[0]] = {
      state: undefined,
      tree: {},
      cachedExtendResult: null,
    };
  }

  return prepareBranchByCursor(path.slice(1), tree.tree[path[0]]);
};

let outdateCaches = (path: string[], tree: StatesTree): void => {
  tree.cachedExtendResult = null;
  if (path.length > 0) {
    outdateCaches(path.slice(1), tree.tree[path[0]]);
  }
};

let extendsCursor = <T = Record<string, any>>(cursor: StatesCursor<T>, newKey: string): StatesCursor<T> => {
  let baseBranch = prepareBranchByCursor(cursor.path, globalStates);

  if (baseBranch.tree[newKey]?.cachedExtendResult != null) {
    return baseBranch.tree[newKey].cachedExtendResult;
  }

  if (baseBranch.tree[newKey] == null) {
    let newTree: StatesTree = {
      state: undefined as T,
      tree: {},
      cachedExtendResult: null,
    };

    baseBranch.tree[newKey] = newTree;
  }

  let theTree = baseBranch.tree[newKey];

  let newCursor: StatesCursor = {
    path: cursor.path.concat(newKey),
    init: (zeroState: T) => {
      if (theTree.state === undefined) {
        theTree.state = zeroState;
      }
      return theTree.state;
    },
    get state() {
      return theTree.state as T;
    },
    updateState(f: (x: T) => void) {
      theTree.state = produce(theTree.state, (draft) => {
        f(draft as T);
      });
      outdateCaches(cursor.path.concat(newKey), globalStates);
      bus.emit(keyChanges);
    },
    extends(k: string) {
      return extendsCursor(this, k);
    },
    forceUmountTree: () => {
      // console.warn("Unmount states tree at", newCursor);
      delete baseBranch.tree[newKey];
    },
  };

  theTree.cachedExtendResult = newCursor;

  return newCursor;
};

export let rootStatesCursor = <T>(): StatesCursor<T> => {
  if (globalStates.cachedExtendResult != null) {
    return globalStates.cachedExtendResult;
  }

  let tree: StatesCursor<T> = {
    path: [],
    get state() {
      return globalStates.state as T;
    },
    init(x: T) {
      if (globalStates.state == null) {
        globalStates.state = x;
      }
      return globalStates.state as T;
    },
    updateState(f: (x: T) => void) {
      globalStates.state = produce(globalStates.state, (draft) => {
        f(draft as T);
      });
      outdateCaches([], globalStates);
      bus.emit(keyChanges);
    },
    extends(k: string) {
      return extendsCursor(this, k);
    },
    forceUmountTree() {
      globalStates.state = undefined;
      globalStates.tree = {};
      console.warn("Unmount root states tree", globalStates);
    },
  };

  globalStates.cachedExtendResult = tree;
  return tree;
};

export let debugLogGlobalStates = () => {
  console.info(globalStates);
};
