import { useState } from 'react';
import { make, register } from 'simple-body-validator';

function useFormValidator() {
    const [order, setOrder] = useState({
        first_name: '', name: '', phone: '', mail: '',
        address: '', postal_code: '', city: '', region: '',
        newsletter: false, gtc: false
    });

    const [errors, setErrors] = useState({
        first_name: '', name: '', phone: '', mail: '',
        address: '', postal_code: '', city: '', region: ''
    });

    const setFormValue = (input, value) => {
        let isValueValid = true;

        if (input === 'address') {
        } else if (input === 'phone') {
        } else if (input === 'newsletter' || input === 'gtc') {
            isValueValid = (typeof input === 'boolean');
        }

        if (isValueValid) setOrder({...order, [input]: value});
    };

    const isFormValid = () => {
        return true;
    };


  return { order, errors, setFormValue, isFormValid };
}

export default useFormValidator;
