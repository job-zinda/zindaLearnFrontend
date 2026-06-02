import { useNavigate } from "react-router-dom";
import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import api from "../api/axios";
import { useAlert } from "../context/AlertContext";
import InlineAlert from "../Components/InlineAlert";
import "./TutorSettingsPage.css";

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
    <div className="tutor-settings-modal-overlay" onMouseDown={onClose}>
      <div
        className="tutor-settings-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="tutor-settings-modal-head">
          <h3>{title}</h3>

          <button
            type="button"
            className="tutor-settings-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="tutor-settings-modal-body">{children}</div>
      </div>
    </div>,
    document.body
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
  "USER INFORMATION",
  "COOKIES",
  "LINKS TO OTHER SITES",
  "INFORMATION SHARING",
  "INFORMATION SECURITY",
  "Grievance Redressal",
]);

function renderLineWithLinks(line) {
  const urlRegex = /(https?:\/\/[^\s,]+)/g;

  return String(line)
    .split(urlRegex)
    .map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={`${part}-${index}`}
            href={part}
            target="_blank"
            rel="noreferrer"
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
    return <h3 className="tutor-settings-content-heading">{line}</h3>;
  }

  return <p>{renderLineWithLinks(line)}</p>;
}

const sections = [
  { key: "profile", label: "Profile Edit" },
  { key: "help", label: "Help and Support" },
  { key: "terms", label: "Terms and Conditions" },
  { key: "about", label: "About Zinda Learn" },
  { key: "privacy", label: "Privacy Policy" },
];

