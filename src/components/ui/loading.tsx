import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

const Loading = ({ label }: { label: string }) => {
  return (
    <motion.div
      className="flex items-center gap-2 text-muted-foreground px-4 py-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Loader2 className="animate-spin w-4 h-4 text-primary" />
      <motion.span
        className="text-sm"
        initial={{ x: 10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

export default Loading;
