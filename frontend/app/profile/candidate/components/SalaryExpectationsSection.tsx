"use client";

import { DollarSign } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function SalaryExpectationsSection({
  formData,
  handleChange,
}: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-green-500/10">
            <DollarSign className="h-5 w-5 text-green-600" />
          </div>
          Prétentions Salariales
        </CardTitle>
        <CardDescription>
          Votre fourchette de salaire attendue (annuel brut)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Salaire minimum (€/an)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                name="desired_salary_min"
                value={formData.desired_salary_min}
                onChange={handleChange}
                className="pl-10"
                placeholder="35000"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Salaire maximum (€/an)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                name="desired_salary_max"
                value={formData.desired_salary_max}
                onChange={handleChange}
                className="pl-10"
                placeholder="45000"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
