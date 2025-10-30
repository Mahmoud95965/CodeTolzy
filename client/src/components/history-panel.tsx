import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { History, Trash2, FileCode } from "lucide-react";

export interface SavedCode {
  id: string;
  title: string;
  language: string;
  code: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  savedCodes: SavedCode[];
  onLoadCode: (code: SavedCode) => void;
  onDeleteCode: (id: string) => void;
}

export function HistoryPanel({ savedCodes, onLoadCode, onDeleteCode }: HistoryPanelProps) {
  return (
    <div className="flex flex-col h-full bg-card border-l">
      <div className="p-4 border-b">
        <h2 className="font-semibold text-lg flex items-center gap-2">
          <History className="h-5 w-5 text-primary" />
          History
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {savedCodes.length} saved {savedCodes.length === 1 ? 'code' : 'codes'}
        </p>
      </div>

      <ScrollArea className="flex-1 p-4">
        {savedCodes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <FileCode className="h-12 w-12 mx-auto mb-4 text-primary/50" />
            <p className="text-sm">No saved codes yet</p>
            <p className="text-xs mt-2">Save your code to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {savedCodes.map((savedCode) => (
              <Card
                key={savedCode.id}
                className="p-3 hover-elevate cursor-pointer transition-all"
                onClick={() => onLoadCode(savedCode)}
                data-testid={`card-history-${savedCode.id}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-medium text-sm line-clamp-1">{savedCode.title}</h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 flex-shrink-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCode(savedCode.id);
                    }}
                    data-testid={`button-delete-${savedCode.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {savedCode.language}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {savedCode.timestamp.toLocaleDateString()}
                  </span>
                </div>
                
                <pre className="mt-2 text-xs font-mono bg-muted/50 p-2 rounded overflow-hidden text-ellipsis whitespace-nowrap">
                  {savedCode.code.substring(0, 50)}...
                </pre>
              </Card>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
