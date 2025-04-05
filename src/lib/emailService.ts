import { toast } from "sonner";
import { createEmailTemplate } from "./createEmailTemplate";

// Declare EmailJS types
declare global {
  interface Window {
    emailjs: {
      init: (publicKey: string) => void;
      send: (
        serviceId: string,
        templateId: string,
        templateParams: any
      ) => Promise<any>;
    };
  }
}

interface DeliveryFormData {
  body: any;
  from_email: string;
  from_name: string;
  to_email: string;
}

/**
 * Load EmailJS script dynamically
 */
const loadEmailJSScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.emailjs) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load EmailJS script"));
    document.body.appendChild(script);
  });
};

export async function sendDeliveryRequest(
  formData: DeliveryFormData,
  onSuccess: () => void
): Promise<boolean> {
  try {
    // Load EmailJS script if not already loaded
    await loadEmailJSScript();

    // Initialize EmailJS
    window.emailjs.init("Pkg3Whydu7HTFp47R");

    // Generate HTML email content
    const htmlContent = createEmailTemplate(formData.body);

    // Send email using EmailJS
    const response = await window.emailjs.send(
      "service_e4w9w3h",
      "template_tunqxci",
      {
        to_email: formData.to_email,
        from_name: formData.from_email,
        from_email: formData.to_email,
        subject: `New Delivery Request - ${formData.from_email}`,
        html_content: htmlContent,
      }
    );
    console.log("🚀 ~ response:", response);

    if (response.status === 200) {
      toast.success("Delivery request submitted successfully");
      onSuccess();
      return true;
    }

    throw new Error("Failed to send email");
  } catch (error) {
    console.error("Error sending delivery request:", error);
    if ((error as any).status === 413) {
      toast.error("The image is to large reduce the file");
    } else {
      toast.error("Failed to submit delivery request. Please try again.");
    }
    return false;
  }
}

const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
