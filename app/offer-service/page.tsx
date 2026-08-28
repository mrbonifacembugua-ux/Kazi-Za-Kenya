"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

function extensionFor(file: File) {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function validateImage(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) return `${file.name}: use JPG, PNG or WebP.`;
  if (file.size > MAX_BYTES) return `${file.name}: image must be 5 MB or smaller.`;
  return "";
}

export default function OfferServicePage() {
  const router = useRouter();
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [workPhotos, setWorkPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const profilePreview = useMemo(() => (profilePhoto ? URL.createObjectURL(profilePhoto) : ""), [profilePhoto]);
  const workPreviews = useMemo(() => workPhotos.map((file) => URL.createObjectURL(file)), [workPhotos]);

  function parsePrice(value: string) {
    const amounts = value.match(/[\d,]+/g)?.map((part) => Number(part.replace(/,/g, ""))).filter(Number.isFinite) || [];
    return { priceFrom: amounts[0] ?? null, priceTo: amounts[1] ?? null };
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setErrorMessage("");

    const selected = [...(profilePhoto ? [profilePhoto] : []), ...workPhotos];
    for (const file of selected) {
      const validation = validateImage(file);
      if (validation) { setSaving(false); setErrorMessage(validation); return; }
    }

    const form = new FormData(e.currentTarget);
    const name = String(form.get("name") || "").trim();
    const service = String(form.get("service") || "").trim();
    const description = String(form.get("description") || "").trim();
    const area = String(form.get("area") || "").trim();
    const price = String(form.get("price") || "").trim();
    const availability = String(form.get("availability") || "AVAILABLE");

    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData.user;
    if (authError || !user) { setSaving(false); router.push("/login?next=%2Foffer-service"); return; }

    const uploadedPaths: string[] = [];
    try {
      let profilePhotoUrl: string | null = null;
      if (profilePhoto) {
        const path = `${user.id}/profile/${crypto.randomUUID()}.${extensionFor(profilePhoto)}`;
        const { error } = await supabase.storage.from("portfolio").upload(path, profilePhoto, { contentType: profilePhoto.type, upsert: false });
        if (error) throw error;
        uploadedPaths.push(path);
        profilePhotoUrl = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
      }

      const { data: existingProfile } = await supabase.from("profiles").select("role,profile_photo_url").eq("id", user.id).maybeSingle();
      const currentRole = existingProfile?.role || "both";
      const nextRole = currentRole === "customer" ? "both" : currentRole;
      const profilePayload: Record<string, unknown> = { id: user.id, full_name: name, area, bio: description, role: nextRole, is_active: true };
      if (profilePhotoUrl) profilePayload.profile_photo_url = profilePhotoUrl;

      const { error: profileError } = await supabase.from("profiles").upsert(profilePayload, { onConflict: "id" });
      if (profileError) throw profileError;

      const prices = parsePrice(price);
      const { error: serviceError } = await supabase.from("services").insert({ provider_id: user.id, title: service, category: service, description, price_from: prices.priceFrom, price_to: prices.priceTo, availability_status: availability === "BUSY" ? "busy" : "available" });
      if (serviceError) throw serviceError;

      for (let index = 0; index < workPhotos.length; index++) {
        const file = workPhotos[index];
        const path = `${user.id}/work/${crypto.randomUUID()}.${extensionFor(file)}`;
        const { error: uploadError } = await supabase.storage.from("portfolio").upload(path, file, { contentType: file.type, upsert: false });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        const photoUrl = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
        const { error: itemError } = await supabase.from("portfolio_items").insert({ provider_id: user.id, title: `${service} work ${index + 1}`, description: `Proof of work for ${service}`, storage_path: path, photo_url: photoUrl });
        if (itemError) throw itemError;
      }

      setSubmitted(true);
    } catch (err) {
      if (uploadedPaths.length) await supabase.storage.from("portfolio").remove(uploadedPaths);
      setErrorMessage(err instanceof Error ? err.message : "We could not create your worker profile. Please try again.");
    } finally { setSaving(false); }
  }

  function chooseWorkPhotos(files: FileList | null) { setWorkPhotos(Array.from(files || []).slice(0, 21)); }

  if (submitted) return <main className="page"><section className="card success"><div className="mark">✓</div><h1>Your worker profile is ready</h1><p>Your service, profile photo and portfolio are now connected to your Kazi za Kenya account. Customers can see your work and you can respond to jobs using the same signed-in identity.</p><button onClick={() => router.push("/")}>Back to Kazi za Kenya</button></section><style jsx>{styles}</style></main>;

  return <main className="page"><section className="card"><button className="back" type="button" onClick={() => router.push("/")}>← Back</button><div className="brand">🇰🇪 Kazi za <span>Kenya</span></div><h1>Offer your service</h1><p className="intro">Create a clear worker profile so customers can see what you do, view your previous work and contact you directly.</p><form onSubmit={submit}>
    <label>Your name<input required name="name" placeholder="e.g. Peter Kamau" /></label><label>Service or category<input required name="service" placeholder="e.g. Plumbing, painting, cleaning" /></label><label>About your service<textarea required name="description" rows={5} placeholder="Tell customers what you do and the kind of work you handle" /></label>
    <div className="two"><label>Area<input required name="area" placeholder="e.g. Kilimani" /></label><label>Starting price or price range<input required name="price" placeholder="e.g. From KSh 1,500" /></label></div><label>Availability<select required name="availability" defaultValue="AVAILABLE"><option value="AVAILABLE">Available for work</option><option value="BUSY">Currently busy</option></select></label>
    <label>Profile photo <small>(recommended · JPG, PNG or WebP · max 5 MB)</small><input className="file" type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} /></label>{profilePreview && <div className="profilePreview"><img src={profilePreview} alt="Profile preview" /><span>{profilePhoto?.name}</span></div>}
    <label>Proof of work / portfolio photos <small>(optional, up to 21 · max 5 MB each)</small><input className="file" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => chooseWorkPhotos(e.target.files)} /></label>{workPhotos.length > 0 && <><div className="photoNote">📷 {workPhotos.length} portfolio photo{workPhotos.length === 1 ? "" : "s"} selected{workPhotos.length === 21 ? " · Maximum reached" : ""}</div><div className="gallery">{workPreviews.slice(0, 6).map((src, index) => <div className="thumb" key={src}><img src={src} alt={`Work preview ${index + 1}`} /></div>)}</div>{workPhotos.length > 6 && <div className="morePhotos">+ {workPhotos.length - 6} more photos in your portfolio</div>}</>}
    <div className="notice">Kazi za Kenya connects you with customers. You and the customer discuss timing, final price, materials and other arrangements directly.</div>{errorMessage && <div className="error">{errorMessage}</div>}<button className="submit" type="submit" disabled={saving}>{saving ? "Saving profile and photos..." : "Create my worker profile"}</button>
  </form></section><style jsx>{styles}</style></main>;
}

