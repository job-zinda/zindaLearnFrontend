




import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import InlineAlert from "../Components/InlineAlert";

function getErrorMessage(error, fallback = "Something went wrong") {
  return (
    error?.response?.data?.msg ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

function getImageSrc(value) {
  if (!value) return "";
  const src = String(value).trim();

  if (
    src.startsWith("data:image") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  return src;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return createPortal(
    <div className="student-settings-modal-overlay" onMouseDown={onClose}>
      <div
        className="student-settings-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="student-settings-modal-head">
          <h3>{title}</h3>

          <button
            type="button"
            className="student-settings-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="student-settings-modal-body">{children}</div>
      </div>
    </div>,
    document.body
  );
}

function StarRating({ value, onChange }) {
  return (
    <div className="student-settings-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={star <= value ? "active" : ""}
          onClick={() => onChange(star)}
        >
          ★
        </button>
      ))}
    </div>
  );
}

const headingLines = new Set([
  "Introduction",
  "General",
  "Services Overview",
  "Registration",
  "Eligibility",
  "Security",
  "License and Access",
  "User Conduct",
  "Communications",
  "Payment",
  "User Obligations",
  "Copyright and Trademark",
  "Disclaimer of Warranties and Liabilities",
  "Indemnification and Limitation of Liability",
  "Termination",
  "Hosting of Third-Party Information",
  "Disputes and Jurisdiction",
  "Privacy",
  "Miscellaneous Provisions",
  "Contact Us",
  "FAQs",
]);

function renderLineWithLinks(line) {
  const urlRegex = /(https?:\/\/[^\s,]+)/g;

  return String(line)
    .split(urlRegex)
    .map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noreferrer"
            style={{
              color: "#6200d8",
              fontWeight: 900,
              textDecoration: "underline",
            }}
          >
            {part}
          </a>
        );
      }

      return part;
    });
}

function ContentLine({ line }) {
  if (headingLines.has(line)) {
    return (
      <h3
        style={{
          margin: "22px 0 10px",
          fontSize: "22px",
          fontWeight: 950,
          color: "#111827",
        }}
      >
        {line}
      </h3>
    );
  }

  return <p>{renderLineWithLinks(line)}</p>;
}

const sections = [
  { key: "profile", label: "Profile Edit" },
  { key: "help", label: "Help and Support" },
  { key: "terms", label: "Terms and Conditions" },
  { key: "about", label: "About Zinda Learn" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "feedback", label: "Feedback" },
];

