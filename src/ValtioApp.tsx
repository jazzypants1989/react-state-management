import { useState } from "react"
import { useSnapshot } from "valtio"
import cart from "./ValtioStore"
import type { Cart, CartItem, Product } from "./ValtioStore"

type Props = {
  products: Product[]
}

function Cart() {
  const cartSnap = useSnapshot(cart)

  const remove = (product: Product) => {
    cart.products.splice(
      cart.products.findIndex((item) => item.product.id === product.id),
      1
    )
  }

  // The splice method returns the removed item(s) in an array.
  // We are not using the returned value, so we are not assigning it to a variable.

  const adjustQuantity = (product: Product, quantity: number) => {
    const item = cartSnap.products.find(
      (item) => item.product.id === product.id
    )
    if (item) {
      cart.products.forEach((item) => {
        if (item.product.id === product.id) {
          item.quantity = Math.max(0, quantity)
        }
      })
    }
  }

  // The snapshot shows us the current state of the cart.
  // We can use forEach instead of map, because we are not returning a value.
  // This is because Valtio uses proxies to detect changes
  // So, we don't have to worry about immutability.
  // We can just mutate the state.

  const total = cartSnap.products.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cartSnap.products.map((item) => (
          <li key={item.product.id}>
            {item.product.name} - {item.quantity}
            <button onClick={() => remove(item.product)}>Remove</button>
            <button
              onClick={() => adjustQuantity(item.product, item.quantity + 1)}
            >
              +
            </button>
            <button
              onClick={() => adjustQuantity(item.product, item.quantity - 1)}
            >
              -
            </button>
          </li>
        ))}
      </ul>
      <div>Total: {total}</div>
    </div>
  )
}

function Products({ products }: Props) {
  const cartSnap = useSnapshot(cart)

  const add = (product: Product) => {
    const item = cartSnap.products.find(
      (item) => item.product.id === product.id
    )
    if (item) {
      cart.products.forEach((item) => {
        if (item.product.id === product.id) {
          item.quantity++
        }
      })
    } else {
      cart.products.push({
        product,
        quantity: 1,
      })
    }
  }

  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.price}
            <button onClick={() => add(product)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// So, adding a product to the cart is divided between the snapshot and the actual state as well.
// We use the snapshot to check if the product is already in the cart.
// If it is, we use the actual state to either increase the quantity
// If it isn't, we add the product to that state.

function App({ products }: Props) {
  const [showCart, setShowCart] = useState(true)
  return (
    <div>
      <button onClick={() => setShowCart(!showCart)}>Toggle Cart</button>
      {showCart && <Cart />}
      <Products products={products} />
    </div>
  )
}

export default App
