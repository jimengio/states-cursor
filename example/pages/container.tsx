import React, { FC } from "react";
import { css, cx } from "emotion";
import { fullscreen, row, expand } from "@jimengio/flex-styles";

import { HashRedirect, findRouteTarget } from "@jimengio/ruled-router/lib/dom";
import { genRouter, GenRouterTypeMain } from "controller/generated-router";
import { ISidebarEntry, DocSidebar } from "@jimengio/doc-frame";
import { StatesCursor } from "../../src/states-cursor";
import PageHome from "./home";

let items: ISidebarEntry[] = [
  {
    title: "Home",
    path: genRouter.$.name,
  },
];

let onSwitchPage = (path: string) => {
  let target = findRouteTarget(genRouter, path);
  if (target != null) {
    target.go();
  }
};

let Container: FC<{ router: GenRouterTypeMain; cursor: StatesCursor }> = React.memo((props) => {
  /** Methods */
  /** Effects */
  /** Renderers */

  const renderChildPage = () => {
    switch (props.router?.name) {
      case "home":
        return <PageHome cursor={props.cursor.extends("home")} />;
      default:
        return <HashRedirect to={genRouter.$.path()} noDelay />;
    }

    return <div>NOTHING</div>;
  };

  return (
    <div className={cx(fullscreen, row, styleContainer)}>
      <DocSidebar
        title="States cursor"
        currentPath={props.router.name}
        onSwitch={(item) => {
          onSwitchPage(item.path);
        }}
        items={items}
      />
      <div className={cx(expand, styleBody)}>{renderChildPage()}</div>
    </div>
  );
});

export default Container;

const styleContainer = css``;

let styleBody = css`
  padding: 16px;
`;
