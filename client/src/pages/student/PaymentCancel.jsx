import { Button } from "@/components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <div>
      Payment is cancelled, try again.
      <Button onClick={() => navigate("/student")}>Go To Home</Button>
    </div>
  );
}
