import React, { FC, useEffect } from "react";
import { css, cx } from "emotion";
import { StatesCursor, debugLogGlobalStates } from "../../src/states-cursor";
import randomcolor from "randomcolor";

let PageA: FC<{ className?: string; cursor: StatesCursor<{ a: number }> }> = React.memo((props) => {
  props.cursor.init({ a: 0 });
  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={cx(styleArea, props.className)} style={{ borderColor: randomcolor() }}>
      <div>a is: {props.cursor.state.a}</div>
      <button
        onClick={() => {
          props.cursor.updateState((draft) => {
            draft.a = draft.a + 1;
          });
        }}
      >
        increment a
      </button>
    </div>
  );
});

let PageB: FC<{ className?: string; cursor: StatesCursor<{ b: number }> }> = React.memo((props) => {
  props.cursor.init({ b: 0 });

  // console.log("b...", props.cursor);
  // debugLogGlobalStates();

  /** Plugins */
  /** Methods */
  /** Effects */

  useEffect(() => {
    return () => {
      props.cursor.forceUmountTree();
    };
  }, []);

  /** Renderers */
  return (
    <div className={cx(styleArea, props.className)} style={{ borderColor: randomcolor() }}>
      <div>b is: {props.cursor.state.b}</div>
      <button
        onClick={() => {
          props.cursor.updateState((draft) => {
            draft.b = draft.b + 1;
          });
        }}
      >
        increment b
      </button>
    </div>
  );
});

let PageHome: FC<{ className?: string; cursor: StatesCursor<{ draft: string; hasB2: boolean }> }> = React.memo((props) => {
  props.cursor.init({ draft: "zero", hasB2: false });

  // console.log(props.cursor);

  /** Plugins */
  /** Methods */
  /** Effects */
  /** Renderers */
  return (
    <div className={cx(styleArea, props.className)} style={{ borderColor: randomcolor() }}>
      <div>
        <input
          value={props.cursor.state.draft}
          onChange={(event) => {
            let text = event.target.value;
            props.cursor.updateState((draft) => {
              draft.draft = text;
            });
          }}
        />
        got: {props.cursor.state.draft}
      </div>
      <div>
        <button
          onClick={() => {
            props.cursor.updateState((draft) => {
              draft.hasB2 = !draft.hasB2;
            });
          }}
        >
          Toggle b2
        </button>
      </div>

      <div>
        <PageA cursor={props.cursor.extends("a")} />
        <PageA cursor={props.cursor.extends("a2")} />
        <PageB cursor={props.cursor.extends("b")} />

        {props.cursor.state.hasB2 ? <PageB cursor={props.cursor.extends("b2")} /> : null}
      </div>
    </div>
  );
});

export default PageHome;

let styleArea = css`
  padding: 4px;
  margin: 16px;
  border: 8px solid #ccc;
`;
