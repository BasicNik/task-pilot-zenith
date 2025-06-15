
import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Check, Star } from "lucide-react";
import type { TaskStatus } from "./types";

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onComplete: () => void;
  onStar: () => void;
  onStatusChange: (status: TaskStatus) => void;
}

const BulkActions: React.FC<BulkActionsProps> = ({
  selectedCount,
  onDelete,
  onComplete,
  onStar,
  onStatusChange,
}) => (
  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 bg-muted/70 px-4 py-2 rounded-lg border mb-2 items-start sm:items-center w-full">
    <span className="font-semibold">{selectedCount} selected</span>
    <div className="flex gap-2 flex-wrap">
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        className="px-4 w-full sm:w-auto"
      >
        <Trash2 className="w-4 h-4" /> Delete
      </Button>
      <Button
        variant="aurora-outline"
        size="sm"
        onClick={onComplete}
        className="px-4 w-full sm:w-auto"
      >
        <Check className="w-4 h-4" /> Mark Complete
      </Button>
      <Button
        variant="aurora-outline"
        size="sm"
        onClick={onStar}
        className="px-4 w-full sm:w-auto"
      >
        <Star className="w-4 h-4" /> Star
      </Button>
    </div>
    <div className="flex items-center gap-2 w-full sm:w-auto">
      <span>Status:</span>
      <select
        className="border rounded px-2 py-1 bg-background"
        onChange={(e) => onStatusChange(e.target.value as TaskStatus)}
        defaultValue=""
      >
        <option value="" disabled>Change all...</option>
        <option value="Not Started">Not Started</option>
        <option value="Pending">Pending</option>
        <option value="Almost Done">Almost Done</option>
        <option value="Completed">Completed</option>
      </select>
    </div>
  </div>
);

export default BulkActions;
