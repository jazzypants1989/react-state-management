import { proxy, subscribe } from "valtio"

export type Product = {
  id: number
  name: string
  price: number
  stock: number
}

export type CartItem = {
  product: Product
  quantity: number
}

export type Cart = {
  products: CartItem[]
}

const cartStorage = localStorage.getItem("cart")

const cart = proxy<Cart>(
  JSON.parse(cartStorage!) || {
    products: [],
  }
)

export const consolita = subscribe(cart, () => {
  localStorage.setItem("cart", JSON.stringify(cart))
  console.log("Jesse is a genius")
})

export default cart
