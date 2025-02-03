<script>
  import BigText from "$lib/components/BigText.svelte";
  import Section from "../Section.svelte";
  const bigText = `privacy policy<span class="text-gold-400">.</span>`;
</script>

<div
  class="py-12 text-justify text-pretty sm:py-8 md:py-12 lg:py-14 xl:py-12 2xl:py-28"
>
  <div class="lowercase">
    <BigText text={bigText} />
  </div>

  <div
    class="mx-auto grid max-w-4xl grid-cols-1 items-start gap-8 px-4 py-8 pb-12 text-pretty sm:px-6 md:py-16 lg:grid lg:gap-x-8 lg:px-8 lg:py-24 xl:gap-x-24 xl:gap-y-12"
  >
    <Section
      sectionBigText="General"
      sectionSmallText="At BCF, we respect customers' need for privacy. We offer our Sites and Services (defined below) to users directly. By using or accessing our Sites and Services in any manner, you accept the practices and policies outlined in this Privacy Notice and you acknowledge that we may process and share your information."
    />
    <Section
      sectionBigText="About BCF Products and Services"
      sectionSmallText="BCF is a web platform made for people interested in perfumery. The user is free to browse the database, which is based on information the <a class='text-gold-400' href='https://ifrafragrance.org/priorities/ingredients/glossary'>IFRA Fragrance Ingredient Glossary,</a> developed by The International Fragrance Association. The user is free to store their subjective opinion on certain ingredients that they see as part of their collection. They can also create and manage their perfume formulas. The user may contribute to the project's knowledge base, which is encouraged. The collect and formulate parts of the website are encrypted."
    />
    <Section
      sectionBigText="Information We Collect"
      sectionSmallText="
  
  We use <a class='text-gold-400' href='https://sentry.io'>Sentry </a> to track crashes and unexpected behaviour on the website. Apart from that, there is nothing personal we collect from you. You are not required to provide a valid email address, or give your name. We don't care.

  <p class='font-extrabold mt-10 text-3xl'>Information you provide</p>
  <ul class='mt-4 space-y-4 list-disc'>
    <li><b>Contact information.</b> Contact Information. We collect your contact information if and only if you create your own account. This information includes your email address.</li>
    <li><b>Account Information.</b> We collect information you provide to us to create, update, or administer your account on the Sites & Services, such as email and username. We do not require your real name or address or whatever. </li>
    <li><b>Contributions.</b> You as a registered user gain the opportunity to contribute to the platform. This might include any number of perfume compounds you want to comment and any amount of information you want to add. Each of your contributions is bound to your user id, and your account is associated with that element in BCF's knowledge base. Once contributed, the data becomes part of BCF and cannot be removed even in the event of your account deletion.</li>
    <li><b>Troubleshooting and Support Information.</b> We collect the information you provide when you contact us for support.</li>
    <li><b>Any Information You Voluntarily Provide to Us.</b> For example, when you provide feedback on your experience with our app.</li>
    </ul>

    <p class='font-extrabold mt-10 text-3xl'>Information we collect automatically</p>
  <ul class='mt-4 space-y-4 list-disc'>
    <li><b>Service-Generated Information.</b> We collect and use information generated from using our Services and Sites, such as log files, Internet Protocol (IP) address, location information derived from your IP address, proxy server, diagnostics, capacity and usage information to determine storage requirements, performance information from our servers, data settings, and system configurations, including your elected privacy and security settings.</li>
    <li><b>API Information.</b> We collect functional data and customer-initiated events (i.e., authentication token, database URL, etc.) from Third-Party Services that connect or integrate with BCF’s Services.
    </li>
    <li><b>Cookies.</b> The only cookie files we use are the ones that let the web app work. We DO NOT collect your data, your behaviour, etc. Not interested. If you want to turn off cookies, you can do so via your browser, but the app will not work.</li>
    <li><b>Sentry tracking data.</b> We use Sentry to track crashes and unexpected behaviour on the website. This data is not shared with anyone and is used only for the purpose of improving the website. Feel free to turn off tracking on this website. Do consider that the more feedback we get the better the app becomes.</li>
  </ul>
  
  
  "
    />
    <Section
      sectionBigText="How We Use Information"
      sectionSmallText="
  
  We use your information as described in this Notice to provide our Sites and Services. For example, we may use your information in the following ways:
  <ul class='mt-4 space-y-4 list-disc'>
    <li><b>Service Operation.</b> To operate and administer our Sites and provide, operate, deliver, monitor, and maintain our Services, including troubleshooting, system maintenance and upgrades.</li>
    <li><b>Support.</b> To provide Customer assistance and technical support, such as responding to your requests and inquiries.
    </li>
    <li><b>Security.</b> To detect, investigate, prevent, protect against and respond to potential threats, fraudulent transactions, unauthorised access, and other malicious, deceptive, fraudulent, or illegal activity.</li>
    <li><b>Legal, Safety, and Compliance.</b> To comply with applicable laws and regulations or a court or legal order, and to review compliance with applicable terms.</li>
    <li><b>Research and Development.</b> To conduct research and development activities to improve our Sites and Services, including adding new features or capabilities.</li>
    <li><b>For Any Other Purposes with Your Consent.</b> We may use your information for any other purpose for which we have your consent.</li>
  </ul>

  "
    />

    <Section
      sectionBigText="How We Disclose Information"
      sectionSmallText="
  We only disclose information on a need-to-know basis where appropriate safeguards and contractual arrangements are in place and as described below.
  <p class='mt-4'><b>Third-Party Service Providers.</b> We disclose information with third-party service providers that require access to information to support our operations and delivery of our Sites and Services. The third parties that BCF discloses your information with may include:</p>
  <ul class='mt-4 space-y-4 list-disc'>

    <li><b>Cloud providers.</b> To provide data hosting, data storage and content delivery network services.</li>
    <li><b>Domain.</b> Domain registrars, registries and other domain name service providers for the purposes of domain registration and listing via the WHOIS protocol.
    </li>
  </ul>
  



  "
    />

    <Section
      sectionBigText="How We Protect Information"
      sectionSmallText="
  <div class='space-y-4'>
  <p>We use reasonable and appropriate administrative, technical, and physical safeguards designed to protect the information that we have about you from unauthorised or unlawful access, use, modification, destruction, loss, alteration and/ or disclosure.</p>

  <p>The encrypted part of your experience with the website, namely, your custom ingredients, formulas, your subjective views on certain perfume compounds are encrypted. We cannot name the standard out of security reasons, but this is the industry's top encryption method. This is NOT end-to-end encryption, though. That means, we can hypothetically manually decrypt your data. We vow not to do so unless required by you. This is our moral obligation.</p>

  <p>We require third parties acting on our behalf or with whom we disclose your information to provide security measures in accordance with industry standards and in compliance with contractual obligations, their privacy and security obligations, and any other appropriate confidentiality and security measures. We are not responsible for the privacy and security practices of such third parties outside the information we receive from or disclose to them. Notwithstanding our security safeguards, it is impossible to guarantee absolute security in all situations.</p>
  </div>

  "
    />

    <Section
      sectionBigText="Data Deletion"
      sectionSmallText="
