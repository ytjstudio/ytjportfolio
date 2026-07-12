import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let raf = 0; let mx = window.innerWidth / 2; let my = window.innerHeight / 2; let rx = mx; let ry = my
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; if (dotRef.current) dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)` }
    const onOver = (e: MouseEvent) => { const target = e.target as HTMLElement; const interactive = target.closest('a, button, input, textarea, select, [data-cursor="hover"]'); if (ringRef.current) ringRef.current.classList.toggle('hover', !!interactive) }
    const loop = () => { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`; raf = requestAnimationFrame(loop) }
    window.addEventListener('mousemove', onMove); window.addEventListener('mouseover', onOver); raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseover', onOver); cancelAnimationFrame(raf) }
  }, [])
  return (<><div ref={ringRef} className="custom-cursor" aria-hidden /><div ref={dotRef} className="custom-cursor-dot" aria-hidden /></>)
}