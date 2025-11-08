"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CreateEntryDialogProps {
  onCreateEntry: (entry: {
    timestamp: string;
    consumption: number;
    peak: boolean;
    reason: string;
    encrypted: boolean;
  }) => void;
  isCreating?: boolean;
}

const CreateEntryDialog = ({
  onCreateEntry,
  isCreating,
}: CreateEntryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    timestamp: "",
    consumption: "",
    peak: false,
    reason: "",
    encrypted: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.timestamp || !formData.consumption || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onCreateEntry({
      timestamp: formData.timestamp,
      consumption: Number(formData.consumption),
      peak: formData.peak,
      reason: formData.reason,
      encrypted: formData.encrypted,
    });

    setFormData({
      timestamp: "",
      consumption: "",
      peak: false,
      reason: "",
      encrypted: true,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Entry
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Consumption Entry</DialogTitle>
          <DialogDescription>
            Add a new encrypted energy consumption record to the blockchain
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="timestamp">Timestamp *</Label>
              <Input
                id="timestamp"
                type="datetime-local"
                value={formData.timestamp}
                onChange={(e) =>
                  setFormData({ ...formData, timestamp: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="consumption">Consumption (kWh) *</Label>
              <Input
                id="consumption"
                type="number"
                placeholder="Enter consumption in kWh"
                value={formData.consumption}
                onChange={(e) =>
                  setFormData({ ...formData, consumption: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="peak" className="flex-1">
                Peak Period
              </Label>
              <Switch
                id="peak"
                checked={formData.peak}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, peak: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="reason">Reason / Notes *</Label>
              <Textarea
                id="reason"
                placeholder="Enter reason for consumption level or outage details"
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                required
              />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="encrypted" className="flex-1">
                Encrypt Data (FHE)
              </Label>
              <Switch
                id="encrypted"
                checked={formData.encrypted}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, encrypted: checked })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Creating..." : "Create Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateEntryDialog;
