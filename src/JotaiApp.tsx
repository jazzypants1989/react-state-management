import { useRef, forwardRef } from "react"
import { useAtom } from "jotai"
import cartAtom from "./JotaiStore"
import type { Cart, Product } from "./JotaiStore"
import useCartClick from "./useCartClick"

type Props = {
  products: Product[]
}

const Cart = forwardRef<HTMLDivElement, {}>((props, ref) => {
  const [cart, setCart] = useAtom(cartAtom)

  const removeFromCart = (product: Product) => {
    const cartItem = cart.cartItems.find((i) => i.product.id === product.id)
    if (cartItem) {
      if (cartItem.quantity > 1) {
        cartItem.quantity--
      } else {
        cart.cartItems = cart.cartItems.filter(
          (i) => i.product.id !== product.id
        )
      }
    }
    setCart({ ...cart })
  }

  const addToCart = (product: Product) => {
    const cartItem = cart.cartItems.find((i) => i.product.id === product.id)
    if (cartItem) {
      cartItem.quantity++
    } else {
      cart.cartItems.push({ product, quantity: 1 })
    }
    setCart({ ...cart })
  }

  const removeAllFromCart = (product: Product) => {
    cart.cartItems = cart.cartItems.filter((i) => i.product.id !== product.id)
    setCart({ ...cart })
  }

  const clearCart = () => {
    cart.cartItems = []
    setCart({ ...cart })
  }

  return (
    <div ref={ref}>
      <h2>Cart</h2>
      {cart.cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <ul>
            {cart.cartItems.map((item) => (
              <li key={item.product.id}>
                <button onClick={() => removeFromCart(item.product)}>-</button>
                {item.product.name} - ${item.product.price} x {item.quantity} =
                ${item.product.price * item.quantity}
                <button onClick={() => addToCart(item.product)}>+</button>
                <button onClick={() => removeAllFromCart(item.product)}>
                  Remove from cart
                </button>
              </li>
            ))}
          </ul>
          <button onClick={clearCart}>Clear cart</button>
        </>
      )}

      <p>
        Total: $
        {cart.cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        )}
      </p>
    </div>
  )
})

function Product({ product }: { product: Product }) {
  const [cart, setCart] = useAtom(cartAtom)

  const addToCart = () => {
    const cartItem = cart.cartItems.find((i) => i.product.id === product.id)
    if (cartItem) {
      cartItem.quantity++
    } else {
      cart.cartItems.push({ product, quantity: 1 })
    }
    setCart({ ...cart })
  }

  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <p>Stock: {product.stock}</p>
      <button className="add-to-cart" onClick={addToCart}>
        Add to Cart
      </button>
    </div>
  )
}

export default function JotaiApp({ products }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const [cart, setCart] = useAtom(cartAtom)
  const cartOpen = cart.cartOpen
  useCartClick(ref, () => setCart({ ...cart, cartOpen: false }))

  return (
    <div>
      <button onClick={() => setCart({ ...cart, cartOpen: !cartOpen })}>
        Toggle Cart
      </button>
      {cartOpen && <Cart ref={ref} />}
      {products.map((product) => (
        <Product key={product.id} product={product} />
      ))}
    </div>
  )
}
