import { useEffect, useRef, useState} from 'react';
import * as Plot from "@observablehq/plot";
import * as d3 from 'd3';
import './plotsOverride.css';


type Props = {
  dataFile: string,
}

export default function PostLinePlot(props: Props) {
  const containerRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<d3.DSVParsedArray<object>>();

  useEffect(() => {
    d3.csv(props.dataFile, d3.autoType).then((fileData) => setData(fileData));
  }, [props.dataFile]);

  useEffect(() => {
    if (data === undefined || containerRef.current === null) return;
    const plot = Plot.plot({
      padding: 0,
      grid: true,
      height: 300,
      x: {axis: "bottom", label: ""},
      y: {label: "Posts"},
      color: {type: "linear", scheme: "Blues"},
      marks: [
        Plot.lineY(
          data, 
          Plot.binX({y: "count", filter: null}, {x: (d) => (new Date(d.date+' '+d.time)), })),
      ]
    });
    containerRef.current.append(plot);

    return () => plot.remove();
  }, [data]);

  return (
    <div ref={containerRef} />
  )
}