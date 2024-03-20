import axios from "axios";

const send_sms = async (mobile: string) => {
  try {
    if (!mobile) {
      throw new Error("Please provide a mobile number.");
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Get environment variables
    const api_url = process.env.SMS_API_URL;
    const sms_user = process.env.SMS_USER;
    const sms_pass = process.env.SMS_PASS;
    const sender_id = process.env.SENDER_ID;

    // Construct API URL
    let query_params: URLSearchParams | undefined;

    if (sms_user && mobile) {
      query_params = new URLSearchParams();
      query_params.append("user", sms_user);
      query_params.append("pass", sms_pass || '');
      query_params.append("sender", sender_id || '');
      query_params.append("phone", mobile);
      query_params.append(
        "text",
        `Dear User, OTP for the registration app is ${otp}. Kindly enter the password to register.`
      );
      query_params.append("priority", "ndnd");
      query_params.append("stype", "normal");
    } 
    const full_url = `${api_url}?${query_params}`;

    // Send SMS using bhashsms API
    const response = await axios.get(full_url);

    if (response.status === 200) {
      return otp;
    } else {
      throw new Error("Failed to send OTP");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send SMS");
  }
};

export default send_sms;
