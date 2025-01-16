import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import MapComponent from './screens/MapComponent'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Devices from './screens/Devices';

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MapComponent />} />
          <Route path="/devices" element={<Devices />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
