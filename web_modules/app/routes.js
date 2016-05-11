import React, { Component } from "react"
import { Route } from "react-router"
import PhenomicPageContainer from "phenomic/lib/PageContainer"

import LayoutContainer from "../LayoutContainer"

import Page from "../layouts/Page"
import PageError from "../layouts/PageError"
import HomePage from "../layouts/Homepage"

class PageContainer extends Component {
  render() {
    const { props } = this
    return (
      <PhenomicPageContainer
        { ...props }
        layouts={ {
          Page,
          PageError,
          HomePage,
        } }
      />
    )
  }
}

// routes
export default (
  <Route component={ LayoutContainer }>
    <Route path="*" component={ PageContainer } />
  </Route>
)
