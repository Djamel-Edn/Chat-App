import React from 'react'

const ChatIcon = ({fill}) => {
  return (
<svg width="60px" height="60px" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg">
 <g>
  <path fill={fill|| "white"} d="m925 475h-350c-42.5 0-75 32.5-75 75v200c0 40 32.5 75 75 75h250l100 100v-100c42.5 0 75-35 75-75v-200c0-42.5-32.5-75-75-75z"/>
  <path fill={fill|| "white"} d="m625 300h-350c-42.5 0-75 32.5-75 75v200c0 40 32.5 75 75 75v100l100-100h75v-100c0-70 55-125 125-125h125v-50c0-42.5-32.5-75-75-75z"/>
 </g>
</svg>
  )
}

export default ChatIcon
