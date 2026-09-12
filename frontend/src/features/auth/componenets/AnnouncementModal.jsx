import Modal from "../../../components/ui/Modal";
import Button from "../../../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { Scan, User } from "lucide-react";

export default function AnnouncementModal() {
  const { showAnnouncement, dismissAnnouncement } = useAuth();

  return (
    <Modal
      open={showAnnouncement}
      onClose={dismissAnnouncement}
      title={
        <span className="flex items-center gap-2">
          <Scan size={30} nonScalingStroke>
            <User size={10} x={7} y={6} nonScalingStroke />
          </Scan>
          UniMember Team
        </span>
      }
      size="md"
    >
      <p className="text-sm leading-6 ">
        You're in Unimember V1.0. Something new coming soon!
      </p>

      <div className="mt-6 flex justify-end">
        <Button variant="primary" size="md" onClick={dismissAnnouncement}>
          Got it
        </Button>
      </div>
    </Modal>
  );
}
