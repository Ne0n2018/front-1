"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Doctor } from "@/type";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  user: Doctor;
  className?: string;
}

export const GroupButton: React.FC<Props> = ({ className, user }) => {
  const router = useRouter();
  return (
    <div className={cn(className, "flex flex-row gap-3 ")}>
      <Button
        onClick={() => {
          router.push("/patients");
        }}
      >
        список пациентов
      </Button>
      <Button
        onClick={() => {
          router.push(`/profile/edit/${user.id}`);
        }}
      >
        редактировать профиль
      </Button>
    </div>
  );
};
