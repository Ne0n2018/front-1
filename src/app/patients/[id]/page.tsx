"use client";
import api from "@/apiClient";
import { Container } from "@/components/shared/container";
import { DateDisplay } from "@/components/shared/dataDisplay";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Patient } from "@/type";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    fullName?: string;
    birthDate?: string;
    medicalHistory?: string;
  }>({});
  const router = useRouter();

  // Загрузка данных пациента
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchPatient() {
      if (!id || typeof id !== "string") {
        if (isMounted) {
          setError("Некорректный ID пациента");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/patients/${id}`);
        if (isMounted) {
          setPatient(response.data);
          setFormData({
            ...response.data,
            birthDate: response.data.birthDate
              ? new Date(response.data.birthDate).toISOString().slice(0, 16)
              : "",
          }); // Преобразуем birthDate для input
          setError(null);
        }
      } catch (error: any) {
        if (isMounted && !controller.signal.aborted) {
          if (error.response?.status === 404) {
            setError("Пациент не найден");
          } else if (error.response?.status === 401) {
            setError("Не авторизован. Пожалуйста, войдите в систему");
            localStorage.removeItem("token");
            router.push("/login");
          } else {
            setError("Ошибка загрузки данных пациента");
          }
          console.error("Failed to fetch patient:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPatient();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, router]);

  // Обработчик изменения полей формы
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "birthDate") {
      // Преобразуем значение в ISO-формат
      setFormData((prev) => ({
        ...prev,
        [name]: value ? new Date(value).toISOString() : "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Обработчик сохранения изменений
  const handleSave = async () => {
    if (!id || !patient) return;

    try {
      setLoading(true);
      await api.put(`/patients/${id}`, formData);
      setPatient({ ...patient, ...formData }); // Обновляем данные пациента
      setIsEditing(false); // Выходим из режима редактирования
      setError(null);
    } catch (error: any) {
      setError("Ошибка при сохранении изменений");
      console.error("Failed to update patient:", error);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    setFormData(patient || {}); // Восстанавливаем исходные данные
    setIsEditing(false);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-destructive">
        {error}
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => {
            setError(null);
            setLoading(true);
            const fetchPatient = async () => {
              try {
                const response = await api.get(`/patients/${id}`);
                setPatient(response.data);
                setFormData({
                  ...response.data,
                  birthDate: response.data.birthDate
                    ? new Date(response.data.birthDate)
                        .toISOString()
                        .slice(0, 16)
                    : "",
                });
              } catch (err) {
                setError("Ошибка загрузки данных пациента");
              } finally {
                setLoading(false);
              }
            };
            fetchPatient();
          }}
        >
          Повторить
        </Button>
      </div>
    );
  }

  if (!patient) {
    return <div className="text-center">Данные пациента не найдены</div>;
  }

  return (
    <Container>
      <Title text="Страница пациента" className="mb-3" />
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? (
              <Input
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleInputChange}
                placeholder="ФИО пациента"
              />
            ) : (
              patient.fullName
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-row gap-1.5">
              <Label className="mt-2">Дата рождения:</Label>
              {isEditing ? (
                <Input
                  name="birthDate"
                  type="datetime-local"
                  value={
                    formData.birthDate
                      ? new Date(formData.birthDate).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={handleInputChange}
                />
              ) : (
                <DateDisplay dateString={patient.birthDate || ""} />
              )}
            </div>
            <div>
              <Label>История болезни:</Label>
              {isEditing ? (
                <Textarea
                  name="medicalHistory"
                  value={formData.medicalHistory || ""}
                  onChange={handleInputChange}
                  placeholder="История болезни"
                />
              ) : (
                <div>{patient.medicalHistory || "Не указана"}</div>
              )}
            </div>
            <div className="flex flex-row gap-4 mt-4">
              {isEditing ? (
                <>
                  <Button onClick={handleSave} disabled={loading}>
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Сохранить"
                    )}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
                    Отмена
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  Редактировать
                </Button>
              )}
              <Button
                onClick={() => router.push(`/patients/research/${patient.id}`)}
              >
                Открыть список исследований
              </Button>
              <Button
                onClick={() => router.push(`/patients/report/${patient.id}`)}
              >
                Открыть список заключений
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
