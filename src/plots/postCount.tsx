import { useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import { Metric } from "@tremor/react";


type Props = {
  dataFile: string
}

type dataRow = {
  date: string,
  time: string,
  uri: string
}

export default function PostCount(props: Props) {
  const containerRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<d3.DSVParsedArray<object>>();

  useEffect(() => {
    d3.csv(props.dataFile, d3.autoType).then((fileData) => {
      setData(fileData)});
  }, [props.dataFile]);



  return (
    <Metric>Posts: {data? data.length : ""}</Metric>
  )
}