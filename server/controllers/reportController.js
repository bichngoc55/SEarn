import Report from "../models/report.js";
import nodemailer from "nodemailer";
import User from "../models/User.js";
export const addReport = async (req, res) => {
  try {
    const { content, email } = req.body;
    let report = await Report.findOne({ email: email });

    if (report) {
      report.content.push(content);
    } else {
      report = new Report({ content: [content], email: email });
    }
    const savedReport = await report.save();
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "musicifya@gmail.com",
        pass: "rifl tdyk bdyl iwrb",
      },
    });

    let mailOptions = {
      from: "musicifya@gmail.com",
      to: email,
      subject: "Thansk for giving us feedback",
      text: `Dear ${user.name} \nWe have received your feedback regarding our app with the following content: ${content}. \nThank you for taking the time to share your thoughts and experiences with us. Your input is invaluable as it helps us to continuously improve our service.\nOur team will review your feedback and take the necessary actions. We will contact you directly if we require any additional information. We are committed to providing you with the best possible experience, and your feedback is a key part of that effort.\nThank you once again for your contribution.\nBest regards,\n[Nguyen Thi Bich Gau - Manager Of Fake App]\n[Musicify]`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending email" });
      }
      res.status(200).json({
        message: "Report added and email sent successfully",
        report: savedReport,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
