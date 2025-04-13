import {useContext, useEffect, useState } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";

/* @desc: This component is used to display all informations about an item in store
 * @param id: the item identifier, used to retrieve item's data
 * @param clickFn: the handler to add the item to the basket
 * @return: Item component of the website page
 */
function Item({ id, add, goto }) {

    const [item, setItem] = useState(null); // Item data
    const { fetchItem } = useContext(ShopAPIContext);

    useEffect(() => { // Fetch all item's data
        fetchItem(id)
            .then(data => setItem(data))
            .catch(e => console.error(`[Item;useEffect] ${e.message}`));
    }, []);

    const home = ( // HTML image rendering
        <div className="item">

            <img src={(!item) ? "??" : item.image} alt=""/>

            <div className="item-description-border">
                <div className="item-description">
                    <p>{(!item) ? "" : item.description}</p>
                </div>
            </div>

            <button className="item-button" id={id} onClick={handleClick} price={item?.price}>
            </button>


        </div>
    );

    function handleClick() { add(id); goto(); };

    return (
        <div className="home">
            <div className="showcase">
                {home}
            </div>
        </div>
    );

/* Fusionner la variable home et le rendu du composant Item */

} export default Item;