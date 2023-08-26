import { Card, Title, DonutChart } from "@tremor/react";
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import colors from 'tailwindcss/colors'


const valueFormatter = (number: number) => `$ ${Intl.NumberFormat("us").format(number).toString()}`;

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
    console.log('here', data)
  }, [data])

  return (
    <Card >
      <DonutChart
        className="mt-6"
        data={data? data : []}
        category="count"
        index="category"
        // valueFormatter={valueFormatter}
        colors={['cyan', 'blue', 'slate']}
      />
    </Card>
  )
};