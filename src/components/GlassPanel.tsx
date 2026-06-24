import { motion } from 'framer-motion';

interface GlassPanelProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  glowColor?: string;
  borderColor?: string;
}

export const GlassPanel = ({
  children,
  style,
  glowColor = 'rgba(0, 255, 255, 0.05)',
  borderColor = 'rgba(0, 255, 255, 0.1)',
}: GlassPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        background: 'rgba(2, 6, 23, 0.6)',
        backdropFilter: 'blur(20px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.5)',
        border: `1px solid ${borderColor}`,
        borderRadius: 4,
        boxShadow: `
          0 0 30px ${glowColor},
          inset 0 0 30px ${glowColor},
          0 8px 32px rgba(2, 6, 23, 0.4)
        `,
        ...style,
      }}
    >
      {children}
    </motion.div>
  );
};
