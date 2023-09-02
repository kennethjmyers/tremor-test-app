import React from 'react'
import ReactDOM from "react-dom"
import { ModalState } from './FollowsActivityTable_tanstack';

type Props = {
  open: ModalState,
  closeModal: () => void
}

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

export default function PostsModal(props: Props) {
  if (!props.open.show) return null
  return ReactDOM.createPortal(
    <div style={MODAL_STYLES} className="bg-tremor-background dark:bg-dark-tremor-background">
      PostsModal
      <br></br>
      <button onClick={props.closeModal}>Close Modal</button>
    
    </div>,
    document.getElementById('portal')!
  )
}
