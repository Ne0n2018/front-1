'use client'
import { Container } from "@/components/shared/container";
import { Title } from "@/components/shared/title";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter()
  return (
    <Container className="flex flex-col gap-4 mt-10">
      <Title text={"ПОМОЩЬ ИНВАЛИДАМ В IT СФЕРЕ"}/>
      <p>
    Помогаем исправить проблемы с нервами и не только. До кода пока не доросли.
      </p>
      <Button onClick={()=>{
        router.push("/login")
      }}>
        Войти в систему
      </Button>
    </Container>
  );
}
