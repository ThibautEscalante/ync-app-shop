function About() {
    return (
        <div className="about-page">
            {/* Hero */}
            <div className="hero-banner" />

            {/* Intro */}
            <section className="intro-about">
                <h1 className="title-about">QUI SOMMES NOUS ?</h1>
                <p className="intro-text">
                YNC est un collectif bordelais et montpelliérain d’artistes, de créatifs et de technophiles réunis par une passion 
                commune : exprimer des idées originales à travers des formats visuels, sonores ou numériques. Notre volonté ? Créer
                 un univers libre, sincère, parfois chaotique — mais toujours profondément nourri par le partage, l’émotion et l’
                 expérimentation. Nous croyons que c’est dans l’échange que naît l’inspiration, que chaque émotion transmise peut 
                 devenir un point de connexion entre l’artiste et le spectateur, et que l’expérimentation est le moteur essentiel de 
                 toute création authentique. Chez YNC, chaque projet est une invitation à ressentir, à s’interroger et à explorer de 
                 nouvelles formes de création.
                </p>
            </section>

            {/* Vision / YNShop */}
            <section className="double-section">
                <div className="column">
                    <h2>NOTRE VISION</h2>
                    <p>
                        On ne veut pas juste vendre. On veut créer avec vous.
                        Votre regard, vos retours, vos idées nourrissent notre démarche. 
                        YNShop est une plateforme, mais aussi un laboratoire de création libre, collaborative, audacieuse. 
                    </p>
                </div>
                <div className="separator" />
                <div className="column">
                    <h2>YNSHOP, C'EST QUOI ?</h2>
                    <p>
                        YNShop, c’est notre premier terrain d’expression. Une boutique de photos, visuels, objets, concepts. 
                        Chaque produit vient de notre imaginaire collectif. Tous racontent une histoire : celle d’un crew 
                        passionné qui refuse de choisir entre art, jeu, et sincérité.
                    </p>
                </div>
            </section>

            {/* Vision étendue - 6 blocs en 3+3 sur fond blanc pleine largeur */}
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



            {/* Contact */}
            <section className="contact-about">
                <p className="contact-text">
                    Envie de discuter, de proposer une idée, de collaborer ? On est là. Sérieusement.
                </p>
                <button className="questions-button">Questions en vrac</button>
            </section>
        </div>
    );
}

export default About;
