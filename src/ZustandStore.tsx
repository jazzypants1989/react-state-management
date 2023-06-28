import { create, UseBoundStore, StoreApi } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export interface Product {
  id: number
  name: string
  price: number
  stock: number
}

export interface cartItem {
  product: Product
  quantity: number
}

interface CartState {
  cart: cartItem[]
  add: (product: Product) => void
  remove: (product: Product) => void
  adjustQuantity: (product: Product, quantity: number) => void
}

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  let store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (let k of Object.keys(store.getState())) {
    ;(store.use as any)[k] = () => store((s) => s[k as keyof typeof s])
  }

  return store
}

const useCartStoreBase = create<CartState>()(
  persist(
    (set) => ({
      cart: [],
      add: (product) =>
        set((state) => {
          const newState = {
            ...state,
            cart: [...state.cart],
          }
          const item = newState.cart.find((i) => i.product.id === product.id)
          if (item) {
            item.quantity++
          } else {
            newState.cart.push({ product, quantity: 1 })
          }
          console.log(newState.cart)
          return newState
        }),
      remove: (product) =>
        set((state) => {
          const newState = { ...state, cart: [...state.cart] }
          const item = newState.cart.find((i) => i.product.id === product.id)
          if (item) {
            newState.cart = newState.cart.filter(
              (i) => i.product.id !== product.id
            )
          }
          return newState
        }),
      adjustQuantity: (product, quantity) =>
        set((state) => {
          const newState = { ...state, cart: [...state.cart] }
          const item = newState.cart.find((i) => i.product.id === product.id)
          if (item) {
            item.quantity = quantity
          }
          return newState
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
)

const useCartStore = createSelectors(useCartStoreBase)

export default useCartStore
