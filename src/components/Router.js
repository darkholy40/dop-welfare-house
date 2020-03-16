import React from 'react'
import { Switch, Route } from 'react-router-dom'

import Home from '../pages/Home'
import User from '../pages/User'
import WrongUrl from '../pages/WrongUrl'

function Routes() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/:username" component={User} />
            <Route path="/*" component={WrongUrl} />
        </Switch>
    )
}

export default Routes