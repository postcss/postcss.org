import React from "react"
import { Route } from "react-router"
import PageContainer from "statinamic/lib/PageContainer"

// components
import Wrapper from "layouts/Wrapper"

// routes
export default (
  <Route component={ Wrapper }>
    <Route path="*" component={ PageContainer } />
  </Route>
)
