"use client";
import api from "@/apiClient";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Doctor } from "@/type";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DoctorPage() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<{
    email?: string;
    name?: string;
  }>({});

  const router = useRouter();

  // Загрузка данных доктора
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchDoctor() {
      if (!id || typeof id !== "string") {
        if (isMounted) {
          setError("Некорректный ID доктора");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await api.get(`/users/${id}`);
        if (isMounted) {
          setDoctor(response.data);
          setFormData({
            email: response.data.email,
            name: response.data.name,
          });
          setError(null);
        }
      } catch (error: any) {
        if (isMounted && !controller.signal.aborted) {
          if (error.response?.status === 404) {
            setError("Доктор не найден");
          } else if (error.response?.status === 401) {
            setError("Не авторизован. Пожалуйста, войдите в систему");
            localStorage.removeItem("token");
            router.push("/login");
          } else {
            setError("Ошибка загрузки данных доктора");
          }
          console.error("Failed to fetch doctor:", error);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchDoctor();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, router]);

  // Обработчик изменения полей формы
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Обработчик сохранения изменений
  const handleSave = async () => {
    if (!id || !doctor) return;

    // Валидация: email и name не могут быть пустыми
    if (!formData.email) {
      setError("Email не может быть пустым");
      return;
    }
    if (!formData.name) {
      setError("Имя не может быть пустым");
      return;
    }

    // Валидация формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Укажите корректный email");
      return;
    }

    const updatedData: {
      email?: string;
      name?: string;
    } = {};
    if (formData.email !== undefined) updatedData.email = formData.email;
    if (formData.name !== undefined) updatedData.name = formData.name;

    // Логируем данные перед отправкой
    console.log("Sending PATCH request with data:", updatedData);

    try {
      setLoading(true);
      await api.put(`/users/${id}`, updatedData);
      setDoctor({ ...doctor, ...updatedData });
      setIsEditing(false);
      setError(null);
    } catch (error: any) {
      setError(
        error.response?.data?.error || "Ошибка при сохранении изменений"
      );
      console.error("Failed to update doctor:", error);
    } finally {
      setLoading(false);
    }
  };

  // Обработчик отмены редактирования
  const handleCancel = () => {
    setFormData({
      email: doctor?.email,
      name: doctor?.name,
    });
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
            const fetchDoctor = async () => {
              try {
                const response = await api.get(`/users/${id}`);
                setDoctor(response.data);
                setFormData({
                  email: response.data.email,
                  name: response.data.name,
                });
              } catch (err) {
                setError("Ошибка загрузки данных доктора");
              } finally {
                setLoading(false);
              }
            };
            fetchDoctor();
          }}
        >
          Повторить
        </Button>
      </div>
    );
  }

  if (!doctor) {
    return <div className="text-center">Данные доктора не найдены</div>;
  }

  return (
    <Container>
      <Title text="Страница доктора" className="mb-3" />
      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? (
              <Input
                name="name"
                value={formData.name || ""}
                onChange={handleInputChange}
                placeholder="Имя доктора"
                required
              />
            ) : (
              doctor.name
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-row gap-1.5">
              <Label className="mt-2">Email:</Label>
              {isEditing ? (
                <Input
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  placeholder="Email доктора"
                  required
                />
              ) : (
                <div>{doctor.email}</div>
              )}
            </div>
            <div className="flex flex-row gap-1.5">
              <Label className="mt-2">Роль:</Label>
              <div>{doctor.role}</div>
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
            </div>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