const content = {
  help: {
    title: "Help and Support",
    body: [
      "Zinda Learn is an online school website designed to help students learn easily from home by connecting them with tutors, online classes, study support, and learning resources. Our goal is to make learning simple, reliable, and helpful for every student.",

      "Here are some tips and resources to help you get the most out of Zinda Learn:",

      "Get familiar with our website: Before you start learning, spend some time exploring Zinda Learn. Check the main sections such as courses, tutors, classes, chat, profile, and support so you know where to find what you need.",

      "Choose the right course or tutor: Zinda Learn provides different learning options for students. Select the course, class, subject, syllabus, or tutor that matches your learning needs.",

      "Attend classes regularly: Regular learning is very important. Make sure you attend your online classes on time and follow the instructions given by your tutor.",

      "Use chat and support: If you have any doubts about classes, tutors, courses, or your account, you can use the chat or support options to contact the Zinda Learn team.",

      "Keep your profile updated: Make sure your name, phone number, email, and other details are correct so that Zinda Learn can provide better support and communication.",

      "FAQs",

      "Q1. What is Zinda Learn? Zinda Learn is an online school platform that helps students learn from home through online classes, tutor support, and learning services.",

      "Q2. What services does Zinda Learn offer? Zinda Learn offers online tuition, tutor connection, course selection, student support, chat support, and learning guidance.",

      "Q3. What are the benefits of using Zinda Learn? Zinda Learn helps students learn from experienced tutors, attend classes from home, get personalized support, improve understanding of subjects, and prepare better for studies.",

      "Q4. Is Zinda Learn free to use? No, Zinda Learn may include paid learning services depending on the course, tutor, or class selected. Students can contact the Zinda Learn team for fee details.",

      "Q5. How can I choose a tutor or course? You can browse the available courses and tutors on the website, check the details, and select the option that best matches your learning requirement.",

      "Q6. How can I ask for help? If you need help with your account, course, tutor, class, payment, or any other issue, you can contact Zinda Learn through the website chat, support section, or contact form. Our team is here to help.",

      "We hope you find Zinda Learn helpful in your learning journey. Good luck!",
    ],
  },

  terms: {
    title: "Terms and Conditions",
    body: [
      "Introduction",

      "https://zinda-learn-frontend-rntj.vercel.app/student/settings is an online school platform designed to help students learn from home by connecting them with tutors, online classes, study support, and learning resources. The platform provides digital learning services for school students across different subjects and levels.",

      "General",

      "https://zinda-learn-frontend-rntj.vercel.app/student/settings, hereinafter referred to as the Website, is owned and operated by Zinda Learn, an online education service provider. By accessing or using the Website, you agree that you have read, understood, and accepted these Terms and Conditions, along with the Privacy Policy and other policies of the platform.",

      "These Terms form a legally binding agreement between you, the User, and Zinda Learn, the Company. The terms We, Us, and Our shall refer to Zinda Learn. The terms You, Your, and User shall refer to any person visiting, accessing, browsing, registering, or using the Website.",

      "We reserve the right to modify these Terms and Conditions at any time without prior notice. Your continued use of the Website after any changes indicates your acceptance of the updated Terms.",

      "Services Overview",

      "Zinda Learn provides an online platform where students can connect with tutors, attend online classes, access study materials, communicate through chat, receive academic support, and choose learning services based on their needs.",

      "Some services may be paid and may be accessible only after subscription, registration, or payment. The availability of courses, tutors, classes, and learning services may vary from time to time.",

      "Registration",

      "To use certain services on Zinda Learn, you may be required to create an account. At the time of registration, you may need to provide details such as name, email address, phone number, profile information, and other basic details required for platform services.",

      "You must keep your account details accurate and updated. You are responsible for maintaining the confidentiality of your login credentials. Any activity performed through your account will be considered as done by you.",

      "Zinda Learn reserves the right to suspend, restrict, or terminate accounts that provide false, inaccurate, misleading, or incomplete information.",

      "Eligibility",

      "Users must be legally capable of entering into a contract under applicable law. Students below the age of 18 may use the platform under the supervision and consent of a parent or legal guardian.",

      "Zinda Learn reserves the right to refuse access, suspend registration, or terminate an account if eligibility requirements are not met or if misuse of the platform is identified.",

      "Security",

      "Zinda Learn takes reasonable steps to protect user information and platform transactions. Payment details are processed through secure payment gateways. Zinda Learn does not directly store your debit card, credit card, UPI, or banking details.",

      "Users are responsible for protecting their account passwords and login details. Any unauthorized access or suspicious activity should be reported to Zinda Learn support immediately.",

      "License and Access",

      "Zinda Learn grants users a limited, non-transferable, non-exclusive license to access and use the Website for personal educational purposes only.",

      "Users are not allowed to copy, reproduce, distribute, sell, modify, download, commercially exploit, or misuse any content, study material, design, images, videos, tutor details, or platform data without written permission from Zinda Learn.",

      "Users shall not attempt to gain unauthorized access to any part of the Website, server, database, account, network, or service through hacking, password mining, scraping, bots, automated tools, or any unlawful method.",

      "User Conduct",

      "You agree not to upload, post, send, share, or transmit any content that is harmful, abusive, harassing, defamatory, obscene, threatening, hateful, misleading, illegal, or offensive.",

      "You agree not to impersonate another person, misuse another user's information, violate intellectual property rights, disturb tutors or students, misuse chat services, or perform any activity that may harm the platform or its users.",

      "Any violation of user conduct rules may result in warning, account restriction, suspension, termination, or legal action.",

      "Communications",

      "By using Zinda Learn, you agree to receive communications from us through phone calls, SMS, WhatsApp, email, in-app messages, or other contact methods provided by you.",

      "These communications may relate to classes, tutors, course updates, support, payment, account activity, service notifications, promotional messages, or important platform updates.",

      "You may opt out of promotional communications where applicable, but service-related communications may still be sent when necessary.",

      "Payment",

      "Zinda Learn may offer paid services such as online tuition, tutor sessions, course access, subscriptions, learning support, or other educational services.",

      "Payment options may include debit cards, credit cards, net banking, UPI, wallets, or other payment methods supported by the platform or payment gateway.",

      "Users must complete payment successfully to access paid services. Fees, subscriptions, and service charges may vary depending on the selected course, tutor, class, or learning package.",

      "Payments are generally non-refundable unless specifically stated by Zinda Learn or required by applicable law.",

      "User Obligations",

      "You agree to use Zinda Learn only for lawful learning purposes. You shall not copy, share, resell, distribute, record, reproduce, or misuse any class content, tutor content, study material, or platform information.",

      "You agree not to interfere with the working of the Website, not to upload harmful files or viruses, not to collect data of other users, and not to use the platform for advertising, spam, fraud, harassment, or illegal activities.",

      "You are solely responsible for the content, messages, feedback, profile details, and information submitted through your account.",

      "Copyright and Trademark",

      "All content available on Zinda Learn, including text, images, videos, logos, designs, study materials, platform layout, graphics, and software, is owned by Zinda Learn or licensed to Zinda Learn.",

      "No user is permitted to use the Zinda Learn name, logo, content, design, study material, or service marks without prior written permission.",

      "Unauthorized use, copying, distribution, or reproduction of Zinda Learn content may lead to account termination and legal action.",

      "Disclaimer of Warranties and Liabilities",

      "Zinda Learn provides the Website and services on an as is and as available basis. We do not guarantee that the Website will always be uninterrupted, error-free, fully secure, or available at all times.",

      "We try to provide accurate and useful learning support, but we do not guarantee specific academic results, exam success, grades, or performance outcomes.",

      "Users understand that learning progress depends on regular attendance, effort, practice, tutor guidance, and individual performance.",

      "Zinda Learn shall not be responsible for service interruptions, internet issues, device issues, third-party service failures, payment gateway errors, or any indirect loss arising from use of the platform.",

      "Indemnification and Limitation of Liability",

      "You agree to indemnify and hold harmless Zinda Learn, its team, tutors, partners, employees, and service providers from any claims, damages, losses, liabilities, costs, or expenses arising from your misuse of the Website, violation of these Terms, violation of law, or infringement of any third-party rights.",

      "To the maximum extent permitted by law, Zinda Learn shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Website or services.",

      "Termination",

      "These Terms remain effective unless terminated by you or Zinda Learn. You may stop using the Website at any time.",

      "Zinda Learn may suspend or terminate your account immediately if you violate these Terms, misuse the platform, provide false information, disturb other users, fail to make required payments, or engage in unlawful activities.",

      "Termination will not cancel any payment obligation or liability that arose before termination.",

      "Hosting of Third-Party Information",

      "Zinda Learn may include information, links, tools, or services provided by third parties. We are not responsible for the accuracy, reliability, legality, or completeness of third-party content or external websites.",

      "Users access third-party links or services at their own risk.",

      "Disputes and Jurisdiction",

      "Any disputes relating to Zinda Learn, its Website, services, payments, or these Terms shall first be attempted to be resolved through discussion or mediation.",

      "If the dispute cannot be resolved through mediation, it may be resolved through arbitration or legal proceedings as permitted by applicable Indian law.",

      "The jurisdiction shall be subject to the competent courts in India, unless otherwise specified by Zinda Learn.",

      "Privacy",

      "We encourage you to read our Privacy Policy carefully. By using Zinda Learn, you consent to the collection and use of your information as described in our Privacy Policy.",

      "Your personal information such as name, email, phone number, profile photo, chats, feedback, course details, and usage data may be used to provide platform services, improve learning support, process payments, and communicate with you.",

      "Miscellaneous Provisions",

      "Entire Agreement: These Terms, along with the Privacy Policy and other platform policies, constitute the complete agreement between you and Zinda Learn regarding the use of the Website and services.",

      "Waiver: Failure by Zinda Learn to enforce any provision of these Terms shall not be considered a waiver of the right to enforce such provision later.",

      "Severability: If any provision of these Terms is found invalid or unenforceable, the remaining provisions shall continue to remain valid and enforceable.",

      "Contact Us",

      "If you have any questions about these Terms and Conditions, the practices of Zinda Learn, or your experience with the service, you can contact us through WhatsApp at https://api.whatsapp.com/message/XTRJLU7IXTBHI1?autoload=1&app_absent=0.",
    ],
  },

about: {
  title: "About Zinda Learn",
  body: [
    "Zinda Learn is a modern online school platform designed to help students easily find the right tutors and continue their studies from home with convenience and confidence. The platform provides a complete learning system where students can explore different types of courses such as Online Tuition, Skill-Based Courses, and Talent-Based Courses, based on their academic and personal learning needs.",

    "Students can browse available courses, select their class or subject, and view a list of qualified tutors along with their profiles, qualifications, experience, ratings, and reviews. Each tutor profile gives detailed information so students can make the right decision before choosing a tutor.",

    "Zinda Learn mainly focuses on online tuition, where students can find suitable tutors and send a request to connect. Once a student selects a tutor, a request is sent to the admin, and after confirming the request and completing the payment process, the tutor will be assigned and made available for the student. This ensures a secure and controlled learning experience.",

    "The platform also includes a real-time chat system, where students can communicate with the admin for support, queries, and assistance during the tutor selection and connection process. This makes the entire learning journey smooth and guided.",

    "In addition, students can manage their profiles, view course details, read tutor reviews, and share feedback about their experience. Zinda Learn aims to provide a simple, user-friendly, and effective learning environment where students can improve their knowledge, clear doubts, and achieve better academic results without leaving their home.",
  ],
},

privacy: {
  title: "Privacy Policy",
  body: [
    "Our website may use the Privacy Policy given below:",

    "The terms We, Us, Our, and Company individually and collectively refer to Zinda Learn Online School, and the terms You, Your, and Yourself refer to the users of the platform.",

    "This Privacy Policy is an electronic record in the form of an electronic contract formed under applicable Information Technology laws. This Privacy Policy does not require any physical, electronic, or digital signature.",

    "This Privacy Policy is a legally binding document between you and Zinda Learn Online School. The terms of this Privacy Policy will be effective upon your acceptance (directly or indirectly by using the website, creating an account, or accessing services) and will govern your relationship with Zinda Learn.",

    "This document is published in accordance with applicable data protection and information technology laws that require publishing of a Privacy Policy for collection, use, storage, and transfer of personal information.",

    "Please read this Privacy Policy carefully. By using the website, you indicate that you understand, agree, and consent to this Privacy Policy. If you do not agree with the terms, please do not use the website.",

    "By providing your information or using the services provided by Zinda Learn, you consent to the collection, storage, processing, and transfer of your personal and non-personal information as described in this Privacy Policy.",

    "USER INFORMATION",

    "To access and use services on Zinda Learn, users may be required to provide information such as name, email address, phone number, class, course details, profile photo, password, and other necessary details.",

    "Students may also provide information while browsing courses, selecting tutors, sending requests, chatting with admin, making payments, giving feedback, or updating their profile.",

    "This information helps us create accounts, connect students with tutors, process requests, provide support, improve services, and deliver a better user experience.",

    "All required information is service-dependent and is used only to maintain, protect, and improve our platform and services.",

    "COOKIES",

    "To improve the responsiveness of the website, we may use cookies or similar technologies to collect information. Cookies help us understand user preferences and improve the overall user experience.",

    "Cookies do not personally identify users unless information is voluntarily provided. Users may disable cookies in their browser settings, but some features may not function properly.",

    "Our servers may also collect limited information such as IP address, browser type, and device information to improve performance and analyze usage.",

    "LINKS TO OTHER SITES",

    "Zinda Learn may contain links to third-party websites, payment gateways, or external services. These websites are not controlled by us, and we are not responsible for their privacy practices or content.",

    "Users are advised to read the privacy policies of such external websites before using them.",

    "INFORMATION SHARING",

    "We do not share personal information with third parties without user consent, except in the following cases:",

    "(a) When required by law, court order, or government authority for verification, investigation, prevention of fraud, or legal compliance.",

    "(b) When sharing information with our internal team, service providers, tutors, or partners for providing services, processing requests, handling payments, or improving platform functionality.",

    "All such third parties are required to follow strict confidentiality and data protection measures.",

    "INFORMATION SECURITY",

    "We take appropriate security measures to protect user data from unauthorized access, alteration, disclosure, or destruction.",

    "Data is stored securely in protected systems, and access is limited to authorized personnel only. Payment information is processed through secure payment gateways.",

    "However, no system is completely secure, and we cannot guarantee absolute security of data transmitted over the internet.",

    "We continuously review and update our security practices to improve protection of user data.",

    "Grievance Redressal",

    "If you have any complaints, concerns, or issues related to privacy, data misuse, or platform usage, you may contact the Zinda Learn support team.",

    "You can contact us via WhatsApp at https://wa.me/message/XTRJLU7IXTBHI1 or through the support section on our website.",

    "Zinda Learn Online School",
    "India",
  ],
}
};

