/* npm & React module imports */
import { useState, useContext, useEffect, useRef} from "react";

/* Custom context imports */
import ShopAPIContext from "./context/ShopAPIProvider";

/* Custom component imports */
import Header from "./components/Header";
import Section from "./components/Section";
import Footer from "./components/Footer";
import Logo from "./components/Splashpage";
// import Item from "./components/Item"; /* A supprimer par la suite */
import Vitrine from "./components/Vitrine";
import Gallery from "./components/Gallery";
import PopupItem from "./components/PopupItem";
import Basket from "./components/Basket";
import Payment from "./components/Payment";
import About from "./components/About";
import Acknowledgment from "./components/Acknowledgment";

/* Custom Cursor component import */
import CustomCursor from "./CustomCursor";

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
import "./style/custom_cursor.css";

function useBasket() {
    const { fetchBasket, postBasket } = useContext(ShopAPIContext);
    const [basket, setBasket] = useState({});

    useEffect(() => {
        fetchBasket()
            .then((data) => { if (data) setBasket(data); })
            .catch(e => console.error(`[useBasket;useEffect | fetchBasket] ${e.message} (${e.status}))`));
    }, []);

    function addBasket(item) {
        let count = 1;
        if (basket[item]) count = basket[item] + 1;

        postBasket({...basket, [String(item)]: count});
        setBasket({...basket, [String(item)]: count});
    };

    function removeBasket(item) {

        if (basket[item]) {
            const count = basket[item] - 1;
            const updated = { ...basket };

            if (count <= 0) {
                delete updated[item];
            } else {
                updated[item] = count;
            }

            postBasket({...basket, [item]: count});
            setBasket({...basket, [item]: count});
        }
    };

    return { basket, addBasket, removeBasket };
}






// const galleryRef = useRef(null);
// useSmoothScroll([galleryRef], true);

  



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

    const { basket, addBasket, removeBasket } = useBasket();

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
        setState("ABOUT");
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
            <Header name={buttonDisplay} basket={basket} homeFn={homeState} clickFn={updateState}/>
            <Section name={section.name} image={section.image}/>

            {/* {(state === "HOME") && <Item id="quelconque" galleryIds={["quelconque", "quelconque", "quelconque", "quelconque"]} add={addBasket} goto={basketState}/>}
             */}

            {state === "HOME" && (
            <>
                {currentSection === "VITRINE" && (
                    <Vitrine id="quelconque" add={addBasket} goto={basketState} />
                )}

                {currentSection === "GALLERY" && (
                    <div ref={galleryRef}>
                        <Gallery ids={["quelconque", "quelconque", "quelconque", "quelconque"]} onItemClick={(id) => setPopupId(id)} />
                    </div>
                )}
            </>
            )}

            {(state === "BASKET") && <Basket basket={basket} compact={false} add={addBasket} rm={removeBasket} next={paymentState}/>}
            {(state === "PAYMENT") && <Payment basket={basket} goto={acknowledgmentState}/>}

            {(state === "ABOUT") && <About />}
            {(state === "ACKNOWLEDGMENT") && <Acknowledgment />}

            {((state === "HOME") || (state === "ACKNOWLEDGMENT")) && <Footer onClick={aboutState} />}

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
        <CustomCursor targetClass="custom-target">
            {content}
        </CustomCursor>
    );

} export default App;
