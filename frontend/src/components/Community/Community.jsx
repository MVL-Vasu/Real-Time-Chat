import React from 'react';
import './Community.css'

const Community = ({activelink}) => {
     return (
          <div className='community' >
               <div className="header">
                    <h1>{activelink}</h1>
               </div>
          </div>
     );
}

export default Community;
