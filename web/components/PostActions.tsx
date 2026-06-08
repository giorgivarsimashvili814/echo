import { Ellipsis, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export default function PostActions({
  canEdit,
  canDelete,
  onEdit,
  isEditing,
  onDelete
}: {
  canEdit: boolean;
  canDelete: boolean;
  onEdit: () => void;
  isEditing: boolean;
  onDelete: () => void;
}) {
  const [showActions, setShowActions] = useState(false);

  if (!canEdit && !canDelete) return null;

  if (isEditing) return null;

  return (
    <div
      className="relative"
      tabIndex={-1}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setShowActions(false);
      }}
    >
      <Button
        variant="ghost"
        className="rounded-full"
        size="icon"
        onClick={() => setShowActions((prev) => !prev)}
      >
        <Ellipsis size={14} />
      </Button>
      {showActions && (
        <div className="absolute right-0 top-8 bg-white shadow rounded-lg flex flex-col min-w-28 z-10">
          {canEdit && (
            <Button
              variant="ghost"
              className="justify-start gap-2"
              onClick={() => {
                onEdit();
                setShowActions(false);
              }}
            >
              <Pencil size={14} /> Edit
            </Button>
          )}
          {canDelete && (
            <Button
              variant="ghost"
              className="justify-start gap-2 text-red-500 hover:text-red-500"
              onClick={() => {
                onDelete();
                setShowActions(false);
              }}
            >
              <Trash2 size={14} /> Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
