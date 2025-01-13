import React from "react";
import DeviceCardComponent from "./deviceCard.component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface SidebarComponentProps {
  searchQuery: any;
  setSearchQuery: React.Dispatch<React.SetStateAction<any>>;
  setSelectedDevice: React.Dispatch<React.SetStateAction<Device | null>>;
  handleSearch: any;
  devices: Device[];
  handleSelectedDevice: (device: Device) => void;
  selectedDevice: Device | null;
}


const SidebarComponent: React.FC<SidebarComponentProps> = ({ searchQuery, setSearchQuery, handleSearch, devices, handleSelectedDevice, setSelectedDevice, selectedDevice }) => {
  return (
    <div className="py-1">
      <Separator />
      <div className="flex flex-row gap-2 my-4 px-4 ">
        <Input
          type="text"
          // className="border border-gray-300 rounded p-2 w-full"
          placeholder="Enter Device ID"
          value={searchQuery}
          onSubmit={handleSearch}
          onChange={(e) => {
            setSearchQuery(e.target.value)
          }}
        />
        <Button
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
      <Separator />
      <div className="mt-4 px-4">
        <h2 className="text-lg font-semibold mb-4">Device List</h2>
        <ul>
          {devices.map((device) => (
            <li key={device.deviceId} className="mb-2">
              <button
                onClick={() => {
                  setSelectedDevice(null); // Clear any previously selected device
                  setSearchQuery('');
                  setTimeout(() => {
                    handleSelectedDevice(device); // Set the new selected device
                  }, 100);
                }}

                className={`w-full px-3 py-3 rounded-lg ${selectedDevice?.deviceId === device.deviceId
                  ? 'border border-blue-500 text-black outline-1 outline-blue-500'
                  : 'border border-gray-200 hover:bg-gray-50'
                  }`}
              >
                <DeviceCardComponent device={device} selectedDevice={selectedDevice} />
              </button>

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidebarComponent;

