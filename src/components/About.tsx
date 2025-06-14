function About() {

    return (

        <div className="about">


            {/* BANNER */}
            <div className="banner" />


            {/* QUI SOMMES NOUS ? */}
            <section className="intro-left">

                <div className="intro-content">

                    {/*<img src="/assets/background1.jpg" alt="YN image gauche" className="intro-image-left" />*/}

                    <div className="text-block">
                        <h1 className="title">YNSHOP, C'EST QUOI ?</h1>
                        <p className="text-left">
                            YNShop, c’est notre premier terrain d’expression. Une boutique de photos, visuels, objets, concepts. 
                            Chaque produit vient de notre imaginaire collectif. Tous racontent une histoire : celle d’un crew 
                            passionné qui refuse de choisir entre art, jeu, et sincérité.
                        </p>
                    </div>

                </div>

            </section>


            {/* NOTRE VISION */}
            <section className="intro-right">

                <div className="intro-content reverse">

                    {/*<img src="/assets/background2.jpg" alt="YN image droite" className="intro-image-right" />*/}

                    <div className="text-block">
                        <h1 className="title">NOTRE VISION</h1>
                        <p className="text-right">
                            On ne veut pas juste vendre. On veut créer avec vous.
                            Votre regard, vos retours, vos idées nourrissent notre démarche. 
                            YNShop est une plateforme, mais aussi un laboratoire de création libre, collaborative, audacieuse. 
                        </p>
                    </div>

                </div>

            </section>


            {/* YNSHOP, C'EST QUOI ? */}
            <section className="intro-left">

                <div className="intro-content">

                    {/*<img src="/assets/background3.jpg" alt="YNShop image gauche" className="intro-image-left" />*/}

                    <div className="text-block">
                        <h1 className="title">QUI SOMMES NOUS ?</h1>
                        <p className="text-left">
                            YNC, YNCorp, ou encore YNCorporation est un collectif d'amis Bordelais. Développeur, Designer, 
                            Vendeur, Ingénieur du son, qu'importe notre métier, c'est la volonté d'explorer l'art sous 
                            toutes ses formes qui constitue l'ADN de notre crew.
                        </p>
                    </div>

                </div>

            </section>


            {/* GRID INFOS */}
            <section className="six-grid-wrapper">

                <div className="six-grid">


                    <div className="column">
                        <h2>NOTRE VISION CRÉATIVE</h2>
                        <p>
                            Chaque photographie est une émotion figée, une idée rendue visible. 
                            Nous cherchons à provoquer du ressenti, à explorer sans cesse de nouvelles formes narratives.
                        </p>
                    </div>

                    <div className="column">
                        <h2>QUALITÉ & RESPONSABILITÉ</h2>
                        <p>
                            Impressions haut de gamme, encres écologiques, emballages soignés — notre art est aussi un engagement pour un monde plus durable.
                        </p>
                    </div>

                    <div className="column">
                        <h2>LIEN AVEC LES ARTISTES</h2>
                        <p>
                            Derrière chaque œuvre, un créateur. Rencontrez-les lors de nos événements, découvrez leur univers et échangez en toute sincérité.
                        </p>
                    </div>

                    <div className="column">
                        <h2>ACCESSIBILITÉ DE L’ART</h2>
                        <p>
                            Nos œuvres existent en plusieurs formats et gammes de prix. L’art doit appartenir à tous, pas seulement à une élite.
                        </p>
                    </div>

                    <div className="column">
                        <h2>COMMUNAUTÉ ACTIVE</h2>
                        <p>
                            Ateliers, collaborations, partages d’idées : nous créons avec vous, pour vous, et grâce à vous.
                        </p>
                    </div>

                    <div className="column">
                        <h2>REJOINDRE L’AVENTURE</h2>
                        <p>
                            Abonnez-vous, participez, explorez : notre univers est ouvert, en mouvement, et vous y avez votre place.
                        </p>
                    </div>


                </div>

            </section>


            {/* CONTACT */}
            <section className="contact">

                <div className="content">

                    <p className="text"> Envie de discuter, de proposer une idée, de collaborer ? On est là. Sérieusement.</p>
                    <button className="button" onClick={() => window.location.href = 'https://yn-corp.xyz/home'}>Questions en vrac</button>
                    
                </div>

            </section>

        </div>

    );
}

export default About;
