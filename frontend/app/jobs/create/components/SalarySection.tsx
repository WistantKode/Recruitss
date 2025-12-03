"use client";

import { DollarSign } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { FormSectionProps } from "../types";

export function SalarySection({ formData, handleChange }: FormSectionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-green-500/10 rounded-lg">
            <DollarSign className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <CardTitle>Rémunération</CardTitle>
            <CardDescription>Fourchette de salaire annuelle</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Salaire minimum (€/an)
              </div>
            </label>
            <Input
              type="number"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleChange}
              placeholder="40000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                Salaire maximum (€/an)
              </div>
            </label>
            <Input
              type="number"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleChange}
              placeholder="55000"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
