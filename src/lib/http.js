export async function readJsonBody(request, maxBytes = 16_384) {
  const reader = request.body?.getReader();
  if (!reader) {
    return { error: "Invalid request body.", status: 400 };
  }

  const chunks = [];
  let byteLength = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    byteLength += value.byteLength;
    if (byteLength > maxBytes) {
      await reader.cancel();
      return { error: "Request is too large.", status: 413 };
    }

    chunks.push(Buffer.from(value));
  }

  try {
    return { body: JSON.parse(Buffer.concat(chunks).toString("utf8")) };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { error: "Invalid request body.", status: 400 };
    }
    throw error;
  }
}
