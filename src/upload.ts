import {CpAsset} from "./standard";

export async function uploadFile(
  file: File,
): Promise<{ uploaded: string[]; failed: string[]; assets: CpAsset[] }> {
  const binary = Buffer.from(await file.arrayBuffer());
  const boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW";
  const multipartBody = [
    `--${boundary}`,
    `Content-Disposition: form-data; name="files[]"; filename="${file.name}"`,
    `Content-Type: ${file.type || "application/octet-stream"}`,
    "",
  ];
  const bodyBuffer = Buffer.concat([
    Buffer.from(multipartBody.join("\r\n") + "\r\n"), // Header part
    binary,
    Buffer.from(`\r\n--${boundary}--\r\n`), // Closing boundary
  ]);

  const response = await fetch(
    `${process.env.COCKPIT_HOST}/api/cockpit/addAssets?token=${process.env.COCKPIT_TOKEN}`,
    {
      method: "POST",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${boundary}`,
        "Content-Length": `${bodyBuffer.length}`,
      },
      body: bodyBuffer,
    },
  );

  // Parse the JSON response
  return await response.json();
}
