//  {/* Carrousel Horizontal */}
//  <div className="relative w-full h-96 mb-8 flex justify-center items-center">
//  <div className="flex items-center justify-center w-full">

//    {/* Image de gauche (précédente) */}
//    <div 
//      onClick={goToPrevious}
//      className="cursor-pointer opacity-60 hover:opacity-80 transform -translate-x-4 scale-75 transition-all duration-300 z-10"
//    >
//      <img 
//        src={images[visibleIndices[0]]} 
//        alt="Image précédente" 
//        className="max-h-80 shadow-md border border-gray-200 rounded"
//      />
//    </div>
   
//    {/* Image centrale (active) */}
//    <div className="mx-4 z-20 transform transition-all duration-300 shadow-xl border-2 border-gray-300 rounded">
//      <img 
//        src={images[visibleIndices[1]]} 
//        alt="Image courante" 
//        className="max-h-96"
//      />
//    </div>
   
//    {/* Image de droite (suivante) */}
//    <div 
//      onClick={goToNext}
//      className="cursor-pointer opacity-60 hover:opacity-80 transform translate-x-4 scale-75 transition-all duration-300 z-10"
//    >
//      <img 
//        src={images[visibleIndices[2]]} 
//        alt="Image suivante" 
//        className="max-h-80 shadow-md border border-gray-200 rounded"
//      />
//    </div>
//  </div>
 
//  {/* Indicateurs (points de navigation) */}
//  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-2">
//    {images.map((_, index) => (
//      <button
//        key={index}
//        onClick={() => setCurrentIndex(index)}
//        className={`w-3 h-3 rounded-full transition-all ${
//          index === currentIndex ? 'bg-purple-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
//        }`}
//        aria-label={`Aller à l'image ${index + 1}`}
//      />
//    ))}
//  </div>
// </div>

// </div>
// </div>
// import {useContext, useEffect, useState } from "react";
// import ShopAPIContext from "../context/ShopAPIProvider";

// /* @desc: This component is used to display all informations about an item in store
//  * @param id: the item identifier, used to retrieve item's data
//  * @param clickFn: the handler to add the item to the basket
//  * @return: Item component of the website page
//  */
// function Item({ id, add, goto }) {

//     const [item, setItem] = useState(null); // Item data
//     const { fetchItem } = useContext(ShopAPIContext);

//     useEffect(() => { // Fetch all item's data
//         fetchItem(id)
//             .then(data => setItem(data))
//             .catch(e => console.error(`[Item;useEffect] ${e.message}`));
//     }, []);

//     const home = ( // HTML image rendering
//         <div className="item">
            
//             <div className="shadow-image">
//                 <img src={(!item) ? "??" : item.image} alt=""/>
//             </div>

//             <div className="item-description-border">
//                 <div className="item-description">
//                     <p>{(!item) ? "" : item.description}</p>
//                 </div>
//             </div>

//             <button className="item-button" id={id} onClick={handleClick} price={item?.price}>
//             </button>


//         </div>
//     );

//     function handleClick() { add(id); goto(); };

//     return (
//         <div className="home">
//             <div className="showcase">
//                 {home}
//             </div>
//         </div>
//     );

// /* Fusionner la variable home et le rendu du composant Item */

// } export default Item;
