function PopupItem({ item, onClose, add, isSoldOut, toggleLike }) {

    if (!item) return null;

    return (

        <div className="popuppage" onClick={onClose}>

            {/* PREVENTS POPUP FROM CLOSING WHEN CLCiKED */}
            <div className="model" onClick={(e) => e.stopPropagation()}> 


                {/* 3D MODEL SECTION */}
                <section className="model-image-section">
                    <img src={item.image} alt={item.title} className="model-image" />
                </section>


                {/* DETAILS SECTION */}
                <section className="details">

                    <div className="content-section">

                        <h1 className="popup-title">{item.title} TITRE</h1>
                        <p className="popup-description">{item.description} description</p>
                        <p className="popup-details">{item.basket_description} description details</p>
                        

                        <div className="action-section">

                            <button className="popup-button custom-target" id={item.id} onClick={() => add(item.id)} price={item?.price}></button>
                            {/* <button className="thumb-button" onClick={toggleLike}> +1 </button> */}

                        </div>


                        <div className="popup-text">

                            <p>© 2025 Young New Corporation. L’univers est en expansion – nous aussi. <img src="/assets/ync_circle_fire.png" alt="ync-fire-logo" className="popup-text-image"/></p>
                        
                        </div>

                    </div>

                </section>


                {/* CLOSE BUTTON */}
                <button className="popup-close-btn" onClick={onClose}>
                    <img src="/assets/croix.svg" alt= "X"/>
                </button>

                

            </div>


        </div>

    );

}

export default PopupItem;