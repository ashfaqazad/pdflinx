import { NextResponse } from "next/server";
import { writeFile, unlink } from "fs/promises";
import { execFile } from "child_process";
import path from "path";
import { tmpdir } from "os";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Buffer banate hain
    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, "_");

    // Temporary input/output path
    const inputPath = path.join(tmpdir(), safeName);
    const outputDir = tmpdir();

    await writeFile(inputPath, buffer);

    // LibreOffice ko PDF me convert karne ke liye call
    await new Promise((resolve, reject) => {
      execFile(
        "soffice",
        ["--headless", "--convert-to", "pdf", "--outdir", outputDir, inputPath],
        (error) => {
          if (error) reject(error);
          else resolve();
        }
      );
    });

    // Converted file ka path
    const outputPath = path.join(outputDir, safeName.replace(/\.[^.]+$/, ".pdf"));

    // File read karke return
    const convertedBuffer = await Bun.file(outputPath).arrayBuffer();

    // Cleanup
    await unlink(inputPath);
    await unlink(outputPath);

    return new Response(Buffer.from(convertedBuffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${safeName.replace(
          /\.[^.]+$/,
          ".pdf"
        )}"`,
        "Content-Type": "application/pdf",
      },
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Conversion failed", details: err.message },
      { status: 500 }
    );
  }
}
