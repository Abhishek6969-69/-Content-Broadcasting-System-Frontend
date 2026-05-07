"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { contentService } from "@/services/content.service";
import { approvalService } from "@/services/approval.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, FileSearch } from "lucide-react";
import { toast } from "sonner";

export default function ApprovalsPage() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Reject Modal State
  const [rejectItem, setRejectItem] = useState(null);
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Preview Modal State
  const [previewItem, setPreviewItem] = useState(null);

  const fetchContent = async () => {
    try {
      const data = await contentService.getAllContent();
      setContent(data.filter(c => c.status === 'PENDING'));
    } catch (error) {
      console.error("Failed to load content", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await approvalService.approveContent(id);
      toast.success("Content approved successfully");
      fetchContent(); // Refresh list
    } catch (error) {
      toast.error(error.message || "Failed to approve content");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!reason.trim()) {
      toast.error("Rejection reason is mandatory");
      return;
    }
    
    setActionLoading(true);
    try {
      await approvalService.rejectContent(rejectItem.id, reason);
      toast.success("Content rejected");
      setRejectItem(null);
      setReason("");
      fetchContent(); // Refresh list
    } catch (error) {
      toast.error(error.message || "Failed to reject content");
    } finally {
      setActionLoading(false);
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
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Pending Approvals</h2>
        <p className="text-slate-500">Review and approve or reject content submitted by teachers.</p>
      </div>

      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {content.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              No pending content to review.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50">
                    <TableHead>Teacher</TableHead>
                    <TableHead>Content Info</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>File</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {content.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium text-slate-900">{item.teacherName}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-xs text-slate-500">{item.subject}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div><span className="font-medium text-slate-700">Start:</span> {format(new Date(item.startTime), 'MMM d, yyyy h:mm a')}</div>
                          <div><span className="font-medium text-slate-700">End:</span> {format(new Date(item.endTime), 'MMM d, yyyy h:mm a')}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-indigo-600 flex items-center gap-1.5"
                          onClick={() => setPreviewItem(item)}
                        >
                          <FileSearch className="w-4 h-4" />
                          View Details
                        </Button>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                            onClick={() => setRejectItem(item)}
                            disabled={actionLoading}
                          >
                            <X className="w-4 h-4 mr-1" /> Reject
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(item.id)}
                            disabled={actionLoading}
                          >
                            <Check className="w-4 h-4 mr-1" /> Approve
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reject Modal */}
      <Dialog open={!!rejectItem} onOpenChange={(open) => !open && setRejectItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Content</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting "{rejectItem?.title}". This will be visible to the teacher.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectItem(null)} disabled={actionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={actionLoading || !reason.trim()}>
              {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={!!previewItem} onOpenChange={(open) => !open && setPreviewItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Content Details</DialogTitle>
          </DialogHeader>
          {previewItem && (
            <div className="space-y-4 py-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-slate-500 font-medium">Title</div>
                <div className="col-span-2 font-medium">{previewItem.title}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-slate-500 font-medium">Teacher</div>
                <div className="col-span-2">{previewItem.teacherName}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-slate-500 font-medium">Subject</div>
                <div className="col-span-2">{previewItem.subject}</div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-slate-500 font-medium">Description</div>
                <div className="col-span-2 text-slate-700">{previewItem.description || "No description provided."}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t pt-4">
                <div className="text-slate-500 font-medium">File Name</div>
                <div className="col-span-2 truncate">{previewItem.file?.name || "None"}</div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setPreviewItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
