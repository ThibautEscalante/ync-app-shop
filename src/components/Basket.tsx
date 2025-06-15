import {useContext, useEffect, useState, useCallback } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";
import Section from './Section';

function BasketArticle({ item, size, quantity, compact, add, rm, del }) {
    return (item &&
        <div className="article"> {/* ARTICLE */}

            {!compact && <>
                {/* IMAGE */}
                <div className="article-image">

                    <img className="image" src={(!item) ? "" : item.images[0]}/>
                    <img className="labeled-price" src="/assets/label_ync.png"/>
                    <p className="image-price">{!item ? 0 : item.price}€</p>

                </div>

                {/* INFOS */}
                <div className="article-information">

                    <h3 className="article-title">{(!item) ? "?" : item.display_name}</h3>
                    <p className="article-delivery-description">{(!item) ? "?" : item.basket_description}</p>

                    <div className="article-icon">
                        {(quantity < 5 && !compact)
                            ? ([...Array(quantity)].map((_,i) => <img key={i} className="icon" src="assets/home_icon.svg"/>))
                            : (<><img className="icon" src="assets/home_icon.svg"/><p>x{quantity}</p></>)
                        }
                    </div>

                    <div className="article-incrementator">
                        {quantity > 1 ?
                            <button id={item.id} className="article-remove" onClick={() => rm(item.id, size)}>-</button>
                            : <button id={item.id} className="article-remove" onClick={() => rm(item.id, size)} disabled>-</button>
                        }
                        <button id={item.id} className="article-add" onClick={() => add(item.id, size)}>+</button>
                    </div>

                    <p className="article-price">{(!item) ? "?" : item.price * quantity}€</p>
                    <button id={item.id} className="article-delete" onClick={() => del(item.id, size)}>X</button>

                </div>

            </>}

        </div>
    );
}

function BasketItem({ basket, id, compact, add, rm, del }) {

    const { fetchItem } = useContext(ShopAPIContext);
    const [item, setItem] = useState(null);

    useEffect(() => {
        fetchItem(id)
            .then(data => setItem(data))
            .catch(e => console.error(`[BasketItem;useEffect] ${e.message}`));
    }, [basket]);

    return (<>
        {Object.entries(basket[id]).map(el => <BasketArticle item={item} size={el[0]} quantity={basket[id][el[0]]} compact={compact} add={add} rm={rm} del={del}/>)}
    </>);
}

function BasketPrice({ basket, compact, next }) {

    const { fetchItem } = useContext(ShopAPIContext);
    const [price, setPrice] = useState({amount: 0, fee: 0});

    useEffect(() => {

        let new_fee = 0, new_amount = 0;

        for (const item in basket) {

            fetchItem(item).then((data) => {
                for (const size in basket[item]) {
                    new_fee += .01 * basket[item][size];
                    new_amount += basket[item][size] * parseFloat(data.price);
                    setPrice(p => ({...p, amount: new_amount, fee: new_fee}));
                }
            }).catch(e => console.error(`[BasketPrice;useEffect] ${e.message}`));

        }

    }, [basket]);

    return (

        <div className="order-summary">

            {/* TITLE */}
            <div className="title">ORDER SUMMARY</div>

            {/* DETAILS */}
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

            {/* BUTTON */}
            {!compact && (<button className="order-button" onClick={next}>JE PASSE À LA SUITE</button>)}

        </div>
      );
}


/* @desc: This component is used to display all items currently in the basket and all pricing informations
 * @param basket: a list of all items in the basket
 * @return: Basket component of the website page
 */
function Basket({ basket, compact=true, add=undefined, rm=undefined, del=undefined, next=undefined }) {

    // const isEmpty = !basket || Object.keys(basket).length === 0;
    const isEmpty = !basket || Object.entries(basket).every(([_, quantity]) => quantity <= 0);

    return (<>
        <Section name="Panier" image="assets/basket_icon.svg" />
        {isEmpty
            ? (<div className="empty-basket-wrapper"> {/* NO BASKET */}

                <p className="empty-basket">&lt; No item in your cute lil basket &gt;</p>

                <div className="empty-basket-image-container">
                    <img src="/assets/empty_basket3.svg" alt="Empty basket" className="empty-basket-image" />
                </div>

            </div>)
            : (<div className="basket"> {/* BASKET */}
                {/* BASKET ARTICLES */}
                <div className="basket-rows">
                    {Object.keys(basket).map((item, i) => <BasketItem key={i} basket={basket} id={item} compact={compact} add={add} rm={rm} del={del}/>)}
                </div>

                {/* ORDER SUMMARY */}
                <BasketPrice basket={basket} compact={compact} next={next}/>

            </div>)}

    </>);

} export default Basket;
