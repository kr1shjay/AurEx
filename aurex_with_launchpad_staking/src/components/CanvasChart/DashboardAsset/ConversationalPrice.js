import React, { useContext, useState } from 'react';

// import context
import SocketContext from '../Context/SocketContext';

// import lib
import roundOf from '../../lib/roundOf'
import { balanceConvention } from '../../lib/calculation';

const ConversationalPrice = (props) => {
    const socketContext = useContext(SocketContext)

    // state
    const [currencyBalance, setCurrencyBalance] = useState({})

    // props
    const { currencySymbol, price } = props;

    // socket
    socketContext.socket.on('userAssetBalance', data => {
        setCurrencyBalance(data)
    })

    return (
        <small>{roundOf(balanceConvention(price, currencyBalance[currencySymbol]), 4)}</small>
    )
}

export default ConversationalPrice;