export default function StudentSettingsPage() {
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const [activeSection, setActiveSection] = useState("profile");
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
    phone: "",
    photo: "",
  });

  const [savingProfile, setSavingProfile] = useState(false);

  // const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  // const [feedbackRating, setFeedbackRating] = useState(5);
  // const [feedbackMessage, setFeedbackMessage] = useState("");
  // const [savingFeedback, setSavingFeedback] = useState(false);



const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
const [feedbackRating, setFeedbackRating] = useState(5);
const [feedbackMessage, setFeedbackMessage] = useState("");
const [savingFeedback, setSavingFeedback] = useState(false);
const [myFeedback, setMyFeedback] = useState(null);
const [deletingFeedback, setDeletingFeedback] = useState(false);





  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const photoSrc = useMemo(
    () => getImageSrc(profileForm.photo),
    [profileForm.photo]
  );

  async function fetchProfile() {
    try {
      const { data } = await api.get("/my_profile");
      const user = data?.user || null;

      setProfile(user);

      if (user) {
        setProfileForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          photo: user.photo || "",
        });
      }
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to load profile"), "error");
    }
  }

  // async function fetchMyFeedback() {
  //   try {
  //     const { data } = await api.get("/feedback/my");
  //     const feedback = data?.feedback;

  //     if (feedback) {
  //       setFeedbackRating(feedback.rating || 5);
  //       setFeedbackMessage(feedback.message || "");
  //     }
  //   } catch {
  //     // no alert needed
  //   }
  // }






