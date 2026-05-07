"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDropzone } from "react-dropzone";
import { format } from "date-fns";
import { contentService } from "@/services/content.service";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCloud, File as FileIcon, X, Loader2 } from "lucide-react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/gif"];

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100),
  subject: z.string().min(1, "Subject is required"),
  description: z.string().optional(),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().min(1, "End time is required"),
  rotationDuration: z.coerce.number().min(0).optional(),
}).refine((data) => {
  const start = new Date(data.startTime).getTime();
  const end = new Date(data.endTime).getTime();
  return end > start;
}, {
  message: "End time must be after start time",
  path: ["endTime"],
});

const subjects = [
  "Mathematics", "Science", "History", "Geography", "English", "Computer Science"
];

export default function UploadContentPage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "",
      description: "",
      startTime: "",
      endTime: "",
      rotationDuration: 0,
    },
  });

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (rejectedFiles?.length > 0) {
      setFileError("Invalid file type or size (Max 10MB, JPG/PNG/GIF)");
      return;
    }
    
    if (acceptedFiles?.length > 0) {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setFileError("");
      
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/gif': ['.gif']
    },
    maxSize: MAX_FILE_SIZE,
    maxFiles: 1
  });

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setFileError("");
  };

  const onSubmit = async (values) => {
    if (!file) {
      setFileError("Please upload a file");
      return;
    }

    setIsLoading(true);
    try {
      await contentService.uploadContent({
        ...values,
        file: [file] // Passing as array to match mock service expectation
      });
      toast.success("Content uploaded successfully and pending approval.");
      router.push("/teacher/my-content");
    } catch (error) {
      toast.error(error.message || "Failed to upload content");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Upload Content</h2>
        <p className="text-slate-500">Submit new educational material for principal approval.</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Introduction to Algebra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject <span className="text-red-500">*</span></FormLabel>
                      <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {subjects.map((sub) => (
                            <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of the content..." 
                        className="resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="rotationDuration"
                render={({ field }) => (
                  <FormItem className="md:w-1/2 md:pr-3">
                    <FormLabel>Rotation Duration (seconds)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" placeholder="e.g. 10" {...field} />
                    </FormControl>
                    <FormDescription>Time to show before rotating to next content (0 = infinite)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-3">
                <FormLabel>File Upload <span className="text-red-500">*</span></FormLabel>
                
                {!file ? (
                  <div 
                    {...getRootProps()} 
                    className={`border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isDragActive ? 'border-indigo-500 bg-indigo-50' : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <input {...getInputProps()} />
                    <UploadCloud className="h-10 w-10 text-slate-400 mb-4" />
                    <p className="text-sm font-medium text-slate-700">Drag & drop your file here</p>
                    <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, GIF up to 10MB</p>
                  </div>
                ) : (
                  <div className="relative border rounded-lg p-4 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center space-x-4 overflow-hidden">
                      {preview ? (
                        <div className="h-16 w-16 rounded overflow-hidden shrink-0 bg-slate-200">
                          <img src={preview} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                      ) : (
                        <FileIcon className="h-10 w-10 text-indigo-500" />
                      )}
                      <div className="truncate">
                        <p className="text-sm font-medium text-slate-900 truncate">{file.name}</p>
                        <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <Button type="button" variant="ghost" size="icon" onClick={removeFile} className="text-slate-500 hover:text-red-500">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                )}
                {fileError && <p className="text-[0.8rem] font-medium text-red-500">{fileError}</p>}
              </div>

              <div className="flex justify-end pt-4">
                <Button type="button" variant="outline" className="mr-4" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Submit for Approval
                </Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
