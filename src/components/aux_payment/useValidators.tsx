import { useState } from 'react';
import { make, register, setTranslationObject } from 'simple-body-validator';

function useValidators() {

   register('telephone', function (value) {
        if (!value) return true;
        return /^0\d{9}$/.test(value);
    });

    const requestAddress = async (address, limit) => {
        try {
            // const uri = `https://${process.env.FRENCH_GOV_ADDRESS_API}/search?q`;
            const uri = `https://api-adresse.data.gouv.fr/search?q=${encodeURIComponent(address)}&limit=${limit}`;
            const res = await fetch(uri);
            const data = await res.json();

            let result = [];
            for (let i = 0; i < data.features.length; i++) {
                result[i] = data.features[i].properties.label;
            }
            return result;
        } catch (e) {
            console.error(`[useValidators;requestAddress] ${e.message}`);
        }
    };

    register('address', function (value) {
        let address = requestAddress(value, 1)[0];
        address = address.split(' ');
        address.splice(address.length - 2, 2);
        address.join(' ');
        console.log('Validate:', address, value);
        return address === value;
    });

    setTranslationObject({
        en: {
            telephone: 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.',
            address: 'Adresse introuvable ou les informations (ville, code postal, région) ne correspondent pas.',
        },
        fr: {
            telephone: 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.',
            address: 'Adresse introuvable ou les informations (ville, code postal, région) ne correspondent pas.',
        }
    });

    const getAddressSuggestions = (value) => requestAddress(value, 5);

    const rules = {
        first_name: 'required|alpha',
        name: 'required|alpha',
        phone: 'nullable|telephone',
        mail: 'required|email',
        address: 'required|address',
        postal_code: 'required|string',
        city: 'required|string',
        country: 'required|string',
        newsletter: 'strict|boolean',
        gtc: 'strict|boolean|accepted'
    };

    const isFieldValid = (field, value) => {
        const validator = make({[field]: value}, {[field]: rules[field]});
        const isValid = validator.validate();
        if (isValid) {
            return { valid:true, error:undefined };
        } else {
            const err = validator.errors().first(field);
            return { valid:false, error:err };
        }
    };

    const isFormValid = (order) => {
        const validator = make(order, rules);
        const isValid = validator.validate();
        console.log(isValid);
        let errors = validator.errors().all();
        Object.entries(errors).map(el => {
            console.log(el);
        });

        return {valid:isValid, error:errors};
    }

    return { getAddressSuggestions, isFieldValid, isFormValid };
}

export default useValidators;
