
import React from "react";
import { AdminDocumentView } from "@/components/admin/AdminDocumentView";

const PainelAdmin = () => {
  return (
    <div className="space-y-6">
      {/* Admin Dashboard Content */}
      <div className="bg-card rounded-lg border border-border p-6">
        <AdminDocumentView />
      </div>
    </div>
  );
};

export default PainelAdmin;
