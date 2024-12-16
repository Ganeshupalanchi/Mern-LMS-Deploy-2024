import React from "react";
import { Button } from "../ui/button";
import FormControls from "./FormControls";

export default function CommonForm({
  formControls = [],
  formData,
  setFormData,
  handleSubmit,
  isDisabled = false,
  buttonText = "Submit",
}) {
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* form controls */}
      <FormControls
        formControls={formControls}
        formData={formData}
        setFormData={setFormData}
      />
      <Button type="submit" className="w-full " disabled={isDisabled}>
        {buttonText}
      </Button>
    </form>
  );
}
