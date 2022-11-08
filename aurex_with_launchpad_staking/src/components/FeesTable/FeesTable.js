// import package
import React, { useState } from 'react';
import clsx from 'classnames'
import { useTranslation } from 'react-i18next';
// import component
import SpotFees from './SpotFees';
import DerivativeFees from './DerivativeFees';
import P2pFees from './P2pFees';

const FeesTable = () => {
    // state
    const [type, setType] = useState('spot')
    const { t, i18n } = useTranslation();
    return (
        <div className="table_p2p_section inprofile cion_table_sectio">
            <div className="d-flex justify-content-between">
                <ul class="nav nav-tabs ">
                    <li class="active"><a
                        className={clsx({ "active": type == 'spot' })}
                        onClick={() => setType('spot')}
                    >{t('SPOT')}</a></li>
                    {/*<li><a
                        className={clsx({ "active": type == 'derivative' })}
                        onClick={() => setType('derivative')}
                    >{t('DERIVATIVE')}</a></li>
                    <li><a
                        className={clsx({ "active": type == 'p2p' })}
                        onClick={() => setType('p2p')}
                    >{t('P2P')}</a></li>*/}
                </ul>
            </div>
            <div class="tab-content">
                {
                    type == 'spot' && <SpotFees />
                }

                {/*{
                    type == 'derivative' && <DerivativeFees />
                }

                {
                    type == 'p2p' && <P2pFees />
                }*/}
            </div>
        </div>
    )
}

export default FeesTable;