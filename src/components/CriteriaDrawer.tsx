'use client'

import { useEffect, useRef, type ReactNode, type RefObject } from 'react'
import styles from './CriteriaDrawer.module.css'

export default function CriteriaDrawer({ children, onClose, returnFocusRef }: { children: ReactNode; onClose: () => void; returnFocusRef: RefObject<HTMLButtonElement | null> }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    const dialog = dialogRef.current!
    const opener = returnFocusRef.current
    const scrollY = window.scrollY
    const body = document.body
    const previous = { position: body.style.position, top: body.style.top, width: body.style.width, overflow: body.style.overflow }
    // Fixed positioning also locks the document on mobile Safari.
    body.style.position = 'fixed'
    body.style.top = `-${scrollY}px`
    body.style.width = '100%'
    body.style.overflow = 'hidden'
    try {
      dialog.showModal()
    } catch (error) {
      Object.assign(body.style, previous)
      window.scrollTo(0, scrollY)
      throw error
    }
    return () => {
      dialog.close()
      Object.assign(body.style, previous)
      window.scrollTo(0, scrollY)
      opener?.focus({ preventScroll: true })
    }
  }, [returnFocusRef])
  return <dialog ref={dialogRef} className={styles.drawer} aria-labelledby="criteria-title"
    onCancel={event => { event.preventDefault(); onClose() }}
    onClick={event => {
      if (event.target !== event.currentTarget) return
      const rect = event.currentTarget.getBoundingClientRect()
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) onClose()
    }}>
    <div className={styles.heading}>
      <h2 id="criteria-title">Criteria</h2>
      <button type="button" className="henka-button" onClick={onClose}>Close</button>
    </div>
    <div className={styles.content}>{children}</div>
    <div className={styles.footer}><button type="button" className="henka-button" onClick={onClose}>Show results</button></div>
  </dialog>
}
