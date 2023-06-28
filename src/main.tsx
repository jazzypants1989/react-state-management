import React from "react"
import ReactDOM from "react-dom/client"
import App from "./JotaiApp"
import type { Product } from "./ZustandStore"
import "./index.css"

// const data = await fetch("/db.json").then((r) => r.json())
// const products = data.products as Product[]

const products = [
  {
    "id": 1,
    "name": "Product 1",
    "price": 100,
    "stock": 1,
  },
  {
    "id": 2,
    "name": "Product 2",
    "price": 200,
    "stock": 2,
  },
] as Product[]

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App products={products} />
  </React.StrictMode>
)
