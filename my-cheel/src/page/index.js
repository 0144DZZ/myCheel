import {Suspense, lazy} from 'react'
import {Route,Switch,Redirect,Link,withRouter} from 'react-router-dom';
import Introduce from './introduce/introduce'

const Input = lazy(()=>import('./input/input'))
const MyTransfer = lazy(()=>import('./transfer/Transfer'))

function RouteView(){
  return(
    <>
      <Suspense fallback={<>loading...</>}>
        <Switch>
          <Route path="/input" component={Input}/>
          <Route path="/introduce" component={Introduce}/>
          <Route path="/mytransfer" component={MyTransfer}/>
          <Redirect to="/introduce" exact />
        </Switch>
      </Suspense>
    </>
  )
}

export default RouteView