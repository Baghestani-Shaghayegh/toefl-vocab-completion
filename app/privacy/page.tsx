'use client'
import { useRouter } from 'next/navigation'

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Caveat:wght@400;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f5f2eb; font-family: 'Special Elite', cursive; }

        .privacy-wrap {
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .btn-back {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #555;
          background: none;
          border: none;
          cursor: pointer;
          display: block;
          margin-bottom: 32px;
          transition: color 0.12s;
          padding: 0;
        }
        .btn-back:hover { color: #111; }

        .paper-card {
          background: #fffef9;
          border: 1.5px solid #d6d0c4;
          border-radius: 3px;
          padding: 48px 52px;
          position: relative;
          box-shadow: 2px 3px 0 #d6d0c4, 4px 6px 0 #ece8de;
        }

        .paper-card::before {
          content: '';
          position: absolute;
          left: 60px; top: 0; bottom: 0; width: 1px;
          background: rgba(220,100,100,0.18);
          pointer-events: none;
        }

        .paper-card::after {
          content: '';
          position: absolute; inset: 0;
          background-image: repeating-linear-gradient(
            transparent, transparent 31px,
            rgba(180,180,200,0.13) 31px, rgba(180,180,200,0.13) 32px
          );
          border-radius: 3px;
          pointer-events: none;
        }

        .paper-content { position: relative; z-index: 1; }

        .paper-content h1 {
          font-family: 'Special Elite', cursive;
          font-size: 28px;
          color: #111;
          letter-spacing: -0.5px;
          margin-bottom: 6px;
          line-height: 1.2;
        }

        .paper-content .subtitle {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #aaa;
          margin-bottom: 32px;
          display: block;
        }

        .paper-content h2 {
          font-family: 'Special Elite', cursive;
          font-size: 17px;
          color: #111;
          margin: 36px 0 12px;
          padding-bottom: 6px;
          border-bottom: 1px solid #e8e2d8;
        }

        .paper-content h3 {
          font-family: 'Special Elite', cursive;
          font-size: 15px;
          color: #333;
          margin: 20px 0 8px;
        }

        .paper-content p {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #555;
          line-height: 1.8;
          margin-bottom: 12px;
        }

        .paper-content em {
          font-family: ''Special Elite', cursive;
          font-size: 14px;
          color: #888;
          font-style: italic;
          display: block;
          margin-bottom: 12px;
        }

        .paper-content ul {
          margin: 10px 0 16px 20px;
        }

        .paper-content li {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #555;
          line-height: 1.7;
          margin-bottom: 6px;
          list-style-type: square;
        }

        .paper-content a {
          color: #555;
          text-decoration: underline;
        }
        .paper-content a:hover { color: #111; }

        .toc {
          background: rgba(245,242,235,0.6);
          border: 1px solid #d6d0c4;
          border-radius: 2px;
          padding: 16px 20px;
          margin: 16px 0 24px;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .toc a {
          font-family: 'Special Elite', cursive;
          font-size: 13px;
          color: #666;
          text-decoration: none;
          line-height: 1.6;
          transition: color 0.12s;
        }
        .toc a:hover { color: #111; text-decoration: underline; }

        .inset-block {
          font-family: 'Special Elite', cursive;
          font-size: 14px;
          color: #555;
          line-height: 2;
          margin-top: 12px;
          padding: 16px 20px;
          background: rgba(245,242,235,0.6);
          border: 1px solid #d6d0c4;
          border-radius: 2px;
        }

        @media (max-width: 560px) {
          .paper-card { padding: 32px 24px; }
          .paper-card::before { left: 36px; }
        }
      `}</style>

      <div className="privacy-wrap">
        <button onClick={() => router.back()} className="btn-back">← Back to sign up</button>
        <div className="paper-card">
          <div className="paper-content">
            <h1>PRIVACY NOTICE</h1>
            <span className="subtitle">Last updated May 04, 2026</span>

            <p>This Privacy Notice for <strong>Lexivo</strong> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services").</p>
            <p><strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:support@lexivo.io">support@lexivo.io</a>.</p>

            <h2>SUMMARY OF KEY POINTS</h2>
            <p><em>This summary provides key points from our Privacy Notice.</em></p>
            <p><strong>What personal information do we process?</strong> When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
            <p><strong>Do we process any sensitive personal information?</strong> We do not process sensitive personal information.</p>
            <p><strong>Do we collect any information from third parties?</strong> We may collect information from Google when you use Google Sign-In.</p>
            <p><strong>How do we process your information?</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</p>
            <p><strong>In what situations and with which parties do we share personal information?</strong> We may share information in specific situations and with specific third parties.</p>
            <p><strong>What are your rights?</strong> Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information.</p>
            <p><strong>How do you exercise your rights?</strong> The easiest way to exercise your rights is by contacting us at <a href="mailto:support@lexivo.io">support@lexivo.io</a>. We will consider and act upon any request in accordance with applicable data protection laws.</p>

            <h2>TABLE OF CONTENTS</h2>
            <div className="toc">
              <a href="#info-collect">1. What Information Do We Collect?</a>
              <a href="#info-process">2. How Do We Process Your Information?</a>
              <a href="#info-share">3. When and With Whom Do We Share Your Personal Information?</a>
              <a href="#cookies">4. Do We Use Cookies and Other Tracking Technologies?</a>
              <a href="#social-logins">5. How Do We Handle Your Social Logins?</a>
              <a href="#international">6. Is Your Information Transferred Internationally?</a>
              <a href="#retention">7. How Long Do We Keep Your Information?</a>
              <a href="#minors">8. Do We Collect Information From Minors?</a>
              <a href="#privacy-rights">9. What Are Your Privacy Rights?</a>
              <a href="#dnt">10. Controls for Do-Not-Track Features</a>
              <a href="#updates">11. Do We Make Updates to This Notice?</a>
              <a href="#contact">12. How Can You Contact Us About This Notice?</a>
              <a href="#delete">13. How Can You Review, Update, or Delete the Data We Collect From You?</a>
            </div>

            <h2 id="info-collect">1. What Information Do We Collect?</h2>
            <h3>Personal information you disclose to us</h3>
            <em>In Short: We collect personal information that you provide to us.</em>
            <p>We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.</p>
            <p><strong>Personal information provided by you</strong> includes: names, email addresses, and practice session data (scores, answers, time spent).</p>
            <p><strong>Sensitive information.</strong> We do not process sensitive information.</p>
            <p><strong>Social media login data.</strong> We may provide you with the option to register using your Google account details. If you choose to register in this way, we will collect the information described in the section "How Do We Handle Your Social Logins?" below.</p>
            <p>All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.</p>

            <h3>Information automatically collected</h3>
            <em>In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services.</em>
            <p>We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, and information about how and when you use our Services. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes.</p>
            <p>Like many businesses, we also collect information through cookies and similar technologies.</p>

            <h2 id="info-process">2. How Do We Process Your Information?</h2>
            <em>In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law.</em>
            <p>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</p>
            <ul>
              <li>To deliver and facilitate delivery of services to the user</li>
              <li>To respond to user inquiries and offer support</li>
              <li>To send administrative information to you</li>
              <li>To send marketing and promotional communications (where you have opted in)</li>
              <li>To save or protect an individual's vital interest</li>
            </ul>

            <h2 id="info-share">3. When and With Whom Do We Share Your Personal Information?</h2>
            <em>In Short: We may share information in specific situations described in this section and/or with the following third parties.</em>
            <p>We may need to share your personal information in the following situations:</p>
            <ul>
              <li><strong>Business Transfers.</strong> We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
              <li><strong>Affiliates.</strong> We may share your information with our affiliates, in which case we will require those affiliates to honor this Privacy Notice.</li>
              <li><strong>Business Partners.</strong> We may share your information with our business partners to offer you certain products, services, or promotions.</li>
            </ul>

            <h2 id="cookies">4. Do We Use Cookies and Other Tracking Technologies?</h2>
            <em>In Short: We may use cookies and other tracking technologies to collect and store your information.</em>
            <p>We may use cookies and similar tracking technologies (like web beacons and pixels) to gather information when you interact with our Services. Some online tracking technologies help us maintain the security of our Services, prevent crashes, fix bugs, save your preferences, and assist with basic site functions.</p>
            <p>Specifically, we use cookies to maintain your login session via Supabase Auth. These are essential cookies required for the service to function.</p>

            <h2 id="social-logins">5. How Do We Handle Your Social Logins?</h2>
            <em>In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you.</em>
            <p>Our Services offer you the ability to register and log in using your Google account. Where you choose to do this, we will receive certain profile information about you from Google. The profile information we receive may include your name, email address, and profile picture.</p>
            <p>We will use the information we receive only for the purposes that are described in this Privacy Notice. Please note that we do not control, and are not responsible for, other uses of your personal information by Google. We recommend that you review Google's privacy policy to understand how they collect, use, and share your personal information.</p>
            <p>Our use of information received from Google APIs will adhere to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank">Google API Services User Data Policy</a>, including the Limited Use requirements.</p>

            <h2 id="international">6. Is Your Information Transferred Internationally?</h2>
            <em>In Short: We may transfer, store, and process your information in countries other than your own.</em>
            <p>Our servers are located in various regions via Supabase infrastructure. Regardless of your location, please be aware that your information may be transferred to, stored by, and processed by us in our facilities and in the facilities of the third parties with whom we may share your personal information, including facilities in South Korea and other countries.</p>
            <p>If you are a resident in the European Economic Area (EEA), United Kingdom (UK), or Switzerland, please be aware that these countries may not have data protection laws as comprehensive as those in your country. However, we will take all necessary measures to protect your personal information in accordance with this Privacy Notice and applicable law.</p>

            <h2 id="retention">7. How Long Do We Keep Your Information?</h2>
            <em>In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.</em>
            <p>We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law. When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information.</p>

            <h2 id="minors">8. Do We Collect Information From Minors?</h2>
            <em>In Short: We do not knowingly collect data from or market to children under 18 years of age.</em>
            <p>We do not knowingly collect, solicit data from, or market to children under 18 years of age. By using the Services, you represent that you are at least 18 years old. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at <a href="mailto:support@lexivo.io">support@lexivo.io</a>.</p>

            <h2 id="privacy-rights">9. What Are Your Privacy Rights?</h2>
            <em>In Short: You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.</em>
            <p><strong>Withdrawing your consent:</strong> If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us at <a href="mailto:support@lexivo.io">support@lexivo.io</a>.</p>
            <h3>Account Information</h3>
            <p>If you would at any time like to review or change the information in your account or terminate your account, you can contact us at <a href="mailto:support@lexivo.io">support@lexivo.io</a>.</p>
            <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements.</p>

            <h2 id="dnt">10. Controls for Do-Not-Track Features</h2>
            <p>Most web browsers and some mobile operating systems include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this Privacy Notice.</p>

            <h2 id="updates">11. Do We Make Updates to This Notice?</h2>
            <em>In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws.</em>
            <p>We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Last updated" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this Privacy Notice frequently to be informed of how we are protecting your information.</p>

            <h2 id="contact">12. How Can You Contact Us About This Notice?</h2>
            <p>If you have questions or comments about this notice, you may contact us at:</p>
            <div className="inset-block">
              <strong>Lexivo</strong><br/>
              South Korea<br/>
              <a href="mailto:support@lexivo.io">support@lexivo.io</a>
            </div>

            <h2 id="delete">13. How Can You Review, Update, or Delete the Data We Collect From You?</h2>
            <p>Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law.</p>
            <p>To request to review, update, or delete your personal information, please email us at <a href="mailto:support@lexivo.io">support@lexivo.io</a>.</p>
          </div>
        </div>
      </div>
    </>
  )
}