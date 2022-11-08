// import package
import React from 'react';

// import lib
import CanvasJSReact from './canvasjs.react';

// import ChartPlaceHolder from '../../images/ChartPlaceHolder.png';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const DoughnutChart = (props) => {
    // props
    const { dataPts } = props;

    const options = {
        animationEnabled: true,
        backgroundColor: "transparent",
        // colorSet: "customColorSet1",
        data: [{
            type: "doughnut",
            // showInLegend: true,
            indexLabel: "{label}: {y}",
            yValueFormatString: "#,###''",
            dataPoints: dataPts,
            indexLabel: "{null}",
            indexLabelFontColor: "white",
            indexLabelLineColor: "white",
        }]
    }

    return (

        <CanvasJSChart options={options} />

    );
}

export default DoughnutChart;