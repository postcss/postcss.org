import statinamicStatic from "statinamic/lib/static"

import pkg from "../package.json"
import { RouteHandler, store } from "utils"

const routes = RouteHandler

export default ({
  urls,
  pagesData,
  dest,
  baseUrl,
}) => (
  statinamicStatic({
    metadata: {
      pkg,
    },
    urls,
    pagesData,
    dest,
    baseUrl,
    routes,
    store,
  })
)
