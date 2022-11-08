import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useSelector } from 'react-redux'

// import lib
import config from '../../config';
import { widget } from './charting_library/charting_library.min';
import isEmpty from "lib/isEmpty";
const chartUrl = config.API_URL;
// const chartUrl = 'https://api.paradaks.com:2053/'

const Chart = (props) => {
    // state
    const [theme, setTheme] = useState('Dark');
    const [pair, setPair] = useState('')
    const tvWidget = null;

    // redux state 
    const tradePair = useSelector(state => state.tradePair)
    const themeData = useSelector(state => state.theme)

    // function
    const getLanguageFromURL = () => {
        const regex = new RegExp('[\\?&]lang=([^&#]*)');
        const results = regex.exec(window.location.search);
        return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
    }

    const buildchart = (theme, pair) => {
        const widgetOptions = {
            symbol: pair,
            // BEWARE: no trailing slash is expected in feed URL
            datafeed: new window.Datafeeds.UDFCompatibleDatafeed(props.datafeedUrl),
            interval: props.interval,
            container_id: props.containerId,
            library_path: props.libraryPath,

            locale: getLanguageFromURL() || 'en',
            disabled_features: ['use_localstorage_for_settings'],
            enabled_features: ['study_templates'],
            charts_storage_url: props.chartsStorageUrl,
            charts_storage_api_version: props.chartsStorageApiVersion,
            client_id: props.clientId,
            user_id: props.userId,
            fullscreen: props.fullscreen,
            autosize: props.autosize,
            studies_overrides: props.studiesOverrides,
            loading_screen: { backgroundColor: "#fff" },
            theme: theme,
            toolbar_bg: "#fff",
            overrides: {
                // "symbolWatermarkProperties.color": "#000657",
                "paneProperties.background": "#fff",
                "paneProperties.vertGridProperties.color": "transparent",
                "paneProperties.horzGridProperties.color": "transparent"
            },
        };

        if (theme == "White") {
            delete widgetOptions.toolbar_bg;
            delete widgetOptions.overrides;
        }

        const tvWidget = new widget(widgetOptions);

        tvWidget.onChartReady(() => {
            tvWidget.headerReady().then(() => {
                const button = tvWidget.createButton();
                button.setAttribute('title', 'Click to show a notification popup');
                button.classList.add('apply-common-tooltip');
                button.addEventListener('click', () => tvWidget.showNoticeDialog({
                    title: 'Notification',
                    body: 'TradingView Charting Library API works correctly',
                    callback: () => {
                    },
                }));

                button.innerHTML = 'Check API';
            });
        });
    }

    useEffect(() => {
        if (tvWidget !== null) {
            tvWidget.remove();
            tvWidget = null;
        }
    }, [])

    useEffect(() => {
        if (!isEmpty(tradePair) /* && !isEmpty(themeData) */) {
            let pairData = tradePair.firstCurrencySymbol + tradePair.secondCurrencySymbol;
            let themeValue = 'Dark';

            if (themeData == 'light') {
                themeValue = 'White'
            } else if (themeData == 'dark') {
                themeValue = 'Dark'
            }

            if ((isEmpty(pair) && pair != pairData)) {
                setPair(pairData)
                setTheme(themeValue)
                buildchart(themeValue, pairData);
            }
        }
    }, [tradePair, themeData])

    return (
        <div
            id={props.containerId}
            className={'chartcontainer'}
        />
    )
}

Chart.propTypes = {
    symbol: PropTypes.string.isRequired,
    interval: PropTypes.string.isRequired,
    containerId: PropTypes.string.isRequired,
    datafeedUrl: PropTypes.string.isRequired,
    libraryPath: PropTypes.string.isRequired,
    chartsStorageUrl: PropTypes.string.isRequired,
    chartsStorageApiVersion: PropTypes.string.isRequired,
    clientId: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    fullscreen: PropTypes.string.isRequired,
    autosize: PropTypes.string.isRequired,
    studiesOverrides: PropTypes.string.isRequired,
    theme: PropTypes.string.isRequired,
    pair: PropTypes.string.isRequired,
};

Chart.defaultProps = {
    symbol: 'BTCUSD',
    interval: '5',
    containerId: 'tv_chart_container',
    datafeedUrl: chartUrl + "/api/chart",
    // datafeedUrl: chartUrl + "cryptoapi/chart",
    libraryPath: '/charting_library/', //live
    chartsStorageUrl: 'https://saveload.tradingview.com',
    chartsStorageApiVersion: '1.1',
    clientId: 'tradingview.com',
    userId: 'public_user_id',
    fullscreen: false,
    autosize: true,
    studiesOverrides: {},
};

export default Chart;