import React from 'react'
import ReactDOM from "react-dom"
import { ModalState } from './FollowsActivityTable_tanstack';
import { HeartIcon, ChatBubbleBottomCenterIcon, ArrowPathRoundedSquareIcon} from '@heroicons/react/24/outline'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  // backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000,
  borderRadius: '20px',
  borderColor: '#FFF'
} as React.CSSProperties;

const OVERLAY_STYLES = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000
} as React.CSSProperties;

type Props = {
  open: ModalState,
  closeModal: () => void
}

export default function PostsModal(props: Props) {
  if (!props.open.show) return null
  const handle = props.open.row?.cell.row.original.handle
  const content = props.open.row?.cell.row.original.lastPostContent 
  const likes = props.open.row?.cell.row.original.lastPostLikes || '0'
  const replies = props.open.row?.cell.row.original.lastPostLikes || '0'
  const reposts = props.open.row?.cell.row.original.lastPostReposts || '0'
  return ReactDOM.createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={props.closeModal} />
      <div style={MODAL_STYLES} className="bg-tremor-background dark:bg-dark-tremor-background">
        {handle}
        <br></br>
        {content}
        <br></br>
        <div style={{whiteSpace: 'pre-wrap'}}>
          <HeartIcon className="h-5 w-5 inline"/>{likes}
          {' '}{' '}
          <ChatBubbleBottomCenterIcon className="h-5 w-5 inline"/>{replies}
          {' '}{' '}
          <ArrowPathRoundedSquareIcon className="h-5 w-5 inline"/>{reposts}
        </div>
      </div>
    </>,
    document.getElementById('portal')!
  )
}
