

const GOV_ADDRESS_API_URL = 'https://api-adresse.data.gouv.fr/search';

const fetchSuggestions = async (value) => {
    if (!query || query.length < 10) return null;
};

const fetchAddress = async (address) => {
    if (!address || query.length < 15) return null;
    fetch(`${GOV_ADDRESS_API_URL}/?q=${encodedAddress}&limit=1`)
        .then()
        .catch();
}