const content = {
  help: {
    title: "Help and Support",
    body: [
      "Zinda Learn is an online school website designed to help tutors teach students easily from home by connecting them with students, online classes, study support, and learning resources. Our goal is to make online teaching simple, reliable, and helpful for every tutor.",

      "Here are some tips and resources to help you get the most out of Zinda Learn:",

      "Get familiar with our website: Before you start teaching, spend some time exploring Zinda Learn. Check the main sections such as courses, tutors, chats, profile, and support so you know where to find what you need.",

      "Keep your profile updated: Make sure your name, phone number, email, qualification, subjects, and profile photo are correct so students and admin can identify you properly.",

      "Use chat and support: If you have any doubts about students, classes, courses, payment, or your account, you can use the chat or support options to contact the Zinda Learn team.",

      "Maintain professional communication: Always communicate with students and admin politely and professionally.",

      "FAQs",

      "Q1. What is Zinda Learn? Zinda Learn is an online school platform that helps students learn from home and helps tutors connect with students through online learning support.",

      "Q2. What services does Zinda Learn offer? Zinda Learn offers online tuition, tutor connection, course selection, student support, chat support, and learning guidance.",

      "Q3. How can tutors use Zinda Learn? Tutors can manage their profile, view courses, view tutor details, communicate through chat, and provide learning support to students.",

      "Q4. How can I update my tutor profile? Go to Settings, open Profile Edit, change your details, upload your photo if needed, and save the changes.",

      "Q5. How can I ask for help? If you need help with your account, students, course, class, payment, or any other issue, you can contact Zinda Learn through the website chat or support section.",

      "We hope you find Zinda Learn helpful in your teaching journey.",
    ],
  },

  terms: {
    title: "Terms and Conditions",
    body: [
      "Introduction",

      "Zinda Learn is an online school platform designed to help students learn from home by connecting them with tutors, online classes, study support, and learning resources. The platform provides digital learning services for school students across different subjects and levels.",

      "General",

      "The Website is owned and operated by Zinda Learn, an online education service provider. By accessing or using the Website, you agree that you have read, understood, and accepted these Terms and Conditions, along with the Privacy Policy and other policies of the platform.",

      "These Terms form a legally binding agreement between you, the User, and Zinda Learn, the Company. The terms We, Us, and Our shall refer to Zinda Learn. The terms You, Your, and User shall refer to any person visiting, accessing, browsing, registering, or using the Website.",

      "We reserve the right to modify these Terms and Conditions at any time without prior notice. Your continued use of the Website after any changes indicates your acceptance of the updated Terms.",

      "Services Overview",

      "Zinda Learn provides an online platform where students can connect with tutors, attend online classes, access study materials, communicate through chat, receive academic support, and choose learning services based on their needs.",

      "Tutors may use the platform to manage their profile, view course-related details, communicate with admin or students, and provide learning support according to the platform rules.",

      "Registration",

      "To use certain services on Zinda Learn, you may be required to create an account. At the time of registration, you may need to provide details such as name, email address, phone number, profile information, and other basic details required for platform services.",

      "You must keep your account details accurate and updated. You are responsible for maintaining the confidentiality of your login credentials. Any activity performed through your account will be considered as done by you.",

      "Zinda Learn reserves the right to suspend, restrict, deactivate, or terminate accounts that provide false, inaccurate, misleading, or incomplete information.",

      "Eligibility",

      "Users must be legally capable of entering into a contract under applicable law. Tutors must provide correct qualification, contact, and teaching-related information when required.",

      "Security",

      "Zinda Learn takes reasonable steps to protect user information and platform transactions. Users are responsible for protecting their account passwords and login details. Any unauthorized access or suspicious activity should be reported to Zinda Learn support immediately.",

      "License and Access",

      "Zinda Learn grants users a limited, non-transferable, non-exclusive license to access and use the Website for educational purposes only.",

      "Users are not allowed to copy, reproduce, distribute, sell, modify, download, commercially exploit, or misuse any content, study material, design, images, videos, tutor details, student details, or platform data without written permission from Zinda Learn.",

      "User Conduct",

      "You agree not to upload, post, send, share, or transmit any content that is harmful, abusive, harassing, defamatory, obscene, threatening, hateful, misleading, illegal, or offensive.",

      "You agree not to impersonate another person, misuse another user's information, violate intellectual property rights, disturb tutors or students, misuse chat services, or perform any activity that may harm the platform or its users.",

      "Any violation of user conduct rules may result in warning, account restriction, suspension, deactivation, termination, or legal action.",

      "Communications",

      "By using Zinda Learn, you agree to receive communications from us through phone calls, SMS, WhatsApp, email, in-app messages, or other contact methods provided by you.",

      "Payment",

      "Zinda Learn may offer paid services such as online tuition, tutor sessions, course access, subscriptions, learning support, or other educational services. Payment-related rules may vary depending on selected services and admin approval.",

      "Privacy",

      "We encourage you to read our Privacy Policy carefully. By using Zinda Learn, you consent to the collection and use of your information as described in our Privacy Policy.",

      "Termination",

      "Zinda Learn may suspend, deactivate, restrict, or terminate your account immediately if you violate these Terms, misuse the platform, provide false information, disturb other users, fail to follow platform rules, or engage in unlawful activities.",

      "Contact Us",

      "If you have any questions about these Terms and Conditions, the practices of Zinda Learn, or your experience with the service, you can contact us through WhatsApp at https://api.whatsapp.com/message/XTRJLU7IXTBHI1?autoload=1&app_absent=0.",
    ],
  },

  about: {
    title: "About Zinda Learn",
    body: [
      "Zinda Learn is a modern online school platform designed to help students easily find the right tutors and continue their studies from home with convenience and confidence.",

      "The platform provides a complete learning system where students can explore different types of courses such as Online Tuition, Skill-Based Courses, and Talent-Based Courses, based on their academic and personal learning needs.",

      "Tutors can use Zinda Learn to manage their profile, show their qualification and course details, and support students through online learning services.",

      "Students can browse available courses, select their class or subject, and view a list of qualified tutors along with their profiles, qualifications, experience, ratings, and reviews.",

      "Zinda Learn mainly focuses on online tuition and guided learning support. The platform aims to provide a simple, user-friendly, and effective learning environment where students and tutors can connect in a structured way.",
    ],
  },

  privacy: {
    title: "Privacy Policy",
    body: [
      "Our website may use the Privacy Policy given below:",

      "The terms We, Us, Our, and Company individually and collectively refer to Zinda Learn Online School, and the terms You, Your, and Yourself refer to the users of the platform.",

      "Please read this Privacy Policy carefully. By using the website, you indicate that you understand, agree, and consent to this Privacy Policy. If you do not agree with the terms, please do not use the website.",

      "USER INFORMATION",

      "To access and use services on Zinda Learn, users may be required to provide information such as name, email address, phone number, class, course details, profile photo, password, qualification, and other necessary details.",

      "Tutors may also provide information while updating their profile, using chats, managing teaching details, or communicating with admin.",

      "This information helps us create accounts, connect students with tutors, provide support, improve services, and deliver a better user experience.",

      "COOKIES",

      "To improve the responsiveness of the website, we may use cookies or similar technologies to collect information. Cookies help us understand user preferences and improve the overall user experience.",

      "LINKS TO OTHER SITES",

      "Zinda Learn may contain links to third-party websites, payment gateways, or external services. These websites are not controlled by us, and we are not responsible for their privacy practices or content.",

      "INFORMATION SHARING",

      "We do not share personal information with third parties without user consent, except when required by law or when needed for platform services, support, communication, or security.",

      "INFORMATION SECURITY",

      "We take appropriate security measures to protect user data from unauthorized access, alteration, disclosure, or destruction.",

      "Grievance Redressal",

      "If you have any complaints, concerns, or issues related to privacy, data misuse, or platform usage, you may contact the Zinda Learn support team.",

      "You can contact us via WhatsApp at https://wa.me/message/XTRJLU7IXTBHI1 or through the support section on our website.",

      "Zinda Learn Online School",
      "India",
    ],
  },
};

