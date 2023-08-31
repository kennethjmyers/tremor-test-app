import { Card, Title, DonutChart } from "@tremor/react";
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type Props = {
  dataFile: string
}

type dataRow = {
  date: string,
  time: string,
  uri: string,
  category: string
}

type aggData = {
  category: string,
  count: number
}

export default function PostDonut (props: Props) {
  const [data, setData] = useState<aggData[]>();

  useEffect(() => {
    d3.csv(props.dataFile, d3.autoType).then((fileData) => {
      let thisData = d3.rollup(fileData as dataRow[], v => v.length, d => d.category) as Map<string, number>
      let arrData: aggData[]  = []
      thisData.forEach((value, key) => {
        arrData.push({category:key, count: value})
      })
      setData(arrData)
    });
  }, [props.dataFile]);

  useEffect(() => {
    console.log('data updated: ', data)
  }, [data])

  return (
    <div >
      <DonutChart
        className="mt-6"
        data={data? data : []}
        category="count"
        index="category"
        // colors={['cyan', 'blue', 'slate']}
        colors={['blue', 'blue', 'blue']}
        shades={[100, 500, 900]}
      />
    </div>
  )
};