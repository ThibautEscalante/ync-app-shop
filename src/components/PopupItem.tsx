import { useState } from 'react';

function PopupItem({ item, onClose, add, isSoldOut, toggleLike }) {
    const [selectedSize, setSelectedSize] = useState('M');
    const [quantity, setQuantity] = useState(1);

    if (!item) return null;

    const handleQuantityChange = (change) => {
        setQuantity(prev => Math.max(1, prev + change));
    };

    return (
        <div className="popuppage" onClick={onClose}>
            <div className="model" onClick={(e) => e.stopPropagation()}>
                
                {/* HEADER BAR */}
                {/* <div className="popup-header" style={{ height: '50px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <button className="popup-close-btn" onClick={onClose}>
                        <img src="/assets/croix.svg" alt="X" />
                    </button>
                </div> */}

                {/* MAIN SPLIT CONTAINER */}
                <div className="popup-main" style={{ display: 'flex' }}>
                    
                    {/* LEFT SIDE – IMAGE */}
                    <div className="popup-image-container" style={{ width: '50%' }}>
                        <img src={item.image || '/path/to/default-image.png'} alt={item.title} className="popup-image" />
                    </div>

                    {/* RIGHT SIDE – CONTENT */}
                    <div className="content-section" style={{ width: '50%', padding: '2rem' }}>
                        <button className="popup-close-btn" onClick={onClose}>
                            <img src="/assets/croix.svg" alt="X" />
                        </button>
                        
                        <div className="top-section">  
                            <div className="content-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <h1 className="popup-title">{item.title || 'STAIRS Tee'}</h1>
                                <span className="popup-quote"><em>“Create or consume.”</em></span>
                            </div>
                        
                        
                            <p className="popup-subtitle">BLACK ON WHITE • UNISEX ♂</p>
                            <p className="popup-price">{item.price} €</p>
                            <p className="popup-description">
                                {item.description || `Là où l’âme chante afin de proclamer son existence, d’autres accueillent dans un écho cette lancinante mélodie. 
                                STAIRS est une ode au va-et-vient entre l’intime et le partagé – là où l’art prend tout son sens.`}
                            </p>
                        </div>    
                    
                        <div className="mid-section">
                            <div className="options-section">
                                <div className="option-group">
                                    <label className="option-label">Dis-moi quelle taille tu portes !</label>
                                    <div className="size-buttons">
                                        {['S', 'M', 'L', 'XL'].map(size => (
                                            <button 
                                                key={size}
                                                className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                                                onClick={() => setSelectedSize(size)}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="option-group">
                                    <label className="option-label">Combien tu en veux l'ami(e) ?</label>
                                    <div className="quantity-controls">
                                        <button className="quantity-button" onClick={() => handleQuantityChange(-1)}>-</button>
                                        <span className="quantity-display">{quantity}</span>
                                        <button className="quantity-button" onClick={() => handleQuantityChange(1)}>+</button>
                                    </div>
                                </div>
                            </div>

                            <div className="action-section">
                                <button 
                                    className="popup-button custom-target" 
                                    id={item.id} 
                                    onClick={() => add(item.id, selectedSize, quantity)}
                                >
                                    JE LE PRENDS !
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default PopupItem;
