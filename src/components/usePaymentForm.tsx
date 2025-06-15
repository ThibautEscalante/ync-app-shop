import { useState, useMemo } from 'react';
import { make, register, setTranslationObject } from 'simple-body-validator';




const searchFrenchAddress = async (query: string) => {
  if (!query || query.length < 3) {
      return null;
  }

  try {
      const encodedQuery = encodeURIComponent(query);
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodedQuery}&limit=1`);

      if (!response.ok) {
          console.error(`API Adresse: Échec de la récupération (${response.status} ${response.statusText})`);
          return null;
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
          return data.features[0];
      }

      return null;
  } catch (error) {
      console.error('API Adresse: Erreur lors de l\'appel:', error);
      return null;
  }
};

// Ajout de la regle personnalisée pour la verification du champs téléphone + passage simplebodyvalidator
register('telephone', function (value) {
    if (!value) return true;
    return /^0\d{9}$/.test(value);
  });

  


// Ajout de la regle personnalisée pour la verification d'adresse, de ville, de code postal et de pays/region + passage simplebodyvalidator
  register('address_api_check', async function (addressValue) {

    if (!addressValue || addressValue.length < 3) {
        return false; // L'adresse est vide ou trop courte, la validation échoue
    }

    const apiAddress = await searchFrenchAddress(addressValue);

    if (!apiAddress) {
        return false; // L'API n'a pas trouvé l'adresse, la validation échoue
    }

     // Convertir en minuscules et supprimer les espaces
    const formData = this.data; // // this.data accede à toutes les données de l'objet qu'on a donné au make de validator

    const formCity = formData?.city?.toLowerCase().trim();
    const formPostalCode = formData?.postal_code?.trim();
    const formRegion = formData?.region?.toLowerCase().trim();

    const apiCity = apiAddress.properties.city?.toLowerCase().trim();
    const apiPostalCode = apiAddress.properties.postcode?.trim();
    const apiContext = apiAddress.properties.context?.toLowerCase();

    let isValidMatch = true;

    // Vérification de la correspondance Ville
    if (formCity && apiCity && formCity !== apiCity) {
        console.log(`Mismatch Ville: Form='${formCity}', API='${apiCity}'`);
        isValidMatch = false;
    }

    // Vérification de la correspondance Code Postal
    if (formPostalCode && apiPostalCode && formPostalCode !== apiPostalCode) {
        console.log(`Mismatch Code Postal: Form='${formPostalCode}', API='${apiPostalCode}'`);
        isValidMatch = false;
    }

    // Vérification de la correspondance Région
    if (formRegion && apiContext) {
        const regionSearchTerm = formRegion.replace(/-/g, ' '); //  /-/g  regex :  les tirets '-' par ' ' 
        const regionFoundInContext = apiContext.includes(regionSearchTerm); 
        if (!regionFoundInContext) {
            console.log(`Mismatch Région: Form='${formRegion}', API Context='${apiContext}'`);
            isValidMatch = false;
        }
    }

    return isValidMatch;
}, function (message, parameters, data) {
    if (!data || !data.value || data.value.length < 3) {
        return 'L\'adresse est trop courte pour être vérifiée ou est vide.';
    }
    return 'Cette adresse ne semble pas valide. Veuillez en choisir une depuis les suggestions si possible.';
});



// Doit être appelé une seule fois si pref au chargement de l'application
setTranslationObject({
en: {
  telephone: 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.',
  address_api_check: 'Adresse introuvable ou les informations (ville, code postal, région) ne correspondent pas.',
},
fr: {
  telephone: 'Le numéro de téléphone est invalide, il doit commencer par 0 et contenir 10 chiffres.',
  address_api_check: 'Adresse introuvable ou les informations (ville, code postal, région) ne correspondent pas.',
}
});

// Typage Order et Rules
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


  const [isCheckingAddress, setIsCheckingAddress] = useState(false);

  // Gestion du blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Validation avec simple-body-validator
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


  // Gestion du blur (asynchrone)
  const handleBlurAsync = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setIsCheckingAddress(true);

    const currentOrderState = { ...order, [name]: value };
    const validator = make(currentOrderState, { [name]: rules[name as keyof Rules] });
    const isValid = await validator.validateAsync();
    ;

    if (!isValid) {
      const fieldError = validator.errors().first(name);
      setErrors((prev) => ({
        ...prev,
        [name]: fieldError,
      }));
    } else {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof typeof newErrors];
        return newErrors;
      });
    }

    setIsCheckingAddress(false);
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


    const isValid = !hasErrors && allRequiredFilled && !isCheckingAddress;
    // logs pour débugger
    console.log('------');
    console.log('Current errors state:', errors);
    console.log('hasErrors:', hasErrors);
    console.log('allRequiredFilled:', allRequiredFilled);
    console.log('isCheckingAddress:', isCheckingAddress);
    console.log('formValid (result):', isValid);
    console.log('------');

    return isValid;
  }, [errors, order, rules, isCheckingAddress]);

  return { order, errors, handleChange, handleBlur, handleBlurAsync, formValid, setOrder, setErrors };
}