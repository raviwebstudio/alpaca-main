'use client';

import { useEffect, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  createCategorySlug,
  readLocalCategories,
  writeLocalCategories,
  type LocalCategory,
} from '@/lib/localCategories';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<LocalCategory[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    image: '',
  });

  const loadCategories = () => {
    setCategories(readLocalCategories());
    setLoading(false);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setFormData({ name: '', slug: '', parentId: '', description: '', image: '' });
    setFormError(null);
    setShowForm(true);
  };

  const openEdit = (category: LocalCategory) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId || '',
      description: category.description || '',
      image: category.image || '',
    });
    setFormError(null);
    setShowForm(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((current) => ({
      ...current,
      name,
      slug: editingId ? current.slug : createCategorySlug(name),
    }));
  };

  const handleSaveCategory = () => {
    if (!formData.name.trim()) {
      setFormError('Category name is required.');
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const currentCategories = readLocalCategories();
      const slug = formData.slug.trim() || createCategorySlug(formData.name.trim());
      const duplicate = currentCategories.some((category) => category.slug === slug && category.id !== editingId);

      if (duplicate) {
        setFormError('A category with this slug already exists.');
        setSaving(false);
        return;
      }

      const nextCategory: LocalCategory = {
        id: editingId ?? `cat-${Date.now()}`,
        name: formData.name.trim(),
        slug,
        parentId: formData.parentId || null,
        image: formData.image.trim() || null,
        description: formData.description.trim() || null,
        _count: { products: 0 },
      };
      const nextCategories = editingId
        ? currentCategories.map((category) => category.id === editingId ? nextCategory : category)
        : [...currentCategories, nextCategory];

      writeLocalCategories(nextCategories);
      setFormData({ name: '', slug: '', parentId: '', description: '', image: '' });
      setEditingId(null);
      setShowForm(false);
      loadCategories();
      toast.success('Category saved successfully.');
    } catch (error: any) {
      setFormError(`An error occurred: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string, count: number) => {
    if (count > 0) {
      toast.error(`Cannot delete — ${count} products use this category. Reassign them first.`);
      return;
    }

    if (confirm('Are you sure you want to delete this category?')) {
      writeLocalCategories(readLocalCategories().filter((category) => category.id !== id));
      toast.success('Category deleted successfully.');
      loadCategories();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-[#78716C]">Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1917]">Categories</h1>
        <p className="mt-1 text-sm text-[#78716C]">Manage product categories and hierarchy</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#E0D8D0] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-between border-b border-[#E0D8D0] bg-stone-50/50 p-4">
          <h3 className="font-medium text-[#1C1917]">Category List</h3>
          <button onClick={openAdd} className="flex items-center gap-2 rounded-full bg-[#C8956C] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B07D56]">
            <Plus size={16} /> Add Category
          </button>
        </div>

        {showForm && (
          <div className="border-b border-[#E0D8D0] bg-[#FAF8F5] p-6">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-[#1C1917]">{editingId ? 'Edit Category' : 'New Category'}</h4>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-stone-600"><X size={20} /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Name"><input type="text" required value={formData.name} onChange={handleNameChange} className="w-full rounded-xl border border-[#E0D8D0] px-4 py-2.5 text-sm outline-none focus:border-[#C8956C]" /></Field>
              <Field label="Slug"><input type="text" required value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} className="w-full rounded-xl border border-[#E0D8D0] px-4 py-2.5 text-sm outline-none focus:border-[#C8956C]" /></Field>
              <Field label="Parent Category">
                <select value={formData.parentId} onChange={e => setFormData({ ...formData, parentId: e.target.value })} className="w-full rounded-xl border border-[#E0D8D0] bg-white px-4 py-2.5 text-sm outline-none focus:border-[#C8956C]">
                  <option value="">Root (None)</option>
                  {categories.filter(c => c.id !== editingId).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Image URL"><input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full rounded-xl border border-[#E0D8D0] px-4 py-2.5 text-sm outline-none focus:border-[#C8956C]" /></Field>
              <div className="col-span-2"><Field label="Description"><input type="text" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full rounded-xl border border-[#E0D8D0] px-4 py-2.5 text-sm outline-none focus:border-[#C8956C]" /></Field></div>
              <div className="col-span-2 mt-2">
                {formError && <div className="mb-3 rounded-[10px] border border-red-200 bg-red-50 p-3 text-sm text-red-600">{formError}</div>}
                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => setShowForm(false)} className="rounded-full px-5 py-2 text-sm font-medium text-[#78716C] transition-colors hover:bg-stone-100">Cancel</button>
                  <button onClick={handleSaveCategory} disabled={saving} className="rounded-full bg-[#C8956C] px-6 py-2.5 text-sm font-medium text-white disabled:bg-stone-400">
                    {saving ? 'Saving...' : 'Save Category'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-50 text-xs uppercase tracking-wide text-stone-500">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Parent</th>
                <th className="px-6 py-4 text-center font-medium">Products</th>
                <th className="px-6 py-4 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categories.map((category) => (
                <tr key={category.id} className="transition-colors hover:bg-stone-50/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {category.image ? <img src={category.image} alt="" className="h-8 w-8 rounded-lg object-cover" /> : <div className="h-8 w-8 rounded-lg border border-[#E0D8D0] bg-stone-100" />}
                      <span className="font-medium text-[#1C1917]">{category.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#78716C]">{category.slug}</td>
                  <td className="px-6 py-4 text-sm text-[#78716C]">{category.parent ? <span className="rounded bg-stone-100 px-2 py-1 text-xs">{category.parent.name}</span> : <span className="italic text-stone-400">Root</span>}</td>
                  <td className="px-6 py-4 text-center text-sm font-medium text-[#1C1917]">{category._count?.products || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => openEdit(category)} className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-[#C8956C]"><Pencil size={18} /></button>
                      <button onClick={() => handleDelete(category.id, category._count?.products || 0)} className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-stone-100 hover:text-red-500"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && <tr><td colSpan={5} className="px-6 py-8 text-center text-stone-500">No categories found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-stone-500">{label}</label>
      {children}
    </div>
  );
}
