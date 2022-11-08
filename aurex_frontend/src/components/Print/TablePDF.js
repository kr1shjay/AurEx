// import package
import React from 'react';
import PropTypes from "prop-types";

const TablePDF = (props) => {
    const { column, rows } = props
    return (
        <table>
            <thead>
                <tr>
                    {
                        column && column.length > 0 && column.map((item, key) => {
                            return (
                                <th key={key}>{item.name}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                {
                    rows && rows.length > 0 && rows.map((item, key) => {
                        return (
                            <tr key={key}>
                                {
                                    column && column.length > 0 && column.map((el, index) => {
                                        return (
                                            <td key={index}>{item[el.selector]}</td>
                                        )
                                    })
                                }
                            </tr>
                        )
                    })
                }
            </tbody>
        </table>
    )
}

TablePDF.propTypes = {
    column: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            selector: PropTypes.string.isRequired
        })
    ),
    rows: PropTypes.array.isRequired,
};

TablePDF.defaultProps = {
    column: [],
    rows: [],
};

export default TablePDF;