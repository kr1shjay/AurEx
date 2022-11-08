import React, { useEffect, useState } from "react";
// @material-ui/core components

import DataTable from 'react-data-table-component';

//lib
import isEmpty from "lib/isEmpty";
import isLogin from 'lib/isLogin'

//action
import { getPairList } from "actions/derivativeTradeAction";
import { AddFavorite, GetFavorite } from "actions/users";








export default function SpotMarket(props) {
    const [record, setRecord] = useState([]);
    const [fav, setFav] = useState([]);
    const [tableValue, setTableValue] = useState('');

    var FilterData = record.filter(function (record) {

        if (!isEmpty(tableValue)) {

            if (record.firstCurrencySymbol == tableValue) {
                return record

            }
            if (record.markPrice == tableValue) {
                return record

            }
            if (record.changePrice == tableValue) {
                return record

            }
            if (record.high == tableValue) {
                return record

            }
            if (record.low == tableValue) {
                return record

            }
            if (record.last == tableValue) {
                return record

            }
        } else {
            return record
        }

    });



    const derivativeMarketColumns = [

        {
            name: 'Favorite',
            selector: 'star_icon',
            sortable: false,
            cell: record => {
                return (
                    isLogin() == true ?
                    fav && fav.length > 0 && fav.includes(record.firstCurrencyId) ?
                        <div className="color_fill_star">
                            <i class="far fa-star fa-lg" onClick={() => handleClick(record.firstCurrencyId, 'remove')}></i>
                        </div>
                        : <div>
                            <i class="far fa-star fa-lg" onClick={() => handleClick(record.firstCurrencyId)}></i>
                        </div>:null
                )
            }
        },
        {

            name: 'Coin',
            selector: 'firstCurrencyImage',
            sortable: false,
            cell: record => {
                return <div><img src={record.firstCurrencyImage} className="marketIcon" /><span>{record.firstCurrencySymbol}</span></div>
            }
        },
        {
            name: 'Current Price',
            selector: 'markPrice',
            sortable: false,
        },
        {
            name: '24H Change',
            selector: 'changePrice',
            sortable: false,
        },
        {
            name: '24H High',
            selector: 'high',
            sortable: false,
        },
        {
            name: '24H Low',
            selector: 'low',
            sortable: false,
        },
        {
            name: '24H Volume',
            selector: 'last',
            sortable: false,
        },
        {
            name: '',
            selector: 'button',
            sortable: false,
        },


    ];



    const FetchData = async () => {
        let { status, result } = await getPairList()
        if (status == 'success') {
            setRecord(result)
        }
    }



    const FavData = async () => {
        let { status, result } = await GetFavorite()
        if (status == 'success') {
            setFav(result)
        }
    }

    const handleClick = async (e, type) => {
        let Data = {
            item: e,
            type: type
        }
        let { status } = await AddFavorite(Data)
        if (status == 'success') {
            FavData()
        }

    }

    const handleChange = (e) => {

        let { name, value } = e.target
        setTableValue(value)

    }

    useEffect(() => {
        FetchData()
        FavData()
    }, [])
    return (

        <>
            <div className='row'>
                <div className="col-md-9"></div>
                <div className="col-md-3">
                    <div className="seacr_box_s">
                        <input
                            type="text"
                            placeholder="Find Coin"
                            onChange={handleChange}
                        />
                        <i class="fas fa-search"></i>
                    </div>
                </div>
            </div>
            <DataTable
                columns={derivativeMarketColumns}
                data={FilterData && FilterData.length > 0 ? FilterData : record}
                noHeader
            />
        </>




    );
}
