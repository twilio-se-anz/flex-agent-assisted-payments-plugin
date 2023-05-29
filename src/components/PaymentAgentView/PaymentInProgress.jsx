import React from "react";
import PaymentElement from "./PaymentElement";
import { GetSymbolForCurrencyISO } from "../../util/CurrencyUtil";
import CreditCard from "@snowpak/react-credit-cards";
import "@snowpak/react-credit-cards/es/styles-compiled.css";
import { withTaskContext } from "@twilio/flex-ui";

class PaymentInProgress extends React.Component {
  constructor(props) {
    super(props);
  }

  getFocusField = (field) => {
    if (!field) {
      return "";
    } else if (field === "expiration-date") {
      return "expiry";
    } else if (field === "security-code") {
      return "cvc";
    } else if (field === "payment-card-number") {
      return "number";
    }
  };

  getIssuer = (number) => {
    if (number && number.length > 2) {
      return "visa";
    }
    return null;
  };

  render() {
    if (
      !(
        this.props.paymentState.Result === undefined ||
        this.props.paymentState.Result != "success"
      )
    ) {
      return null;
    }
    //"expiration-date" "security-code"
    return (
      <>
        <div className="input-card">
          <div className="payment-details-container">
            <div className="pay-icon"></div>
            <h1 className="payment-form-heading">
              {GetSymbolForCurrencyISO(this.props.currency)}{" "}
              {this.props.chargeAmount}
            </h1>
          </div>
          <CreditCard
            cvc={this.props.paymentState.SecurityCode || ""}
            expiry={this.props.paymentState.ExpirationDate || ""}
            focused={this.getFocusField(this.props.captureField)}
            name={this.props.task?.attributes.name || "john doe"}
            number={
              this.props.paymentState.PaymentCardNumber?.replaceAll("x", "*") ||
              ""
            }
            preview={true}
            issuer={this.getIssuer(this.props.paymentState.PaymentCardNumber)}
          />
          <hr />
          <PaymentElement
            captureField={this.props.captureField}
            requestCapture={this.props.requestCapture}
            paymentState={this.props.paymentState}
            friendlyName="Payment Card Number"
            pascalCaseName="PaymentCardNumber"
            riverCaseName="payment-card-number"
          />
          <PaymentElement
            captureField={this.props.captureField}
            requestCapture={this.props.requestCapture}
            paymentState={this.props.paymentState}
            friendlyName="Expiration Date"
            pascalCaseName="ExpirationDate"
            riverCaseName="expiration-date"
          />
          <PaymentElement
            captureField={this.props.captureField}
            requestCapture={this.props.requestCapture}
            paymentState={this.props.paymentState}
            friendlyName="Security Code"
            pascalCaseName="SecurityCode"
            riverCaseName="security-code"
          />
          <>
            {this.props.paymentState.ErrorType !== undefined &&
              this.props.paymentState.ErrorType !== "" && (
                <div style={{ color: "red", fontWeight: "bold" }}>
                  Error: {this.props.paymentState.ErrorType}
                </div>
              )}

            {this.props.paymentState.Required !== "" && (
              <div style={{ color: "blue", fontWeight: "bold" }}>
                Required Data: {this.props.paymentState.Required}
              </div>
            )}

            {this.props.paymentState.Required !== undefined && (
              <button
                className="payment-form-button Twilio-Button Twilio-TaskCanvasHeader-EndButton"
                disabled={this.props.paymentState.Required !== ""}
                type="button"
                onClick={() => this.props.processPayment()}
              >
                Process Payment
              </button>
            )}
          </>
        </div>
      </>
    );
  }
}

export default withTaskContext(PaymentInProgress);
