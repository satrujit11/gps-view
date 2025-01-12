import React, { useCallback, useEffect, useState } from 'react'
import { GoogleMap, Marker, InfoWindow, useJsApiLoader } from '@react-google-maps/api'
import { getDevices } from '../apis/devices'

const containerStyle = {
  width: '100vw',
  height: '100vh',
  padding: 0,
  margin: 0,
}

function MyComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD8G6muA6e85OPCIV6-t92BBdI0XIfZI30',
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [searchQuery, setSearchQuery] = useState('') // State for search input

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)

    const fetchDevices = async () => {
      const fetchedDevices = await getDevices()
      setDevices(fetchedDevices)

      const bounds = new window.google.maps.LatLngBounds()
      fetchedDevices.forEach((device: Device) => {
        bounds.extend({
          lat: parseFloat(device.latitude),
          lng: parseFloat(device.longitude),
        })
      })
      map.fitBounds(bounds)
    }

    fetchDevices()

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          map.setCenter({ lat: latitude, lng: longitude })
        },
        () => {
          setUserLocation({ lat: 37.7749, lng: -122.4194 }) // Default to San Francisco
        }
      )
    }
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMarkerClick = (device: Device) => {
    setSelectedDevice(device)

    if (map) {
      map.setCenter({
        lat: parseFloat(device.latitude),
        lng: parseFloat(device.longitude),
      })
      map.setZoom(12) // Optionally zoom in when a marker is clicked
    }
  }

  const handleSearch = () => {
    const device = devices.find((d) => d.deviceId === searchQuery)
    if (device) {
      setSelectedDevice(device)

      if (map) {
        map.setCenter({
          lat: parseFloat(device.latitude),
          lng: parseFloat(device.longitude),
        })
        map.setZoom(12)
      }
    } else {
      alert('Device not found!')
    }
  }

  return isLoaded ? (
    <div>
      {/* Search Section */}
      <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
        <input
          type="text"
          className="border border-gray-300 rounded p-2 w-64"
          placeholder="Enter Device ID"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={handleSearch}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={2}
        center={userLocation || { lat: 37.7749, lng: -122.4194 }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {devices.map((device) => (
          <Marker
            key={device.deviceId}
            position={{
              lat: parseFloat(device.latitude),
              lng: parseFloat(device.longitude),
            }}
            label={device.deviceId}
            icon={
              device.status
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
            onClick={() => handleMarkerClick(device)} // Show InfoWindow on marker click
          />
        ))}

        {/* InfoWindow for the selected device */}
        {selectedDevice && (
          <InfoWindow
            position={{
              lat: parseFloat(selectedDevice.latitude),
              lng: parseFloat(selectedDevice.longitude),
            }}
            onCloseClick={() => setSelectedDevice(null)} // Close InfoWindow when closed
          >
            <div className="bg-white p-4 rounded-lg shadow-lg w-64">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Device ID: {selectedDevice.deviceId}</h3>
              <p className="text-sm text-gray-600 mb-1">
                Status:{' '}
                <span
                  className={`font-medium ${selectedDevice.status ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                  {selectedDevice.status ? 'Active' : 'Inactive'}
                </span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Latitude: <span className="font-medium">{selectedDevice.latitude}</span>
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Longitude: <span className="font-medium">{selectedDevice.longitude}</span>
              </p>
              <p className="text-sm text-gray-600">
                Valid Data:{' '}
                <span
                  className={`font-medium ${selectedDevice.validData ? 'text-green-500' : 'text-red-500'
                    }`}
                >
                  {selectedDevice.validData ? 'Yes' : 'No'}
                </span>
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}

export default React.memo(MyComponent)


