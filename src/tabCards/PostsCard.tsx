import { Card, Title, Flex, Grid, Col } from "@tremor/react";
import PostCalHeatMap from '../plots/PostCalHeatMap';
import PostTimeHeatMap from '../plots/PostTimeHeatMap';
import PostLinePlot from '../plots/PostLinePlot';
import PostMetrics from '../plots/PostMetrics';
import PostDonut from '../plots/PostDonut';

type Props = {
  userName: string, 
  userPostHistoryFile: string, 
  startDate: Date, 
  monthsRange: number
}

export default function PostsCard (props: Props) {
  const {userName, userPostHistoryFile, startDate, monthsRange}  = props
  // const username = props.username
  // const userPostHistoryFile = props.userPostHistoryFile

  return (
    <div>
      <Card>
        <Grid numItems={1} numItemsSm={2} numItemsMd={2} numItemsLg={4} className="gap-2">
          <Col numColSpan={1} numColSpanSm={2} numColSpanMd={2} numColSpanLg={2} className="gap-2">
            <Title>{userName}</Title>
            <PostMetrics dataFile={userPostHistoryFile} />
            <PostDonut dataFile={userPostHistoryFile} />
            <Flex className="mt-4">
              <PostLinePlot dataFile={userPostHistoryFile} />
            </Flex>
          </Col>
          <Col numColSpan={1} numColSpanSm={2} numColSpanMd={2} numColSpanLg={2}>
            <Flex justifyContent="center" className="mt-4">
              <PostCalHeatMap
            dataFile={userPostHistoryFile} startDate={startDate} monthsRange={monthsRange}/>
            </Flex>
            <Flex className='mt-4'>
              <PostTimeHeatMap dataFile={userPostHistoryFile} />
            </Flex>
          </Col>
        </Grid>
      </Card>
    </div>
  )
}