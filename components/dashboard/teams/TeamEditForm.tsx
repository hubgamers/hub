"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { updateTeam, type TeamFormState } from "@/lib/actions/team/team.actions";
import { Link as LinkIcon, Shield, ImageIcon, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Props = {
    teamId: string;
    initialName: string;
    initialSlug: string;
    initialLogoUrl: string | null;
    organizationId: string;
    organizationName: string;
    orgSlug: string;
};

const initialState: TeamFormState = {
    success: false,
    message: "",
    errors: {},
};

const slugify = (value: string) =>
    value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

const FieldError = ({ error }: { error?: string[] }) => {
    if (!error || error.length === 0) return null;
    return <p className="mt-1 text-xs text-red-400">{error[0]}</p>;
};

export default function TeamEditForm({
    teamId,
    initialName,
    initialSlug,
    initialLogoUrl,
    organizationId,
    organizationName,
    orgSlug,
}: Props) {
    const [state, formAction, isPending] = useActionState(updateTeam, initialState);
    const [name, setName] = useState(initialName);
    const [slug, setSlug] = useState(initialSlug);
    const [slugEdited, setSlugEdited] = useState(false);
    const [logoUrl, setLogoUrl] = useState(initialLogoUrl ?? "");
    const [logoPreview, setLogoPreview] = useState(initialLogoUrl ?? "");
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setName(value);
        if (!slugEdited) setSlug(slugify(value));
    };

    const onSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSlug(e.target.value);
        setSlugEdited(true);
    };

    const onLogoChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "image/gif"];
        if (!allowedTypes.includes(file.type)) {
            setUploadError("Format non supporte. Utilisez PNG, JPEG, WEBP, SVG ou GIF.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            setUploadError("Le fichier doit faire moins de 2 Mo.");
            return;
        }

        setUploadError("");
        setUploading(true);
        setLogoPreview(URL.createObjectURL(file));

        const supabase = createClient();
        const ext = file.name.split(".").pop();
        const path = "teams/" + organizationId + "/" + Date.now() + "." + ext;
        const { error } = await supabase.storage.from("logos").upload(path, file, { upsert: true });

        if (error) {
            if (error.message.toLowerCase().includes("row-level security")) {
                setUploadError("Upload bloque par la policy Supabase Storage (RLS). Voir la configuration SQL du bucket logos.");
            } else {
                setUploadError("Erreur lors de l upload : " + error.message);
            }
            setUploading(false);
            return;
        }

        const { data } = supabase.storage.from("logos").getPublicUrl(path);
        setLogoUrl(data.publicUrl);
        setUploading(false);
    };

    return (
        <div className="space-y-6 text-slate-900">
            <div>
                <p className="text-xs uppercase tracking-widest text-slate-500">{organizationName}</p>
                <h1 className="text-2xl md:text-3xl font-black">Modifier une equipe</h1>
                <p className="mt-2 text-sm text-slate-500">Mets a jour les informations de ton equipe.</p>
            </div>

            <form action={formAction} className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 md:p-7">
                <input type="hidden" name="teamId" value={teamId} />
                <input type="hidden" name="organizationId" value={organizationId} />
                <input type="hidden" name="orgSlug" value={orgSlug} />
                <input type="hidden" name="logoUrl" value={logoUrl} />

                <div className="grid gap-4 md:grid-cols-2">
                    <div>
                        <label className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                            <Shield size={14} /> Nom de l&apos;equipe
                        </label>
                        <input
                            name="name"
                            value={name}
                            onChange={onNameChange}
                            required
                            placeholder="Thunder Wolves"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-teal-600 focus:outline-none"
                        />
                        <FieldError error={state.errors?.name} />
                    </div>

                    <div>
                        <label className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                            <LinkIcon size={14} /> Slug
                        </label>
                        <input
                            name="slug"
                            value={slug}
                            onChange={onSlugChange}
                            required
                            placeholder="thunder-wolves"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:border-teal-600 focus:outline-none"
                        />
                        <p className="mt-1 text-xs text-slate-500">URL: /dashboard/org/{orgSlug}/teams/{slug || "..."}</p>
                        <FieldError error={state.errors?.slug} />
                    </div>
                </div>

                <div>
                    <label className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
                        <ImageIcon size={14} /> Logo (optionnel)
                    </label>
                    <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 transition hover:border-teal-500 hover:bg-teal-50/30">
                        {logoPreview ? (
                            <Image src={logoPreview} alt="Preview logo" width={80} height={80} className="h-20 w-20 rounded-lg object-contain" unoptimized />
                        ) : (
                            <ImageIcon size={32} className="text-slate-300" />
                        )}
                        <span>{uploading ? "Upload en cours..." : logoPreview ? "Changer le logo" : "Cliquer pour importer"}</span>
                        <span className="text-xs text-slate-400">PNG, JPEG, WEBP, SVG -- max 2 Mo</span>
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif" onChange={onLogoChange} disabled={uploading || isPending} className="hidden" />
                    </label>
                    {uploadError && <p className="mt-1 text-xs text-red-400">{uploadError}</p>}
                    <FieldError error={state.errors?.logoUrl} />
                </div>

                {state.message && (
                    <div
                        className={"rounded-xl border px-4 py-3 text-sm " + (state.success
                            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                            : "border-red-500/30 bg-red-500/10 text-red-300")}
                    >
                        {state.message}
                    </div>
                )}

                <div className="flex flex-col gap-3 md:flex-row md:items-center">
                    <button
                        type="submit"
                        disabled={isPending || uploading}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold hover:bg-teal-600 transition disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <Save size={15} /> {isPending ? "Mise a jour..." : "Enregistrer"}
                    </button>

                    <a
                        href={"/dashboard/org/" + orgSlug + "/teams"}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold hover:bg-white"
                    >
                        Retour aux equipes
                    </a>
                </div>
            </form>
        </div>
    );
}
