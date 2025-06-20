/* npm & React module imports */
import { useState, useContext, useEffect, useRef} from "react";

/* Custom context imports */
import ShopAPIContext from "./context/ShopAPIProvider";

/* Custom component imports */
import Logo from "./components/Splashpage";

import Header from "./components/Header";
import Section from "./components/Section";
import Footer from "./components/Footer";

import Vitrine from "./components/Vitrine";
import Gallery from "./components/Gallery";
import PopupItem from "./components/PopupItem";

import Basket from "./components/Basket";

// import Payment from "./components/Payment";
import Payment from "./components/Payment";

import About from "./components/About";
import Acknowledgment from "./components/Acknowledgment";

/* Scrolling smooth component import */
import useSmoothScroll from "../useSmoothScroll";

/* Style imports */
import "./style/styles.css";
import "./style/app.css";
// import "./style/home.css";
import "./style/showcase.css";
import "./style/gallery.css";
import "./style/basket.css";
import "./style/payment.css";
import "./style/about.css";
import "./style/acknowledgment.css";
import "./style/popup_item.css";

function useBasket() {
    const { fetchBasket, postBasket } = useContext(ShopAPIContext);
    const [basket, setBasket] = useState({});

    useEffect(() => {
        fetchBasket()
            .then((data) => { console.log(data); setBasket(data); })
            .catch(e => console.error(`[useBasket;useEffect | fetchBasket] ${e.message} (${e.status}))`));
    }, []);

    function addBasket(item, size) {
        console.log(basket);

        // Create new basket without mutating current state
        const newBasket = {...basket};

        if (!newBasket[item]) {
            newBasket[item] = {};
        }

        const currentCount = newBasket[item][size] || 0;
        const newCount = currentCount + 1;

        // Update the specific size
        newBasket[item] = {...newBasket[item], [String(size)]: newCount};

        postBasket(newBasket);
        setBasket(newBasket);
    }

    function removeBasket(item, size) {
        if (basket[item]?.[size]) {
            const count = basket[item][size] - 1;
            const newBasket = {...basket};

            if (count <= 0) {
                newBasket[item] = {...newBasket[item]};
                delete newBasket[item][size];

                if (Object.keys(newBasket[item]).length === 0) {
                    delete newBasket[item];
                }
            } else {
                newBasket[item] = {...newBasket[item], [size]: count};
            }

            postBasket(newBasket);
            setBasket(newBasket);
        }
    }

    function removeBasketSize(item, size) {
        if (basket[item]?.[size]) {
            const newBasket = {...basket};
            newBasket[item] = {...newBasket[item]};

            // Remove the specific size completely
            delete newBasket[item][size];

            // Remove the entire item if no sizes left
            if (Object.keys(newBasket[item]).length === 0) {
                delete newBasket[item];
            }

            postBasket(newBasket);
            setBasket(newBasket);
        }
    }

    return { basket, addBasket, removeBasket, removeBasketSize };
}

/* @desc: the main component orchestating all different components of the website
 * @return: the whole website content
 */
function App() {
    const { basket, addBasket, removeBasket, removeBasketSize } = useBasket();
    const { fetchItem, fetchQuantity } = useContext(ShopAPIContext);

    // Define default app state
    const [state, setState] = useState("HOME");
    const [buttonDisplay, setButtonDisplay] = useState("PANIER");
    const [section, setSection] = useState({name: "Quelconque", image: "assets/home_icon.svg"});

    function homeState() {
        setButtonDisplay("PANIER");
        setSection({name:"Quelconque", image:"assets/home_icon.svg"});
        setState("HOME");
    };

    function paymentState() {
        setButtonDisplay("RETOUR");
        setSection({name:"Paiement", image:"assets/payment_icon.svg"});
        setState("PAYMENT");
    };

    function basketState() {
        setButtonDisplay("RETOUR");
        setSection({name:"Panier", image:"assets/basket_icon.svg"});
        setState("BASKET");
    };

    function aboutState() {
        setButtonDisplay("RETOUR");
        setSection({name:"À propos", image:"assets/home_icon.svg"})
        setState("ABOUT");
    };

    function acknowledgmentState() {
        setButtonDisplay("RETOUR");
        setSection({name:"Nous te remercions !", image:"assets/acknowledgment/acknowledgment_icon.svg"});
        setState("ACKNOWLEDGMENT");
    };

    const updateState = () => {
        if (state === "HOME" || state === "PAYMENT" || state === "VITRINE" || state === "GALLERY") {
            basketState();
        } else if (state === "BASKET" || state === "ABOUT" || state === "ACKNOWLEDGMENT") {
            homeState();
        }
    }

    const [popupItem, setPopupItem] = useState(null);
    const [popupQuantity, setPopupQuantity] = useState(null);
    const [popupId, setPopupId] = useState(null);

    const handleItemClick = (clickedId) => setPopupId(clickedId);
    const closePopup = () => {
        setPopupId(null);
        setPopupItem(null);
        setPopupQuantity(null);
    };

    useEffect(() => {
        if (popupId) {
            fetchItem(popupId)
                .then(data => setPopupItem(data))
                .catch(e => {
                    console.error(`[PopupItem] ${e.message}`);
                    setPopupItem(null);
                });
            fetchQuantity(popupId)
                .then(data => setPopupQuantity(data.sizes))
                .catch(e => {
                    console.error(`[PopupItem] ${e.message}`);
                    setPopupQuantity(null);
                });
        }
    }, [popupId, fetchItem]);

    const [scrollPos, setScrollPos] = useState(0);
    const galleryRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
            if (galleryRef.current) {
                const rect = galleryRef.current.getBoundingClientRect();
                const currentScrollY = window.scrollY;
                // Check if we've scrolled past the bottom of the element
                if (currentScrollY > rect.top) {
                    setSection(section => { return {name:"Galerie", image:"assets/gallery_icon.svg"}; });
                } else {
                    setSection(section => { return {name:"Quelconque", image:"assets/home_icon.svg"}; });
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
    }, []);


    const content = (
        <div className="App">
            <Header name={buttonDisplay} basket={basket} homeFn={homeState} aboutFn={aboutState} basketFn={updateState}/>
            <Section name={section.name} image={section.image}/>

            {state === "HOME" && (<>
                <Vitrine id="quelconque" add={addBasket} goto={basketState} />
                <Gallery ref={galleryRef} ids={["quelconque", "stairs_white_shirt", "frog_poster"]} onItemClick={(id) => setPopupId(id)} />
            </>)}

            {(state === "BASKET") && <Basket basket={basket} compact={false} add={addBasket} rm={removeBasket} del={removeBasketSize} next={paymentState} />}
            {(state === "PAYMENT") && <Payment basket={basket} onSuccess={acknowledgmentState} onFailure={basketState} />}

            {(state === "ABOUT") && <About />}
            {(state === "ACKNOWLEDGMENT") && <Acknowledgment />}

            {/*((state === "HOME") || (state === "ACKNOWLEDGMENT")) && <Footer onClick={aboutState} />*/}

            {popupItem && popupId && (
                <PopupItem
                    item={popupItem}
                    quantity={popupQuantity}
                    onClose={closePopup}
                    add={addBasket}
                    toggleLike={() => setLikes(likes + 1)}
                />
            )}

        </div>
    );

    return (
        // <Logo content={content} />
        <>{content}</>
    );

} export default App;
