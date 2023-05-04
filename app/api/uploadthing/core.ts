/** app/api/uploadthing/core.ts */
import { createFilething, type FileRouter } from "uploadthing/server";
const f = createFilething();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f
    // Set permissions and file types for this FileRoute
    .fileTypes(["image", "video"])
    .maxSize("1GB")
    .onUploadComplete(async () => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete");
    }),
} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;