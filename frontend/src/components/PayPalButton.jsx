import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { useAmount } from './AmountContext';
import { useNavigate } from 'react-router-dom';  
const PayPalButton = () => {
  const { amount } = useAmount();
  const navigate = useNavigate();  

  return (
    <PayPalButtons
      style={{ layout: "horizontal" }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'USD', 
              value: amount
            }
          }]
        });
      }}
      onApprove={(data, actions) => {
        return actions.order.capture().then(details => {
          console.log("Payment Successful:", details);
          alert("Thank you for your payment!");
          navigate('/home');  
        }).catch(err => {
          console.error("Error capturing the payment:", err);
          alert("There was an issue capturing your payment. Please try again or contact support.");
        });
      }}
      onError={(err) => {
        console.error("PayPal Button Error:", err);
        alert("There was an error processing your payment with PayPal. Please try again or contact our support.");
      }}
    />
  );
};

export default PayPalButton;
