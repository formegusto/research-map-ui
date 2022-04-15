import React from "react";
import "./App.css";

function App() {
  const refZoom = React.useRef<HTMLDivElement>(null);
  const start = React.useRef<any>({
    x: 0,
    y: 0,
  });
  const panning = React.useRef<boolean>(false);
  const scale = React.useRef<number>(1);
  const pointX = React.useRef<number>(0);
  const pointY = React.useRef<number>(0);

  const setTransform = () => {
    if (refZoom && refZoom.current) {
      refZoom.current.style.transform =
        "translate(" +
        pointX.current +
        "px, " +
        pointY.current +
        "px) scale(" +
        scale.current +
        ")";
    }
  };

  React.useEffect(() => {
    if (refZoom && refZoom.current) {
      refZoom.current.onmousedown = (e) => {
        e.preventDefault();

        start.current = {
          x: e.clientX - pointX.current,
          y: e.clientY - pointY.current,
        };
        panning.current = true;
      };

      refZoom.current.onmouseup = (e) => {
        panning.current = false;
      };

      refZoom.current.onmousemove = (e) => {
        e.preventDefault();
        if (!panning.current) {
          return;
        }
        pointX.current = e.clientX - start.current.x;
        pointY.current = e.clientY - start.current.y;
        setTransform();
      };
    }
  }, []);

  return (
    <div className="zoom_outer">
      <div ref={refZoom} id="zoom"></div>
    </div>
  );
}

export default App;
