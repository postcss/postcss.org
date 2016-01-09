import React from "react"
import { Route } from "react-router"
import PageContainer from "statinamic/lib/PageContainer"

import { combineReducers } from "redux"
import createStore from "statinamic/lib/redux/createStore"
import * as statinamicReducers from "statinamic/lib/redux/modules"
import minifyCollection from "statinamic/lib/md-collection-loader/minify"

/*
 * Page layouts
 */
// Default layout
import Page from "Page"

// Additional layouts, to add your own import it below and add it to the "pageComponents" variable
import PageError from "PageError"

const pageComponents = {
  Page,
  PageError
};

/*
 * Route Handler
 */
import Layout from "Layout"
export const RouteHandler = (
  <Route component={ Layout }>
    <Route path="*" component={ PageContainer } />
  </Route>
);

/*
 * Store
 */
export const store = createStore(
  combineReducers(statinamicReducers),

  // initialState
  {
    ...(typeof window !== "undefined") && window.__INITIAL_STATE__,

    // static build optimization
    ...__PROD__ && {
      collection:
        minifyCollection(require("statinamic/lib/md-collection-loader/cache")),
    },

    pageComponents,
  }
)