async function fetchMyFeedback() {
  try {
    const { data } = await api.get("/feedback/my");
    const feedback = data?.feedback || null;

    setMyFeedback(feedback);

    if (feedback) {
      setFeedbackRating(Number(feedback.rating) || 5);
      setFeedbackMessage(feedback.message || "");
    } else {
      setFeedbackRating(5);
      setFeedbackMessage("");
    }
  } catch {
    setMyFeedback(null);
    setFeedbackRating(5);
    setFeedbackMessage("");
  }
}







  useEffect(() => {
    fetchProfile();
    fetchMyFeedback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openSection(key) {
    setActiveSection(key);

    if (key === "profile") {
      setProfileModalOpen(true);
    }

    if (key === "feedback") {
      setFeedbackModalOpen(true);
    }

    setMobileDetailOpen(true);
  }

  async function handlePhotoSelect(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const base64 = await fileToBase64(file);
    setProfileForm((prev) => ({ ...prev, photo: base64 }));
  }

  async function saveProfile() {
    try {
      setSavingProfile(true);

      const { data } = await api.put("/update_my_profile", {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        photo: profileForm.photo,
      });

      const updated = data?.user || {
        ...profile,
        ...profileForm,
      };

      setProfile(updated);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...(JSON.parse(localStorage.getItem("user") || "{}")),
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
          photo: updated.photo,
        })
      );

      showAlert("Profile updated successfully", "success");
      setProfileModalOpen(false);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to update profile"), "error");
    } finally {
      setSavingProfile(false);
    }
  }

  // async function submitFeedback() {
  //   try {
  //     setSavingFeedback(true);

  //     await api.post("/feedback", {
  //       rating: feedbackRating,
  //       message: feedbackMessage,
  //     });

  //     showAlert("Feedback submitted successfully", "success");
  //     setFeedbackModalOpen(false);
  //   } catch (err) {
  //     showAlert(getErrorMessage(err, "Failed to submit feedback"), "error");
  //   } finally {
  //     setSavingFeedback(false);
  //   }
  // }










