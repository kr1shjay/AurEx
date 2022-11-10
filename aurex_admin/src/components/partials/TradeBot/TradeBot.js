// import package
import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import Select from 'react-select';

// import component
import NewBot from './NewBot';

// import action
import { getPairDropdown } from "../../../actions/commonActions";


class TradeBot extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pairList: []
        };
        this.fetchSpotPair = this.fetchSpotPair.bind(this);
    }

    styles = {
		option: (provided, state) => ({
		  ...provided,
		  color: "white",
		  backgroundColor: "#242827",
		}),
		valueContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  padding: '0 6px',
		  backgroundColor: "#1a1b1c",
		  borderColor: '#242827',
		borderRadius: 8,
		borderStyle: 'solid',
		borderWidth: '1px'
		 
		}),
		control: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  borderRadius:8,
		  backgroundColor: "#1a1b1c",
		  border:'none'
		 
		}),
		indicatorsContainer: (provided, state) => ({
		  ...provided,
		  height: '52px',
		  position: 'absolute',
		  right: 0,
		  top: 0,
		  color:'#fff' 
		}),    
		singleValue: (provided, state) => ({
		  ...provided,
		  color: "#fff"
		})
	  };


    componentDidMount() {
        this.fetchSpotPair()
    };

    async fetchSpotPair() {
        try {
            const { status, loading, result } = await getPairDropdown();
            if (status == 'success') {
                this.setState({ 'pairList': result })
            }
        } catch (err) { }
    }

    render() {
        const { pairList } = this.state;

        return (
            <div className="container-fluid">
                <button className="btn mt-3" id="menu-toggle"><FontAwesomeIcon icon={faList} /></button>

                <NewBot
                    pairList={pairList}
                    refetchPair={this.fetchSpotPair}
                />

                <h3 className="mt-2 text-secondary">Delete Spot Orders</h3>
                {/* <form noValidate onSubmit={this.onDeleteBot} id="delete-bot">
                    <div className="row mt-2">
                        <div className="col-md-3">
                            <label htmlFor="copyright_text">Pair</label>
                        </div>
                        <div className="col-md-6">
                            <Select
                                value={this.state.pair}
                                onChange={this.handleselectChange}
                                options={options}
                                 styles={this.styles} className="border_blue_select basic-multi-select"
                            />
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-md-3">
                            <label htmlFor="copyright_text">Buy/Sell</label>
                        </div>
                        <div className="col-md-6">
                            <Select
                                value={this.state.buyorsell}
                                onChange={this.handleselectbuyChange}
                                options={options1}
                                 styles={this.styles} className="border_blue_select basic-multi-select"
                            />
                        </div>
                    </div>

                </form> */}
                <br />
                <button
                    form="delete-bot"
                    type="submit"
                    className="btn btn-primary">
                    Delete Spot Order
                </button>
            </div>
        )
    }
}

export default TradeBot;