You are free to delete your account and all data connected to it in your profile, the settings subsection. The only information that will not be deleted are your contributions to the knowledge base. For more information about how contributions work, see the 'information you provide' section of this privacy policy.

"
    />

    <Section
      sectionBigText="Third-Party Software"
      sectionSmallText="
Our Sites and Services may contain links to or integrations with other websites or applications not operated or controlled by BCF ('Third-Party Services'). Certain Third-Party Services used to navigate to and from our Sites and Services have separate user terms and privacy notices that are independent of this Notice. We are not responsible for the content, accuracy, or opinions expressed in such Third-Party Services. We do not monitor or check these Third-Party Services for accuracy or completeness. We recommend carefully reviewing the terms and privacy notices of each Third-Party Service prior to use in alignment with your specific compliance, privacy, and security requirements.

"
    />
    <Section
      sectionBigText="Dispute Resolution"
      sectionSmallText="
Arbitration or mediation of any disputes will be conducted according to the EU legislation

"
    />
    <Section
      sectionBigText="Changes to this Privacy Notice"
      sectionSmallText="
We periodically review and update this Notice to describe new Services or changes to our practices. You can determine when this Notice was last revised by referring to the 'Last Update' date at the bottom of this Notice. We encourage you to review the Notice whenever you interact with us to stay informed about our privacy practices and the ways that you can help protect your privacy.
"
    />

    <Section
      sectionBigText="Contact Us"
      sectionSmallText="
If you have any questions about this Notice or our privacy practices, <a class='text-gold-400' href='/paperwork/contact-us'>please contact us</a>.
"
    />

    <BigText
      text="We are committed to protecting your privacy<span class='text-gold-400'>.</span>"
    />
    <Section
      sectionBigText=""
      sectionSmallText="
    <i>This Notice was last updated on 19.05.2024.</i>
    "
    />
  </div>
</div>
