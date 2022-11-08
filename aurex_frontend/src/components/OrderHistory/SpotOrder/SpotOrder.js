// import package
import React, { useState, Fragment } from 'react';
import PropTypes from "prop-types";
import { useTranslation } from 'react-i18next';
// import component
import OpenOrder from './OpenOrder';
import TradeOrder from './TradeOrder'

const SpotOrder = (props) => {
    // props
    const { filter } = props;
    const { t, i18n } = useTranslation();
    // state
    const [orderType, setOrderType] = useState('open')

    return (
        <Fragment>
            <div className="order_header_">
                <div className="d-flex">
                    <div className="ceckbox_section">
                        <div class="custom-control custom-radio">
                            <input
                                type="radio"
                                id="customRadio1"
                                name="customRadio"
                                class="custom-control-input"
                                checked={orderType == 'open'}
                                onClick={() => setOrderType('open')}
                            />
                            <label class="custom-control-label" for="customRadio1"><span>{t('OPEN_ORDER')}</span></label>
                        </div>
                    </div>
                    <div className="ceckbox_section">
                        <div class="custom-control custom-radio">
                            <input
                                type="radio"
                                id="customRadio2"
                                name="customRadio"
                                class="custom-control-input"
                                checked={orderType == 'trade'}
                                onClick={() => setOrderType('trade')}
                            />
                            <label class="custom-control-label" for="customRadio2"><span>{t('TRADE_HISTORY')}</span></label>
                        </div>
                    </div>
                </div>
            </div>
            {
                orderType == 'open' && <OpenOrder filter={filter} />
            }

            {
                orderType == 'trade' && <TradeOrder filter={filter} />
            }
        </Fragment>
    )
}

SpotOrder.propTypes = {
    filter: PropTypes.shape({
        pairList: PropTypes.array,
        orderTypes: PropTypes.array
    }),
};

SpotOrder.defaultProps = {
    filter: {
        pairList: [],
        orderTypes: []
    },
};

export default SpotOrder;