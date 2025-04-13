/* @desc: This component is used to display all informations about YNShop
 * @return: About component of the website page
 */
function About() {
    return (

        <div className="about">

            <div className="content-left">
                
                <img/>

                <div className="">
                    <h2 className="title">YNC, KÉZAKO ?</h2>
                    <p>
                        YNC, YNCorp, ou encore YNCorporation est un collectif d'amis Bordelais. Développeur, Designer, 
                        Vendeur, Ingénieur du son, qu'importe notre métier, c'est la volonté d'explorer l'art sous 
                        toutes ses formes qui constitue l'ADN de notre crew.
                    </p>
                </div>

            </div>

            <div className="content-right">
                
                <img/>

                <div className="">
                    <h2 className="title">NOTRE VISION.</h2>
                    <p>
                        C'est vous. Vos retours et votre implication nous permet de développer l'histoire de la YNCorp 
                        ensemble. YNShop est le premier service YNC que nous vous proposons avec des idées souvent 
                        farfelues et sans aucune prétention, vous aussi vous pouvez faire partie de cette aventure 
                        collaborative ! Nous prônons l'échange, la communication, l'humilité et le dépassement de soi.
                    </p>
                </div>

            </div>

            <div className="content-left">
                
                <img/>

                <div className="">
                    <h2 className="title">ET YNSHOP ?</h2>
                    <p>
                        YNShop est un de nos services, d'autres sont à venir tous différents les uns des autres.
                        À travers cette boutique, on veut vous proposer des produits issus de notre imaginaire 
                        chaotique, des idées de toutes part, un fil d'Ariane voué à évoluer avec votre aide et vos 
                        retours. On souhaite créer un univers commun à travers tous les produits disponibles sur cette 
                        boutique.
                    </p>
                </div>

            </div>
    
            <button className="questions-button">Questions en vrac</button>

        </div>
    );
} export default About;