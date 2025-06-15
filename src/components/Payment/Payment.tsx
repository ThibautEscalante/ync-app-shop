
function Payment({ basket, goto }) {

    const { fetchItem, fetchOrder, postOrder, captureOrder } = useContext(ShopAPIContext);

    const rules = {
        first_name: 'required|alpha',
        name: 'required|alpha',
        phone: 'nullable|telephone',
        mail: 'required|email',
        address: 'required|address_api_check',
        postal_code: 'required|string',
        city: 'required|string',
        region: 'required|string',
        gtc: 'accepted'
    };

    const { order, errors, handleChange, handleBlur, formValid, setOrder, setErrors } = usePaymentForm({
        first_name: '', name: '', phone: '', mail: '',
        address: '', postal_code: '', city: '', region: '',
        newsletter: false, gtc: false
    }, rules);

    const [approved, setApproved] = useState('');
    const [message, setMessage] = useState('');

    const time2Pay = async () => {

        const validator = make(order, rules);

        if (!validator.validate()) {
            setApproved('UNVALID_FORM_ORDER');
            const errs = validator.errors().all();

            setErrors(prev => {
                let newErrors = {};
                Object.keys(rules).forEach(key => {
                    newErrors[key] = errs[key] ? errs[key][0] : undefined;
                });
                if (rules.gtc.includes('accepted') && !order.gtc) {
                    newErrors.gtc = newErrors.gtc || 'Vous devez accepter les CGV.';
                }
                return newErrors;
            });

            let err_msg = '';
            Object.keys(errs).map(key => err_msg += `- ${key} : ${errs[key]}`);
            setMessage(err_msg);
            return;

        } else {

            // Si la validation globale réussit, on efface toutes les erreurs
            setErrors({});

            setApproved('VALID_FORM_ORDER');
            setMessage('Processing payment...');

            let price = 0;
            for (let item in basket) {
                await fetchItem(item)
                    .then(data => price += (parseFloat(data.price) * basket[item]))
                    .catch(e => console.error(`[Payment;time2pay | fetchItem] ${e.message} (${e.status})`));
            }

            let res = await postOrder({...order, items: basket, price: price});
            await paypalPage(res, fetchOrder, captureOrder).then((paypalResult) => {
                setApproved(paypalResult.status);
                // mailConfirmation(order);
                setMessage('THANKS A LOT !'); // setMessage(paypalResult.message);
                goto();
            }).catch(e => {
                console.error(`[Payment;time2pay] ${e.message} (${e.status})`);
                setApproved(e.status);
                setMessage(e.message);
            });
        }
    };

    return (<>
            <Section name="Payment" image="assets/payment_icon.svg" />
            <div className="payment">
                 {/* PARTIE GAUCHE */}
                <PaymentForm
                    order={order}
                    errors={errors}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    rules={rules}
                    basket={basket}
                />

                {/* PARTIE DROITE */}
                <PaymentPrice basket={basket} time2Pay={time2Pay} formValid={formValid}/>

                {/* Message conditionnel si le paiement est approuvé */}
                {(approved !== '') && (
                    <div className="payment-message">
                    {message}
                    </div>
                )}

            </div>

            </>);
}

export default Payment;
