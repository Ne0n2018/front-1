"use client";
import api from "@/apiClient";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddPatientPage() {
  const [formData, setFormData] = useState<{
    fullName: string;
    birthDate: string;
    medicalHistory?: string;
  }>({
    fullName: "",
    birthDate: "",
    medicalHistory: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  // Обработчик изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value).toISOString() : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Обработчик отправки формы
  const handleSubmit = async () => {
    // Валидация
    if (!formData.fullName) {
      setError("ФИО не может быть пустым");
      return;
    }
    if (!formData.birthDate || isNaN(new Date(formData.birthDate).getTime())) {
      setError("Укажите корректную дату рождения");
      return;
    }

    const dataToSend: {
      fullName: string;
      birthDate: string;
      medicalHistory?: string;
    } = {
      fullName: formData.fullName,
      birthDate: formData.birthDate,
    };
    if (formData.medicalHistory) {
      dataToSend.medicalHistory = formData.medicalHistory;
    }

    // Логируем данные перед отправкой
    console.log("Sending POST request with data:", dataToSend);

    try {
      setLoading(true);
      const response = await api.post(`/patients`, dataToSend);
      setError(null);
      // Перенаправляем на страницу нового пациента
      router.push(`/patients/${response.data.id}`);
    } catch (error: any) {
      setError(error.response?.data?.error || "Ошибка при добавлении пациента");
      console.error("Failed to add patient:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title text="Добавление пациента" className="mb-3" />
      <Card>
        <CardHeader>
          <CardTitle>Новый пациент</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-center text-destructive mb-4">{error}</div>
          )}
          <div className="space-y-4">
            <div className="flex flex-row gap-1.5">
              <Label className="mt-2">ФИО:</Label>
              <Input
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="ФИО пациента"
                required
              />
            </div>
            <div className="flex flex-row gap-1.5">
              <Label className="mt-2">Дата рождения:</Label>
              <Input
                name="birthDate"
                type="datetime-local"
                value={
                  formData.birthDate
                    ? new Date(formData.birthDate).toISOString().slice(0, 16)
                    : ""
                }
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <Label>История болезни:</Label>
              <Textarea
                name="medicalHistory"
                value={formData.medicalHistory || ""}
                onChange={handleInputChange}
                placeholder="История болезни (опционально)"
              />
            </div>
            <div className="flex flex-row gap-4 mt-4">
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Добавить пациента"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/patients")}
              >
                Отмена
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
