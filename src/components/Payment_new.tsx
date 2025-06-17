import { useState } from 'react';

import Section from './Section';
import PaymentForm from './aux_payment/PaymentForm';
import PaymentSummary from './aux_payment/PaymentSummary';
import useValidators from './aux_payment/useValidators';

function Payment({ basket }) {
    const { isFormValid } = useValidators();

    const [order, setOrder] = useState({
        first_name: '', name: '', phone: '',
        mail: '', address: '',
        postal_code: '', city: '', country: '',
        newsletter: false, gtc: false
    });
    const setOrderField = (field, value) => setOrder(order => { return {...order, [field]: value}; });

    const [errors, setErrors] = useState({
        first_name: '', name: '', phone: '',
        mail: '', address: '',
        postal_code: '', city: '', country: '',
        newsletter: '', gtc: ''
    });
    const setErrorsField = (field, value) => setErrors(errors => { return {...errors, [field]: value}; });

    const time2pay = () => {
        const result = isFormValid(order);
        if (!result.valid) setErrors(result.error);
        console.log(result);
    }

    return (<>
        <Section name="Payment" image="assets/payment_icon.svg" />
        <div className="payment">
            <PaymentForm order={order} setOrderField={setOrderField} errors={errors} setErrorsField={setErrorsField}/>
            <PaymentSummary basket={basket} payment={time2pay}/>
        </div>
        <div className="payment-status">
            {}
        </div>
    </>);
}

export default Payment;
