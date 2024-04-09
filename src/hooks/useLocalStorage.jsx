import { useEffect, useState } from 'react'

// const PREFIX = 'whatsapp-clone-'

export default function useLocalStorage(key, initialValue) {
  const prefixedKey = key
  const [value, setValue] = useState(() => {
    const jsonValue = localStorage.getItem("id")
    if (jsonValue != null) return jsonValue
    if (typeof initialValue === 'function') {
      return initialValue()
    } else {
      return (initialValue)?initialValue : null;
    }
  })

  useEffect(() => {
    localStorage.setItem("id", value)
  }, [prefixedKey, value])

  return [value, setValue]
}