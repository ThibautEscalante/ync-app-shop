import { createContext } from 'react';
import axios from 'axios';

// init Context
const ShopAPIContext = createContext();

export const ShopAPIProvider = ({ children }) => {
    const api_address = `https://yn-corp.xyz/api/shop`;
    // const api_address = `http://${process.env.REACT_APP_API_CONTACT_POINTS}:${process.env.REACT_APP_API_PORT}/api/shop`;
    const config = {withCredentials: true, headers: {'Content-Type':'application/json', 'Accept':'application/json'}};

    const fetchBasket = async () => { // Fonction pour récupérer le panier
        try {
            const res = await axios.get(`${api_address}/connect`, config);
            let basket = res.data.items;
            for (const k in basket) {
                for (const size in basket[k]) { basket[k][size] = parseInt(basket[k][size]); }
            }
            return basket;
        } catch (e) { console.error('[fetchBasket]', e); }
    };

    const postBasket = async (items) => { // Fonction pour mettre à jour le panier
        try {
            const res = await axios.post(`${api_address}/basket`, {items}, config);
            return res.data.items;
        } catch (e) { console.error('[postBasket]', e); }
    };

    const fetchItem = async (item) => { // Récupérer les données de l'article en fonction de id_article
        console.log('FETCH CALL');
        try {
            await axios.get(`${api_address}/connect`, config);
            const res = await axios.get(`${api_address}/item?id=${item}`, config);
            if (res.data.length === 1) res.data = res.data[0];

            for (let i=0; i < res.data.images.length; i++) {
                res.data.images[i] = `data:image/jpeg;base64,${res.data.images[i]}`;
            }
            return res.data;
        } catch (e) { console.error('[fetchItem]', e); }
        /*
        return Promise.resolve({
            id: "quelconque",
            category: "quelconque",
            image: "/assets/background1.jpg",
            images: ["/assets/background1.jpg", "/assets/background1.jpg"],
            title: "Quelconque",
            subtitle: "Black on White - Unisex",
            quote: "Create or consume",
            description: "“Quelconque” est une photo prise au lac de Gradignan le 14 mars 2024...",
            details: "Tu peux penser qu'il est banal et sans âme, mais à YNC, nous on l'aime ce tee-shirt. C'est le premier (et pas le dernier), il nous représente, il montre qu'on est pas juste des vieux geek. En plus de tout ça, je peux le porter en dehors de chez moi et savoir qu'il y aura pas grand monde qui l'aura. Le jour où je croiserai quelqu'un avec, je serai plus que ravi de discuter avec lui parce que c'est obligé que, lui et moi, on ait des trucs en commun à partager.",
            spec: "100% coton bio • Impression DTF • Lavage à 40°C • Assemblé en France.",
            sizes: ["S", "M", "L"],
            basket_description: "Livré avec son cadre photo aléatoire.",
            price: 10.99
        });
        */
    };

    const fetchQuantity = async (item) => {
        return Promise.resolve({ S: 25, M: 25, L: 0 });
    };

    const fetchOrder = async (order) => {
        try {
            const res = await axios.get(`${api_address}/capture?id=${order}`, config);
            // If new cookie in response, goto connect route to retrieve old session token
            if (res.data.length === 1) res.data = res.data[0];
            return res.data;
        } catch (e) { console.error('[fetchOrder]', e); }
    }

    const postOrder = async (order) => {
        try {
            const res = await axios.post(`${api_address}/order`, {order}, config);
            if (res.data.length === 1) res.data = res.data[0];
            return res.data;
        } catch (e) { console.error('[postOrder]', e); }
    }

    const captureOrder = async (order) => {
        try {
            const res = await axios.post(`${api_address}/capture`, {order}, config);
            if (res.data.length === 1) res.data = res.data[0];
            return res.data;
        } catch (e) { console.error('[captureOrder]', e); }
    };

    return (
        <ShopAPIContext.Provider value={{ fetchBasket, postBasket, fetchItem, fetchQuantity, fetchOrder, postOrder, captureOrder }}>
            {children}
        </ShopAPIContext.Provider>
    );

};

export default ShopAPIContext;
