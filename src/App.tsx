import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import MyComponent from './screens/MapComponent'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MyComponent />
    </QueryClientProvider>
  )
}

export default App
