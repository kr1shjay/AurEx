import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";


import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";


// import components
import OrderPlace from './OrderPlace';
import MarketPrice from "./MarketPrice";
import OrderBook from './OrderBook';
import UserOrderList from './UserOrderList';
import PairList from './PairList';
import Chart from './Chart'
import RecentTrade from './RecentTrade'

import './styles.css';
import './example-styles.css';

const ResponsiveReactGridLayout = WidthProvider(Responsive);


const ShowcaseDerivativeLayout = (props) => {

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };
  const [currentBreakpoint, setCurrentBreakpoint] = useState('lg')
  const [compactType, setCompactType] = useState('vertical')
  const [mounted, setMounted] = useState(false)
  const [layouts, setLayouts] = useState({
    lg: props.initialLayout
  })

  // function

  const generateDOM = () => {
    return _.map(layouts.lg, function (l, i) {
      return (
        <div key={i} className={l.static ? "static" : ""}>
          {l.static ? (
            <span
              className="text"
              title="This item is static and cannot be removed or resized."
            >
              Static - {i}
            </span>
          ) : (
            <span className="text">{i}</span>
          )}
        </div>
      );
    });
  }

  const onBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint)
  }
  const onLayoutChange = (layout, layouts) => {
    props.onLayoutChange(layout, layouts);
  }
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="derivativeTrade">
      <ResponsiveReactGridLayout
        {...props}
        layouts={layouts}
        onBreakpointChange={onBreakpointChange}
        measureBeforeMount={false}
        useCSSTransforms={mounted}
        compactType={compactType}
        preventCollision={!compactType}
      >
        <div key={0} className="static">
          <div className="header-overview">
            <PairList />
            <MarketPrice />
          </div>
        </div>
        <div key={1}>
          <OrderPlace />
        </div>
        <div key={2}>
          <div className="tradeChart">
            <Chart />
          </div>
        </div>

        <div key={3}>
          <OrderBook />
        </div>
        <div key={6}>
          <RecentTrade />
        </div>
        <div key={4}>
          <UserOrderList />
        </div>
      </ResponsiveReactGridLayout>
    </div>
  );

}

ShowcaseDerivativeLayout.propTypes = {
  onLayoutChange: PropTypes.func.isRequired
};

ShowcaseDerivativeLayout.defaultProps = {
  className: "layout",
  rowHeight: 30,
  onLayoutChange: function () { },
  cols: { lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 },
  initialLayout: [{
    x: 0,
    y: 0,
    w: 9,
    h: 2,
    i: "0",
    name: 'marketPrice',
    static: true,
  },
  {
    x: 9,
    y: 0,
    w: 3,
    h: 21,
    i: "1",
    name: 'placeOrder',
    static: true,
  },
  {
    x: 0,
    y: 2,
    w: 6,
    h: 13,
    i: "2",
    name: 'chart',
    static: true,
  },
  {
    x: 6,
    y: 2,
    w: 3,
    h: 7,
    i: "3",
    name: 'orderBook',
    static: true,
  },
  {
    x: 6,
    y: 2,
    w: 3,
    h: 6,
    i: "6",
    name: 'Recent Trade',
    static: true,
  },
  {
    x: 0,
    y: 10,
    w: 9,
    h: 6,
    i: "4",
    name: 'tradeHistory',
    static: false,
  }
  ]
};


export default ShowcaseDerivativeLayout;