export default function TutorSettingsPage() {
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

  useEffect(() => {
    fetchProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openSection(key) {
    setActiveSection(key);

    if (key === "profile") {
      setProfileModalOpen(true);
    }

    setMobileDetailOpen(true);
  }

  async function handlePhotoSelect(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    const base64 = await fileToBase64(file);

    setProfileForm((prev) => ({
      ...prev,
      photo: base64,
    }));
  }

  async function saveProfile() {
    try {
      if (!profileForm.name.trim()) {
        return showAlert("Please enter name", "error");
      }

      if (!profileForm.email.trim()) {
        return showAlert("Please enter email", "error");
      }

      setSavingProfile(true);

      const { data } = await api.put("/update_my_profile", {
        name: profileForm.name.trim(),
        email: profileForm.email.trim(),
        phone: profileForm.phone,
        photo: profileForm.photo,
      });







      // const updated = data?.user || {
      //   ...profile,
      //   ...profileForm,
      // };

      // setProfile(updated);

      // const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

      // localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     ...oldUser,
      //     name: updated.name,
      //     email: updated.email,
      //     phone: updated.phone,
      //     photo: updated.photo,
      //   })
      // );

      // window.dispatchEvent(new Event("storage"));




const updatedUser = data?.user || {
  ...profile,
  ...profileForm,
};

setProfile(updatedUser);

setProfileForm({
  name: updatedUser.name || "",
  email: updatedUser.email || "",
  phone: updatedUser.phone || "",
  photo: updatedUser.photo || "",
});

const oldUser = JSON.parse(localStorage.getItem("user") || "{}");

localStorage.setItem(
  "user",
  JSON.stringify({
    ...oldUser,
    ...updatedUser,
  })
);

window.dispatchEvent(new Event("storage"));







      showAlert("Profile updated successfully", "success");
      setProfileModalOpen(false);
    } catch (err) {
      showAlert(getErrorMessage(err, "Failed to update profile"), "error");
    } finally {
      setSavingProfile(false);
    }
  }

  async function deleteAccount() {
    try {
      setDeleting(true);

      await api.delete("/delete_my_account");

      localStorage.clear();
      sessionStorage.clear();

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
        <div className="tutor-settings-content-card">
          <h2>Profile Edit</h2>

          <div className="tutor-settings-profile-view">
            <div className="tutor-settings-profile-avatar">
              {getImageSrc(profile?.photo) ? (
                <img
                  src={getImageSrc(profile.photo)}
                  alt={profile?.name || "Tutor"}
                />
              ) : (
                <span>{profile?.name?.charAt(0)?.toUpperCase() || "T"}</span>
              )}
            </div>

            <div>
              <h3>{profile?.name || "Tutor"}</h3>
              <p>{profile?.email || "No email"}</p>
              <p>{profile?.phone || "No phone"}</p>
            </div>
          </div>

          <button
            type="button"
            className="tutor-settings-primary-btn"
            onClick={() => setProfileModalOpen(true)}
          >
            Edit Profile
          </button>
        </div>
      );
    }

    const selected = content[activeSection];

    return (
      <div className="tutor-settings-content-card">
        <h2>{selected?.title}</h2>

        {selected?.body?.map((line, index) => (
          <ContentLine key={index} line={line} />
        ))}
      </div>
    );
  }

  return (
    <div className="tutor-settings-page">
      <InlineAlert />

      <div className="tutor-settings-layout">
        <aside
          className={`tutor-settings-menu ${
            mobileDetailOpen ? "tutor-settings-menu--hide-mobile" : ""
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
            className="tutor-settings-delete-btn"
            onClick={() => setDeleteModalOpen(true)}
          >
            Delete account
          </button>
        </aside>

        <main
          className={`tutor-settings-content ${
            mobileDetailOpen ? "tutor-settings-content--open-mobile" : ""
          }`}
        >
          <button
            type="button"
            className="tutor-settings-mobile-back"
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
        <div className="tutor-settings-form">
          <div className="tutor-settings-photo-box">
            {photoSrc ? (
              <img src={photoSrc} alt="Profile" />
            ) : (
              <span>{profileForm.name?.charAt(0)?.toUpperCase() || "T"}</span>
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
              setProfileForm((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />

          <label>Email ID</label>
          <input
            value={profileForm.email}
            onChange={(e) =>
              setProfileForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
          />

          <label>Phone Number</label>
          <input
            value={profileForm.phone}
            onChange={(e) =>
              setProfileForm((prev) => ({
                ...prev,
                phone: e.target.value,
              }))
            }
          />

          <button
            type="button"
            className="tutor-settings-primary-btn"
            disabled={savingProfile}
            onClick={saveProfile}
          >
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </Modal>

      <Modal
        open={deleteModalOpen}
        title="Delete Account"
        onClose={() => setDeleteModalOpen(false)}
      >
        <div className="tutor-settings-delete-modal">
          <p>Are you sure you want to delete your account?</p>
          <p>This action cannot be undone.</p>

          <button
            type="button"
            className="tutor-settings-danger-btn"
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