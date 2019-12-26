// tslint:disable:jsx-no-lambda
import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import Game from './components/templates/Game'

const Routes = () => {
  return (
    <Switch>
      <Route exact={true} path="/game" component={Game} />
      <Route path="*" render={() => <Redirect to="/game" />} />
    </Switch>
  )
}

export default Routes
