import React, { Component } from 'react'

import { Carousel, Flex, Modal, Toast } from 'antd-mobile'

import NavHeader from '../../components/NavHeader'
import HouseItem from '../../components/HouseItem'
import HousePackage from '../../components/HousePackage'

import { API, BASE_URL } from '../../utils/api'

import styles from './index.module.css'
import { Auth } from '../../utils/auth'

// 猜你喜欢
const recommendHouses = [
    {
        id: 1,
        src: BASE_URL + '/img/message/1.png',
        desc: '72.32㎡/南 北/低楼层',
        title: '安贞西里 3室1厅',
        price: 4500,
        tags: ['随时看房']
    },
    {
        id: 2,
        src: BASE_URL + '/img/message/2.png',
        desc: '83㎡/南/高楼层',
        title: '天居园 2室1厅',
        price: 7200,
        tags: ['近地铁']
    },
    {
        id: 3,
        src: BASE_URL + '/img/message/3.png',
        desc: '52㎡/西南/低楼层',
        title: '角门甲4号院 1室1厅',
        price: 4300,
        tags: ['集中供暖']
    }
]

// 百度地图
const BMap = window.BMap

const labelStyle = {
    position: 'absolute',
    zIndex: -7982820,
    backgroundColor: 'rgb(238, 93, 91)',
    color: 'rgb(255, 255, 255)',
    height: 25,
    padding: '5px 10px',
    lineHeight: '14px',
    borderRadius: 3,
    boxShadow: 'rgb(204, 204, 204) 2px 2px 2px',
    whiteSpace: 'nowrap',
    fontSize: 12,
    userSelect: 'none'
}

export default class HouseDetail extends Component {
    state = {
        isLoading: false,
        isFavorite: false,
        houseInfo: {
            // 房屋图片
            houseImg: [],
            // 标题
            title: '',
            // 标签
            tags: [],
            // 租金
            price: 0,
            // 房型
            roomType: '两室一厅',
            // 房屋面积
            size: 89,
            // 装修类型
            renovation: '精装',
            // 朝向
            oriented: [],
            // 楼层
            floor: '',
            // 小区名称
            community: '',
            // 地理位置
            coord: {
                latitude: '39.928033',
                longitude: '116.529466'
            },
            // 房屋配套
            supporting: [],
            // 房屋标识
            houseCode: '',
            // 房屋描述
            description: ''
        }
    }

    houseCode = ''

    async getHouseDetail() {
        const res = await API.get(`/houses/${ this.houseCode }`);

        console.log(res);

        this.setState({ houseInfo: res.body })

        this.renderMap(res.body.community, res.body.coord)
    }

    async getFavoriteStatus() {
        const res = await API.get('/user/favorites/' + this.houseCode);

        res.status === 200 && this.setState({ isFavorite: res.body.isFavorite });
    }

    componentDidMount() {
        const { match: { params } } = this.props

        this.houseCode = params.id;

        // 获取房屋详情。
        this.getHouseDetail();

        // 获取收藏状态。
        this.getFavoriteStatus();
    }

    // 渲染轮播图结构
    renderSwipers() {
        const {
            houseInfo: { houseImg: slides }
        } = this.state

        return slides.map((item, idx) => (
            <a
                key={idx}
                href="http://itcast.cn"
                style={{
                    display: 'inline-block',
                    width: '100%',
                    height: 252
                }}
            >
                <img
                    src={BASE_URL + item}
                    alt=""
                    style={{ width: '100%', verticalAlign: 'top' }}
                />
            </a>
        ))
    }

    // 渲染地图
    renderMap(community, coord) {
        const { latitude, longitude } = coord

        const map = new BMap.Map('map')
        const point = new BMap.Point(longitude, latitude)
        map.centerAndZoom(point, 17)

        const label = new BMap.Label('', {
            position: point,
            offset: new BMap.Size(0, -36)
        })

        label.setStyle(labelStyle)
        label.setContent(`
      <span>${ community }</span>
      <div class="${ styles.mapArrow }"></div>
    `)
        map.addOverlay(label)
    }

    async favorite() {
        const { isFavorite } = this.state;
        const res = await API[isFavorite ? 'delete' : 'post']('/user/favorites/' + this.houseCode)
        if (res.status === 200) {
            Toast.info((isFavorite ? '取消' : '添加') + '收藏成功！')
            this.setState({ isFavorite: !isFavorite })
        } else Toast.fail('登录状态异常！')
    }

    favoriteHandler() {
        // 判断用户是否登录。
        if (Auth.isLogin) {
            // 如果登录就去操作，（基于当前获取到的收藏状态）
            this.favorite();
        } else {
            Modal.alert('请求登录', '您还没有登录，是否要登录？', [
                { text: '取消' },
                { text: '去登录', onPress: () => this.props.history.push('/login') }
            ])
        }
    }

