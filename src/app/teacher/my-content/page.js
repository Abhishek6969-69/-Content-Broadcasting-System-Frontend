"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { contentService } from "@/services/content.service";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function MyContentPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await contentService.getMyContent();
        setContent(data);
      } catch (error) {
        console.error("Failed to load content", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const getStatusBadge = (status) => {
    switch(status) {
      case 'APPROVED': return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Approved</Badge>;
      case 'REJECTED': return <Badge variant="destructive">Rejected</Badge>;
      default: return <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">Pending</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Content</h2>
        <p className="text-slate-500">Manage and view the status of your uploaded content.</p>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {content.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No content uploaded yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Times</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>File</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {item.title}
                        {item.status === 'REJECTED' && item.rejectionReason && (
                          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded flex items-start gap-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{item.rejectionReason}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{item.subject}</TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div><span className="font-medium text-slate-700">Start:</span> {format(new Date(item.startTime), 'MMM d, yyyy h:mm a')}</div>
                          <div><span className="font-medium text-slate-700">End:</span> {format(new Date(item.endTime), 'MMM d, yyyy h:mm a')}</div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        {item.file ? (
                          <div className="text-xs max-w-[120px] truncate text-slate-600" title={item.file.name}>
                            {item.file.name}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">No file</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
