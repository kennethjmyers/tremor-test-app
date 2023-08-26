import { useEffect, useRef } from 'react';
// Importing the CalHeatmap library and its CSS
import CalHeatmap from 'cal-heatmap';
import Tooltip from 'cal-heatmap/plugins/Tooltip';
import Legend from 'cal-heatmap/plugins/Legend';
import 'cal-heatmap/cal-heatmap.css';

type Props = {
  dataFile: string,
  startDate: Date,
  monthsRange: number
}

export default function DailyPosts(props: Props) {
    // useRef hook to create a reference to the DOM element that will contain the heatmap
    const calHeatmapRef = useRef(null);
    
    // useEffect hook to run code after the component is mounted
    useEffect(() => {
    // Check if the ref is defined
    // @ts-ignore is used to bypass TypeScript checks for CalHeatmap
    // Instantiate CalHeatmap
    const cal = new CalHeatmap();
    // Paint the heatmap with the given options
    cal.paint({
      itemSelector: calHeatmapRef.current,
      // Add other options as needed
      data: {
        source: '/data/post_history.csv',
        type: 'csv',
        x: 'date',
        y: d => +d['uri'],
        groupY: 'count',
      },
      date: { start: props.startDate },
      range: props.monthsRange,
      scale: {
        color: {
          type: 'linear',
          scheme: 'Blues',
          domain: [0, 75],
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
              (value ? value + 'posts' : 'No data') +
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
          itemSelector: '#cal-heatmap-legend',
          label: 'Post Count',
        },
      ],
    ]
  );
  }, []);

  return (
    <div style={{ display: 'inline-block' }}>
      {/* Reference to the div element where the heatmap will be rendered */}
      <div ref={calHeatmapRef} id="cal-heatmap"></div>
      <div id="cal-heatmap-legend" style={{ float: 'right' }}></div>
    </div>
  )
}