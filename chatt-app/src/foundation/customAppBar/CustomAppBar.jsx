import React from 'react'

// interface CustomAppBarProps{
//   children: any;
// }

const CustomAppBar = ({children}) => {
  return (
    <div style= {{

      flexShrink: 0,          // 👈 prevents layout shifts  
      // width: "100%", 
      height:"63px",
      background:"#1f2c33" ,
      padding:"0px 20px"
    }}> {children}
    </div>
  )
}

export default CustomAppBar