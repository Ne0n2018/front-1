import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface DateDisplayProps {
  dateString: string;
}

export const DateDisplay: React.FC<DateDisplayProps> = ({ dateString }) => {
  const date = new Date(dateString);

  // Проверка на валидность даты
  if (isNaN(date.getTime())) {
    return <span>дату не предоставили</span>;
  }

  const formattedDate = format(date, "dd.MM.yyyy HH:mm", { locale: ru });

  return (
    <div>
      <time dateTime={dateString}>{formattedDate}</time>
    </div>
  );
};