const styles = `
*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:30px 16px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#17221b}.card{max-width:720px;margin:auto;background:#fff;border:1px solid #dce4dc;border-radius:20px;padding:28px;box-shadow:0 12px 40px rgba(27,43,31,.10)}.brand{font-size:20px;font-weight:850;margin:8px 0 26px}.brand span{color:#15803d}h1{font-size:30px;margin:0 0 8px}.intro{color:#66736b;line-height:1.55;margin:0 0 24px}.back{border:0;background:transparent;color:#15803d;font-weight:750;padding:0;cursor:pointer}form{display:grid;gap:17px}label{display:grid;gap:7px;font-size:13px;font-weight:800}small{font-weight:500;color:#78847c}input,textarea,select{width:100%;border:1px solid #d5ddd6;border-radius:11px;padding:12px 13px;outline:0;background:#fff;font:inherit;font-weight:500;color:#17221b}input:focus,textarea:focus,select:focus{border-color:#16803d;box-shadow:0 0 0 3px rgba(22,128,61,.09)}textarea{resize:vertical}.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.file{padding:10px}.photoNote{font-size:12px;color:#52705b}.profilePreview{display:flex;align-items:center;gap:11px;font-size:12px;color:#617067}.profilePreview img{width:58px;height:58px;object-fit:cover;border-radius:50%;border:1px solid #d8e1d9}.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.thumb{aspect-ratio:1.35/1;border-radius:10px;overflow:hidden;background:#edf2ed;border:1px solid #dde5de}.thumb img{width:100%;height:100%;object-fit:cover}.morePhotos{font-size:12px;color:#15803d;font-weight:750}.notice{background:#eef8f1;border:1px solid #cfe8d6;border-radius:11px;padding:12px 14px;color:#386347;font-size:12px;line-height:1.5}.error{background:#fff1f1;border:1px solid #f0caca;color:#9f2020;border-radius:11px;padding:12px 14px;font-size:12px}.submit,.success button{border:0;border-radius:11px;background:#16803d;color:#fff;padding:13px 18px;font-weight:800;cursor:pointer}.submit:hover,.success button:hover{background:#126b33}.submit:disabled{opacity:.65;cursor:wait}.success{text-align:center;margin-top:10vh}.mark{width:58px;height:58px;border-radius:50%;background:#e7f7ec;color:#16803d;display:grid;place-items:center;margin:0 auto 18px;font-size:30px;font-weight:900}.success p{color:#66736b;line-height:1.6;max-width:520px;margin:0 auto 22px}@media(max-width:600px){.card{padding:21px}.two{grid-template-columns:1fr}h1{font-size:25px}.gallery{grid-template-columns:repeat(2,1fr)}}
`;
