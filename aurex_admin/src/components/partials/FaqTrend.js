// import package
import React, { Component } from 'react';
import { Card, Button } from "react-bootstrap";
import Select from 'react-select';

// import action
import { updateFaqTrend } from '../../actions/siteSettingActions'

//import lib
import { toastAlert } from '../../lib/toastAlert';

class FaqTrend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            faqTrend: [],
            createObjectUrl: false,
            errors: {},
            loader: false
        };
        this.handleSelect = this.handleSelect.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
		  borderColor: '#59615f',
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

    componentWillReceiveProps(nextProps) {
        const { records } = nextProps;
        if (records) {
            this.setState({
                faqTrend: records.faqTrend,
            })
        }
    }

    handleSelect(selectedOption) {
        if (selectedOption && selectedOption.length > 0) {
            this.setState({
                "faqTrend": selectedOption.map((el) => { return el.value; })
            })
        } else {
            this.setState({ "faqTrend": [] })
        }
    };

    async handleSubmit(e) {
        e.preventDefault();
        const { faqTrend } = this.state;
        let reqData = {
            faqTrend
        }
        try {
            const { status, loading, message,result } = await updateFaqTrend(reqData);
            if (status == 'success') {
                toastAlert('success', message, 'faqTrend')
                this.setState({ 'faqTrend': result.faqTrend })
            } else {
                toastAlert('error', message, 'faqTrend')
            }
        } catch (err) { }
    }

    render() {
        const { faqOption } = this.props
        const { faqTrend } = this.state;

        return (
            <Card>
                <Card.Header><p className="text-white"><b>FAQ Trend</b></p></Card.Header>
                <Card.Body>
                    <div className="row mt-2 align-items-center">
                        <div className="col-md-3">
                            <label htmlFor="currencyName">FAQ</label>
                        </div>
                        <div className="col-md-9">
                            <Select
                                value={faqOption && faqOption.length > 0 ? faqOption.filter((el) => {
                                    if (faqTrend && faqTrend.includes(el.value)) {
                                        return el;
                                    }
                                }) : []}
                                isMulti
                                name="colors"
                                options={faqOption}
                                onChange={this.handleSelect}
                                styles={this.styles} className="border_blue_select basic-multi-select"
                                classNamePrefix="select"
                            />

                        </div>
                    </div>
                </Card.Body>
                <Card.Footer>
                    <Button onClick={this.handleSubmit}>Submit</Button>
                </Card.Footer>
            </Card>
        )
    }
}

export default FaqTrend;