// Originally I wrote the table using tremors built in tables
// These looked nice but they did not offer virtualization and loaded all of the data
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
  Badge,
} from "@tremor/react";
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

type Props = {
  dataFile: string
}

type dataRow = {
  did: string,
  handle: string,
  displayName: string,
  avatar: string,
  followedDt: string,
  lastPostUri: string,
  lastPostDt: string
}

export default function FollowsActivityTable (props: Props) {
  const [data, setData] = useState<dataRow[]>();

  useEffect(() => {
    d3.csv(props.dataFile, d3.autoType).then((fileData) => {
      setData(fileData as dataRow[])
    });
  }, [props.dataFile]);

  useEffect(() => {
    console.log('data updated: ', data)
  }, [data])

  return (
    <div >
      <Table className="mt-5">
      <TableHead>
        <TableRow>
          <TableHeaderCell></TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Handle</TableHeaderCell>
          <TableHeaderCell>Followed Date</TableHeaderCell>
          <TableHeaderCell>Last Post Date</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {data ? data.map((item) => (
          <TableRow key={item.displayName}>
            <TableCell><Image src={item.avatar??''} alt={'Profile picture for '+item.displayName} width={50} height={50}/></TableCell>
            <TableCell>
              <Text>{item.displayName}</Text>
            </TableCell>
            <TableCell>
              <Text>{item.handle}</Text>
            </TableCell>
            <TableCell>
              <Text>{item.followedDt}</Text>
            </TableCell>
            <TableCell>
              <Text>{item.lastPostDt}</Text>
            </TableCell>
          </TableRow>
        )) : [] }
      </TableBody>
    </Table>
    </div>
  )
}