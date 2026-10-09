import { AnimatePresence, motion } from "framer-motion";
import {
    X,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    RotateCw
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export default function MediaPreviewModal({
    open,
    media,
    currentImage,
    onClose

}) {

    const [zoom, setZoom] = useState(1);

    const [rotation, setRotation] = useState(0);

    const currentIndex = useMemo(() => {

        return media.findIndex(

            img => img.id === currentImage?.id

        );

    }, [media, currentImage]);

    const [index, setIndex] = useState(currentIndex);

    useEffect(() => {

        setIndex(currentIndex);

    }, [currentIndex]);

    useEffect(() => {

        const keyDown = (e) => {

            if (!open) return;

            if (e.key === "Escape") onClose();

            if (e.key === "ArrowRight") {

                nextImage();

            }

            if (e.key === "ArrowLeft") {

                prevImage();

            }

        };

        window.addEventListener("keydown", keyDown);

        return () =>

            window.removeEventListener(

                "keydown",

                keyDown

            );

    }, [open, index]);

    const nextImage = () => {

        setZoom(1);

        setRotation(0);

        setIndex(

            (prev) =>

                (prev + 1) % media.length

        );

    };

    const prevImage = () => {

        setZoom(1);

        setRotation(0);

        setIndex(

            (prev) =>

                prev === 0

                    ?

                    media.length - 1

                    :

                    prev - 1

        );

    };

    const image = media[index];

    if (!open || !image) return null;

    return (

        <AnimatePresence>

            {

                open && (

                    <motion.div

                        initial={{

                            opacity: 0

                        }}

                        animate={{

                            opacity: 1

                        }}

                        exit={{

                            opacity: 0

                        }}

                        className="fixed inset-0 z-50 bg-black/80 flex justify-center items-center"

                    >
                        <button

                            onClick={onClose}

                            className="absolute top-6 right-6 text-white"

                        >

                            <X size={32} />

                        </button>

                        <button

                            onClick={prevImage}

                            className="absolute left-5 text-white"

                        >

                            <ChevronLeft size={40} />

                        </button>

                        <button

                            onClick={nextImage}

                            className="absolute right-5 text-white"

                        >

                            <ChevronRight size={40} />

                        </button>

                        <motion.img

                            key={image.id}

                            initial={{

                                scale: .8,

                                opacity: 0

                            }}

                            animate={{

                                scale: zoom,

                                opacity: 1,

                                rotate: rotation

                            }}

                            transition={{

                                duration: .25

                            }}

                            src={

                                image.preview ||

                                image.url

                            }

                            alt=""

                            className="max-h-[85vh] rounded-xl"

                        />

                        <div

                            className="absolute bottom-8 flex gap-3 bg-black/60 rounded-full px-5 py-3"

                        >

                            <button

                                onClick={() =>

                                    setZoom(

                                        zoom + .2

                                    )

                                }

                                className="text-white"

                            >

                                <ZoomIn />

                            </button>

                            <button

                                onClick={() =>

                                    setZoom(

                                        Math.max(

                                            1,

                                            zoom - .2

                                        )

                                    )

                                }

                                className="text-white"

                            >

                                <ZoomOut />

                            </button>

                            <button

                                onClick={() =>

                                    setRotation(

                                        rotation + 90

                                    )

                                }

                                className="text-white"

                            >

                                <RotateCw />

                            </button>

                        </div>

                    </motion.div>

                )

            }

        </AnimatePresence>

    );

}