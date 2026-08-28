"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);
type Geo = { latitude: number; longitude: number; accuracy: number };

function ext(file: File) {
  return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}
function validateFile(file: File) {
  if (!ALLOWED_TYPES.has(file.type)) return `${file.name}: use JPG, PNG or WebP.`;
  if (file.size > MAX_BYTES) return `${file.name}: image must be 5 MB or smaller.`;
  return "";
}
function parsePrice(value: string) {
  const amounts = value.match(/[\d,]+/g)?.map(v => Number(v.replace(/,/g, ""))).filter(Number.isFinite) || [];
  return { priceFrom: amounts[0] ?? null, priceTo: amounts[1] ?? null };
}

export default function OfferServicePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("AVAILABLE");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [workPhotos, setWorkPhotos] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [geo, setGeo] = useState<Geo | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  const profilePreview = useMemo(() => profilePhoto ? URL.createObjectURL(profilePhoto) : "", [profilePhoto]);
  const workPreviews = useMemo(() => workPhotos.map(file => URL.createObjectURL(file)), [workPhotos]);

  function locate() {
    setLocError("");
    if (!navigator.geolocation) {
      setLocError("This device does not support location sharing.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      position => {
        setGeo({ latitude: position.coords.latitude, longitude: position.coords.longitude, accuracy: position.coords.accuracy });
        setLocating(false);
      },
      locationError => {
        setLocError(locationError.code === 1
          ? "Location permission was not granted. Your typed area will still be saved."
          : "We could not get your current location. Your typed area will still be saved.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (saving) return;

    const cleanName = name.trim();
    const cleanService = service.trim();
    const cleanDescription = description.trim();
    const cleanArea = area.trim();
    const cleanPrice = price.trim();
    if (!cleanName || !cleanService || !cleanDescription || !cleanArea || !cleanPrice) {
      setError("Please complete all required fields.");
      return;
    }

    for (const file of [...(profilePhoto ? [profilePhoto] : []), ...workPhotos]) {
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setSaving(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.getUser();
    const user = authData.user;
    if (authError || !user) {
      setSaving(false);
      router.push("/login?next=%2Foffer-service");
      return;
    }

    const uploadedPaths: string[] = [];
    try {
      let photoUrl: string | null = null;
      if (profilePhoto) {
        const path = `${user.id}/profile/${crypto.randomUUID()}.${ext(profilePhoto)}`;
        const { error: uploadError } = await supabase.storage.from("portfolio").upload(path, profilePhoto, {
          contentType: profilePhoto.type,
          upsert: false,
        });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        photoUrl = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
      }

      const { data: existing, error: existingError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle();
      if (existingError) throw existingError;

      const profileUpdates: Record<string, unknown> = {
        full_name: cleanName,
        area: cleanArea,
        bio: cleanDescription,
        role: existing?.role === "customer" ? "both" : existing?.role || "both",
      };
      if (photoUrl) profileUpdates.profile_photo_url = photoUrl;
      if (geo) {
        profileUpdates.latitude = geo.latitude;
        profileUpdates.longitude = geo.longitude;
        profileUpdates.location_accuracy_m = geo.accuracy;
        profileUpdates.location_updated_at = new Date().toISOString();
      }

      const { error: profileError } = await supabase
        .from("profiles")
        .update(profileUpdates)
        .eq("id", user.id);
      if (profileError) throw profileError;

      const prices = parsePrice(cleanPrice);
      const { error: serviceError } = await supabase.from("services").insert({
        provider_id: user.id,
        title: cleanService,
        category: cleanService,
        description: cleanDescription,
        price_from: prices.priceFrom,
        price_to: prices.priceTo,
        availability_status: availability === "BUSY" ? "busy" : "available",
      });
      if (serviceError) throw serviceError;

      for (let i = 0; i < workPhotos.length; i++) {
        const file = workPhotos[i];
        const path = `${user.id}/work/${crypto.randomUUID()}.${ext(file)}`;
        const { error: uploadError } = await supabase.storage.from("portfolio").upload(path, file, {
          contentType: file.type,
          upsert: false,
        });
        if (uploadError) throw uploadError;
        uploadedPaths.push(path);
        const url = supabase.storage.from("portfolio").getPublicUrl(path).data.publicUrl;
        const { error: itemError } = await supabase.from("portfolio_items").insert({
          provider_id: user.id,
          title: `${cleanService} work ${i + 1}`,
          description: `Proof of work for ${cleanService}`,
          storage_path: path,
          photo_url: url,
        });
        if (itemError) throw itemError;
      }

      setSubmitted(true);
    } catch (caught) {
      if (uploadedPaths.length) await supabase.storage.from("portfolio").remove(uploadedPaths);
      setError(caught instanceof Error ? caught.message : "We could not create your worker profile. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return <main className="page"><section className="card success"><div className="mark">✓</div><h1>Your worker profile is ready</h1><p>Your service and portfolio are connected to your account{geo ? ", and your private device position is available for nearby-job matching" : ""}.</p><button onClick={() => router.push("/")}>Back to Kazi za Kenya</button></section><style jsx>{styles}</style></main>;
  }

  return <main className="page"><section className="card">
    <button className="back" type="button" onClick={() => router.push("/")}>← Back</button>
    <div className="brand">🇰🇪 Kazi za <span>Kenya</span></div>
    <h1>Offer your service</h1>
    <p className="intro">Create a clear worker profile. You may also share your device position for accurate nearby-job matching.</p>
    <form onSubmit={submit}>
      <label>Your name<input required value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Peter Kamau" /></label>
      <label>Service or category<input required value={service} onChange={e => setService(e.target.value)} placeholder="e.g. Plumbing, painting, cleaning" /></label>
      <label>About your service<textarea required value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Tell customers what you do" /></label>
      <div className="locationBox"><b>📍 Worker location</b><p>Optional. Share your current device position to calculate nearby jobs accurately. The precise coordinates are stored for matching and are not printed on your public profile.</p><button className="locate" type="button" disabled={locating} onClick={locate}>{locating ? "Finding location…" : geo ? "✓ Location captured — update it" : "Use my current location"}</button>{geo && <small className="ok">Position captured · accuracy about {Math.round(geo.accuracy)} m</small>}{locError && <small className="locError">{locError}</small>}</div>
      <div className="two"><label>Area<input required value={area} onChange={e => setArea(e.target.value)} placeholder="e.g. Kilimani" /></label><label>Starting price or price range<input required value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. From KSh 1,500" /></label></div>
      <label>Availability<select required value={availability} onChange={e => setAvailability(e.target.value)}><option value="AVAILABLE">Available for work</option><option value="BUSY">Currently busy</option></select></label>
      <label>Profile photo <small>(JPG, PNG or WebP · max 5 MB)</small><input className="file" type="file" accept="image/jpeg,image/png,image/webp" onChange={e => setProfilePhoto(e.target.files?.[0] || null)} /></label>
      {profilePreview && <div className="profilePreview"><img src={profilePreview} alt="Profile preview" /><span>{profilePhoto?.name}</span></div>}
      <label>Proof of work / portfolio photos <small>(optional, up to 21 · max 5 MB each)</small><input className="file" type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => setWorkPhotos(Array.from(e.target.files || []).slice(0, 21))} /></label>
      {workPhotos.length > 0 && <><div className="photoNote">📷 {workPhotos.length} portfolio photo{workPhotos.length === 1 ? "" : "s"} selected</div><div className="gallery">{workPreviews.slice(0, 6).map((src, i) => <div className="thumb" key={src}><img src={src} alt={`Work preview ${i + 1}`} /></div>)}</div></>}
      <div className="notice">Location sharing is optional. Your typed area remains available if you decline.</div>
      {error && <div className="error" role="alert">{error}</div>}
      <button className="submit" type="submit" disabled={saving}>{saving ? "Saving profile and photos..." : "Create my worker profile"}</button>
    </form>
  </section><style jsx>{styles}</style></main>;
}

const styles = `*{box-sizing:border-box}.page{min-height:100vh;background:#f3f6f3;padding:30px 16px;font-family:Inter,system-ui,-apple-system,"Segoe UI",sans-serif;color:#17221b}.card{max-width:720px;margin:auto;background:#fff;border:1px solid #dce4dc;border-radius:20px;padding:28px;box-shadow:0 12px 40px rgba(27,43,31,.1)}.brand{font-size:20px;font-weight:850;margin:8px 0 26px}.brand span{color:#15803d}h1{font-size:30px;margin:0 0 8px}.intro{color:#66736b;line-height:1.55;margin:0 0 24px}.back{border:0;background:transparent;color:#15803d;font-weight:750;padding:0;cursor:pointer}form{display:grid;gap:17px}label{display:grid;gap:7px;font-size:13px;font-weight:800}small{font-weight:500;color:#78847c}input,textarea,select{width:100%;border:1px solid #d5ddd6;border-radius:11px;padding:12px 13px;outline:0;background:#fff;font:inherit;color:#17221b}.two{display:grid;grid-template-columns:1fr 1fr;gap:14px}.locationBox{border:1px solid #cfe1d3;background:#f5fbf6;border-radius:13px;padding:14px}.locationBox p{font-size:12px;color:#607066;line-height:1.5;margin:5px 0 10px}.locate{border:1px solid #99c7a6;background:#fff;color:#156f37;border-radius:10px;padding:10px 12px;font-weight:800;cursor:pointer}.ok,.locError{display:block;margin-top:9px}.ok{color:#257342}.locError{color:#9f2020}.file{padding:10px}.profilePreview{display:flex;align-items:center;gap:11px;font-size:12px}.profilePreview img{width:58px;height:58px;object-fit:cover;border-radius:50%}.gallery{display:grid;grid-template-columns:repeat(3,1fr);gap:9px}.thumb{aspect-ratio:1.35/1;border-radius:10px;overflow:hidden}.thumb img{width:100%;height:100%;object-fit:cover}.photoNote{font-size:12px;color:#52705b}.notice{background:#eef8f1;border:1px solid #cfe8d6;border-radius:11px;padding:12px 14px;color:#386347;font-size:12px}.error{background:#fff1f1;border:1px solid #f0caca;color:#9f2020;border-radius:11px;padding:12px}.submit,.success button{border:0;border-radius:11px;background:#16803d;color:#fff;padding:13px 18px;font-weight:800;cursor:pointer}.submit:disabled{opacity:.65}.success{text-align:center;margin-top:10vh}.mark{width:58px;height:58px;border-radius:50%;background:#e7f7ec;color:#16803d;display:grid;place-items:center;margin:0 auto 18px;font-size:30px;font-weight:900}.success p{color:#66736b;line-height:1.6}@media(max-width:600px){.card{padding:21px}.two{grid-template-columns:1fr}.gallery{grid-template-columns:repeat(2,1fr)}}`;