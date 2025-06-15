import { useState } from 'react';

import Section from './Section';
import PaymentForm from './aux_payment/PaymentForm';
import PaymentSummary from './aux_payment/PaymentSummary';

function Payment({ basket }) {
    return (<>
        <Section name="Payment" image="assets/payment_icon.svg" />
        <div className="payment">
            <PaymentForm />
            <PaymentSummary basket={basket} />
        </div>
    </>);
}

export default Payment;
