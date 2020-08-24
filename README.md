## States Cursor

> An alternative for Respo cursor.

States in React components are reset during Webpack how code replacement. Respo cursor proposed a solution by maintaining a global states tree and using manual states passing to hold states. This library tries to offer a alternative library for use case in React.

### Usages

![](https://img.shields.io/npm/v/@jimengio/states-cursor.svg)

```bash
yarn add @jimengio/states-cursor
```

```ts
import { rootStatesCursor } from "@jimengio/states-cursor";

// at root component
let rootCursor = rootStatesCursor();

// at child component
let cursorPageA = rootCursor.extends("a");

// another child page
let cursorPageB = rootCursor.extends("b");

// list of children
let childCursor = cursorPageA.extends(`child-${idx}`);
```

Manage states:

```ts
cursor.init({ a: 1 });

cursor.state; // gets {a: 1}

cursor.updateState((draft) => {
  draft.a = draft.a + 1;
});
```

listen to changes and rerender page:

```ts
import { addStatesListener, removeStatesListener } from "@jimengio/states-cursor";

addStatesListener(() => {
  // console.log("requests rerender from states");
  renderApp();
});
```

Reset states on unmount:

```ts
useEffect(() => {
  return () => {
    props.cursor.forceUmountTree();
  };
}, []);
```

### Workflow

https://github.com/jimengio/ts-workflow

### License

MIT
