import { useState, useMemo } from 'react';
import { make, register, setTranslationObject } from 'simple-body-validator';

// Ajout de la regle personnalisée pour le champs téléphone dans la verif que fait simplebodyvalidator
register('telephone', function (value) {
  if (!value) return true;
  return /^0\d{9}$/.test(value);
});

// Doit être appelé une seule fois si pref au chargement de l'application
setTranslationObject({
  en: {
      telephone: 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.',
  },
  fr: {
    telephone: 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.',
  }
});

const rules = { phone: 'nullable|telephone' };

type Order = {
  first_name: string;
  name: string;
  phone: string;
  mail: string;
  address: string;
  postal_code: string;
  city: string;
  region: string;
  newsletter: boolean;
  gtc: boolean;
};

type Rules = {
  [key in keyof Order]: string;
};

export function usePaymentForm(initialOrder: Order, rules: Rules) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [errors, setErrors] = useState<{ [key in keyof Order]?: string }>({});

  // Gestion des changements dans les inputs (texte et checkbox)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Gestion du blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validation générique avec simple-body-validator
    const singleFieldData = { [name]: value };
    const singleRule = { [name]: rules[name as keyof Rules] };

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
        [name]: undefined,
      }));
    }
  };

  // Validation globale du formulaire
  const formValid = useMemo(() => {
    // Check si erreurs présentes
    const hasErrors = Object.values(errors).some((e) => e !== undefined && e !== null && e !== '');

    // Check si tous les champs requis sont remplis
    const allRequiredFilled = Object.keys(rules).every((key) => {
      const rule = rules[key as keyof Rules];
      if (rule.includes('required') || rule.includes('accepted')) {
        const val = order[key as keyof Order];
        // boolean false est considéré comme non rempli pour accepted (ex: gtc)
        return val !== undefined && val !== null && val !== '' && val !== false;
      }
      return true;
    });


    const isValid = !hasErrors && allRequiredFilled;
    // logs pour débugger
    console.log('--- formValid calculation ---');
    console.log('Current errors state:', errors);
    console.log('hasErrors:', hasErrors);
    console.log('allRequiredFilled:', allRequiredFilled);
    console.log('formValid (result):', isValid);
    console.log('-----------------------------');

    return isValid;
  }, [errors, order, rules]);

  return { order, errors, handleChange, handleBlur, formValid, setOrder, setErrors };
}