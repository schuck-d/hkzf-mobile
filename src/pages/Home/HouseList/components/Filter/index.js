import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops'

import { API } from '../../../../../utils/api'
import { Location } from '../../../../../utils/location'

import FilterTitle from '../FilterTitle'
import FilterPicker from '../FilterPicker'
import FilterMore from '../FilterMore'

import styles from './index.module.css'

const defaultValues = {
    1: ['area', 'null'],
    2: ['null'],
    4: ['null'],
    8: []
}

export default class Filter extends Component {
    state = {
        titleStatus: 0,
        filterData: undefined,
        selectedValues: {
            1: ['area', 'null'],
            2: ['null'],
            4: ['null'],
            8: []
        }
    }

    onFilter() {
        const { selectedValues } = this.state;

        const params = {
            [selectedValues[1][0]]: selectedValues[1][2] === 'null' ? selectedValues[1][1] : selectedValues[1][2] || 'null',
            rentType: selectedValues[2][0],
            price: selectedValues[4][0],
            more: selectedValues[8].join(',')
        }

        console.log(params);
        this.props.onFilter(params);
    }
    
    // 高亮状态（强行点亮+过去选中判断）。
    get highlightStatus() {
        const { titleStatus, selectedValues } = this.state;
        // 手工点击标题强行亮。
        // let status = titleStatus; // 2

        // // 判断勾选的内容。
        // for (const key in selectedValues) {
        //     status |= selectedValues[key].join('') === defaultValues[key].join('') ? 0 : key;
        // }

        // return status

        return Object.keys(selectedValues).reduce((prev, key) => prev |= selectedValues[key].join('') === defaultValues[key].join('') ? 0 : key, titleStatus)
    }

    get currentSelectdValue() {
        const { selectedValues, titleStatus } = this.state;
        return selectedValues[titleStatus]
    }

    get showPicker() {
        return !!(this.state.titleStatus & 7)
    }

    get showMore() {
        return this.state.titleStatus === 8;
    }

    get pickerDataSource() {
        const { titleStatus, filterData: { area, subway, rentType, price } = {} } = this.state;

        const dataCollection = {
            1: [area, subway],
            2: rentType,
            4: price
        };

        return dataCollection[titleStatus];
    }

    get moreDataSource() {
        const { filterData: { area, subway, rentType, price, ...rest } = {} } = this.state

        return rest;
    }

    async getFilterData() {
        const res = await API.get('/houses/condition', { id: Location.getCity().value })
        
        console.log(res);

        this.setState({ filterData: res.body })
    }

    componentDidMount() {
        this.getFilterData()
    }

    changeStatusHandler(value) {
        // 一半。
        this.setState({ titleStatus: value})
    }

    onCancel() {
        this.setState({ titleStatus: 0 })
    }

    onSave(value) {
        const { selectedValues, titleStatus } = this.state;

        this.setState({ selectedValues: { ...selectedValues, [titleStatus]: value }, titleStatus: 0 }, () => this.onFilter())
    }

    render() {
        const { titleStatus } = this.state

        document.body.classList[titleStatus ? 'add' : 'remove']('body-fixed');

        console.log(this.state.selectedValues);

        return (
            <div className={styles.root}>
                {/* 前三个菜单的遮罩层 */}
                <Spring from={{ opacity: 0 }} to={{ opacity: +this.showPicker }}>
                    {style => style.opacity ? <div style={style} className={styles.mask} onClick={this.onCancel.bind(this)} /> : null}
                </Spring>

                <div className={styles.content}>
                    {/* 标题栏 */}
                    <FilterTitle changeStatus={this.changeStatusHandler.bind(this)} titleStatus={this.highlightStatus } />

                    {/* 前三个菜单对应的内容： */}
                    {this.showPicker && <FilterPicker key={titleStatus} dataSource={this.pickerDataSource} defaultValue={this.currentSelectdValue} cols={titleStatus === 1 ? 3 : 1} onSave={this.onSave.bind(this)} onCancel={this.onCancel.bind(this)} /> }

                    {/* 最后一个菜单对应的内容： */}
                    {this.showMore && <FilterMore dataSource={this.moreDataSource} defaultValue={this.currentSelectdValue} onSave={this.onSave.bind(this)} onCancel={this.onCancel.bind(this) } />}
                </div>
            </div>
        )
    }
}
