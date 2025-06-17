import { useState } from 'react';

import Section from './Section';
import PaymentForm from './aux_payment/PaymentForm';
import PaymentSummary from './aux_payment/PaymentSummary';

function Payment({ basket }) {
    const [order, setOrder] = useState({
        first_name: '', name: '', phone: '',
        mail: '', address: '',
        postal_code: '', city: '', country: '',
        newletter: false, gtc: false
    });

    const setOrderField = (field, value) => setOrder(order => { return {...order, [field]: value}; });

    return (<>
        <Section name="Payment" image="assets/payment_icon.svg" />
        <div className="payment">
            <PaymentForm order={order} setOrderField={setOrderField}/>
            <PaymentSummary basket={basket} />
        </div>
    </>);
}

export default Payment;
