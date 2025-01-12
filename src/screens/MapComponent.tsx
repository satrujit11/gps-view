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
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null)

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)

    // Fetch devices data
    const fetchDevices = async () => {
      const fetchedDevices = await getDevices() // Assuming this returns an array of device data
      console.log(fetchedDevices)
      setDevices(fetchedDevices)

      // Center the map based on the bounds of the device locations
      const bounds = new window.google.maps.LatLngBounds()
      fetchedDevices.forEach((device: Device) => {
        bounds.extend({
          lat: parseFloat(device.latitude),
          lng: parseFloat(device.longitude),
        })
      })
      map.fitBounds(bounds) // Adjust map to fit the bounds of all device locations
    }

    fetchDevices()

    // Get the user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          setUserLocation({ lat: latitude, lng: longitude })
          map.setCenter({ lat: latitude, lng: longitude }) // Center the map on the user's location
        },
        (error) => {
          console.error('Error getting location', error)
          // You could set a default location if needed
          setUserLocation({ lat: 37.7749, lng: -122.4194 }) // Default to San Francisco, for example
        }
      )
    } else {
      console.error('Geolocation not supported by this browser.')
    }
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  const handleMarkerClick = (device: Device) => {
    setSelectedDevice(device)

    if (infoWindow) {
      infoWindow.close() // Close any previously opened InfoWindow
    }

    // Create an InfoWindow for the clicked marker with Tailwind classes
    const newInfoWindow = new google.maps.InfoWindow({
      content: `<div class="bg-white p-4 rounded-lg shadow-lg w-64">
                  <h3 class="text-xl font-semibold text-gray-800 mb-2">Device ID: ${device.deviceId}</h3>
                  <p class="text-sm text-gray-600 mb-1">Status: <span class="font-medium ${device.status ? 'text-green-500' : 'text-red-500'}">${device.status ? 'Active' : 'Inactive'}</span></p>
                  <p class="text-sm text-gray-600 mb-1">Latitude: <span class="font-medium">${device.latitude}</span></p>
                  <p class="text-sm text-gray-600 mb-1">Longitude: <span class="font-medium">${device.longitude}</span></p>
                  <p class="text-sm text-gray-600">Valid Data: <span class="font-medium ${device.validData ? 'text-green-500' : 'text-red-500'}">${device.validData ? 'Yes' : 'No'}</span></p>
                </div>`,
    })

    newInfoWindow.open(map, new google.maps.Marker({
      position: {
        lat: parseFloat(device.latitude),
        lng: parseFloat(device.longitude),
      },
    }))
    setInfoWindow(newInfoWindow)
  }

  useEffect(() => {
    // Initial map setup, but devices will be fetched dynamically inside `onLoad`
  }, [])

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      zoom={2}
      center={userLocation || { lat: 37.7749, lng: -122.4194 }} // Default to San Francisco
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
          onClick={() => handleMarkerClick(device)} // Handle marker click
        />
      ))}

      {/* Optional: Display additional information about the selected device */}
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
            <p className="text-sm text-gray-600 mb-1">Status: <span className={`font-medium ${selectedDevice.status ? 'text-green-500' : 'text-red-500'}`}>{selectedDevice.status ? 'Active' : 'Inactive'}</span></p>
            <p className="text-sm text-gray-600 mb-1">Latitude: <span className="font-medium">{selectedDevice.latitude}</span></p>
            <p className="text-sm text-gray-600 mb-1">Longitude: <span className="font-medium">{selectedDevice.longitude}</span></p>
            <p className="text-sm text-gray-600">Valid Data: <span className={`font-medium ${selectedDevice.validData ? 'text-green-500' : 'text-red-500'}`}>{selectedDevice.validData ? 'Yes' : 'No'}</span></p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <></>
  )
}

export default React.memo(MyComponent)

