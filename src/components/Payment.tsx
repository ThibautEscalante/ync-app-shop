import { useState,  useEffect, useContext } from 'react';
import { isChrome, isFirefox, isSafari, isOpera, isIE } from 'react-device-detect';
import { make } from 'simple-body-validator';

import ShopAPIContext from "../context/ShopAPIProvider";

import Basket from "./Basket";

function getBrowserOptions() {
    const windowFeatures = "left=100,top=100,width=600,height=800";
    if (isChrome) {
        return ["chromeWindow", windowFeatures];
    } else if (isFirefox) {
        return ["mozillaWindow", windowFeatures];
    } else if (isOpera || isSafari) {
        return [];
    } else if (isIE) {
        return ["IEWindow", windowFeatures];
    }
}

async function paypalPage(order, fetchOrder, captureOrder) {
    let popup = window.open(order.links[1].href, ...getBrowserOptions());

    let res = {status: 'NONE'};
    let processed = false;
    while (!processed) {
        res = await fetchOrder(order.id);
        if (res.status === 'APPROVED' || res.status === 'COMPLETED') processed = true;
    }

    await captureOrder({id: order.id, uuid: order.uuid});
    popup?.close();
    return res;
}

function Payment({ basket }) {
    const { fetchItem, fetchOrder, postOrder, captureOrder } = useContext(ShopAPIContext);

    const [order, setOrder] = useState({
        first_name: '', name: '', phone: '', mail: '',
        address: '', postal_code: '', city: '', country: '',
        newsletter: false, gtc: false
    });
    const [approved, setApproved] = useState('');
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setOrder((order) => ({...order, [name]: value}));
    };

    const time2Pay = async () => {
        const rules = {
            first_name: 'required|alpha', name: 'required|alpha', phone: 'sometimes|digits', mail: 'required|email',
            address: 'required|string', postal_code: 'required|string', city: 'required|string', country: 'required|string',
            gtc: 'accepted'
        };
        const validator = make(order, rules);

        if (!validator.validate()) {
            setApproved('UNVALID_FORM_ORDER');
            const errs = validator.errors().all();
            let err_msg = '';
            Object.keys(errs).map(key => err_msg += `- ${key} : ${errs[key]}`);
            setMessage(err_msg);

        } else {
            setApproved('VALID_FORM_ORDER');
            setMessage('Processing payment...');

            let price = 0;
            for (let item in basket) {
                await fetchItem(item)
                    .then(data => price += (parseFloat(data.price) * basket[item]))
                    .catch(e => console.error(`[Payment;time2pay | fetchItem] ${e.message} (${e.status})`));
            }
    
            let res = await postOrder({...order, items: basket, price: price});
            await paypalPage(res, fetchOrder, captureOrder).then((order) => {
                // @TODO
                // Page element to thank user;
                setApproved(order.status);
                // mailConfirmation(order);
                setMessage('THANKS A LOT !')
            }).catch(e => console.error(`[Payment;time2pay] ${e.message} (${e.status})`));
        }
    };


    // const [item, setItem] = useState(null);
    // useEffect(() => { // Retrieve item's data
    //     fetchItem(id)
    //         .then(data => setItem(data))
    //         .catch(e => console.error(`[BasketItem;useEffect] ${e.message}`));
    // }, [basket]);

    // const [price, setPrice] = useState({amount: 0, fee: 0});
    // useEffect(() => {
    //     let new_fee = 0, new_amount = 0;
    //     for (const item in basket) {
    //         fetchItem(item).then((data) => {
    //             // Compute fee based on data.price
    //             // maybe set a coupon system ?
    //             new_fee += .01 * basket[item];
    //             new_amount += basket[item] * parseFloat(data.price);
    //             setPrice( p => ({...p, amount: new_amount, fee: new_fee}) );
    //         }).catch(e => console.error(`[BasketPrice;useEffect] ${e.message}`));
    //     }

    // }, [basket]);

    return (


            <div className="payment">


                <div className="form">

                    <div className="delivery">

                        <h1>Méthode de livraison</h1>

                        <div className="shipping-option">
                            <input type="radio" id="to-my-address" name="shipping-method" defaultChecked />
                            <label htmlFor="to-my-address">À mon adresse</label>
                        </div>

                    </div>


                    <div className="contact">

                        <h1>Contact</h1>

                        <input type="email" name="mail" placeholder="Email" onChange={handleChange} required />

                        <div className="checkbox-container">
                            <input type="checkbox" id="newsletter" name="newsletter" onChange={handleChange} />
                            <label htmlFor="newsletter">M'envoyer un mail lorsque YNG sort une nouvelle création.</label>
                        </div>

                    </div>


                    <div className="shipping">
                  
                        <h1>Livraison</h1>
                        
                        <div className="name-fields">
                            <input type="text" name="first_name" placeholder="Prénom" onChange={handleChange} required />
                            <input type="text" name="name" placeholder="Nom" onChange={handleChange} required />
                        </div>

                        <input type="text" name="country" placeholder="Pays/Région" onChange={handleChange} required />

                        <input type="text" name="address" placeholder="Adresse" onChange={handleChange} required />

                        <div className="city-fields">
                            <input type="text" name="postal_code" placeholder="Code Postal" onChange={handleChange} required />
                            <input type="text" name="city" placeholder="Ville" onChange={handleChange} required />
                        </div>

                        <input type="tel" name="phone" placeholder="Téléphone" onChange={handleChange} />
                
                    </div>

                </div>
              

              {/* PARTIE DROITE */}
              <div className="payment-basket">

                <div className="payment-summary">
                  <h1>Résumé du paiement</h1>

                  <div className="basket-summary">
                  
                    <div className="basket-product">
                        
                        <div className="product-image">

                            <div className="product-icon" >
                                <img className="basket-image"/>
                            </div>

                        </div>

                        <div className="product-details">

                            <div className="product-name">Quelconque Tableau</div>
                            <div className="product-quantity">x 5</div>

                        </div>

                        <div className="product-price"> €</div>
                    </div>
                    
                  

                    <div className="basket-price-compact">
                        <div className="price-details-compact">
                            <div className="price-row-compact">
                                <span className="price-label-compact">Montant</span>
                                <span className="price-value-compact"> €</span>
                            </div>
                            <div className="price-row-compact">
                                <span className="price-label-compact">Livraison</span>
                                <span className="price-value-compact"> €</span>
                            </div>
                            <div className="total-row-compact">
                                <span className="price-label-compact">TOTAL</span>
                                <span className="total-value-compact"> €</span>
                            </div>
                        </div>
                        <button className="finalisation-button" onClick={time2Pay}>Je finalise mon achat</button>
                    </div>

                    </div>

                    <div className="payment-note">
                  Cette Action Redirigera Vers Paypal Qui Est L'unique Moyen De Paiement Disponible Actuellement (Désolé D'avance :/)
                </div>

                </div>
                
                
              </div>
              
              {/* Message conditionnel si le paiement est approuvé */}
              {(approved !== '') && (
                <div className="payment-message">
                  {message}
                </div>
              )}
              
            </div>












        // <div className="payment">
        //     <div className="payment-form">
        //         <div className="payment-contact">
        //             <h1>Contact</h1>
        //             <input type="email" name="mail" placeholder="E-mail" onChange={handleChange} required/>
        //             <input type="checkbox" name="newsletter" onChange={handleChange}/>
        //             <label htmlFor="newsletter">M'envoyer un mail lorsque YNC sort une nouvelle création.</label>
        //         </div>

        //         <div className="payment-shipping">
        //             <h1>Livraison</h1>
        //             <input type="text" name="first_name" placeholder="Prénom" onChange={handleChange} required/>
        //             <input type="text" name="name" placeholder="Nom" onChange={handleChange} required/>
        //             <input type="text" name="phone" placeholder="Téléphone" onChange={handleChange}/>
        //             <input type="text" name="address" placeholder="Adresse" onChange={handleChange} required/>
        //             <input type="text" name="city" placeholder="Ville" onChange={handleChange} required/>
        //             <input type="text" name="postal_code" placeholder="Code Postal" onChange={handleChange} required/>
        //             <input type="text" name="country" placeholder="Pays" onChange={handleChange} required/>
        //         </div>

        //         <div className="payment-gtc">
        //             <input type="checkbox" name="gtc" onChange={handleChange} required/>
        //             <label htmlFor="newsletter">J'ai lu les <a>conditions de ventes générale</a> et je reconnais que YNC sont les meilleurs.</label>
        //         </div>

        //         <button className="payment-button" onClick={time2Pay}>JE FINALISE MON ACHAT</button>
        //     </div>
        //     <div className="payment-basket">
        //         <Basket basket={basket}/>
        //     </div>
        //     {(approved !== '') && (
        //         <div className="payment-message">
        //             {message}
        //         </div>
        //     )}
        // </div>

    );
} export default Payment;