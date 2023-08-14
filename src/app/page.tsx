'use client';
import Image from 'next/image'
import React, { useEffect, useRef } from 'react';
import process from 'process';
import { Card, Text, Metric, Flex, ProgressBar } from "@tremor/react";

console.log(process.env)

// Importing the CalHeatmap library and its CSS
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import Legend from 'cal-heatmap/plugins/Legend';
import 'cal-heatmap/cal-heatmap.css';

export default function Home() {
  // useRef hook to create a reference to the DOM element that will contain the heatmap
  const calHeatmapRef = useRef(null);

  // useEffect hook to run code after the component is mounted
  useEffect(() => {
    // Check if the ref is defined
    if (calHeatmapRef.current) {
      // @ts-ignore is used to bypass TypeScript checks for CalHeatmap
      // Instantiate CalHeatmap
      const cal = new CalHeatmap();
      // Paint the heatmap with the given options
      cal.paint({
        itemSelector: calHeatmapRef.current,
        // Add other options as needed
        data: {
          source: '/data/seattle-weather.csv',
          type: 'csv',
          x: 'date',
          y: d => +d['wind'],
          groupY: 'max',
        },
        date: { start: new Date('2012-01-01') },
        range: 8,
        scale: {
          color: {
            type: 'quantize',
            scheme: 'Oranges',
            domain: [0, 1, 2, 3, 4, 5, 6, 7],
          },
        },
        domain: {
          type: 'month',
        },
        subDomain: { type: 'day', radius: 2 },
      },
      [
        [
          Tooltip,
          {
            text: function (date, value, dayjsDate) {
              return (
                (value ? value + 'km/h' : 'No data') +
                ' on ' +
                dayjsDate.format('LL')
              );
            },
          },
        ],
        [
          Legend,
          {
            tickSize: 0,
            width: 100,
            itemSelector: '#ex-wind-legend',
            label: 'Seattle wind (km/h)',
          },
        ],
      ]
    );
  }
  }, []);

  // JSX to render the component
  return (
    <div>
      <Card>
        <Flex className="mt-4">
          {/* Reference to the div element where the heatmap will be rendered */}
          <div ref={calHeatmapRef} id="cal-heatmap"></div>
          <div id="ex-wind-legend" style={{ float: 'right' }}></div>
        </Flex>
      </Card>
    </div>
  );
  // return (
  //   <main className="flex min-h-screen flex-col items-center justify-between p-24">
  //     <script>
  //       render(
  //         <div style={{ display: 'inline-block' }}>
  //           <div id="ex-wind"></div>
  //           <a
  //             className="button button--sm button--secondary margin-top--sm"
  //             href="#"
  //             onClick={e => {
  //               e.preventDefault();
  //               cal.previous();
  //             }}
  //           >
  //             ← Previous
  //           </a>
  //           <a
  //             className="button button--sm button--secondary margin-left--xs margin-top--sm"
  //             href="#"
  //             onClick={e => {
  //               e.preventDefault();
  //               cal.next();
  //             }}
  //           >
  //             Next →
  //           </a>
  //           <div id="ex-wind-legend" style={{ float: 'right' }}></div>
  //         </div>
  //       );
  //     </script>
  //     <Card className="max-w-xs">
  //       <Flex>
  //         <div>
  //           <Text>Tickets sold</Text>
  //           <Metric>9,876</Metric>
  //         </div>
  //         <div>
  //           <Text>Average Selling Price</Text>
  //           <Metric>$ 175.20</Metric>
  //         </div>
  //       </Flex>
  //     </Card>
  //   </main>
  // )
}
