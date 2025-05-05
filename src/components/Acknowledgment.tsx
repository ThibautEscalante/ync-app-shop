import {useContext, useEffect, useState, useRef } from "react";

function Acknowledgment() {

    const bannerRef = useRef(null);

    useEffect(() => {

        const banner = bannerRef.current;

        const handleScroll = () => {

            const isFixed = window.scrollY >= banner.offsetTop - 25;
            Object.assign(banner.style, {
                position: isFixed ? "fixed" : "relative",
                top: isFixed ? "0px" : "",
                left: isFixed ? "0" : "",
                width: isFixed ? "100%" : "",
                zIndex: isFixed ? "999" : ""
            });

        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);

    }, []);


    return (

        <div className="acknowledgment">

            {/* BANNER */}
            <section className="banner-wrapper" ref={bannerRef}>
                <div className="banner-track">
                    <img src="/assets/acknowledgment/acknowledgment_message.svg" alt="Message défilant YNC" />
                </div>
            </section>


            {/* IMAGE */}
            <section className="cadre">
                <img src="/assets/acknowledgment/acknowledgment2.png" alt="Confirmation de commande YNC"/>
            </section>
            
            {/* CONTENT */}
            <section className="ack-content">


                <div className="ack-sections-row">

                    <div className="ack-section">
                        <h2>Livraison artisanale</h2>
                        <p>Chaque commande est préparée à la main par notre équipe. De l’emballage à l’expédition, tout est réalisé avec soin pour une réception parfaite.</p>
                    </div>

                    <div className="ack-section">
                        <h2>Confirmation & Suivi</h2>
                        <p>Un email t’a été envoyé avec les détails de ta commande, les options de livraison (domicile ou point relais) et un lien de suivi.</p>
                    </div>

                    <div className="ack-section">
                        <h2>Prolonge l’expérience</h2>
                        <p>Explore <a href="/galerie">notre galerie</a> ou suis-nous sur <a href="https://www.instagram.com" target="_blank">Instagram</a> pour découvrir nos nouveautés et les coulisses de YNC.</p>
                    </div>

                </div>


                <div className="ack-help">
                    <h2>Besoin d’aide ?</h2>
                    <p>Une question sur ta commande, un retour ou un suivi ? Contacte-nous à <a href="mailto:yn-corporation@ync.com">yn-corporation@ync.com</a>.</p>
                </div>


            </section>

            {/* BUTTON */}
            <button className="ync-button" onClick={() => window.location.href = 'https://yn-corp.xyz/home'}>QU'EST CE QUE YNC ?</button>
        
        </div>
    );
} export default Acknowledgment;