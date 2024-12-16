import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import { captureAndFinalizePaymentService } from "@/services";
import React, { useContext, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export default function PaymentReturnPage() {
  const { auth } = useContext(AuthContext);
  console.log(auth);

  const navigate = useNavigate();
  const { search } = useLocation();

  const params = new URLSearchParams(search);
  const paymentId = params.get("token") || null;
  const payerId = params.get("PayerID") || null;

  useEffect(() => {
    if (!auth.authenticate) {
      //   navigate("/auth");
    }
    if (!paymentId && !payerId) {
      navigate("/");
    }
  }, []);

  const capturePayment = async () => {
    const currentOrderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
    try {
      const response = await captureAndFinalizePaymentService({
        paymentId,
        payerId,
        orderId: currentOrderId,
      });
      if (response?.success) {
        sessionStorage.removeItem("currentOrderId");
        navigate("/student/student-courses");
      } else {
        sessionStorage.removeItem("currentOrderId");
        navigate("/payment-cancel");
      }
    } catch (error) {
      sessionStorage.removeItem("currentOrderId");
      navigate("/payment-cancel");
    }
  };
  useEffect(() => {
    if (paymentId && payerId) {
      capturePayment();
    }
  }, [paymentId, payerId]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing payment... Please wait</CardTitle>
      </CardHeader>
    </Card>
  );
}
