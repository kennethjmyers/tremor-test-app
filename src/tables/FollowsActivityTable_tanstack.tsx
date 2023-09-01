// Example copied from tanstack
// import React from 'react'
// import ReactDOM from 'react-dom/client'

import './index.css'

//3 TanStack Libraries!!!
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  Row,
  SortingState,
  useReactTable,
  ColumnSort
} from '@tanstack/react-table'
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from '@tanstack/react-query'
import { useVirtual } from '@tanstack/react-virtual'
import Image from 'next/image'
import { StrictMode, useEffect, useRef, useState, useMemo, useReducer, useCallback } from 'react';
import * as d3 from 'd3';
import RenderIfVisible from 'react-render-if-visible';

const queryClient = new QueryClient()

export default function FollowsActivityTable (props: Props) {
  // DATA
  const [data, setData] = useState<dataRow[]>();

  useEffect(() => {
    d3.csv(props.dataFile, d3.autoType).then((fileData) => {
      setData(fileData as dataRow[])
    });
  }, [props.dataFile]);

  useEffect(() => {
    console.log('data updated: ', data)
  }, [data])

  const ESTIMATED_ITEM_HEIGHT = 1

  return (
    <StrictMode>
      {/* the tremor tabs seem to work by setting height and width to 0 so this prevents rendering while not visible */}
      <RenderIfVisible defaultHeight={ESTIMATED_ITEM_HEIGHT}>
        <QueryClientProvider client={queryClient}>
          { data ? <Example data={data} /> : <p>Loading...</p> }
        </QueryClientProvider>
      </RenderIfVisible>
    </StrictMode>
  )
}

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

export type dataRowApiResponse = {
  data: dataRow[]
  meta: {
    totalRowCount: number
  }
}

const fetchSize = 25

export function Example (props: {data:dataRow[]}) {
  const csvData = props.data

  const fetchData = (
    start: number,
    size: number,
    sorting: SortingState
  ): dataRowApiResponse => {
    const dbData = [...csvData]
    if (sorting.length) {
      const sort = sorting[0] as ColumnSort
      const { id, desc } = sort as { id: keyof dataRow; desc: boolean }
      dbData.sort((a, b) => {
        if (desc) {
          return a[id] < b[id] ? 1 : -1
        }
        return a[id] > b[id] ? 1 : -1
      })
    }
    return {
      data: dbData.slice(start, start + size),
      meta: {
        totalRowCount: dbData.length,
      },
    }
  }

  const rerender = useReducer(() => ({}), {})[1]

  //we need a reference to the scrolling element for logic down below
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<dataRow>[]>(
    () => [
      // Avatars were crashing the server a lot
      // {
      //   // accessorFn: row => row,
      //   id: 'avatar',
      //   cell: ({cell: value}) => (<Image src={value.row.original.avatar??''} alt={'Profile picture for '+value.row.original.displayName} width={50} height={50}/>),
      //   header: () => '',
      // },
      {
        accessorFn: row => row.displayName,
        id: 'displayName',
        cell: info => info.getValue(),
        header: () => <span>Display Name</span>,
      },
      {
        accessorFn: row => row.handle,
        id: 'handle',
        cell: info => info.getValue(),
        header: () => <span>Handle</span>,
      },
      {
        accessorFn: row => row.followedDt,
        id: 'followedDt',
        cell: info => info.getValue(),
        header: () => <span>Followed Date</span>,
      },
      {
        accessorFn: row => row.lastPostDt,
        id: 'lastPostDt',
        cell: info => info.getValue(),
        header: () => <span>Last Post Date</span>,
      },
    ],
    []
  )

  //react-query has an useInfiniteQuery hook just for this situation!
  const { data, fetchNextPage, isFetching, isLoading } =
    useInfiniteQuery<dataRowApiResponse>(
      ['table-data', sorting], //adding sorting state as key causes table to reset and fetch from new beginning upon sort
      async ({ pageParam = 0 }) => {
        const start = pageParam * fetchSize
        const fetchedData = fetchData(start, fetchSize, sorting) //pretend api call
        return fetchedData
      },
      {
        getNextPageParam: (_lastGroup, groups) => groups.length,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
      }
    )

  //we must flatten the array of arrays from the useInfiniteQuery hook
  const flatData = useMemo(
    () => data?.pages?.flatMap(page => page.data) ?? [],
    [data]
  )
  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0
  const totalFetched = flatData.length

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement
        //once the user has scrolled within 300px of the bottom of the table, fetch more data if there is any
        if (
          scrollHeight - scrollTop - clientHeight < 300 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage()
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  )

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current)
  }, [fetchMoreOnBottomReached])

  const table = useReactTable({
    data: flatData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  })

  const { rows } = table.getRowModel()

  //Virtualizing is optional, but might be necessary if we are going to potentially have hundreds or thousands of rows
  const rowVirtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: rows.length,
    overscan: 10,
  })
  const { virtualItems: virtualRows, totalSize } = rowVirtualizer
  const paddingTop = virtualRows.length > 0 ? virtualRows?.[0]?.start || 0 : 0
  const paddingBottom =
    virtualRows.length > 0
      ? totalSize - (virtualRows?.[virtualRows.length - 1]?.end || 0)
      : 0

  if (isLoading) {
    return <>Loading...</>
  }

  return (
    <div>
      <div className="p-2 centering">
      <div className="h-2" />
      <div
        className="container"
        onScroll={e => fetchMoreOnBottomReached(e.target as HTMLDivElement)}
        ref={tableContainerRef}
      >        
        <table>
          <thead className="bg-tremor-background dark:bg-dark-tremor-background">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          {...{
                            className: header.column.getCanSort()
                              ? 'cursor-pointer select-none'
                              : '',
                            onClick: header.column.getToggleSortingHandler(),
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {{
                            asc: ' ▲',
                            desc: ' ▼',
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {paddingTop > 0 && (
              <tr>
                <td style={{ height: `${paddingTop}px` }} />
              </tr>
            )}
            {virtualRows.map(virtualRow => {
              const row = rows[virtualRow.index] as Row<dataRow>
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    return (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
            {paddingBottom > 0 && (
              <tr>
                <td style={{ height: `${paddingBottom}px` }} />
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div>
        Fetched {flatData.length} of {totalDBRowCount} Rows.
      </div>
      {/* This didn't seem to be working (here or on the official site) so I removed it
      <div>
        <button onClick={() => rerender()}>Force Rerender</button>
      </div> */}
      </div>
    </div>
  )
}
