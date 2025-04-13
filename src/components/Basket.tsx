import {useContext, useEffect, useState, useCallback } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";

/* @desc: This component is used to display all informations about an item in store specifically for the basket page.
 * @param id: the item identifier, used to retrieve item's data
 * @param count: how many time the item is currently in the basket
 * @return: Row item component for the basket page
 */
function BasketItem({ basket, id, compact, add, rm }) {
    const { fetchItem } = useContext(ShopAPIContext);

    const [item, setItem] = useState(null);
    useEffect(() => { // Retrieve item's data
        fetchItem(id)
            .then(data => setItem(data))
            .catch(e => console.error(`[BasketItem;useEffect] ${e.message}`));
    }, [basket]);

    return (
        <div className="article">
            
            {!compact && <>
            
                <div className="article-image">
                    <img className="image" src={(!item) ? "" : item.image}/>
                    <img className="labeled-price" src={(!item) ? "" : item.image}/>
                </div>

                <div className="article-information">
                    
                    <h3 className="article-title">{(!item) ? "?" : item.display_name}</h3>
                    <p className="article-delivery-description">{(!item) ? "?" : item.basket_description}</p>

                    <div className="article-icon">
                        {(basket[id] < 5 && !compact)
                            ? ([...Array(basket[id])].map((_,i) => <img key={i} className="icon" src="assets/home_icon.svg"/>))
                            : (<><img className="icon" src="assets/home_icon.svg"/><p>x{basket[id]}</p></>)
                        }
                    </div>
                    
                    <div className="article-incrementator">
                        <button id={id} className="article-remove" onClick={() => rm(id)}>-</button>
                        <button id={id} className="article-add" onClick={() => add(id)}>+</button>
                    </div>

                    <p className="article-price">{(!item) ? "?" : item.price * basket[id]} €</p>

                </div>
            </>}

           
        </div>

    );
}

function BasketRows({ basket, compact, add, rm }) {
    return (
        <div className="basket-rows">
            {Object.keys(basket).map((item, i) => <BasketItem key={i} basket={basket} id={item} compact={compact} add={add} rm={rm}/>)}
        </div>
    );
}

/* @desc: This component is used to display all items currently in the basket and all pricing informations
 * @param basket: a list of all items in the basket
 * @return: Basket component of the website page
 */
function BasketPrice({ basket, compact, next }) {
    const { fetchItem } = useContext(ShopAPIContext);
    const [price, setPrice] = useState({amount: 0, fee: 0});

    useEffect(() => {
        let new_fee = 0, new_amount = 0;
        for (const item in basket) {
            fetchItem(item).then((data) => {
                // Compute fee based on data.price
                // maybe set a coupon system ?
                new_fee += .01 * basket[item];
                new_amount += basket[item] * parseFloat(data.price);
                setPrice( p => ({...p, amount: new_amount, fee: new_fee}) );
            }).catch(e => console.error(`[BasketPrice;useEffect] ${e.message}`));
        }

    }, [basket]);

    return (
        <div className="order-summary">

            <div className="title">ORDER SUMMARY</div>
                
            <div className="details">
                
                <div className="amount-row">
                    <div className="label">Montant</div>
                    <div className="value">{price.amount} €</div>
                </div>
                
                <div className="delivery-row">
                    <div className="label">Livraison</div>
                    <div className="value">{price.fee} €</div>
                </div>
                
                <div className="total-row">
                    <div className="label">TOTAL</div>
                    <div className="total-value">{price.amount + price.fee} €</div>
                </div>

            </div>

            {!compact && (<button className="order-button" onClick={next}>JE PASSE À LA SUITE</button>)}

        </div>
      );
}

/* @desc: This component is used to display all items currently in the basket and all pricing informations
 * @param basket: a list of all items in the basket
 * @return: Basket component of the website page
 */
function Basket({ basket, compact=true, add=undefined, rm=undefined, next=undefined }) {

    return (
        (!basket)
            ? (<div>No item in your cute lil basket</div>)
            : (<div className="basket">
                <BasketRows basket={basket} compact={compact} add={add} rm={rm}/>
                <BasketPrice basket={basket} compact={compact} next={next}/>
            </div>)
    );

} export default Basket;