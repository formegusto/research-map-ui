import React from "react";
import "./App.css";
import MapComponent from "./MapComponent";

function generateDivCoord(mapWidth: number, item: any) {
  const { x, y } = item;
  let _x = 0,
    _y = 0;
  // 1사분면
  if (x > 0 && y > 0) {
    // + +
    // left : + , top : -
    _x = x;
    _y = y * -1;
  }
  // 2사분면
  else if (x < 0 && y > 0) {
    // - +
    // left : -, top : -
    _x = x;
    _y = y * -1;
  }
  // 3사분면
  else if (x < 0 && y < 0) {
    // - -
    // left: -, top : +
    _x = x;
    _y = y * -1;
  }
  // 4사분면
  else if (x > 0 && y < 0) {
    // + -
    // left: +, top: +
    _x = x;
    _y = y * -1;
  }

  _x = (mapWidth * _x) / 100 - 24;
  _y = (mapWidth * _y) / 100 - 24;

  return {
    transform: "translateX(" + _x + "px) translateY(" + _y + "px)",
  };
}

function createWheelStopListener(element: any, callback: any, timeout: any) {
  var handle: any = null;
  var onScroll = function (e: React.WheelEvent) {
    if (handle) {
      clearTimeout(handle);
    }
    handle = setTimeout(() => callback(e), timeout || 200);
  };
  element.addEventListener("wheel", onScroll);
  return function () {
    element.removeEventListener("wheel", onScroll);
  };
}

function App() {
  const [item, setItem] = React.useState<any>([
    {
      name: "1 square",
      // 1사분면
      x: 50,
      y: 50,
    },
    {
      name: "4 square",
      // 제 4사분면
      x: 50,
      y: -50,
    },
    {
      name: "2 square",
      // 제 2사분면
      x: -50,
      y: 50,
    },
    {
      name: "3 square",
      // 제 3사분면
      x: -50,
      y: -50,
    },
  ]);
  const [maxItems, setMaxItems] = React.useState<any>([
    {
      name: "1 square",
      // 1사분면
      x: 0,
      y: 0,
    },
    {
      name: "4 square",
      // 제 4사분면
      x: 0,
      y: 0,
    },
    {
      name: "2 square",
      // 제 2사분면
      x: 0,
      y: 0,
    },
    {
      name: "3 square",
      // 제 3사분면
      x: 0,
      y: 0,
    },
  ]);
  const refZoom = React.useRef<HTMLDivElement>(null);
  const start = React.useRef<any>({
    x: 0,
    y: 0,
  });
  const [zooming, setZooming] = React.useState<boolean>(false);
  const [mapWidth, setMapWidth] = React.useState<number>(0);
  const panning = React.useRef<boolean>(false);
  const scale = React.useRef<number>(1);
  const pointX = React.useRef<number>(0);
  const pointY = React.useRef<number>(0);
  const maxWidth = React.useRef<number>(750);
  const maxHeight = React.useRef<number>(750);
  const maxX = React.useRef<number>(0);
  const maxY = React.useRef<number>(0);

  // 1. 초기 위치 설정
  React.useEffect(() => {
    if (refZoom && refZoom.current) {
      const { width } = refZoom.current.getBoundingClientRect();
      setMapWidth(width / 2);
    }
  }, []);

  React.useEffect(() => {
    if (refZoom && refZoom.current) {
    }
  }, [zooming]);

  // React.useEffect(() => {
  //   if (zooming) {
  //     if (refZoom && refZoom.current) {
  //       const { width } = refZoom.current.getBoundingClientRect();
  //       setMapWidth(width / 2);

  //       console.log(width);
  //       setZooming(false);
  //     }
  //   }
  // }, [zooming]);

  const setTransform = () => {
    if (refZoom && refZoom.current) {
      if (pointX.current > 0) pointX.current = 0;
      if (pointY.current > 0) pointY.current = 0;

      if (pointX.current <= maxX.current) pointX.current = maxX.current;
      if (pointY.current <= maxY.current) pointY.current = maxY.current;

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
      // refZoom.current.onmousemove = (e) => {
      //   e.preventDefault();
      //   if (!panning.current) {
      //     return;
      //   }
      //   pointX.current = e.clientX - start.current.x;
      //   pointY.current = e.clientY - start.current.y;
      //   setTransform();
      // };

      createWheelStopListener(
        refZoom.current,
        function (e: React.WheelEvent) {
          console.log(e);
          setZooming(true);
          var xs = (e.clientX - pointX.current) / scale.current,
            ys = (e.clientY - pointY.current) / scale.current,
            delta = e.deltaY;

          let nextScale = 0;
          if (delta > 0) {
            nextScale = scale.current * 1.2;
          } else {
            nextScale = scale.current / 1.2;
          }
          if (nextScale < 1) {
            scale.current = 1;
          } else {
            if (nextScale > 2) {
              scale.current = 2;
            } else {
              scale.current = nextScale;
            }
          }
          maxX.current = maxWidth.current - maxWidth.current * scale.current;
          maxY.current = maxHeight.current - maxHeight.current * scale.current;
          pointX.current = e.clientX - xs * scale.current;
          pointY.current = e.clientY - ys * scale.current;

          setTransform();
          setZooming(false);
        },
        30
      );
    }
  }, []);

  // React.useEffect(() => {
  //   if (refZoom && refZoom.current) {
  //     refZoom.current.onmousedown = (e) => {
  //       e.preventDefault();

  //       start.current = {
  //         x: e.clientX - pointX.current,
  //         y: e.clientY - pointY.current,
  //       };
  //       panning.current = true;
  //     };

  //     refZoom.current.onmouseup = (e) => {
  //       panning.current = false;
  //     };

  //     // refZoom.current.onwheel = (e) => {
  //     //   e.preventDefault();

  //     //   var xs = (e.clientX - pointX.current) / scale.current,
  //     //     ys = (e.clientY - pointY.current) / scale.current,
  //     //     delta = -e.deltaY;

  //     //   let nextScale = 0;
  //     //   if (delta > 0) {
  //     //     nextScale = scale.current * 1.2;
  //     //   } else {
  //     //     nextScale = scale.current / 1.2;
  //     //   }
  //     //   if (nextScale < 1) {
  //     //     scale.current = 1;
  //     //   } else {
  //     //     if (nextScale > 3) {
  //     //       scale.current = 3;
  //     //     } else {
  //     //       scale.current = nextScale;
  //     //     }
  //     //   }

  //     //   maxX.current = maxWidth.current - maxWidth.current * scale.current;
  //     //   maxY.current = maxHeight.current - maxHeight.current * scale.current;
  //     //   pointX.current = e.clientX - xs * scale.current;
  //     //   pointY.current = e.clientY - ys * scale.current;

  //     //   setTransform();
  //     //   setZooming(true);
  //     // };
  //   }
  // }, []);

  return (
    <>
      {/* <div className="zoom_outer">
        <div ref={refZoom} id="zoom">
          <div id="coord">
            {mapWidth !== 0 &&
              item.map((i: any) => (
                <div
                  id={i.name}
                  className="item"
                  style={generateDivCoord(mapWidth, i)}
                />
              ))}
          </div>
        </div>
      </div> */}
      <MapComponent />
      {/* <map>
        <area shape="CIRCLE" coords="90,58.3" alt="CIRCLE" />
      </map> */}
    </>
  );
}

export default App;
