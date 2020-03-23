import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'
import Score from '../pages/Score'
import DashBoard from '../pages/DashBoard'
import WrongUrl from '../pages/WrongUrl'

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/score" component={Score} />
            <Route exact path="/dashboard" component={DashBoard} />
            <Route path="/*" component={WrongUrl} />
        </Switch>
    )
}

export default Routes