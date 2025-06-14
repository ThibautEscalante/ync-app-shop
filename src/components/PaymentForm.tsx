import { useState, useMemo } from 'react';
import { make } from 'simple-body-validator';

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

  // Validation spécifique au téléphone
  const validatePhone = (value: string) => {
    if (!value) return '';
    if (!/^0\d{9}$/.test(value))
      return 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.';
    return '';
  };

  // Gestion des changements dans les inputs (texte et checkbox)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setOrder((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  

  // Gestion du blur et validation à la volée
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const errorMessage = validatePhone(value);
      setErrors((prev) => ({
        ...prev,
        [name]: errorMessage || undefined,
      }));
      return;
    }

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

    return !hasErrors && allRequiredFilled;
  }, [errors, order, rules]);

  return { order, errors, handleChange, handleBlur, formValid, setOrder, setErrors };
}