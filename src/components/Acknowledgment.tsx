import {useContext, useEffect, useState } from "react";
import ShopAPIContext from "../context/ShopAPIProvider";

function Acknowledgment({ basket }) {

    // const { fetchItem } = useContext(ShopAPIContext);

    // const [item, setItem] = useState(null);
    // useEffect(() => { // Retrieve item's data
    //     fetchItem(id)
    //         .then(data => setItem(data))
    //         .catch(e => console.error(`[BasketItem;useEffect] ${e.message}`));
    // }, [basket]);

    // const [currentIndex, setCurrentIndex] = useState(0);

    // Navigation du carrousel
    // const goToPrevious = () => {
    //     setCurrentIndex((prevIndex) => 
    //     prevIndex === 0 ? images.length - 1 : prevIndex - 1
    //     );
    // };

    // const goToNext = () => {
    //     setCurrentIndex((prevIndex) => 
    //     prevIndex === images.length - 1 ? 0 : prevIndex + 1
    //     );
    // };

    return (
        <div className="acknowledgment">

            <div className="carrousel">

                <div className="side-image" onClick={goToPrevious}>
                    {/* <img src="image5.jpg" alt="Image 1"/> */}
                    <img src="image6.jpg"/>
                </div>

                <div className="center-image">
                    {/* <img src="image1.jpg" alt="Image 1"/> */}
                    <img src="image2.jpg"/>
                </div>

                <div className="side-image" onClick={goToNext}>
                    {/* <img src="image3.jpg" alt="Image 1"/> */}
                    <img src="image4.jpg"/>
                </div>

            </div>

            <div className="text">
                <p>Merci !</p>
                <p>Ta commande a bien été passée (comment tu te sens ?).</p>
                <p> <br />Tu recevras rapidement les détails concernant ta commande dans ta boîte mail.</p>
            </div>

            <button className="ync-button">QU'EST CE QUE YNC ?</button>
        </div>
    );
} export default Acknowledgment;