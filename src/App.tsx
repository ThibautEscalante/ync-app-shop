/* npm & React module imports */
import { useState, useContext, useEffect } from "react";

/* Custom context imports */
import ShopAPIContext from "./context/ShopAPIProvider";

/* Custom component imports */
import Bandeau from "./components/Bandeau";
import Section from "./components/Section";
import Footer from "./components/Footer";
import Logo from "./components/Splashpage";
import Item from "./components/Item";
import Basket from "./components/Basket";
import Payment from "./components/Payment";
import About from "./components/About";
import Acknowledgment from "./components/Acknowledgment";

/* Custom Cursor component import */
import CustomCursor from "./CustomCursor";

/* Style imports */
import "./style/styles.css";
import "./style/app.css";
import "./style/home.css";
import "./style/basket.css";
import "./style/payment.css";
import "./style/about.css";
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
            let count = basket[item] - 1;

            postBasket({...basket, [item]: count});
            setBasket({...basket, [item]: count});
        }
    };

    return { basket, addBasket, removeBasket };
}

/* @desc: the main component orchestating all different components of the website
 * @return: the whole website content
 */
function App() {
    const { basket, addBasket, removeBasket } = useBasket();

    // Define default app state
    const [state, setState] = useState("HOME");

    // Define default "Bandeau" and "Section" state
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
        if (state === "HOME" || state === "PAYMENT") {
            basketState();
        } else if (state === "BASKET" || state === "ABOUT" || state === "ACKNOWLEDGMENT") {
            homeState();
        }
    }

    const content = (
        <div className="App">
            <Bandeau name={buttonDisplay} basket={basket} homeFn={homeState} clickFn={updateState}/>
            <Section name={section.name} image={section.image}/>

            {(state === "HOME") && <Item id="quelconque" galleryIds={["quelconque", "quelconque", "quelconque", "quelconque"]} add={addBasket} goto={basketState}/>}
            {(state === "BASKET") && <Basket basket={basket} compact={false} add={addBasket} rm={removeBasket} next={paymentState}/>}
            {(state === "PAYMENT") && <Payment basket={basket} goto={acknowledgmentState}/>}

            {(state === "ABOUT") && <About />}
            {(state === "ACKNOWLEDGMENT") && <Acknowledgment />}

            {((state === "HOME") || (state === "ACKNOWLEDGMENT")) && <Footer onClick={aboutState} />}
        </div>
    );

    return (
        // <Logo content={content} />
        <CustomCursor targetClass="custom-target">
            {content}
        </CustomCursor>
    );

} export default App;