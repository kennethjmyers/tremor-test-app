'use client';
import React from 'react';
// import process from 'process';
import { Card, Grid, Col, TabGroup, TabList, Tab, TabPanels, TabPanel } from "@tremor/react";
import PostsCard from '../tabCards/PostsCard';
import FollowsActivityTable from '../tables/FollowsActivityTable_tanstack';

function dateDiffInDays(a: Date, b: Date): number {
  const _MS_PER_DAY = 1000 * 60 * 60 * 24;
  // Discard the time and time-zone information.
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}

export default function Home() {
  const userName: string = 'kennygesserit.bsky.social'
  const userPostHistoryFile: string = '/data/post_history.csv'
  const FollowsActivityFile: string = '/data/follows.csv'
  const startDate: Date = new Date('2023-05-01')
  const daysLookback: number = dateDiffInDays(startDate, new Date())
  const monthsRange: number = Math.floor(daysLookback/30)+1

  // JSX to render the component
  return (
    <div className="sm:p-10">
      <TabGroup>
        <TabList className="mt-8">
          <Tab>Post Data</Tab>
          <Tab>Follows Data</Tab>
        </TabList>
        <TabPanels>
        {/* <TabPanel>
            <Card className='mt-4'>
              <Grid numItems={1} numItemsSm={2} numItemsMd={2} numItemsLg={4} className="gap-2">
                <Col numColSpan={4} numColSpanSm={2} numColSpanMd={2} numColSpanLg={4} className="gap-2">
                  <FollowsActivityTable dataFile={FollowsActivityFile}/>
                </Col>
              </Grid>
            </Card>
          </TabPanel> */}
          <TabPanel>
            <PostsCard userName={userName} userPostHistoryFile={userPostHistoryFile} startDate={startDate} monthsRange={monthsRange} />
          </TabPanel>
          
        </TabPanels>
      </TabGroup>
    </div>
  );
}
