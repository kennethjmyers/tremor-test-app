import { useEffect, useRef, useState} from 'react';
import * as Plot from "@observablehq/plot";
import * as d3 from 'd3';
import './plotsOverride.css';


type Props = {
  dataFile: string,
}

var dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export default function PostTimeHeatMap(props: Props) {
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
      x: {axis: "top", label: "Day of Week", domain: dayNames},
      y: {label: "Hour of Day"},
      color: {type: "linear", scheme: "Blues"},
      marks: [
        Plot.cell(
          data, 
          Plot.group({fill: "count"}, {
            x: (d) => dayNames[(new Date(d.date+' '+d.time)).getDay()], 
            y: (d) => (new Date(d.date+' '+d.time)).getHours(),
            inset: 0.5
          })),
        Plot.text(
          data, 
          Plot.group({text: "count"}, {
            x: (d) => dayNames[(new Date(d.date+' '+d.time)).getDay()], 
            y: (d) => (new Date(d.date+' '+d.time)).getHours(),
            fill: "black",
            stroke: "white",
            strokeWidth: 2
          })),
      ]
    });
    containerRef.current.append(plot);

    return () => plot.remove();
  }, [data]);

  return (
    <div ref={containerRef} />
  )
}