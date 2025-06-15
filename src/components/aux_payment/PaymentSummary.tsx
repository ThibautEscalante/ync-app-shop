import { useState } from 'react';
import ShopAPIContext from "../context/ShopAPIProvider";

function PaymentItem({ id, quantity }) {
}

function PaymentSummary({ basket, valid }) {
    const [price, setPrice] = useState({amout: 0, fee: 0});

    return (<>
        <div className="payment-basket">
            <div className="payment-summary">
                <h1>Résumé du paiement</h1>
            </div>

            <div className="basket-summary">
                {Object.values(basket).map(sizes => {
                    <PaymentItem />
                })}
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

            <div className="payment-note">Tu seras redirigé vers PayPal, notre unique moyen de paiement pour le moment. (Désolé D'avance :/)</div>
        </div>
    </>);
}

export default PaymentSummary;
