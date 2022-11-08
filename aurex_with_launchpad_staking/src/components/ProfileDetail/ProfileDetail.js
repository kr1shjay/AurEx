// import package
import React, { useRef } from 'react';

// import component
import ViewDetail from './ViewDetail';
import EditDetail from './EditDetail';


const ProfileDetail = () => {
    const viewRef = useRef();
    const editRef = useRef();

    // function
    const handleEditForm = (data) => {
        editRef.current.editForm(data)
    }

    return (
        <div className="dashboard_box p-0 border-none">
            <ViewDetail
                ref={viewRef}
                handleEditForm={handleEditForm}
            />
            <br />
            <EditDetail
                ref={editRef}
            />
        </div>
    )
}

export default ProfileDetail;