import { getDevices } from "@/apis/devices";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Devices = () => {
  const navigate = useNavigate();
  const { data } = useQuery({
    queryKey: ['devices'],
    queryFn: () => getDevices(),
  })

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-row items-center gap-4 py-6">
        <Button variant="outline" size="icon" onClick={goBack}>
          <ChevronLeft />
        </Button>
        <h1 className="text-2xl font-bold">Devices</h1>
      </div>
      <Table>
        <TableCaption>A list of devices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Device ID</TableHead>
            <TableHead>Valid Data</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((device: Device) => (
            <TableRow key={device.deviceId}>
              <TableCell className="font-medium">{device.vehicleNumber}</TableCell>
              <TableCell>{device.deviceId}</TableCell>
              <TableCell>
                <span className={`text-white px-2 py-1 rounded font-semibold ${device.validData ? "bg-green-500" : "bg-red-500"}`} >{device.validData ? "Yes" : "No"}</span>
              </TableCell>
              <TableCell>
                <span className={`text-white px-2 py-1 rounded font-semibold ${device.status ? "bg-green-500" : "bg-red-500"}`} >{device.status ? "Active" : "Inactive"}</span>
              </TableCell>
              <TableCell>{device.latitude}</TableCell>
              <TableCell>{device.longitude}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
};

export default Devices;
