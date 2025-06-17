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

function PaymentForm({ order }) {
    const [errors, setErrors] = useState({
        first_name: '', name: '', phone: '',
        mail: '', region: '', address: '',
        postal_code: '', city: '', country: '',
        gtc: ''
    });

    const [suggestions, setSuggestions] = useState([]);

    const { getAddressSuggestions, isFieldValid } = useValidators();

    const handleChange = () => {};
    const handleBlur = () => {};
    const handleBlurAsync = () => {};

    return (
        <div className="form">

            <div className="delivery">
                <h1>Méthode de livraison</h1>
                <div className="shipping-option">
                    <input type="radio" id="to-my-address" name="shipping-method" defaultChecked />
                    <label htmlFor="to-my-address">À mon adresse</label>
                </div>
            </div>


            <div className="contact">
                <h1>Contact</h1>
                <input
                    className={errors.mail ? 'error-border' : ''}
                    type="email"
                    name="mail"
                    placeholder="Email"
                    value={order.mail}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                />
                {errors.mail && <p className="error-message">{errors.mail}</p>}

                <div className="checkbox-container">
                    <input
                        type="checkbox"
                        id="newsletter"
                        name="newsletter"
                        checked={order.newsletter}
                        onChange={handleChange}
                    />
                    <label htmlFor="newsletter">M'envoyer un mail lorsque YNG sort une nouvelle création.</label>
                </div>
            </div>

            <div className="shipping">
                <h1>Livraison</h1>
                <div className="name-fields">
                    <input
                        className={errors.first_name ? 'error-border' : ''}
                        type="text"
                        name="first_name"
                        placeholder="Prénom"
                        value={order.first_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    <input
                        className={errors.name ? 'error-border' : ''}
                        type="text"
                        name="name"
                        placeholder="Nom"
                        value={order.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                </div>
                {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                {errors.name && <p className="error-message">{errors.name}</p>}

                <input
                    className={errors.region ? 'error-border' : ''}
                    type="text"
                    name="region"
                    placeholder="Pays/Région"
                    value={order.region || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                />
                {errors.region && <p className="error-message">{errors.region}</p>}

                <input
                    className={errors.address ? 'error-border' : ''}
                    type="text"
                    name="address"
                    placeholder="Adresse"
                    value={order.address}
                    onChange={handleChange}
                    onBlur={handleBlurAsync}
                    required
                />
                {(order.address.length > 5 && suggestions.length > 0) &&
                    <ul className="autocomplete-list">
                        {suggestions.map((suggestion, index) => (
                            <li key={index} className="autocomplete-item" onClick={() => handleSuggestionClick(suggestion)}>
                                {suggestion.properties.label}
                            </li>
                        ))}
                    </ul>
                }
                {errors.address && <p className="error-message">{errors.address}</p>}

                <div className="city-fields">
                    <input
                        className={errors.postal_code ? 'error-border' : ''}
                        type="text"
                        name="postal_code"
                        placeholder="Code Postal"
                        value={order.postal_code || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                    <input
                        className={errors.city ? 'error-border' : ''}
                        type="text"
                        name="city"
                        placeholder="Ville"
                        value={order.city || ""}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        required
                    />
                </div>
                {errors.postal_code && <p className="error-message">{errors.postal_code}</p>}
                {errors.city && <p className="error-message">{errors.city}</p>}

                <input
                    className={errors.phone ? 'error-border' : ''}
                    type="tel"
                    name="phone"
                    placeholder="Téléphone" // type="tel"
                    value={order.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                />
                {errors.phone && <p className="error-message">{errors.phone}</p>}
            </div>


            <div className="checkbox-container">
                <input
                    type="checkbox"
                    id="gtc"
                    name="gtc"
                    checked={order.gtc}
                    onChange={handleChange}
                />
                <label htmlFor="gtc">J'ai lu et j'accepte les conditions générales de vente.</label>
                {errors.gtc && <p className="error-message">Vous devez accepter les CGV.</p>}
            </div>

        </div>
    );
}

export default PaymentForm;
