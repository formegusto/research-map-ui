import React from "react";

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
  const width = (48 * 750) / 2 / mapWidth;
  const height = width;

  return {
    width: width,
    height: height,
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

function MapComponent() {
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
  const refZoom = React.useRef<HTMLDivElement>(null);
  const [mapWidth, setMapWidth] = React.useState<number>(750 / 2);
  const [zooming, setZooming] = React.useState<boolean>(false);
  const [controlScale, setControlScale] = React.useState<number>(1);
  const scale = React.useRef<number>(1);
  const pointX = React.useRef<number>(0);
  const pointY = React.useRef<number>(0);
  const maxWidth = React.useRef<number>(750);
  const maxHeight = React.useRef<number>(750);
  const maxX = React.useRef<number>(0);
  const maxY = React.useRef<number>(0);

  React.useEffect(() => {
    if (refZoom && refZoom.current) {
      refZoom.current.ontransitionend = (e) => {
        const _rect = refZoom.current?.getBoundingClientRect();
        if (_rect) {
          const { width } = _rect;

          setMapWidth(width / 2);
        }
      };
    }
  }, []);

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

          setControlScale(nextScale);
        },
        200
      );
    }
  }, []);

  return (
    <div className="zoom_outer">
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
    </div>
  );
}

export default MapComponent;