async function submitFeedback() {
  try {
    if (!feedbackRating || Number(feedbackRating) < 1) {
      return showAlert("Please select rating", "error");
    }

    if (!feedbackMessage.trim()) {
      return showAlert("Please enter feedback", "error");
    }

    setSavingFeedback(true);

    const { data } = await api.post("/feedback", {
      rating: feedbackRating,
      message: feedbackMessage.trim(),
    });

    setMyFeedback(data?.feedback || null);

    showAlert(
      myFeedback ? "Feedback updated successfully" : "Feedback submitted successfully",
      "success"
    );

    setFeedbackModalOpen(false);
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to submit feedback"), "error");
  } finally {
    setSavingFeedback(false);
  }
}












async function deleteMyFeedback() {
  try {
    if (!myFeedback) {
      return showAlert("No feedback found to delete", "error");
    }

    const ok = window.confirm("Do you want to delete your feedback?");
    if (!ok) return;

    setDeletingFeedback(true);

    await api.delete("/feedback/my");

    setMyFeedback(null);
    setFeedbackRating(5);
    setFeedbackMessage("");

    showAlert("Feedback deleted successfully", "success");
    setFeedbackModalOpen(false);
  } catch (err) {
    showAlert(getErrorMessage(err, "Failed to delete feedback"), "error");
  } finally {
    setDeletingFeedback(false);
  }
}








  async function deleteAccount() {
    try {
      setDeleting(true);

      await api.delete("/delete_my_account");

      localStorage.clear();
      showAlert("Account deleted successfully", "success");
      navigate("/", { replace: true });
    } catch (err) {
      showAlert(
        getErrorMessage(
          err,
          "Delete account API not found. Add backend route /delete_my_account"
        ),
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }

  function renderContent() {
    if (activeSection === "profile") {
      return (
        <div className="student-settings-content-card">
          <h2>Profile Edit</h2>

          <div className="student-settings-profile-view">
            <div className="student-settings-profile-avatar">
              {getImageSrc(profile?.photo) ? (
                <img
                  src={getImageSrc(profile.photo)}
                  alt={profile?.name || "Student"}
                />
              ) : (
                <span>{profile?.name?.charAt(0)?.toUpperCase() || "S"}</span>
              )}
            </div>

            <div>
              <h3>{profile?.name || "Student"}</h3>
              <p>{profile?.email || "No email"}</p>
              <p>{profile?.phone || "No phone"}</p>
            </div>
          </div>

          <button
            type="button"
            className="student-settings-primary-btn"
            onClick={() => setProfileModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      );
    }

    if (activeSection === "feedback") {
      return (
        <div className="student-settings-content-card">
          <h2>Feedback</h2>
          <p>Share your experience about Zinda Learn.</p>

          {/* <button
            type="button"
            className="student-settings-primary-btn"
            onClick={() => setFeedbackModalOpen(true)}
          >
            Write Feedback
          </button> */}






<button
  type="button"
  className="student-settings-primary-btn"
  onClick={() => setFeedbackModalOpen(true)}
>
  {myFeedback ? "Edit Feedback" : "Write Feedback"}
</button>







        </div>
      );
    }

    const selected = content[activeSection];

    return (
      <div className="student-settings-content-card">
        <h2>{selected?.title}</h2>

        {selected?.body?.map((line, index) => (
          <ContentLine key={index} line={line} />
        ))}
      </div>
    );
  }

  return (
    <div className="student-settings-page">
      <InlineAlert />

      <div className="student-settings-layout">
        <aside
          className={`student-settings-menu ${
            mobileDetailOpen ? "student-settings-menu--hide-mobile" : ""
          }`}
        >
          {sections.map((section) => (
            <button
              key={section.key}
              type="button"
              className={activeSection === section.key ? "active" : ""}
              onClick={() => openSection(section.key)}
            >
              {section.label}
            </button>
          ))}

          <button
            type="button"
            className="student-settings-delete-btn"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete account
          </button>
        </aside>

        <main
          className={`student-settings-content ${
            mobileDetailOpen ? "student-settings-content--open-mobile" : ""
          }`}
        >
          <button
            type="button"
            className="student-settings-mobile-back"
            onClick={() => setMobileDetailOpen(false)}
          >
            ← Back
          </button>

          {renderContent()}
        </main>
      </div>

      <Modal
        open={profileModalOpen}
        title="Edit Profile"
        onClose={() => setProfileModalOpen(false)}
      >
        <div className="student-settings-form">
          <div className="student-settings-photo-box">
            {photoSrc ? (
              <img src={photoSrc} alt="Profile" />
            ) : (
              <span>{profileForm.name?.charAt(0)?.toUpperCase() || "S"}</span>
            )}

            <label>
              Upload Photo
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handlePhotoSelect}
              />
            </label>
          </div>

          <label>Full Name</label>
          <input
            value={profileForm.name}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, name: e.target.value }))
            }
          />

          <label>Email ID</label>
          <input
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, email: e.target.value }))
            }
          />

          <label>Phone Number</label>
          <input
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm((prev) => ({ ...prev, phone: e.target.value }))
            }
          />

          <button
            type="button"
            className="student-settings-primary-btn"
            disabled={savingProfile}
            onClick={saveProfile}
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>

      {/* <Modal
        open={feedbackModalOpen}
        title="Website Feedback"
        onClose={() => setFeedbackModalOpen(false)}
      >
        <div className="student-settings-form">
          <label>Rating</label>
          <StarRating value={feedbackRating} onChange={setFeedbackRating} />

          <label>Feedback</label>
          <textarea
            rows={5}
            placeholder="Write your feedback..."
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
          />

          <button
            type="button"
            className="student-settings-primary-btn"
            disabled={savingFeedback || !feedbackMessage.trim()}
            onClick={submitFeedback}
          >
            {savingFeedback ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </Modal> */}







