import { useEffect, useRef, useState} from 'react';
import * as d3 from 'd3';
import { Metric, Flex } from "@tremor/react";


type Props = {
  dataFile: string
}

type dataRow = {
  date: string,
  time: string,
  uri: string,
  category: string
}

export default function PostMetrics(props: Props) {
  const containerRef = useRef<HTMLInputElement>(null);
  const [data, setData] = useState<d3.DSVParsedArray<dataRow>>();

  useEffect(() => {
    d3.csv(props.dataFile, d3.autoType).then((fileData) => {
      setData(fileData as d3.DSVParsedArray<dataRow>)});
  }, [props.dataFile]);

  return (
    <div>
      <Flex>
      <Metric>Posts: {data? data.length : 0}</Metric>
      <Metric>Reposts: {data? data.map((row) => row.category==="repost"?1:0).reduce((a, b) => a + b, 0) : 0}</Metric>
      <Metric>Replies: {data? data.map((row) => row.category==="reply"?1:0).reduce((a, b) => a + b, 0) : 0}</Metric>
      </Flex>
    </div>
  )
}