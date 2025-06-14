import { useContext, useEffect, useState, forwardRef } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";

const Gallery = forwardRef(function Gallery({ ids, onItemClick }, ref) {
    const { fetchItem } = useContext(ShopAPIContext);
    const [images, setImages] = useState([]);

    useEffect(() => {
        (async () => {
            const data = await Promise.all(ids.map(async id => {
                try {
                    const item = await fetchItem(id);
                    return (item && item.image) ? { id, src: item.image } : null;
                } catch (e) {
                    console.error(`[Gallery] ${id}: ${e.message}`);
                    return null;
                }
            }));

            const validImages = data.filter(image => image !== null);
            setImages(validImages);
        })();
    }, [ids]);

    if (images.length === 0) return null;

    return (
        <div className="gallery" ref={ref}> {/* GALLERY */}

            <div className="gallery-container">
                <div className="gallery-thumbnails">
                    {images.map(({ id, src }) => (
                        <div key={id} className="gallery-thumbnail">
                            <div className="image-wrapper">
                                <img
                                    src={src}
                                    alt={`Article ${id}`}
                                    className="gallery-image"
                                    onClick={() => onItemClick(id)}
                                />
                            </div>
                            <div className="description-wrapper">
                                <div className="gallery-title">STAIRS Tee</div>
                                <div className="gallery-description">Black on White • Unisex</div>
                                <div className="gallery-note">“Create or consume.”</div>
                                <div className="gallery-label">AAA</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="gallery-logo">
                <img src="/assets/yng_metal_logo.png" alt="ync-logo" className="gallery-logo-image" />
            </div>

            <div className="gallery-phrase"></div>

            <div className="gallery-text">
                <p>
                    Nous préparons de nouveaux articles et designs exclusifs.
                    <br />
                    Restes connecté — notre équipe adore explorer de nouveaux concepts, tester des idées folles,
                    pour enrichir notre univers avec de nouvelles pièces.
                </p>
                <p>
                    © 2025 Young New Corporation. L’univers est en expansion – nous aussi.
                </p>
            </div>

        </div>
    );
});

export default Gallery;