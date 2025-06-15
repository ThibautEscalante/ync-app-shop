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
// import "./style/about.css";
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
    const [currentSection, setCurrentSection] = useState<"VITRINE" | "GALLERY">("VITRINE");
    const galleryRef = useRef<HTMLDivElement | null>(null);

// useEffect(() => {
//     let lastScroll = window.scrollY;
  
//     const onScroll = () => {
//       const currentScroll = window.scrollY;
//       const goingDown = currentScroll > lastScroll + 10;
//       const goingUp = currentScroll < lastScroll - 10;
  
//       if (currentSection === "VITRINE" && goingDown) {
//         setCurrentSection("GALLERY");
//         // Remonte la page en haut pour éviter un scroll trop bas d’entrée
//         setTimeout(() => window.scrollTo({ top: 0, behavior: "auto" }), 0);
//       }
  
//       if (currentSection === "GALLERY" && goingUp) {
//         const galleryTop = galleryRef.current?.getBoundingClientRect().top ?? 0;
//         if (galleryTop >= -10) {
//           setCurrentSection("VITRINE");
//           setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
//         }
//       }
  
//       lastScroll = currentScroll;
//     };
  
//     window.addEventListener("scroll", onScroll, { passive: true });
//     return () => window.removeEventListener("scroll", onScroll);
//   }, [currentSection]);

    useEffect(() => {
        let scrollLocked = false;

        const handleWheel = (e: WheelEvent) => {
            if (scrollLocked) return;

            const delta = e.deltaY;

            if (currentSection === "VITRINE" && delta > 30) {
                scrollLocked = true;
                setCurrentSection("GALLERY");

                setTimeout(() => {
                    scrollLocked = false;
                    window.scrollTo({ top: 0 }); // Remet en haut proprement
                }, 1000); // Bloque pendant 1 seconde pour éviter double scroll
            }

            if (currentSection === "GALLERY" && delta < -30) {
                scrollLocked = true;
                setCurrentSection("VITRINE");

                setTimeout(() => {
                    scrollLocked = false;
                    window.scrollTo({ top: 0 });
                }, 1000);
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: true });
        return () => window.removeEventListener("wheel", handleWheel);
    }, [currentSection]);

    const { basket, addBasket, removeBasket, removeBasketSize } = useBasket();

    // Define default app state
    const [state, setState] = useState("HOME");

    // Define default "Header" and "Section" state
    const [buttonDisplay, setButtonDisplay] = useState("PANIER");
    const [section, setSection] = useState({name: "Quelconque", image: "assets/home_icon.svg"});

    function homeState() {
        setButtonDisplay("PANIER");
        setSection({name: "Quelconque", image: "assets/home_icon.svg"})
        setState("HOME");
    };

    function paymentState() {
        setButtonDisplay("RETOUR");
        setSection({name: "Payment", image: "assets/payment_icon.svg"})
        setState("PAYMENT");
    };

    function basketState() {
        setButtonDisplay("RETOUR");
        setSection({name: "Panier", image: "assets/basket_icon.svg"})
        setState("BASKET");
    };

    function aboutState() {
        setButtonDisplay("RETOUR");
        setSection({name: "Plongez dans l'Univers YNC", image: "assets/home_icon.svg"})
        setState("ACKNOWLEDGMENT");
    };

    function acknowledgmentState() {
        setButtonDisplay("RETOUR");
        setSection({name: "Nous te remercions", image: "assets/acknowledgment/acknowledgment_icon.svg"})
        setState("ACKNOWLEDGMENT");
    };

    // onClick top right button
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
    const [likes, setLikes] = useState(0);

    const { fetchItem, fetchQuantity } = useContext(ShopAPIContext);

    const handleItemClick = (clickedId) => setPopupId(clickedId);

    const closePopup = () => {
        setPopupId(null);
        setPopupItem(null);
        setPopupQuantity(null);
    };

    useEffect(() => {
        if (popupId) {
            fetchItem(popupId)
                .then(setPopupItem)
                .catch(e => {
                    console.error(`[PopupItem] ${e.message}`);
                    setPopupItem(null);
                });
            fetchQuantity(popupId)
                .then(setPopupQuantity)
                .catch(e => {
                    console.error(`[PopupItem] ${e.message}`);
                    setPopupQuantity(null);
                });
        }
    }, [popupId, fetchItem]);


    const content = (
        <div className="App">
            <Header name={buttonDisplay} basket={basket} homeFn={homeState} aboutFn={aboutState} basketFn={updateState}/>
            {/*<Section name={section.name} image={section.image}/>*/}

            {state === "HOME" && (<>
                {currentSection === "VITRINE" && (<Vitrine id="quelconque" add={addBasket} goto={basketState} />)}
                {currentSection === "GALLERY" && (
                    <div ref={galleryRef}>
                        <Gallery ids={["quelconque", "stairs_white_shirt", "frog_poster"]} onItemClick={(id) => setPopupId(id)} />
                    </div>
                )}
            </>)}

            {(state === "BASKET") && <Basket basket={basket} compact={false} add={addBasket} rm={removeBasket} del={removeBasketSize} next={paymentState} />}
            {(state === "PAYMENT") && <Payment basket={basket} goto={acknowledgmentState} />}

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
