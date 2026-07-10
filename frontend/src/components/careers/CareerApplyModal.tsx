import { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import type { Career } from '@/types';
import { useSubmitJobApplication } from '@/api/hooks';
import apiClient from '@/api/client';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

interface CareerApplyModalProps {
  career: Career | null;
  onClose: () => void;
}

export function CareerApplyModal({ career, onClose }: CareerApplyModalProps) {
  const submit = useSubmitJobApplication();
  const fileRef = useRef<HTMLInputElement>(null);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', coverLetter: '' });

  if (!career) return null;

  const uploadResume = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await apiClient.post<{ data: { url: string; fileName: string } }>(
        '/upload/resume',
        fd,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );
      setResumeUrl(data.data.url);
      setResumeName(data.data.fileName);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit.mutate(
      { careerId: career.id, ...form, resumeUrl },
      { onSuccess: onClose },
    );
  };

  return (
    <Modal isOpen={!!career} onClose={onClose} title={`Apply — ${career.title}`} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full name"
          required
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
        </div>
        <Textarea
          label="Cover letter"
          rows={4}
          value={form.coverLetter}
          onChange={(e) => setForm((f) => ({ ...f, coverLetter: e.target.value }))}
        />
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Resume (PDF, DOC, DOCX)</label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx,application/pdf"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void uploadResume(file);
                e.target.value = '';
              }}
            />
            <Button type="button" variant="outline" size="sm" isLoading={uploading} onClick={() => fileRef.current?.click()}>
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Upload resume
            </Button>
            {resumeName && (
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">
                {resumeName}
                <button type="button" onClick={() => { setResumeUrl(''); setResumeName(''); }}>
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          <Button type="submit" isLoading={submit.isPending}>Submit application</Button>
        </div>
      </form>
    </Modal>
  );
}
