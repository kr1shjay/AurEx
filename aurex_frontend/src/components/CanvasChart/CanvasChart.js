// import package
import React from 'react';

// import component
import DoughnutChart from './DoughnutChart';

const CanvasChart = (props) => {
    // props
    const { chartType } = props;

    return (
        <>
            {
                chartType == 'doughnut' && <DoughnutChart {...props} />
            }
        </>
    )
}

export default CanvasChart;