import React, { useState } from "react";
import ReactDOM from "react-dom";
import SpotTradeLayout from "./SpotTradeLayout";

import './styles.css';
import './example-styles.css';

const SpotTrade = () => {
    const [layout, setLayout] = useState([])

    const onLayoutChange = (layout) => {
        setLayout(layout);
    }

    return (
        <div>
            
            <SpotTradeLayout onLayoutChange={onLayoutChange} />
        </div>
    );
}

export default SpotTrade;