import React from "react"
import { Route } from "react-router"
import { PageContainer as PhenomicPageContainer } from "phenomic"

import LayoutContainer from "../LayoutContainer"

import Page from "../layouts/Page"
import PageError from "../layouts/PageError"
import HomePage from "../layouts/HomePage"

const PageContainer = (props) => (
  <PhenomicPageContainer
    { ...props }
    layouts={ {
      Page,
      PageError,
      HomePage,
    } }
  />
)

// routes
export default (
  <Route component={ LayoutContainer }>
    <Route path="*" component={ PageContainer } />
  </Route>
)
