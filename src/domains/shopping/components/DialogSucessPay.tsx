// components/PaymentSuccessDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check, Loader2 } from "lucide-react";

interface PaymentSuccessDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PaymentSuccess({ isOpen, onClose }: PaymentSuccessDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" strokeWidth={3} />
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900">
              ¡Pago Realizado con Éxito!
            </DialogTitle>
            <DialogDescription className="text-sm mt-2">
              Tu pedido ha sido procesado correctamente.
            </DialogDescription>
          </div>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 mt-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin text-sky-500" />
            Redirigiendo al inicio...
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
