import React, { useState } from "react";
import ReactDOM from "react-dom";
import DerivativeTradeLayout from "./DerivativeTradeLayout";

import './styles.css';
import './example-styles.css';

const DerivativeTrade = () => {
    const [layout, setLayout] = useState([])

    const onLayoutChange = (layout) => {
        setLayout(layout);
    }

    return (
        <div>
            
            <DerivativeTradeLayout onLayoutChange={onLayoutChange} />
        </div>
    );
}

export default DerivativeTrade;