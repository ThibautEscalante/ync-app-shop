import { useContext, useEffect, useState } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";

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

                <button
                    className="item-button custom-target"
                    id={id}
                    onClick={handleClick}
                    price={item?.price}
                />
            
            </div>
        
        </section>
    );
}

export default Vitrine;