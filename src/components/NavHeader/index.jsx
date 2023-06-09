import React from 'react'
import { withRouter } from 'react-router-dom'
import { Icon, NavBar } from 'antd-mobile'

import './navheader.module.less'

export default withRouter(({ children, history, onBack = () => history.goBack(), rightContent }) => (
    <NavBar
        mode="light"
        icon={<Icon type="left" />}
        onLeftClick={onBack}
        rightContent={rightContent}
    >{children}</NavBar>
));

// export default NavHeader
