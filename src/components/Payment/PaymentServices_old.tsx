// paymentService.ts

export const PAYMENT_STATES = {
    INITIAL: 'INITIAL',
    CREATING_ORDER: 'CREATING_ORDER',
    ORDER_CREATED: 'ORDER_CREATED',
    AWAITING_APPROVAL: 'AWAITING_APPROVAL',
    APPROVED: 'APPROVED',
    CAPTURING: 'CAPTURING',
    COMPLETED: 'COMPLETED',
    CANCELLED: 'CANCELLED',
    FAILED: 'FAILED',
    POPUP_BLOCKED: 'POPUP_BLOCKED',
    TIMEOUT: 'TIMEOUT',
    NETWORK_ERROR: 'NETWORK_ERROR',
    FETCH_FAILED: 'FETCH_FAILED',
    INVALID_RESPONSE: 'INVALID_RESPONSE',
    CAPTURE_FAILED: 'CAPTURE_FAILED',
  };

  export async function openPaypalPopup(order: any) {
    const popup = window.open(order.links[1].href, "paypalCheckout", "left=100,top=100,width=600,height=800");
    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      throw {
        status: PAYMENT_STATES.POPUP_BLOCKED,
        message: "Veuillez autoriser les popups pour ce site pour compléter le paiement",
      };
    }
    return popup;
  }

  export function waitForPopupClose(popup: Window) {
    return new Promise<{ status: string; message: string }>(resolve => {
      const interval = setInterval(() => {
        if (popup.closed) {
          clearInterval(interval);
          resolve({
            status: PAYMENT_STATES.CANCELLED,
            message: "Paiement annulé par l'utilisateur",
          });
        }
      }, 500);
    });
  }

  export async function pollPaypalStatus(order: any, fetchOrder: (id: string) => Promise<any>, captureOrder: (order: any) => Promise<any>, maxAttempts = 60) {
    let attempts = 0;

    while (attempts < maxAttempts) {
      let res;
      try {
        res = await fetchOrder(order.id);
      } catch (error) {
        throw {
          status: PAYMENT_STATES.FETCH_FAILED,
          message: "Erreur lors de la récupération de la commande",
          error,
        };
      }

      if (!res || typeof res.status !== "string") {
        throw {
          status: PAYMENT_STATES.INVALID_RESPONSE,
          message: "Réponse inattendue de l'API",
          raw: res,
        };
      }

      if (res.status === PAYMENT_STATES.APPROVED || res.status === PAYMENT_STATES.COMPLETED) {
        try {
          await captureOrder({ id: order.id, uuid: order.uuid });
          return { ...res, status: PAYMENT_STATES.COMPLETED };
        } catch (error) {
          throw {
            status: PAYMENT_STATES.CAPTURE_FAILED,
            message: "Erreur lors de la capture du paiement",
            error,
          };
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    throw {
      status: PAYMENT_STATES.TIMEOUT,
      message: "Le délai de validation du paiement a expiré",
    };
  }

  export async function paypalPage(order: any, fetchOrder: (id: string) => Promise<any>, captureOrder: (order: any) => Promise<any>) {
    try {
      const popup = await openPaypalPopup(order);
      const popupClosed = waitForPopupClose(popup);
      const polling = pollPaypalStatus(order, fetchOrder, captureOrder);
      const result = await Promise.race([popupClosed, polling]);

      if (popup && !popup.closed) {
        popup.close();
      }

      return result;
    } catch (error) {
      return {
        status: error.status || PAYMENT_STATES.FAILED,
        message: error.message || "Erreur inattendue durant le processus de paiement",
        error,
      };
    }
  }
