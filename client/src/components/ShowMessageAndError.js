import React from "react";

const ShowMessageAndError = ({state}) => {
    return(
        <>
        {state.message && 
            <div>
                {state.message}
            </div>
        }

        {state.error && 
        <div>
            {state.error}
        </div>
        }
        </>
    )
};


export default ShowMessageAndError;