import { ConnectedRouter } from 'connected-react-router'
import React from 'react'
import { Provider } from 'react-redux'

import { store } from './modules/store'
import history from './modules/store/history'
import Routes from './Routes'

const App = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Routes />
    </ConnectedRouter>
  </Provider>
)

export default App
