import { useMemo, useState, type ReactNode } from 'react';
import { Inbox, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import {
  AdminCard,
  AdminCardBody,
  AdminCardToolbar,
} from '@/components/admin/AdminCard';
import { AdminEmptyState } from '@/components/admin/AdminEmptyState';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { PageLoader } from '@/components/ui/Spinner';
import { Table, THead, TBody, TR, TH, TD } from '@/components/ui/Table';

export interface AdminColumn<T> {
  key: string;
  label: string;
  render?: (item: T) => ReactNode;
}

export interface AdminCrudPageProps<T extends { id: string }> {
  title: string;
  description?: string;
  items: T[] | undefined;
  isLoading: boolean;
  columns: AdminColumn<T>[];
  formContent: (item: T | null, onClose: () => void) => ReactNode;
  onDelete: (id: string) => Promise<void> | void;
  createLabel?: string;
  searchPlaceholder?: string;
  deleteTitle?: string;
  getDeleteItemName?: (item: T) => string;
}

function itemMatchesSearch<T extends { id: string }>(
  item: T,
  columns: AdminColumn<T>[],
  query: string,
): boolean {
  const q = query.toLowerCase();
  return columns.some((col) => {
    const raw = (item as Record<string, unknown>)[col.key];
    if (raw == null) return false;
    return String(raw).toLowerCase().includes(q);
  });
}

function defaultDeleteItemName<T>(item: T, columns: AdminColumn<T>[]): string {
  for (const col of columns) {
    const raw = (item as Record<string, unknown>)[col.key];
    if (raw != null && String(raw).trim()) return String(raw);
  }
  return 'this record';
}

export function AdminCrudPage<T extends { id: string }>({
  title,
  description,
  items,
  isLoading,
  columns,
  formContent,
  onDelete,
  createLabel = 'Add new',
  searchPlaceholder = 'Search records…',
  deleteTitle,
  getDeleteItemName,
}: AdminCrudPageProps<T>) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<T | null>(null);
  const [search, setSearch] = useState('');

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (item: T) => {
    setEditing(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
  };

  const filtered = useMemo(() => {
    const list = items ?? [];
    if (!search.trim()) return list;
    return list.filter((item) => itemMatchesSearch(item, columns, search));
  }, [items, columns, search]);

  if (isLoading) return <PageLoader />;

  const count = items?.length ?? 0;
  const singular = title.replace(/s$/, '');

  return (
    <div>
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            {createLabel}
          </Button>
        }
      />

      <AdminCard accent="navy">
        <AdminCardToolbar>
          <p className="text-sm text-slate-500">
            <span className="font-medium tabular-nums text-primary-900">{count}</span>{' '}
            {count === 1 ? 'record' : 'records'}
            {search && (
              <span className="text-slate-400">
                {' '}
                · {filtered.length} shown
              </span>
            )}
          </p>
          {count > 0 && (
            <div className="relative w-full sm:w-64">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
                aria-label="Search records"
              />
            </div>
          )}
        </AdminCardToolbar>

        <AdminCardBody className="p-0 sm:p-0">
          {count === 0 ? (
            <AdminEmptyState
              icon={Inbox}
              title={`No ${title.toLowerCase()} yet`}
              description="Get started by creating your first entry."
              action={
                <Button onClick={openCreate}>
                  <Plus className="h-4 w-4" />
                  {createLabel}
                </Button>
              }
            />
          ) : filtered.length === 0 ? (
            <AdminEmptyState
              title="No matching records"
              description={`Try a different search term.`}
              action={
                <Button variant="outline" size="sm" onClick={() => setSearch('')}>
                  Clear search
                </Button>
              }
            />
          ) : (
            <Table className="rounded-none border-0 shadow-none">
              <THead>
                <TR>
                  {columns.map((col) => (
                    <TH key={col.key}>{col.label}</TH>
                  ))}
                  <TH className="w-28 text-right">Actions</TH>
                </TR>
              </THead>
              <TBody>
                {filtered.map((item) => (
                  <TR key={item.id}>
                    {columns.map((col) => (
                      <TD key={col.key}>
                        {col.render
                          ? col.render(item)
                          : String((item as Record<string, unknown>)[col.key] ?? '')}
                      </TD>
                    ))}
                    <TD>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEdit(item)}
                          aria-label={`Edit ${singular}`}
                          className="text-primary-700 hover:bg-primary-50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${singular}`}
                          className="hover:bg-brand-red-500/10"
                        >
                          <Trash2 className="h-4 w-4 text-brand-red-500" />
                        </Button>
                      </div>
                    </TD>
                  </TR>
                ))}
              </TBody>
            </Table>
          )}
        </AdminCardBody>
      </AdminCard>

      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        title={editing ? `Edit ${singular}` : `New ${singular}`}
        size="lg"
      >
        {formContent(editing, closeModal)}
      </Modal>

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          await onDelete(deleteTarget.id);
        }}
        title={deleteTitle ?? `Delete ${singular.toLowerCase()}?`}
        itemName={
          deleteTarget
            ? getDeleteItemName?.(deleteTarget) ?? defaultDeleteItemName(deleteTarget, columns)
            : undefined
        }
        successMessage={`${singular} deleted successfully.`}
      />
    </div>
  );
}
