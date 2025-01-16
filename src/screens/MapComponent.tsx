import React, { useCallback, useEffect, useRef, useState } from 'react'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import { getDevices } from '../apis/devices'
import { GiHamburgerMenu } from 'react-icons/gi'
import InfoWindowComponent from './components/infoWindow.component'
import SidebarComponent from './components/sidebar.component'
import { MdBikeScooter, MdClose } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const containerStyle = {
  width: '100vw',
  height: '100vh',
  padding: 0,
  margin: 0,
}

function MapComponent() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyD8G6muA6e85OPCIV6-t92BBdI0XIfZI30',
  })

  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const sidebarRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()


  const { data } = useQuery({
    queryKey: ['devices'],
    queryFn: () => getDevices(),
  })

  useEffect(() => {
    if (data) {
      setDevices(data)
      updateMapBounds(data)
      if (selectedDevice != null) {
        const tempDevice = data.find((device: Device) => device.deviceId === selectedDevice.deviceId)
        setSelectedDevice(tempDevice ?? null)
      }
    }
  }, [data])

  // Update map bounds based on the new set of devices
  const updateMapBounds = (fetchedDevices: Device[]) => {
    if (map) {
      const bounds = new window.google.maps.LatLngBounds()
      fetchedDevices.forEach((device: Device) => {
        bounds.extend({
          lat: parseFloat(device.latitude),
          lng: parseFloat(device.longitude),
        })
      })
      map.fitBounds(bounds)
    }
  }


  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)

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
      map.setZoom(12)
    }
  }

  const handleSearch = () => {
    const device = devices.find((d) => d.deviceId === searchQuery);
    if (device) {
      setSelectedDevice(null); // Reset the previous selection
      setTimeout(() => {
        setSelectedDevice(device); // Set the new selected device
      }, 100)

      if (map) {
        map.setCenter({
          lat: parseFloat(device.latitude),
          lng: parseFloat(device.longitude),
        });
        map.setZoom(12);
      }
    } else {
      alert("Device not found!");
    }
  };

  const handleSelectedDevice = (device: Device) => {
    setSelectedDevice(device)
    if (map) {
      map.setCenter({
        lat: parseFloat(device.latitude),
        lng: parseFloat(device.longitude),
      })
      map.setZoom(12)
    }
  }


  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState)
  }

  const navigateToDevices = () => {
    navigate('/devices')
  }

  // Close sidebar when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false)
      }
    }

    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [sidebarOpen])

  return isLoaded ? (
    <div className="relative">
      {/* Hamburger Menu */}
      <div
        className="absolute top-2 left-2 bg-white p-4 rounded-full shadow-lg z-20 cursor-pointer"
        onClick={toggleSidebar}
      >
        <GiHamburgerMenu size={24} />
      </div>


      <div
        className="absolute top-2 right-2 bg-white p-4 rounded-full shadow-lg z-20 cursor-pointer"
        onClick={navigateToDevices}
      >
        <MdBikeScooter size={24} />
      </div>

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-white shadow-lg z-30 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300`}
      // style={{ width: '500px' }}
      >
        <div className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold">Sidebar</h2>
          <MdClose className="cursor-pointer" size={24} onClick={toggleSidebar} />
        </div>
        <SidebarComponent
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setSelectedDevice={setSelectedDevice}
          handleSearch={handleSearch}
          devices={devices}
          handleSelectedDevice={handleSelectedDevice}
          selectedDevice={selectedDevice}
        />

      </div>

      {/* Map Section */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={2}
        center={userLocation || { lat: 37.7749, lng: -122.4194 }}
        options={{
          disableDefaultUI: true,
          mapTypeControl: false, // Disables the map style switching buttons
          streetViewControl: false, // Optional: Disable the Street View button
          fullscreenControl: false, // Optional: Disable the fullscreen button
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {devices.map((device) => (
          <Marker
            title={device.deviceId}
            clickable
            key={device.deviceId}
            position={{
              lat: parseFloat(device.latitude),
              lng: parseFloat(device.longitude),
            }}
            label={device.deviceId}
            icon={
              device.validData
                ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            }
            onClick={() => handleMarkerClick(device)}
          />
        ))}

        {selectedDevice && (
          <InfoWindowComponent
            devices={devices}
            selectedDevice={selectedDevice}
            setSelectedDevice={setSelectedDevice}
          />
        )}
      </GoogleMap>
    </div>
  ) : (
    <></>
  )
}

export default React.memo(MapComponent)
