import { useEffect, useRef } from 'react'
import { useTheme } from '@mui/material/styles'

export default function Logo({
  animated = false,
  size = 40,
  time = '4s'
}: {
  animated?: boolean
  size?: number
  time?: string
}) {
  const rotatingGearRef = useRef<SVGGElement | null>(null)

  const theme = useTheme()

  useEffect(() => {
    if (animated) {
      if (rotatingGearRef.current) {
        rotatingGearRef.current.classList.add('rotating-gear')
      }
    }
  }, [animated])

  const gearStyle = {
    transformOrigin: '50% 50%',
    animation: animated ? `rotateGear ${time} linear infinite` : 'none'
  }

  return (
    <svg xmlns='http://www.w3.org/2000/svg' width={size} height={size} viewBox='0 0 24 24'>
      <style>
        {`
          @keyframes rotateGear {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .rotating-gear path {
            transition: transform 0.2s; // Adicione uma transição suave
          }
        `}
      </style>
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2'>
        <path color={theme.palette.primary.dark} fill={theme.palette.primary.dark} d='M10 9v6l5-3z' />
        <g ref={rotatingGearRef} style={gearStyle}>
          <path
            color={theme.palette.primary.main}
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065z'
          />
        </g>
      </g>
    </svg>
  )
}
