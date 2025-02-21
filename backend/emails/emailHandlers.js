import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeMail = async (email, name, profileURL) => {
  const recipient = [{ email }];
// const recipient = [{ email: "rishabhid777@gmail.com" }]; // ✅ Correct format


  try {
    const response = await mailtrapClient.send({
      from: sender, 
      to: recipient,
      subject: "Welcome to ConnectIn",
      html: createWelcomeEmailTemplate(name, profileURL),
      category: "welcome",
    });
    console.log("Welcome Email sent Successfully", response);
  } catch (error) {
    throw error;
  }
};
