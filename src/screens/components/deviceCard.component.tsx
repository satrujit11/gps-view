import { MdDelete, MdEdit } from "react-icons/md"
import { deleteDevice, editDevice } from "../../apis/devices"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import DeviceEditForm from "./deviceEditForm.component"

const DeviceCardComponent = ({ device }: { device: Device }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const queryClient = useQueryClient()
  const { toast } = useToast()

  const deleteDeviceMutation = useMutation({
    mutationFn: (deviceId: string) => deleteDevice(deviceId),
    onSuccess: () => {
      toast({
        title: `${device.deviceId} Deleted`,
        description: "Device deleted successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    }
  })

  const editDeviceMutation = useMutation({
    mutationFn: (data: any) => editDevice(data),
    onSuccess: () => {
      toast({
        title: `${device.deviceId} updated`,
        description: "Device updated successfully",
      })
      queryClient.invalidateQueries({ queryKey: ["devices"] })
    }
  })

  const handleSave = (updatedVehicleNumber: string) => {
    editDeviceMutation.mutate({ deviceId: device.deviceId, vehicleNumber: updatedVehicleNumber });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <DeviceEditForm
        initialVehicleNumber={device.vehicleNumber ?? ""}
        onSave={handleSave}
        onCancel={() => setIsEditing(false)}
      />
    );
  }
  return (
    <div className="flex flex-row items-center justify-between gap-8">
      <div className="flex flex-row gap-2 justify-between items-center">
        <div className="flex flex-row rounded-full overflow-hidden">
          <div className={`w-12 h-12 bg-gray-800 ${device.validData ? "bg-green-500" : "bg-red-500"}`}>
          </div>
        </div>
        <div className="flex flex-col items-start">
          <h3
            className={`text-md font-semibold text-start text-gray-800${device.vehicleNumber ? "" : " text-gray-400"
              }`}
          >
            {device.vehicleNumber ?? "No vehicle added"}
          </h3>

          <p className="text-sm text-start text-gray-600">{device.deviceId}</p>
        </div>
      </div>
      <div className="flex flex-row gap-1 items-center">
        <Switch onCheckedChange={(value) => {
          editDeviceMutation.mutate({ deviceId: device.deviceId, status: value ? 1 : 0 })
        }} checked={device.status == 1} className="mr-2" />
        <Separator orientation="vertical" />
        <button className="p-2 rounded-full" onClick={(e) => {
          setIsEditing(true)
          e.stopPropagation()
        }}>
          <MdEdit color="blue" size={20} />
        </button>
        <Separator orientation="vertical" />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="p-2 rounded-full">
              <MdDelete color="red" size={20} />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the device and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteDeviceMutation.mutate(device.deviceId)}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  )
}

export default DeviceCardComponent

