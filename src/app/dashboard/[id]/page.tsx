'use client'
import api from "@/apiClient";
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Doctor } from "@/type";
import { Loader2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function doctorDashboard(){
    const { id } = useParams();
    const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    useEffect(()=>{
        async function fetchDoctor() {
            try {
                setLoading(true)
                const response = await api.get(`/users/${id}`)
                setDoctor(response.data as Doctor)
            } catch (error) {
             setError("Помойму ты перепутал")
             console.log(error)   
            }
            finally{
                setLoading(false)
            }
        }
        fetchDoctor()
    },[id])
    if (loading) {
        return (
          <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        );
      }
    
      if (error || !doctor) {
        return (
          <div className="container mx-auto p-4 text-center text-destructive">
            {error || "Давай по новой"}
          </div>
        );
      }
    return(
    <Container>
    <Title text="Ваш профиль"/>
    
    </Container>
    )
}