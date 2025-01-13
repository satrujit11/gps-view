import React, { useEffect } from "react";
import { InfoWindow } from "@react-google-maps/api";

interface InfoWindowComponentProps {
  devices: Device[];
  selectedDevice: Device;
  setSelectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
}

const InfoWindowComponent: React.FC<InfoWindowComponentProps> = ({ devices, selectedDevice, setSelectedDevice }) => {
  useEffect(() => {
    if (selectedDevice != null && !devices.find((device) => device.deviceId === selectedDevice.deviceId)) {
      setSelectedDevice(null);
    }
  }, [devices, selectedDevice]);
  return (
    <InfoWindow
      key={selectedDevice.deviceId}
      position={{
        lat: parseFloat(selectedDevice.latitude),
        lng: parseFloat(selectedDevice.longitude),
      }}
      onCloseClick={() => setSelectedDevice(null)}
    >
      <div className="bg-white p-4 rounded-lg shadow-lg w-64">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Device ID: {selectedDevice.deviceId}</h3>
        <p className="text-sm text-gray-600 mb-1">
          Status:{" "}
          <span
            className={`font-medium ${selectedDevice.status ? "text-green-500" : "text-red-500"}`}
          >
            {selectedDevice.status ? "Active" : "Inactive"}
          </span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Latitude: <span className="font-medium">{selectedDevice.latitude}</span>
        </p>
        <p className="text-sm text-gray-600 mb-1">
          Longitude: <span className="font-medium">{selectedDevice.longitude}</span>
        </p>
        <p className="text-sm text-gray-600">
          Valid Data:{" "}
          <span
            className={`font-medium ${selectedDevice.validData ? "text-green-500" : "text-red-500"}`}
          >
            {selectedDevice.validData ? "Yes" : "No"}
          </span>
        </p>
      </div>
    </InfoWindow>
  );
};

export default InfoWindowComponent;

