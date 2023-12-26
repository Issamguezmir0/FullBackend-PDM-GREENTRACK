import twilio from "twilio";
import crypto from "crypto"; 

const accountSid = "AC31b7d020c2017393ffbd8e14095d7635";
const authToken = "3e4b0509bd182c3edf07813fc4e83c2e";
const twilioClient = twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string) => {
  try {
    await twilioClient.messages.create({
      body,
      to,
      from: "+18773362692",
    });
  } catch (error) {
    console.error("Erreur lors de l'envoi du SMS :", error);
    throw error;
  }
};

export const generateResetCode = (): string => {
  try {
    const randomBytesResult = crypto.randomBytes(3);
    return randomBytesResult.toString("hex").toUpperCase();
  } catch (error) {
    console.error(
      "Erreur lors de la génération du code de réinitialisation :",
      error
    );
    throw error;
  }
};
