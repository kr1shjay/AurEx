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
                                className="basic-multi-select"
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