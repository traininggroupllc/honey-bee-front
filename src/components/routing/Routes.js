import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Alert from '../layout/Alert'
import BeeHive from '../layout/BeeHive'
import HoneyJar from '../layout/HoneyJar'
import Metamorphosis from '../layout/Metamorphosis'
import NotFound from '../layout/NotFound'
import Roadmap from '../layout/Roadmap'
import Tokenomics from '../layout/Tokenomics'

const Routes = () => {
  return (
    <section>
      <Alert />
      <Switch>
        <Route exact path='/beehive' component={BeeHive} />
        <Route exact path='/honeyjar' component={HoneyJar} />
        <Route exact path='/metamorphosis' component={Metamorphosis} />
        <Route exact path='/tokenomics' component={Tokenomics} />
        <Route exact path='/roadmap' component={Roadmap} />
        <Route component={NotFound} />
      </Switch>
    </section>
  )
}

export default Routes