<Modal
  open={feedbackModalOpen}
  title="Website Feedback"
  onClose={() => setFeedbackModalOpen(false)}
>
  <div className="student-settings-feedback-form">
    <label>
      <span>Rating</span>
      <StarRating value={feedbackRating} onChange={setFeedbackRating} />
    </label>

    <label>
      <span>Feedback</span>
      <textarea
        value={feedbackMessage}
        onChange={(e) => setFeedbackMessage(e.target.value)}
        placeholder="Write your feedback..."
      />
    </label>

    <div className="student-settings-feedback-actions">
      {myFeedback && (
        <button
          type="button"
          className="student-settings-feedback-delete-btn"
          onClick={deleteMyFeedback}
          disabled={savingFeedback || deletingFeedback}
        >
          {deletingFeedback ? "Deleting..." : "Delete Feedback"}
        </button>
      )}

      <button
        type="button"
        className="student-settings-primary-btn"
        onClick={submitFeedback}
        disabled={savingFeedback || deletingFeedback}
      >
        {savingFeedback
          ? "Saving..."
          : myFeedback
          ? "Update Feedback"
          : "Submit Feedback"}
      </button>
    </div>
  </div>
</Modal>







      <Modal
        open={deleteModalOpen}
        title="Delete Account"
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="student-settings-delete-modal">
          <p>Are you sure you want to delete your account?</p>
          <p>This action cannot be undone.</p>

          <button
            type="button"
            className="student-settings-danger-btn"
            disabled={deleting}
            onClick={deleteAccount}
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </Modal>
    </div>
  );
}