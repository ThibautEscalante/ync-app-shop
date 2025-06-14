import { useState, useEffect, useContext, useMemo } from 'react';
import { isChrome, isFirefox, isSafari, isOpera, isIE } from 'react-device-detect';
import { make } from 'simple-body-validator';

import ShopAPIContext from "../context/ShopAPIProvider";
import Basket from "./Basket";

import { useForm } from "react-hook-form";

import { paypalPage, PAYMENT_STATES } from './PaymentServices';

import { usePaymentForm } from './PaymentForm';


// Address API URL
const ADDRESS_API_URL = "https://api-adresse.data.gouv.fr/search/";

function PaymentForm({ basket, handleChange, rules, order}) {

    const [addressInput, setAddressInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);


    const fetchSuggestions = async (query) => {
        // Si le form est vide on efface les suggestions
        if (!query) {
            setSuggestions([]);
            return;
          }
          
        try {
            const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
            const data = await response.json();
    
            if (Array.isArray(data.features)) {
                setSuggestions(data.features);
            } else {
                setSuggestions([]);
            }
        } catch (error) {
            console.error("Erreur lors de la recherche d'adresse :", error);
            setSuggestions([]);
        }
    };
        

        // {
        //     "features": [
        //       {
        //         "properties": {
        //           "label": "12 Rue de l'Église 75000 Paris",
        //           "city": "Paris",
        //           "postcode": "75000",
        //           "context": "75, Paris, Île-de-France",
        //           "street": "Rue de l'Église"
        //         },
        //         "geometry": {
        //           "coordinates": [2.35, 48.85],
        //           "type": "Point"
        //         },
        //         ...
        //       },
        //       ...
        //     ]
        //   }
          
    const handleAddressChange = (e) => {
        const value = e.target.value;
        setAddressInput(value);
        
        if (value.length > 2) {  // Longueur de la recherche dès +2 caractères
            fetchSuggestions(value);
        } else {
            setSuggestions([]);
        }
        
        handleChange(e);
    };
    
    

    const handleSuggestionClick = (suggestion) => {
        const label = suggestion.properties.label;
        setAddressInput(label);
        setSelectedSuggestion(suggestion);
        setSuggestions([]);
        
        // Mise à jour du champ adresse
        handleChange({
          target: {
            name: "address",
            value: label,
          },
        });
      
        // Mise à jour des autres champs
        if (suggestion) {
          const { city, postcode, context } = suggestion.properties;
      
          console.log("→ city:", city);
          console.log("→ postcode:", postcode);
          console.log("→ context:", context);
      
          handleChange({ target: { name: "city", value: city || "" } });
          handleChange({ target: { name: "postal_code", value: postcode || "" } });
      
          if (context) {
            const parts = context.split(',').map((part) => part.trim());
            const region = parts.length >= 3 ? parts[2] : parts[1] || "";
            handleChange({ target: { name: "region", value: region } });
          }
        }
      };
      
      
      
      

    const [errors, setErrors] = useState({});

       // Fonction de validation spécifique au téléphone
  const validatePhone = (value) => {
    if (!value) return '';
    if (!/^0\d{9}$/.test(value)) return 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.'; // commence par "0" et contient exactement 10 chiffres
    return ''; // Si aucune erreur
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
  
    // Valisation spécifique pour le téléphone
    if (name === 'phone') {
      const errorMessage = validatePhone(value);
      if (errorMessage) {
        setErrors((prev) => ({
          ...prev,
          [name]: errorMessage,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined,
        }));
      }
    } else {
      const singleFieldData = { [name]: value };
      const singleRule = { [name]: rules[name] };
  
      const validator = make(singleFieldData, singleRule);
  
      if (!validator.validate()) {
        const fieldError = validator.errors().first(name);
        setErrors((prev) => ({
          ...prev,
          [name]: fieldError,
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [name]: undefined, // Aucune erreur pour ce champ
        }));
      }
    }
  
    };

    useEffect(() => {
        console.log('errors updated:', errors);
      }, [errors]);

    return (
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

                        <input type="email" name="mail" placeholder="Email" onChange={handleChange} onBlur={handleBlur} required className={errors.mail ? 'error-border' : ''}/>
                        {errors.mail && <p className="error-message">{errors.mail}</p>}

                        <div className="checkbox-container">
                            <input type="checkbox" id="newsletter" name="newsletter" onChange={handleChange} />
                            <label htmlFor="newsletter">M'envoyer un mail lorsque YNG sort une nouvelle création.</label>
                        </div>

                    </div>


                    <div className="shipping">
                
                        <h1>Livraison</h1>
                        
                        <div className="name-fields">

                            <input type="text" name="first_name" placeholder="Prénom*" onChange={handleChange} onBlur={handleBlur} required className={errors.first_name ? 'error-border' : ''}/>
                            <input type="text" name="name" placeholder="Nom" onChange={handleChange} onBlur={handleBlur} required className={errors.name ? 'error-border' : ''}/>
                            
                
                        </div>
                        {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                            {errors.name && <p className="error-message">{errors.name}</p>}

                        <input type="text" name="region" placeholder="Pays/Région" value={order.region || ""} onChange={handleChange} onBlur={handleBlur} required className={errors.region ? 'error-border' : ''}/>
                        {errors.region && <p className="error-message">{errors.region}</p>}

                        <input type="text" name="address" placeholder="Adresse" value={addressInput} onChange={handleAddressChange} onBlur={handleBlur} required className={errors.address ? 'error-border' : ''}/>
                        {suggestions && suggestions.length > 0 && (
                            <ul className="autocomplete-list">
                                {suggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    className="autocomplete-item"
                                >
                                    {suggestion.properties.label}
                                </li>
                                ))}
                            </ul>
                        )}
                        {errors.address && <p className="error-message">{errors.address}</p>}

                        <div className="city-fields">
                            <input type="text" name="postal_code" placeholder="Code Postal" value={order.postal_code || ""} onChange={handleChange} onBlur={handleBlur} required className={errors.postal_code ? 'error-border' : ''}/>
                            <input type="text" name="city" placeholder="Ville"  value={order.city || ""}onChange={handleChange} onBlur={handleBlur} required className={errors.city ? 'error-border' : ''}/>
                            
                        </div>
                        {errors.postal_code && <p className="error-message">{errors.postal_code}</p>}
                            {errors.city && <p className="error-message">{errors.city}</p>}

                        <input type="tel" name="phone" placeholder="Téléphone" onChange={handleChange} onBlur={handleBlur} className={errors.phone ? 'error-border' : ''}/>
                        {errors.phone && <p className="error-message">{errors.phone}</p>}
                
                    </div>

                    <div className="checkbox-container">
                        <input type="checkbox" id="gtc" name="gtc" onChange={handleChange} />
                        <label htmlFor="gtc">J'ai lu et j'accepte les conditions générales de vente.</label>
                        {/* {errors.gtc && <p className="error-message">Vous devez accepter les CGV.</p>} */}
                    </div>

                </div>
    );
}
function PaymentRow({ basket, id }) {
        const { fetchItem } = useContext(ShopAPIContext);

        const [item, setItem] = useState(null);
        useEffect(() => { // Retrieve item's data
            fetchItem(id)
                .then(data => setItem(data))
                .catch(e => console.error(`[BasketItem;useEffect] ${e.message}`));
        }, [basket]);
    return (
        <div className="payment-product">
                        
                        <div className="payment-product-image">

                            <div className="payment-product-icon" >
                                <img className="payment-basket-image" src={(!item) ? "" : item.image}/>
                            </div>

                        </div>

                        <div className="payment-product-details">

                            <div className="product-name"> {(!item) ? "?" : item.display_name} </div>
                            <div className="product-quantity"> {basket[id]}</div>

                        </div>

                        <div className="product-price"> {(!item) ? "?" : item.price * basket[id]} €</div>
        </div>
    );
}
function PaymentRows({ basket }){
    return (
        <div className="payment-rows">
            {Object.keys(basket).map((item, i) => <PaymentRow key={i} basket={basket} id={item}/>)}
        </div>
    );
}
function PaymentPrice({ basket, time2Pay, formValid}){

    const { fetchItem } = useContext(ShopAPIContext);
    const [price, setPrice] = useState({amount: 0, fee: 0});

    // useEffect(() => {
    //     let new_fee = 0, new_amount = 0;
    //     for (const item in basket) {
    //         fetchItem(item).then((data) => {
                
    //             new_fee += .01 * basket[item];
    //             new_amount += basket[item] * parseFloat(data.price);
    //             setPrice( p => ({...p, amount: new_amount, fee: new_fee}) );
    //         }).catch(e => console.error(`[BasketPrice;useEffect] ${e.message}`));
    //     }

    // }, [basket]);

    useEffect(() => {
        async function calculatePrice() {
          let new_fee = 0;
          let new_amount = 0;
      
          // On lance toutes les requêtes fetchItem en parallèle
          const itemsData = await Promise.all(Object.keys(basket).map(item => fetchItem(item)));
      
          // Une fois toutes les réponses reçues, on calcule le total
          itemsData.forEach((data, index) => {
            const quantity = basket[Object.keys(basket)[index]];
            new_fee += 0.01 * quantity;
            new_amount += quantity * parseFloat(data.price);
          });
      
          // Mise à jour une seule foiss de l'état
          setPrice({ amount: new_amount, fee: new_fee });
        }
      
        calculatePrice();
      }, [basket]);
      

    return (
        <div className="payment-basket">

                <div className="payment-summary">
                <h1>Résumé du paiement</h1>
                </div>

                <div className="basket-summary">
                
                <PaymentRows basket={basket}/>
                

                    <div className="basket-price-compact">
                        <div className="price-details-compact">
                            <div className="price-row-compact">
                                <span className="price-label-compact">Montant</span>
                                <span className="price-value-compact">{price.amount} €</span>
                            </div>
                            <div className="price-row-compact">
                                <span className="price-label-compact">Livraison</span>
                                <span className="price-value-compact">{price.fee} €</span>
                            </div>
                            <div className="total-row-compact">
                                <span className="price-label-compact">TOTAL</span>
                                <span className="total-value-compact">{price.amount + price.fee} €</span>
                            </div>
                        </div>
                        <button className="finalisation-button" onClick={time2Pay} disabled={!formValid}>Je finalise mon achat</button>
                    </div>

                    </div>

                    <div className="payment-note">
                    Tu seras redirigé vers PayPal, notre unique moyen de paiement pour le moment. (Désolé D'avance :/)
                    </div>

                
                
                
            </div>
    );
}
function Payment({ basket, goto }) {
    const { fetchItem, fetchOrder, postOrder, captureOrder } = useContext(ShopAPIContext);

    // const [errors, setErrors] = useState({});

    // const [order, setOrder] = useState({
    //     first_name: '', name: '', phone: '', mail: '',
    //     address: '', postal_code: '', city: '', region: '',
    //     newsletter: false, gtc: false
    // });

    const rules = {
        first_name: 'required|alpha', name: 'required|alpha', phone: 'nullable|telephone', mail: 'required|email',
        address: 'required|string', postal_code: 'required|string', city: 'required|string', region: 'required|string',
        gtc: 'accepted'
    };

    const { order, errors, handleChange, handleBlur, formValid, setOrder, setErrors } = usePaymentForm({
        first_name: '', name: '', phone: '', mail: '',
        address: '', postal_code: '', city: '', region: '',
        newsletter: false, gtc: false
    }, rules);
    
    

    

    const [approved, setApproved] = useState('');
    
    const [message, setMessage] = useState('');

    const time2Pay = async () => {
  


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
                setMessage('THANKS A LOT !');
                goto();
            }).catch(e => console.error(`[Payment;time2pay] ${e.message} (${e.status})`));
        }
    };

    // const formValid = useMemo(() => {
    //     const hasErrors = Object.values(errors).some(e => e !== undefined && e !== null && e !== '');
    
    //     const allRequiredFilled = rules && Object.keys(rules).every((key) => {
    //     if (rules[key].includes('required') || rules[key].includes('accepted')) {
    //         const val = order[key];
    //         return val !== undefined && val !== null && val !== '' && val !== false;
    //     }
    //     return true;
    //     });
    
    //     return !hasErrors && allRequiredFilled;
    // }, [errors, order]);

    return (


            <div className="payment">


                <PaymentForm basket={basket} handleChange={handleChange} rules={rules} order={order}/>

            

            {/* PARTIE DROITE */}

            <PaymentPrice basket={basket} time2Pay={time2Pay} formValid={formValid}/>
            
            
            {/* Message conditionnel si le paiement est approuvé */}
            {(approved !== '') && (
                <div className="payment-message">
                {message}
                </div>
            )}
            
            </div>


    );
} export default Payment;