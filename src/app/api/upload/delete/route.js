import { NextResponse } from "next/server";

/**
 * Cloudinary Image Deletion API Route
 * Handles deletion of images from Cloudinary cloud storage
 */
export async function DELETE(request) {
  try {
    const { publicId } = await request.json();

    if (!publicId) {
      return NextResponse.json(
        { error: "No public ID provided" },
        { status: 400 }
      );
    }

    // Verify environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Cloudinary credentials not configured" },
        { status: 500 }
      );
    }

    // Generate timestamp and signature for Cloudinary
    const timestamp = Math.round(new Date().getTime() / 1000);
    const crypto = require("crypto");

    // Create signature for deletion
    const signatureString = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto
      .createHash("sha1")
      .update(signatureString)
      .digest("hex");

    // Delete from Cloudinary
    const deleteFormData = new FormData();
    deleteFormData.append("public_id", publicId);
    deleteFormData.append("timestamp", timestamp.toString());
    deleteFormData.append("api_key", apiKey);
    deleteFormData.append("signature", signature);

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

    const deleteResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: deleteFormData,
    });

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json();
      console.error("Cloudinary delete error:", errorData);
      return NextResponse.json(
        { error: "Failed to delete from Cloudinary", details: errorData },
        { status: deleteResponse.status }
      );
    }

    const deleteData = await deleteResponse.json();

    return NextResponse.json({
      success: true,
      result: deleteData.result, // 'ok' if deleted, 'not found' if doesn't exist
      message: deleteData.result === "ok" ? "Image deleted successfully" : "Image not found",
    });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Delete failed", message: error.message },
      { status: 500 }
    );
  }
}
