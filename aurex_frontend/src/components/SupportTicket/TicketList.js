// import package
import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Accordion } from 'react-bootstrap';

// import component
import ChatList from './ChatList';

// import action
import { getTicketList, replyMessage, closeTicket } from '../../actions/supportAction';

const TicketList = forwardRef((props, ref) => {

    // state
    const [ticketList, setTicketList] = useState([])
    const [sender, setSender] = useState({})
    const [receiver, setReceiver] = useState({})

    // function
    const fetchTicketList = async (reqData) => {
        try {
            const { status, loading, result } = await getTicketList(reqData);
            if (status == 'success') {
                setTicketList(result.ticketList)
                setSender(result.sender)
                setReceiver(result.receiver)
            }
        } catch (err) { }
    }

    useEffect(() => {
        fetchTicketList()
        // setValidateError(replyValidation(formValue))
    }, [])

    useImperativeHandle(
        ref,
        () => ({
            listData() {
                fetchTicketList()
            }
        }),
    )

    return (
        <div className="supporTicketAccordian wow fadeIn">
                {
                    ticketList && ticketList.length > 0 && ticketList.map((item, key) => {
                        return (
                            <ChatList
                                key={key}
                                eventKey={key}
                                ticketRecord={item}
                                sender={sender}
                                receiver={receiver}
                            />
                        )
                    })
                }
        </div>
    )
})

export default TicketList;