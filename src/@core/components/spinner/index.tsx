// ** MUI Imports
import Box, { BoxProps } from '@mui/material/Box'
import Logo from 'src/layouts/components/logo/Logo'

const FallbackSpinner = ({ sx }: { sx?: BoxProps['sx'] }) => {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        ...sx
      }}
    >
      <Logo size={120} animated />
    </Box>
  )
}

export default FallbackSpinner
