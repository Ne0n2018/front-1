"use client";
import api from "@/apiClient";
import { Container } from "@/components/shared/container";
import { Reaserch } from "@/type";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function reaserchPage() {
  const { id } = useParams();
  const [reaserch, setReaserch] = useState<Reaserch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchPatient() {
      try {
        setLoading(true);
        const response = await api.get(`/research/patient/${id}`);
        setReaserch(response.data);
      } catch (error) {
        setError("Помойму ты перепутал");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatient();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-destructive">{error}</div>;
  }
  return (
    <Container>
      {reaserch.map((res) => {
        return <div key={res.id}>{res.type}</div>;
      })}
    </Container>
  );
}