    render() {
        const {
            isLoading,
            isFavorite,
            houseInfo: {
                houseImg,
                tags,
                oriented
            } } = this.state
        return (
            <div className={styles.root}>
                {/* 导航栏 */}
                <NavHeader
                    className={styles.navHeader}
                    rightContent={[<i key="share" className="iconfont icon-share" />]}
                >
                    天山星城
        </NavHeader>

                {/* 轮播图 */}
                <div className={styles.slides}>
                    {!isLoading ? (
                        <Carousel key={houseImg.length} autoplay infinite autoplayInterval={5000}>
                            {this.renderSwipers()}
                        </Carousel>
                    ) : (
                            ''
                        )}
                </div>

                {/* 房屋基础信息 */}
                <div className={styles.info}>
                    <h3 className={styles.infoTitle}>
                        整租 · 精装修，拎包入住，配套齐Q，价格优惠
          </h3>
                    <Flex className={styles.tags}>
                        <Flex.Item>
                            {tags.map((i, idx) => (
                                <span key={idx} className={[styles.tag, styles[`tag${ idx % 3 + 1 }`]].join(' ')}>
                                    {i}
                                </span>
                            ))}
                        </Flex.Item>
                    </Flex>

                    <Flex className={styles.infoPrice}>
                        <Flex.Item className={styles.infoPriceItem}>
                            <div>
                                8500
                <span className={styles.month}>/月</span>
                            </div>
                            <div>租金</div>
                        </Flex.Item>
                        <Flex.Item className={styles.infoPriceItem}>
                            <div>1室1厅1卫</div>
                            <div>房型</div>
                        </Flex.Item>
                        <Flex.Item className={styles.infoPriceItem}>
                            <div>78平米</div>
                            <div>面积</div>
                        </Flex.Item>
                    </Flex>

                    <Flex className={styles.infoBasic} align="start">
                        <Flex.Item>
                            <div>
                                <span className={styles.title}>装修：</span>
                精装
              </div>
                            <div>
                                <span className={styles.title}>楼层：</span>
                低楼层
              </div>
                        </Flex.Item>
                        <Flex.Item>
                            <div>
                                <span className={styles.title}>朝向：</span>南
              </div>
                            <div>
                                <span className={styles.title}>类型：</span>{['南', '北'].every(i => oriented/* [东 南 北] */.includes(i)) ? '优质房源' : '普通房源'}</div>
                        </Flex.Item>
                    </Flex>
                </div>

                {/* 地图位置 */}
                <div className={styles.map}>
                    <div className={styles.mapTitle}>
                        小区：
            <span>天山星城</span>
                    </div>
                    <div className={styles.mapContainer} id="map">
                        地图
          </div>
                </div>

                {/* 房屋配套 */}
                <div className={styles.about}>
                    <div className={styles.houseTitle}>房屋配套</div>
                    <HousePackage
                        list={[
                            '电视',
                            '冰箱',
                            '洗衣机',
                            '空调',
                            '热水器',
                            '沙发',
                            '衣柜',
                            '天然气'
                        ]}
                    />
                    {/* <div className="title-empty">暂无数据</div> */}
                </div>

                {/* 房屋概况 */}
                <div className={styles.set}>
                    <div className={styles.houseTitle}>房源概况</div>
                    <div>
                        <div className={styles.contact}>
                            <div className={styles.user}>
                                <img src={BASE_URL + '/img/avatar.png'} alt="头像" />
                                <div className={styles.useInfo}>
                                    <div>王女士</div>
                                    <div className={styles.userAuth}>
                                        <i className="iconfont icon-auth" />
                    已认证房主
                  </div>
                                </div>
                            </div>
                            <span className={styles.userMsg}>发消息</span>
                        </div>

                        <div className={styles.descText}>
                            {/* {description || '暂无房屋描述'} */}
              1.周边配套齐全，地铁四号线陶然亭站，交通便利，公交云集，距离北京南站、西站都很近距离。
              2.小区规模大，配套全年，幼儿园，体育场，游泳馆，养老院，小学。
              3.人车分流，环境优美。
              4.精装两居室，居家生活方便，还有一个小书房，看房随时联系。
            </div>
                    </div>
                </div>

                {/* 推荐 */}
                <div className={styles.recommend}>
                    <div className={styles.houseTitle}>猜你喜欢</div>
                    <div className={styles.items}>
                        {recommendHouses.map(item => (
                            <HouseItem {...item} key={item.id} />
                        ))}
                    </div>
                </div>

                {/* 底部收藏按钮 */}
                <Flex className={styles.fixedBottom}>
                    <Flex.Item onClick={this.favoriteHandler.bind(this)}>
                        <img
                            src={BASE_URL + `/img/${ isFavorite ? '' : 'un' }star.png`}
                            className={styles.favoriteImg}
                            alt="收藏"
                        />
                        <span className={styles.favorite}>{isFavorite ? '已' : ''}收藏</span>
                    </Flex.Item>
                    <Flex.Item>在线咨询</Flex.Item>
                    <Flex.Item>
                        <a href="tel:400-618-4000" className={styles.telephone}>
                            电话预约
            </a>
                    </Flex.Item>
                </Flex>
            </div>
        )
    }
}
