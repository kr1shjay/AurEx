// import package
import React, { useRef } from 'react';

// import component
import CreateApiKey from './CreateApiKey';
import ApiKeyList from './ApiKeyList';

const ApiManagement = () => {
    const createRef = useRef();
    const listRef = useRef();

    // function
    const handleList = (data) => {
        listRef.current.listData(data)
        console.log( listRef.current.listData(data),"keylist")
    }

    return (
        <div className='settingsContent userPages pb-0'>
         <div className="container-fluid">
           
            <div class="dashboard_box launchpad_box">
            <CreateApiKey
                ref={createRef}
                handleList={handleList}
            />
            </div>

            <div class="dashboard_box launchpad_box">
            <ApiKeyList
                ref={listRef}
            />
            </div>
            </div>
            </div>
           
    )
}

export default ApiManagement;