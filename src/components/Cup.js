import React, { useState, forwardRef, useEffect } from "react";
import cup from "../img/cup.png";
import ball from "../img/ball.png";

const css = {
  container: {
    cursor: "pointer",
    float: "left",
    margin: "15px 30px",
    position: "absolute",
  },
  cup: {
    position: "relative",
    transitionDuration: "300ms",
    width: 105,
  },
  ball: {
    display: "block",
    borderRadius: "50%",
    height: 30,
    width: 30,
    margin: "5px 45px",
  },
};

export default forwardRef((props, ref) => {
  const [state, setState] = useState({
    open: props.open,
    selected: props.selected,
    animation: {},
  });

  useEffect(() => {
    const animation = props.open
      ? { transform: "translateY(0px)" }
      : { transform: "translateY(40px)" };
    setState({ animation: animation, open: props.open });
  }, [props.open]);

  const cupStyles = { ...css.cup, ...(state.animation ?? {}) };
  const stylesContainer = { ...css.container, left: props.left };

  return (
    <div
      ref={ref}
      onClick={() => {
        if (!props.open) {
          setState({ open: true, animation: { transform: "translateY(0px)" } });

          props.onClick();
        }
      }}
      style={stylesContainer}
    >
      <img src={cup} style={cupStyles} alt="cup" />

      {props.selected ? <img src={ball} style={css.ball} alt="ball" /> : null}
    </div>
  );
});
