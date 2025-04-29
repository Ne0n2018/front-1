"use client";

import api from "@/apiClient";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Patient } from "@/type";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function patientsList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchPatients() {
      try {
        setLoading(true);
        const response = await api.get("/patients");
        setPatients(response.data);
      } catch (error) {
        setError("Помойму ты перепутал");
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPatients();
  }, []);
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
    <Container className="p-4">
      <Title text="список пациентов" />
      {patients.length === 0 ? (
        <p className="text-center text-muted-foreground">пациентов пока нету</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {patients.map((patient) => (
            <div key={patient.id} className="border p-4 rounded-lg">
              <h2 className="text-xl font-semibold">{patient.fullName}</h2>
              <p className="text-muted-foreground">
                Дата рождения: {patient.birthDate}
              </p>
              <p className="text-muted-foreground">
                История болезни: {patient.medicalHistory}
              </p>
              <div className="mt-3">
                <Button
                  onClick={() => {
                    router.push(`/patients/${patient.id}`);
                  }}
                >
                  редактировать
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  );
}
