// ** Next Import
import Link from 'next/link'

// ** MUI Imports
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

const StyledCompanyName = styled(Link)(({ theme }) => ({
  fontWeight: 500,
  textDecoration: 'none',
  color: `${theme.palette.primary.main} !important`
}))

const FooterContent = () => {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'end' }}>
      <Typography sx={{ mr: 2, display: 'flex', color: 'text.secondary' }}>
        {`© ${new Date().getFullYear()}, Feito por `}
        <Typography
          sx={{ ml: 1 }}
          target='_blank'
          href='https://www.linkedin.com/in/anthero-vieira-neto-aa7a6b8a/'
          component={StyledCompanyName}
        >
          Anthero Vieira Neto
        </Typography>
      </Typography>
    </Box>
  )
}

export default FooterContent
