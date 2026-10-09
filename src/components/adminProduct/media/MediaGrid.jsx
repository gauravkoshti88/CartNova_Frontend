import { AnimatePresence, motion } from "framer-motion";
import MediaItem from "./MediaItem";

export default function MediaGrid({
  media,

  onDelete,

  onPrimary,

  onPreview,
}) {
  if (!media.length) return null;

  return (
    <AnimatePresence>
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5 mt-6"
      >
        {media.map((image, index) => (
          <MediaItem
            key={image.id || image.publicId || image.url || `media-${index}`}
            image={image}
            onDelete={onDelete}
            onPrimary={onPrimary}
            onPreview={onPreview}
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
