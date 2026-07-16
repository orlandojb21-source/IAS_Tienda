import Image from "next/image";

export function NegocioLogo({
  nombre,
  logoUrl,
  size = 28,
}: {
  nombre: string;
  logoUrl: string | null;
  size?: number;
}) {
  if (logoUrl) {
    return (
      <Image
        src={logoUrl}
        alt=""
        width={size}
        height={size}
        className="rounded-lg object-cover"
        style={{ width: size, height: size }}
        unoptimized
      />
    );
  }

  return (
    <div
      style={{ width: size, height: size }}
      className="flex items-center justify-center rounded-lg bg-gradient-to-r from-sky-500 to-emerald-500 font-semibold text-white"
    >
      {nombre.charAt(0).toUpperCase()}
    </div>
  );
}
