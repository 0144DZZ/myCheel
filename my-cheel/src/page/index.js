import {Suspense, lazy} from 'react'
import {Route,Switch,Redirect,Link,withRouter} from 'react-router-dom';
import Introduce from './introduce/introduce'

const Input = lazy(()=>import('./input/input'))

function RouteView(){
  return(
    <div>
      <Suspense fallback={<div>loading...</div>}>
        <Switch>
          <Route path="/input" component={Input}/>
          <Route path="/introduce" component={Introduce}/>
          <Redirect to="/introduce" exact />
        </Switch>
      </Suspense>
    </div>
  )
}

export default RouteView