import React from 'react';
import './Channel.css'

const Channel = ({activelink}) => {
     return (
          <div className='channel'>
               <div className="header">
                    <h1>{activelink}</h1>
               </div>
          </div>
     );
}

export default Channel;
