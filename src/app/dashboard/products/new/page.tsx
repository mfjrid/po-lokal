"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, ArrowLeft, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { uploadImage } from "@/app/actions/upload-image";

export default function NewProductPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        setError("");

        try {
            const formData = new FormData();
            formData.append("file", file);
            const url = await uploadImage(formData) as string;
            setImageUrl(url);
        } catch (err: any) {
            setError("Gagal mengupload gambar: " + err.message);
        } finally {
            setIsUploading(false);
        }
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (!imageUrl) {
            setError("Mohon upload gambar produk terlebih dahulu");
            setIsLoading(false);
            return;
        }

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get("name"),
            description: formData.get("description"),
            price: parseInt(formData.get("price") as string),
            quota: parseInt(formData.get("quota") as string),
            expiredAt: new Date(formData.get("expiredAt") as string).toISOString(),
            imageUrl: imageUrl,
        };

        try {
            const response = await fetch("/api/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Gagal membuat produk");
            }

            router.push("/dashboard/products");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <Link href="/dashboard/products" className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali ke Daftar Produk
                </Link>
                <h1 className="text-3xl font-black text-slate-900">Buat Produk Pre-Order Baru</h1>
                <p className="text-slate-500">Isi detail produk yang ingin Anda tawarkan ke pasar.</p>
            </div>

            <Card className="border-none shadow-sm rounded-2xl overflow-hidden">
                <form onSubmit={onSubmit}>
                    <CardContent className="p-8 space-y-8">
                        {error && (
                            <div className="p-4 text-sm text-red-500 bg-red-50 rounded-xl border border-red-100 italic">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Nama Produk</label>
                                    <Input name="name" placeholder="Contoh: Keripik Tempe Premium" required />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Harga Satuan (Rp)</label>
                                    <Input name="price" type="number" placeholder="25000" required />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Total Kuota</label>
                                        <Input name="quota" type="number" placeholder="50" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-slate-700">Batas Waktu</label>
                                        <Input name="expiredAt" type="date" required />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Gambar Produk</label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-200 border-dashed rounded-xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-colors overflow-hidden relative">
                                            {imageUrl ? (
                                                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {isUploading ? (
                                                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                    ) : (
                                                        <>
                                                            <Upload className="w-8 h-8 text-slate-400 mb-2" />
                                                            <p className="text-xs text-slate-500">Klik untuk upload gambar</p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                                        </label>
                                    </div>
                                    {imageUrl && (
                                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-tighter">
                                            ✓ Gambar berhasil diupload ke Cloudinary
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-700">Deskripsi Lengkap</label>
                                    <Textarea
                                        name="description"
                                        placeholder="Jelaskan keunikan produk Anda..."
                                        rows={6}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100 flex justify-end space-x-4">
                            <Link href="/dashboard/products">
                                <Button variant="ghost" type="button">Batal</Button>
                            </Link>
                            <Button type="submit" className="px-8 font-bold" disabled={isLoading || isUploading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Publish Produk
                            </Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
