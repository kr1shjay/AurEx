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
        <div className="container pt-5">
            <CreateApiKey
                ref={createRef}
                handleList={handleList}
            />
            <ApiKeyList
                ref={listRef}
            />
        </div>
    )
}

export default ApiManagement;