import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";

export default function FormControls({
  formControls = [],
  formData,
  setFormData,
}) {
  const renderComponentByType = (controlItem) => {
    let renderField = "";
    const value = formData[controlItem.name] || "";
    switch (controlItem.componentType) {
      case "input":
        renderField = (
          <Input
            type={controlItem.type}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value })
            }
          />
        );
        break;
      case "select":
        renderField = (
          <Select
            value={value}
            onValueChange={(selectedValue) =>
              setFormData({ ...formData, [controlItem.name]: selectedValue })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.placeholder || "Select"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{controlItem.placeholder || "Select"}</SelectLabel>
                {controlItem?.options.map((item, i) => (
                  <SelectItem value={item.value} key={i}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );

        break;
      case "textarea":
        renderField = (
          <Textarea
            value={value}
            onChange={(e) =>
              setFormData({ ...formData, [controlItem.name]: e.target.value })
            }
            placeholder={controlItem.placeholder}
          />
        );
        break;
      default:
        renderField = (
          <Input
            type={controlItem.type}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
          />
        );
        break;
    }
    return renderField;
  };
  return (
    <div className="flex flex-col gap-3">
      {formControls.map((controlItem, i) => (
        <div key={i}>
          <Label htmlFor={controlItem.name}>{controlItem.label}</Label>
          {renderComponentByType(controlItem)}
        </div>
      ))}
    </div>
  );
}
