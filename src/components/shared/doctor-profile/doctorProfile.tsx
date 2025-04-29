import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Doctor } from "@/type";
import React from "react";

interface Props {
  doctor: Doctor;
  className?: string;
}

export const DoctorPRofile: React.FC<Props> = ({ className, doctor }) => {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-4">
          {doctor.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <strong>Email:</strong> {doctor.email}
        </p>
      </CardContent>
    </Card>
  );
};
