import { createContext } from 'react'

// @ts-ignore
const { Provider: ServiceProvider, Consumer: ServiceConsumer } = createContext()

export { ServiceProvider, ServiceConsumer }
