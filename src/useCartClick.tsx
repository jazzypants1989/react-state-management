import { useEffect } from "react"

export default function useCartClick(
  ref: React.RefObject<HTMLDivElement>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      // Do nothing if clicking ref's element, it's descendent elements, or the add-to-cart button
      if (
        !ref.current ||
        ref.current.contains(event.target as Node) ||
        (event.target as HTMLElement).className.includes("add-to-cart")
      ) {
        return
      }
      handler(event)
    }
    document.addEventListener("pointerdown", listener)
    return () => {
      document.removeEventListener("pointerdown", listener)
    }
  }, [ref, handler])
}
