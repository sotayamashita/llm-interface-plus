import React from "react";
import ReactDOM from "react-dom/client";
import optionsStorage from "./options-storage";
import { cn } from "./lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const Popup: React.FC = () => {
  const [enableInjection, setEnableInjection] = React.useState<boolean>(true);

  React.useEffect(() => {
    optionsStorage.getAll().then((opts) => {
      setEnableInjection(!!opts.enableTemplateInjection);
    });
  }, []);

  const onToggleInjection = async () => {
    const newVal = !enableInjection;
    setEnableInjection(newVal);
    await optionsStorage.set({ enableTemplateInjection: newVal });
  };

  return (
    <div className="min-w-[300px] p-4">
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="text-sm font-medium">Template Button</h2>
            <p className="text-xs text-muted-foreground">
              Show/hide the template button
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleInjection}
            className={cn(
              "hover:bg-bg-200 hover:text-text-200",
              enableInjection ? "text-text-200" : "text-text-300",
            )}
          >
            {enableInjection ? "ON" : "OFF"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const root = document.getElementById("root");
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>,
  );
}
