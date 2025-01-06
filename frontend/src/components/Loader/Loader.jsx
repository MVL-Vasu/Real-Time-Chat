import React from 'react';
import { RotatingLines } from "react-loader-spinner";


const Loader = () => {

     const styles = {
          loader: {
               position: 'fixed',
               top: '0',
               left: '0',
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               width: '100%',
               height: '100%',
               background: 'rgba(0,0,0,.5    )',
               // background: 'rgba(255,255,255,.7)',
               zIndex: '999999',
          }
     }

     return (

          <div style={styles.loader}>
               <RotatingLines
                    strokeColor=" rgb(57, 212, 255)"
                    strokeWidth="5"
                    animationDuration="0.90"
                    width="110"
                    visible={true}
               />
          </div>

     );

}

export default Loader;
