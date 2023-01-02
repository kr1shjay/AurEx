// import package
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// import action
import { getNotificationHistory } from '../../actions/dashboardAction';

// import lib
import { dateTimeFormat, momentFormat } from '../../lib/dateTimeHelper';
// Datatable
import DataTable from 'react-data-table-component';
import { getNotification, unReadNotice } from 'actions/notificationAction';

const table_columns = [
  {
    name: 'Date',
    selector: 'createdAt',
    width: '180px',
    cell: (record) => {
      return momentFormat(record.createdAt, 'YYYY-MM-DD HH:mm')
    }
  },
  {
    name: 'Description',
    selector: 'description',
  },
];



const NotificationHistory = () => {
  const { t, i18n } = useTranslation();

  // state
  const [data, setData] = useState([]);
  const [loader, setLoader] = useState(true);

  // function
  const fetchNotificationHistory = async () => {
    try {
      const { status, loading, ReadMsg } = await getNotification();
      setLoader(loading)
      if (status == 'success') {
        setData(ReadMsg)
      }
    } catch (err) { }
  }
  useEffect(() => {
    fetchNotificationHistory()
    // unReadNotice()
  }, [])

  return (
    <div className="table-responsive">
      <DataTable className="history_table" noHeader columns={table_columns} data={data} pagination={true} paginationPerPage="5" paginationRowsPerPageOptions={[5, 10, 15, 20]} />
      {/* <button onClick={()=>{}}>Mark As Read </button> */}
    </div>
  )
}

export default NotificationHistory;