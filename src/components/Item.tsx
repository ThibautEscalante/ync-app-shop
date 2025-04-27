import { useContext, useEffect, useState } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";

/* @desc: This component is used to display all informations about an item in store
 * @param id: the item identifier, used to retrieve item's data
 * @param clickFn: the handler to add the item to the basket
 * @return: Item component of the website page
 */

function Vitrine({ id, add, goto }) {

    const [item, setItem] = useState(null);
    const { fetchItem } = useContext(ShopAPIContext);

    useEffect(() => {
        fetchItem(id)
            .then(data => setItem(data))
            .catch(e => console.error(`[Vitrine;useEffect] ${e.message}`));
    }, [id]);

    function handleClick() { 
        add(id); 
        goto(); 
    };

    const home = (
        <div className="item">
            
            <div className="shadow-image">
                <img src={(!item) ? "??" : item.image} alt=""/>
            </div>

            <div className="item-description-border">
                <div className="item-description">
                    <p>{(!item) ? "" : item.description}</p>
                </div>
            </div>

            <button className="item-button" id={id} onClick={handleClick} price={item?.price}>
            </button>

        </div>
    );

    return (
        <div className="home">
            <div className="showcase">
                {home}
            </div>
        </div>
    );
}


function Gallery({ ids }) {
    const { fetchItem } = useContext(ShopAPIContext);
    const [images, setImages] = useState([]);

    useEffect(() => {
        async function fetchImages() {
            const allImages = [];

            for (const id of ids) {
                try {
                    const item = await fetchItem(id);
                    if (item && item.image) {
                        allImages.push({
                            id: id,
                            src: item.image,
                        });
                    }
                } catch (e) {
                    console.error(`[Gallery;fetchImages] Erreur pour l'item ${id}: ${e.message}`);
                }
            }

            setImages(allImages);
        }

        fetchImages();
    }, [ids]);

    if (images.length === 0) return null; // Pas d'images rien afficher  ATTENTION

    return (
        <div className="gallery-container">
            <div className="gallery-thumbnails">
                {images.map((img, index) => (
                    <div key={index} className="gallery-thumbnail">
                        <img src={img.src} alt={`Article ${img.id}`} className="gallery-image" />
                        <div className="gallery-title">{img.id}</div>
                    </div>
                ))}
            </div>
        </div>

    );
}


function Item({ id, galleryIds, add, goto }) {

    const [isGalleryVisible, setIsGalleryVisible] = useState(false);

    return (
        <div className="item-page">

            <Vitrine id={id} add={add} goto={goto} />
            <Gallery ids={galleryIds} />

        </div>
    );
}

export default Item;