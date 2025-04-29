"use client";
import api from "@/apiClient";
import { Container } from "@/components/shared/container";
import { Medicalreport } from "@/type";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ReportPage() {
  const { id } = useParams();
  const [report, setReport] = useState<Medicalreport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    async function fetchPatient() {
      try {
        setLoading(true);
        const response = await api.get(`/medical-report/patient/${id}`);
        setReport(response.data);
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
      {report.map((rep) => {
        return <div key={rep.id}>{rep.reportType}</div>;
      })}
    </Container>
  );
}
