import * as fs from "fs";
import * as path from "path";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const root = path.resolve(process.cwd(), "..", "..");
  const manifestPath = path.join(root, "registry.json");
  if (!fs.existsSync(manifestPath)) {
    return Response.json({ error: "registry.json not found" }, { status: 404 });
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf-8"));
  return Response.json(manifest);
}
