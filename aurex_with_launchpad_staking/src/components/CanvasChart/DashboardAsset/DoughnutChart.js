// import package
import React from 'react';

// import lib
import CanvasJSReact from './canvasjs.react';

import ChartPlaceHolder from '../../images/ChartPlaceHolder.png';

const CanvasJS = CanvasJSReact.CanvasJS;
const CanvasJSChart = CanvasJSReact.CanvasJSChart;

CanvasJS.addColorSet("customColorSet1",
    [//colorSet Array
        "#4661EE",
        "#EC5657",
        // "#1BCDD1",
        // "#8FAABB",
        // "#B08BEB",
        // "#3EA0DD",
        // "#F5A52A",
        // "#23BFAA",
        // "#FAA586",
        // "#EB8CC6",
    ]);

const DoughnutChart = (props) => {
    CanvasJS.addColorSet("customColorSet1", props.chartColor);
    const options = {
        animationEnabled: true,
        backgroundColor: "transparent",
        colorSet: "customColorSet1",

        // title: {
        //     text: "Holding",
        //     verticalAlign: "center",
        // },
        // subtitles: [{
        //     text: "71% Positive",
        //     verticalAlign: "center",
        //     fontSize: 20,
        //     dockInsidePlotArea: true
        // }],
        data: [{
            type: "doughnut",
            // showInLegend: true,
            indexLabel: "{currencySymbol}: {y}",
            yValueFormatString: "#,###'%'",
            dataPoints: props.userAsset,
            indexLabelFontColor: "white",
            indexLabelLineColor: "white",
        }]
    }
    return (
        <div className="col-md-5">
            <div className="dtbLeft text-center">
                <h2 className="text-center mt-3 mb-4">Holding</h2>
                {
                    props.userAsset && props.userAsset.length > 0 && props.userAsset.filter((item) => item.spotwallet > 0).length > 0 ?
                        <CanvasJSChart options={options} /> :
                        <img src={ChartPlaceHolder} />
                }
            </div>
        </div>

    );
}

export default DoughnutChart;