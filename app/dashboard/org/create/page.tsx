"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createOrgSchema } from "@/lib/schemas/org";
import { createOrganization } from "@/app/actions/org-actions";

export default function CreateOrganizationPage() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Helper pour transformer le nom en slug en temps réel
    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");
    };

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError(null);

        const rawData = {
            name: formData.get("name"),
            slug: formData.get("slug"),
            type: formData.get("type"),
            logoUrl: formData.get("logoUrl"),
        };

        // Validation client
        const validated = createOrgSchema.safeParse(rawData);
        if (!validated.success) {
            setError(validated.error.errors[0].message);
            setLoading(false);
            return;
        }

        const result = await createOrganization(validated.data);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push(`/org/${result.slug}`);
        }
    }

    return (
        <div className="max-w-2xl mx-auto py-10 px-4">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Créer votre Organisation</h1>
                <p className="text-slate-500">Gérez vos équipes et vos tournois depuis un espace dédié.</p>
            </header>

            <form action={handleSubmit} className="space-y-6 bg-white p-8 border rounded-xl shadow-sm">
                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
                        {error}
                    </div>
                )}

                <div className="grid gap-2">
                    <label htmlFor="name" className="font-medium">Nom de l'organisation</label>
                    <input
                        name="name"
                        placeholder="Ex: Ligue Pro de Tennis"
                        className="border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        onChange={(e) => {
                            const slugInput = document.getElementById("slug") as HTMLInputElement;
                            if (slugInput) slugInput.value = slugify(e.target.value);
                        }}
                        required
                    />
                </div>

                <div className="grid gap-2">
                    <label htmlFor="slug" className="font-medium">URL personnalisée (Slug)</label>
                    <div className="flex items-center gap-1 text-slate-500 border rounded-lg px-3 bg-slate-50 focus-within:bg-white transition">
                        <span>tournois.io/org/</span>
                        <input
                            id="slug"
                            name="slug"
                            className="bg-transparent py-2 outline-none text-black w-full"
                            required
                        />
                    </div>
                </div>

                <div className="grid gap-2">
                    <label htmlFor="type" className="font-medium">Spécialité</label>
                    <select name="type" className="border rounded-lg p-2 bg-white outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="MIXED">Mixte</option>
                        <option value="SPORT">Sport Physique</option>
                        <option value="ESPORT">Esport</option>
                    </select>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
                >
                    {loading ? "Création en cours..." : "Lancer l'organisation"}
                </button>
            </form>
        </div>
    );
}