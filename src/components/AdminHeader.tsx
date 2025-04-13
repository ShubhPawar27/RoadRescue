
import { FC } from "react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

const AdminHeader: FC<AdminHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
    </div>
  );
};

export default AdminHeader;
