import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import 'animate.css/animate.min.css'
import 'antd/dist/antd.min.css'

import Header from './components/Header'
import Routes from './components/Router'

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
  background-color: rgba(0, 0, 0, 0.1);

  &.notfound {
    justify-content: center;
    background-color: rgba(0, 0, 0, 0.7);
  }

  &.center {
    justify-content: center;
  }

  &.login {
    justify-content: flex-start;
  }
`

function mapStateToProps(state) {
  return state
}

function App(props) {
  return (
    <AppContainer className={props.appContainerClass}>
      {props.appContainerClass === 'found_data' && <Header />}
      <Routes />
    </AppContainer>
  )
}

export default connect(mapStateToProps)(App)
