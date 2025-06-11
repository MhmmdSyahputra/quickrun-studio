export const scrollStyles1: React.CSSProperties & {
  '&::-webkit-scrollbar'?: React.CSSProperties
  '&::-webkit-scrollbar-track'?: React.CSSProperties
  '&::-webkit-scrollbar-thumb'?: React.CSSProperties
  '&::-webkit-scrollbar-thumb:hover'?: React.CSSProperties
} = {
  flex: 1,
  overflowY: 'auto',
  height: 'calc(90vh - 15rem)',
  paddingRight: '8px',
  marginRight: '-8px',
  paddingBottom: '25px',
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(180deg, #4e54c8, #8f94fb)',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'linear-gradient(180deg, #3b3fbb, #7a80f7)'
  }
}

export const scrollStyles2: React.CSSProperties & {
  '&::-webkit-scrollbar'?: React.CSSProperties
  '&::-webkit-scrollbar-track'?: React.CSSProperties
  '&::-webkit-scrollbar-thumb'?: React.CSSProperties
  '&::-webkit-scrollbar-thumb:hover'?: React.CSSProperties
} = {
  flex: 1,
  overflowY: 'auto',
  height: '100%',
  maxHeight: 'calc(100vh - 16rem)',
  paddingRight: '12px',
  marginRight: '-12px',
  paddingBottom: '12px',
  scrollbarWidth: 'thin',
  scrollbarGutter: 'stable',
  scrollBehavior: 'smooth',
  '&::-webkit-scrollbar': {
    width: '8px'
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: '#f9f9f9',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'linear-gradient(180deg, #43cea2, #185a9d)',
    borderRadius: '10px'
  },
  '&::-webkit-scrollbar-thumb:hover': {
    background: 'linear-gradient(180deg, #2aa987, #154b82)'
  }
}
