import React from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionList, Card } from '@tremor/react'
import './acknowledgements.css'
import acknowledgements from './acknowledgements.json'
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'


interface acknowledgement {
  name: string
  link: string
  context: string
}

const acks = acknowledgements as acknowledgement[]

export default function Acknowledgements() {
  return (
    <div>
      <Card>
        <AccordionList>
          {acks.map((ack) => {
            return (
            <Accordion key={ack.name}>
              <AccordionHeader className='ack-li'><a href={ack.link}>{ack.name} <ArrowTopRightOnSquareIcon className="h-4 w-4 inline" /></a></AccordionHeader>
              <AccordionBody>{ack.context}</AccordionBody>
            </Accordion>)
          })}
        </AccordionList>
      </Card>
    </div>
  )
}
