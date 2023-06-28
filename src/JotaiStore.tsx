import { atomWithStorage } from "jotai/utils"

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
  cartItems: CartItem[]
  cartOpen: boolean
}

const cartAtom = atomWithStorage<Cart>("cart", {
  cartItems: [],
  cartOpen: false,
})

export default cartAtom
