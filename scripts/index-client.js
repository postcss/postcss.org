// all md files as JSON + generate collections
require.context("../content", true, /\.md$/)

// ---

import "whatwg-fetch"
import statinamicClient from "statinamic/lib/client"

import pkg from "../package.json"
import { RouteHandler, store } from "utils"

const routes = RouteHandler;

statinamicClient({
  metadata: {
    pkg,
  },
  routes,
  store,
})
