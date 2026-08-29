"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Upload, X, Loader2, ImagePlus, Save } from "lucide-react";

interface Category { id: string; name: string; }
interface Brand { id: string; name: string; }

export interface ProductFormData {
  id?: string;
  name: string;
  description: string;
  shortDescription: string;
  price: string;
  comparePrice: string;
  stock: string;
  categoryId: string;
  brandId: string;
  isFeatured: boolean;
  isDeal: boolean;
  isNew: boolean;
  images: string[];
}

interface ProductFormProps {
  initial?: Partial<ProductFormData>;
  categories: Category[];
  brands: Brand[];
  mode: "create" | "edit";
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-gray-50 border border-gray-100">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`admin-toggle ${checked ? "on" : ""}`}
      >
        <div className="admin-toggle-knob" />
      </button>
    </div>
  );
}

export function ProductForm({ initial, categories, brands, mode }: ProductFormProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [imageUrl, setImageUrl] = useState("");

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (!url) return;
    try {
      new URL(url);
    } catch {
      setError("Enter a valid image URL (https://...)");
      return;
    }
    setForm((prev) => ({ ...prev, images: [...prev.images, url] }));
    setImageUrl("");
    setError("");
  };

  const [form, setForm] = useState<ProductFormData>({
    name: initial?.name || "",
    description: initial?.description || "",
    shortDescription: initial?.shortDescription || "",
    price: initial?.price || "",
    comparePrice: initial?.comparePrice || "",
    stock: initial?.stock || "100",
    categoryId: initial?.categoryId || categories[0]?.id || "",
    brandId: initial?.brandId || "",
    isFeatured: initial?.isFeatured ?? false,
    isDeal: initial?.isDeal ?? false,
    isNew: initial?.isNew ?? true,
    images: initial?.images || [],
  });

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setForm((prev) => ({ ...prev, images: [...prev.images, data.url] }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setForm((prev) => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.images.length === 0) {
      setError("Please add at least one product image (upload or URL)");
      return;
    }

    setLoading(true);
    setError("");

    const payload = {
      name: form.name,
      description: form.description,
      shortDescription: form.shortDescription,
      price: parseFloat(form.price),
      comparePrice: form.comparePrice ? parseFloat(form.comparePrice) : null,
      stock: parseInt(form.stock),
      categoryId: form.categoryId,
      brandId: form.brandId || null,
      isFeatured: form.isFeatured,
      isDeal: form.isDeal,
      isNew: form.isNew,
      images: form.images,
    };

    try {
      const url = mode === "create" ? "/api/admin/products" : `/api/admin/products/${initial?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100">{error}</div>
      )}

      {/* Images */}
      <div className="admin-form-section">
        <h3 className="font-bold text-gray-900 mb-1 pl-2">Product Images</h3>
        <p className="text-xs text-gray-400 mb-4 pl-2">Upload a file (local) or paste an image URL (Vercel/production).</p>
        <div className="flex flex-wrap gap-3 mb-2 pl-2">
          {form.images.map((url, i) => (
            <div key={url} className="relative w-24 h-24 rounded-xl overflow-hidden ring-2 ring-gray-100 group">
              <Image src={url} alt="" fill className="object-cover" sizes="96px" unoptimized={url.startsWith("/uploads")} />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
              >
                <X className="h-3 w-3" />
              </button>
              {i === 0 && (
                <span className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] text-center py-1.5 font-medium">Main</span>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:border-[#ff4747] hover:text-[#ff4747] transition-all bg-gray-50"
          >
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
            <span className="text-[10px] font-medium">{uploading ? "Uploading..." : "Add Photo"}</span>
          </button>
        </div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(e) => handleUpload(e.target.files)} />
        <div className="flex gap-2 pl-2 mt-3">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://picsum.photos/seed/product/600/600"
            className="admin-input flex-1"
          />
          <button type="button" onClick={addImageUrl} className="admin-btn-ghost whitespace-nowrap px-4">
            Add URL
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="admin-form-section space-y-4">
        <h3 className="font-bold text-gray-900 pl-2">Basic Information</h3>
        <div className="pl-2">
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Product Name *</label>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="admin-input" placeholder="Wireless Bluetooth Earbuds" />
        </div>
        <div className="pl-2">
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Description *</label>
          <textarea required rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input resize-none" placeholder="Full product description..." />
        </div>
        <div className="pl-2">
          <label className="text-sm font-medium text-gray-600 block mb-1.5">Short Description</label>
          <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="admin-input" placeholder="Brief summary for product cards" />
        </div>
      </div>

      {/* Pricing */}
      <div className="admin-form-section space-y-4">
        <h3 className="font-bold text-gray-900 pl-2">Pricing & Inventory</h3>
        <div className="grid sm:grid-cols-3 gap-4 pl-2">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Price (৳) *</label>
            <input required type="number" min="1" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="admin-input" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Compare Price (৳)</label>
            <input type="number" min="1" step="1" value={form.comparePrice} onChange={(e) => setForm({ ...form, comparePrice: e.target.value })} className="admin-input" placeholder="Original" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Stock *</label>
            <input required type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="admin-input" />
          </div>
        </div>
      </div>

      {/* Category */}
      <div className="admin-form-section space-y-4">
        <h3 className="font-bold text-gray-900 pl-2">Category & Brand</h3>
        <div className="grid sm:grid-cols-2 gap-4 pl-2">
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Category *</label>
            <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="admin-input">
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Brand</label>
            <select value={form.brandId} onChange={(e) => setForm({ ...form, brandId: e.target.value })} className="admin-input">
              <option value="">No brand</option>
              {brands.map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Flags */}
      <div className="admin-form-section">
        <h3 className="font-bold text-gray-900 mb-4 pl-2">Product Tags</h3>
        <div className="grid sm:grid-cols-3 gap-3 pl-2">
          <Toggle checked={form.isFeatured} onChange={(v) => setForm({ ...form, isFeatured: v })} label="Featured" />
          <Toggle checked={form.isDeal} onChange={(v) => setForm({ ...form, isDeal: v })} label="SuperDeal" />
          <Toggle checked={form.isNew} onChange={(v) => setForm({ ...form, isNew: v })} label="New Arrival" />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={loading || uploading} className="admin-btn-primary disabled:opacity-50">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "create" ? <Upload className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {mode === "create" ? "Publish Product" : "Save Changes"}
        </button>
        <Link href="/admin/products" className="admin-btn-ghost">Cancel</Link>
      </div>
    </form>
  );
}
