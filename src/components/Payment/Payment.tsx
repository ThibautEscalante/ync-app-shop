import { useState } from 'react';

import { Section } from '../Section';
import { PaymentForm } from './PaymentForm';

function Payment({ basket }) {
    return (<>
        <Section name="Payment" image="assets/payment_icon.svg" />
        <PaymentForm />
        <PaymentSummary basket={basket} />
    </>);
}
