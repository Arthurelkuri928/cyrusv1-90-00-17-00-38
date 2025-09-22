
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageVisibilityManagement from "./PageVisibilityManagement";
import SidebarLinksManagement from "./SidebarLinksManagement";

const Visibility = () => {
  const [activeTab, setActiveTab] = useState("pages");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Gerenciamento de Visibilidade</h2>
        <p className="text-muted-foreground">
          Controle a visibilidade de páginas e links no sistema
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pages">Páginas</TabsTrigger>
          <TabsTrigger value="sidebar-links">Links da Sidebar</TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <PageVisibilityManagement />
        </TabsContent>

        <TabsContent value="sidebar-links">
          <SidebarLinksManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Visibility;
