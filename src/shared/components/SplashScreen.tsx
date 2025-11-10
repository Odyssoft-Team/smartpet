import { Loader2Icon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-black"
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 text-2xl font-black text-cyan-500 dark:text-blue-400">
            <span>ALLQU PET</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2">
            <Loader2Icon className="animate-spin size-6" />
            TECNOLOGÍA, AMOR Y CONFIANZA AL SERVICIO DE QUIENES MÁS QUEREMOS
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
