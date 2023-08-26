'use client';
import React from 'react';
// import process from 'process';
import { Card, Text, Title, Metric, Flex, ProgressBar, Grid, Col } from "@tremor/react";
import PostCalHeatMap from '../plots/postCalHeatMap';
import PostTimeHeatMap from '../plots/postTimeHeatMap';
import PostLinePlot from '../plots/postLinePlot';
import PostMetrics from '../plots/postMetrics';


export default function Home() {
  const userName: string = 'kennygesserit.bsky.social'
  const dataFile: string = '/data/post_history.csv'
  const startDate: Date = new Date('2023-05-15')
  const daysLookback: number = 90
  const monthsRange: number = Math.floor(daysLookback/30)+1

  // JSX to render the component
  return (
    <div className="sm:p-10">
      <Grid numItems={1} numItemsSm={2} numItemsMd={2} numItemsLg={4} className="gap-2">
        <Col numColSpan={1} numColSpanSm={2} numColSpanMd={2} numColSpanLg={2} className="gap-2">
          <Card>
            <Title>{userName}</Title>
            <PostMetrics dataFile={dataFile} />
            <Card className="mt-4">
              <Flex >
                <PostLinePlot dataFile={dataFile} />
              </Flex>
            </Card>
            <Flex justifyContent="center" className="mt-4">
              <PostCalHeatMap
             dataFile={dataFile} startDate={startDate} monthsRange={monthsRange}/>
            </Flex>
          </Card>
        </Col>
        <Col numColSpan={1} numColSpanSm={2} numColSpanMd={2} numColSpanLg={2}>
          <Card>
            <Flex className='mt-4'>
              <PostTimeHeatMap dataFile={dataFile} />
            </Flex>
          </Card>
        </Col>
        {/* <Col numColSpan={1} numColSpanLg={1}>
        </Col> */}
      </Grid>
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
