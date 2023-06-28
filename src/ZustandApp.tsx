import { useEffect, useState } from "react"
import useCartStore, { Product } from "./ZustandStore"

type Props = {
  products: Product[]
}

function Cart() {
  const cart = useCartStore.use.cart()
  const remove = useCartStore.use.remove()
  const adjustQuantity = useCartStore.use.adjustQuantity()

  const total = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  return (
    <div>
      <h1>Cart</h1>
      <ul>
        {cart.map((item) => (
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
  const add = useCartStore.use.add()
  return (
    <div>
      <h1>Products</h1>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name}
            <button onClick={() => add(product)}>Add</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

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
