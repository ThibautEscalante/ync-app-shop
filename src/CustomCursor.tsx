import { useEffect, useRef, useState } from 'react';

function CustomCursor({ targetClass, children }) {

    const cursorRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {

        let animationFrame;

        const moveCursor = (e) => {

            const { clientX, clientY } = e; // on récupére les coordonnées du curseur

            // requestAnimationFrame exécute une fonction au moment du prochain rafraîchissement d’écran
            animationFrame = requestAnimationFrame(() => {
                if (cursorRef.current) {
                    cursorRef.current.style.left = `${clientX}px`;
                    cursorRef.current.style.top = `${clientY}px`;
                }
            });

        };

        // moveCursor appelée à chaque mouvement de la souris, ecoute les mouvements de la souris
        window.addEventListener('mousemove', moveCursor);

        return () => {
        window.removeEventListener('mousemove', moveCursor);
        cancelAnimationFrame(animationFrame);
        };

    }, []);

    // Gestion de l'apparition/disparition du curseur
    useEffect(() => {

        const showCursor = (e) => {
            if (targetClass && e.target.classList.contains(targetClass)) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        const hideCursor = () => {
            setIsVisible(false);
        };

        document.addEventListener('mouseover', showCursor);
        document.addEventListener('mouseout', hideCursor);

        return () => {
            document.removeEventListener('mouseover', showCursor);
            document.removeEventListener('mouseout', hideCursor);
        };

    }, [targetClass]);

    // si le targetClass devient vide
    // useEffect(() => {
    //     if (!targetClass) {
    //         setIsVisible(false);
    //     }
    // }, [targetClass]);

    return (
        
        <div>
            {isVisible && <div className="custom-cursor" ref={cursorRef} />}
            {children}
        </div>

    );
}

export default CustomCursor;