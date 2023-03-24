import { FormEvent } from "react";

function toBase64(blob: Blob) {
  const reader = new FileReader();
  return new Promise((res) => {
    reader.readAsDataURL(blob);
    reader.onload = function () {
      res(reader.result);
    };
  });
}

function POUpload({ blob }: { blob: Blob | null }) {
  if (!blob) {
    return <>An error occurred.</>;
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    toBase64(blob).then((newBlob: any) => {
      return fetch("/api/po/upload", {
        method: "POST",
        headers: { "Content-Type": "application/pdf" },
        body: newBlob,
      }).then(async (res) => {
        if (res.status != 200) {
          console.log("Upload Failure");
        } else {
          console.log("Upload Success");
        }
        const { message } = await res.json();
        console.log("Got message!");
        console.log(message);
        // const newRes = await fetch("/api/mail/send-po", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ url: message }),
        // });

        // if (newRes.status != 200) {
        //     console.log("Send Email Failure");
        // } else {
        //     console.log("Send Email Success");
        // }
      });
    });
  };

  return (
    <form id="upload-form" onSubmit={handleSubmit}>
      <button id="submit" className={`btn btn-accent btn-outline w-28 mt-4 `}>
        Upload
      </button>
    </form>
  );
}

export default POUpload;
