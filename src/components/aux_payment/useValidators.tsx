import { useState } from 'react';
import { make, register } from 'simple-body-validator';

function useValidators() {

    register('telephone', function (value) {
        if (!value) return true;
        return /^0\d{9}$/.test(value);
    });

    const requestAddress = async (address, limit) => {
        try {
            const uri = `https://${process.env.FRENCH_GOV_ADDRESS_API}`;
            const res = fetch(`${uri}/search/?q=${encodeURIComponent(address)}&limit=${limit}`);
            let data = [];
            for (let i = 0; i < res.features.length; i++) {
                data[i] = res.features[i].properties;
            }
            return data;
        } catch (e) {
            console.error(`[useValidators;requestAddress] ${e.message}`);
        }
    };

    register('address', async function (value) {
        return requestAddress(value, 1)[0] === value;
    });

    const rules = {
        first_name: 'required|alpha',
        name: 'required|alpha',
        phone: 'nullable|telephone',
        mail: 'required|email',
        address: 'required|address',
        postal_code: 'required|string',
        city: 'required|string',
        region: 'required|string',
        gtc: 'accepted'
    };

    const getAddressSuggestions = (value) => requestAddress(value, 5);

    const isFieldValid = (field, value) => {
        const validator = make({[field]: value}, {[field]: rules[value]});
        if (validator.validate()) {
            return { valid:true, error:undefined };
        } else {
            const err = validator.errors().first(field);
            return { valid:false, error:err };
        }
    };

    const isFormValid = (order) => {
        const validator = make(order, rules);
        return validator.validate();
    }

    return { getAddressSuggestions, isFieldValid, isFormValid };
}
