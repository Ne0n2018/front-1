"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  className?: string;
}

export const GroupButton: React.FC<Props> = ({ className }) => {
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
          router.push("/profile/edit");
        }}
      >
        редактировать профиль
      </Button>
    </div>
  );
};
