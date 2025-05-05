import { useContext, useEffect, useRef, useState } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";
import PopupItem from "./PopupItem";

function Vitrine({ id, add, goto }) {

    const [item, setItem] = useState(null);
    const { fetchItem } = useContext(ShopAPIContext);

    useEffect(() => {

        fetchItem(id)
            .then(setItem)
            .catch(e => console.error(`[Vitrine] ${e.message}`));

    }, [id]);

    const handleClick = () => {
        add(id);
        goto();
    };

    return (
        
        <section className="showcase"> {/* SHOWCASE */}

            {/* ITEM */}
            <div className="item">
                
                <div className="zoom-box">

                    <div className="shadow-image">
                        <img src={item?.image || "??"} alt="" />
                    </div>

                    <div className="item-description-border">
                        <div className="item-description">
                            <p>{item?.description || ""}</p>
                        </div>
                    </div>

                </div>

                <button className="item-button custom-target" id={id} onClick={handleClick} price={item?.price}/>
            
            </div>
        
        </section>

    );
}


function Gallery({ ids, onItemClick }) {

    const { fetchItem } = useContext(ShopAPIContext);
    const [images, setImages] = useState([]);

    // useEffect(() => {

    //     async function fetchImages() {
    //         const allImages = [];
        
    //         for (const id of ids) {
    //             try {
    //                 const item = await fetchItem(id);
    //                 if (item && item.image) {
    //                     allImages.push({ id, src: item.image });
    //                 }
    //             } catch (e) {
    //                 console.error(`Erreur pour l'item ${id}: ${e.message}`);
    //             }
    //         }
        
    //         setImages(allImages);
    //     }

    // }, [ids]);
    

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
        
        <div className="gallery"> {/* GALLERY */}

            <div className="gallery-container">
                
                <div className="gallery-thumbnails">

                    {images.map(({ id, src }) => (
                        <div key={id} className="gallery-thumbnail">
                            <img src={src} alt={`Article ${id}`} className="gallery-image" onClick={() => onItemClick(id)} />
                            <div className="gallery-title">{src}</div>
                        </div>
                    ))}
                    
                </div>

            </div>
            
            {/* GALLERY COPYRIGHT FOOTER */}
            <div className="gallery-text">

                <p> Nous préparons de nouveaux articles et designs exclusifs.
                    <br /> Restes connecté — notre équipe adore explorer de nouveaux concepts, tester des idées folles, pour enrichir notre univers avec de nouvelles pièces.
                </p>
                <img src="/assets/ync_circle_fire.png" alt="ync-fire-logo" className="gallery-text-image" />
                <p>© 2025 Young New Corporation. L’univers est en expansion – nous aussi.</p>

            </div>

        </div>
    );
}


function Item({ id, galleryIds, add, goto }) {

    const { fetchItem } = useContext(ShopAPIContext);
    const [popupItem, setPopupItem] = useState(null);
    const [popupId, setPopupId] = useState(null);
    const [isGalleryVisible, setIsGalleryVisible] = useState(false);
    const [likes, setLikes] = useState(0);

    const galleryTriggerRef = useRef(null);

    const handleItemClick = (clickedId) => setPopupId(clickedId);

    const closePopup = () => {
        setPopupId(null);
        setPopupItem(null);
    };

    useEffect(() => {

        const observer = new IntersectionObserver(([entry]) => { // IntersectionObserver détecte quand notre ref (galleryTriggerRef) le viewport ( la zone visible à l'écran)
            if (entry.isIntersecting) setIsGalleryVisible(true);
        }, { threshold: 0.8 }); // Si entry est visible à l'écran à au moins 80%

        if (galleryTriggerRef.current) { // existe donc on commence à le surveiller avec notre observer
            observer.observe(galleryTriggerRef.current);
        }
        return () => galleryTriggerRef.current && observer.unobserve(galleryTriggerRef.current); // on arrête de surveiller une fois l’apparition de la galerie pour ne ré-afficher la gallerie
        
    }, []);

    useEffect(() => {

        if (popupId) {
            fetchItem(popupId)
                .then(setPopupItem)
                .catch(err => console.error(`[Popup Fetch] ${err.message}`));
        }

    }, [popupId]);

    return (

        <div className="home">

            {/* SHOWCASE */}
            <Vitrine id={id} add={add} goto={goto} />

            {/* GALLERY */}
            <div ref={galleryTriggerRef} style={{ height: "10px" }}></div>
            {isGalleryVisible && <Gallery ids={galleryIds} onItemClick={handleItemClick} />}

            {/* POPUP */}
            {popupItem && (<PopupItem item={popupItem} onClose={closePopup} add={add} isSoldOut={false} toggleLike={() => setLikes(likes + 1)} />)}

        </div>

    );

}

export default Item;