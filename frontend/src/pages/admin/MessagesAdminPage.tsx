import { useMessages, useUpdateMessageStatus } from '@/api/hooks';
import { MessageStatus } from '@/types';
import { AdminCard, AdminCardBody, AdminCardToolbar } from '@/components/admin/AdminCard';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { AdminStatCard } from '@/components/admin/AdminStatCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PageLoader } from '@/components/ui/Spinner';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';
import { Inbox, Mail } from 'lucide-react';

const statusLabels: Record<MessageStatus, string> = {
  [MessageStatus.New]: 'New',
  [MessageStatus.InProgress]: 'In Progress',
  [MessageStatus.Closed]: 'Closed',
};

const statusVariants: Record<MessageStatus, 'warning' | 'accent' | 'success'> = {
  [MessageStatus.New]: 'warning',
  [MessageStatus.InProgress]: 'accent',
  [MessageStatus.Closed]: 'success',
};

export default function MessagesAdminPage() {
  const { data: messages, isLoading } = useMessages();
  const updateStatus = useUpdateMessageStatus();

  if (isLoading) return <PageLoader />;

  const count = messages?.length ?? 0;
  const unread = messages?.filter((m) => m.status === MessageStatus.New).length ?? 0;

  return (
    <div>
      <AdminPageHeader
        title="Messages"
        description="Contact form submissions from the public website."
        eyebrow="Engagement"
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <AdminStatCard label="Total messages" value={count} icon={Inbox} accent="navy" />
        <AdminStatCard label="Awaiting reply" value={unread} icon={Mail} accent="red" />
      </div>

      <AdminCard accent="gold">
        <AdminCardToolbar>
          <p className="text-sm font-medium text-primary-900">Inbox</p>
          <p className="text-xs text-slate-400">{count} total</p>
        </AdminCardToolbar>
        <AdminCardBody className="p-0 sm:p-0">
          {!count ? (
            <AdminEmptyState
              icon={Mail}
              title="No messages yet"
              description="Contact form submissions will appear here."
            />
          ) : (
            <Table className="rounded-none border-0 shadow-none">
              <THead>
                <TR>
                  <TH>From</TH>
                  <TH>Subject</TH>
                  <TH>Status</TH>
                  <TH>Date</TH>
                  <TH className="text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {messages!.map((msg) => (
                  <TR key={msg.id}>
                    <TD>
                      <div>
                        <p className="font-medium text-primary-900">{msg.name}</p>
                        <p className="text-xs text-slate-400">{msg.email}</p>
                      </div>
                    </TD>
                    <TD className="max-w-xs truncate">{msg.subject}</TD>
                    <TD>
                      <Badge variant={statusVariants[msg.status]}>
                        {statusLabels[msg.status]}
                      </Badge>
                    </TD>
                    <TD className="whitespace-nowrap text-slate-500">
                      {new Date(msg.createdAt).toLocaleDateString()}
                    </TD>
                    <TD>
                      <div className="flex justify-end gap-1">
                        {msg.status !== MessageStatus.InProgress && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateStatus.mutate({ id: msg.id, status: MessageStatus.InProgress })
                            }
                          >
                            In progress
                          </Button>
                        )}
                        {msg.status !== MessageStatus.Closed && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              updateStatus.mutate({ id: msg.id, status: MessageStatus.Closed })
                            }
                          >
                            Close
                          </Button>
                        )}
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </AdminCardBody>
      </AdminCard>
    </div>
  );
}
