<script>
  import BigText from "$lib/components/typography/BigText.svelte";
  import Section from "../Section.svelte";
  const bigText = `terms of use<span class="text-saffron-400">.</span>`;
</script>

<BigText text={bigText} />

<div class="space-y-8">
  <Section
    sectionBigText="Acceptance of Terms"
    sectionSmallText="At BCF, we respect your privacy needs. By using or accessing our Sites and Services (defined below) in any manner, you accept the practices and policies outlined in the Privacy Notice and these Terms of Service."
  />
  <Section
    sectionBigText="User Responsibilities"
    sectionSmallText="You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
  />
  <Section
    sectionBigText="Intellectual Property Rights"
    sectionSmallText="
  
  All intellectual property rights associated with the software component of BCF are owned by Danila Volkov. The Browse page is based on <a href'https://ifrafragrance.org/priorities/ingredients/glossary' class='text-saffron-400'> IFRA's Fragrance Ingredient Glossary</a>. BCF is distributed under the GNU License. For more information, see the <a href='https://github.com/noxlovette/BCF/blob/main/LICENSE.md'>License</a>.
  
  "
  />
  <Section
    sectionBigText="Content guidelines"
    sectionSmallText="
  
  Your contributions and submissions to the platform should be related to perfumery. You are not allowed to advertise products or services or promote anything. We reserve the right to moderate your contributions and suspend your account if you do not follow these guidelines.

  "
  />

  <Section
    sectionBigText="Limitation of Liability"
    sectionSmallText="
  BCF is not responsible for any damages or losses arising from users' use of the platform or reliance on its content. The platform may contain errors, as the world of perfumery evolves daily, and the database might not always reflect current IFRA regulations or other standards. Additionally, as the database changes over time through user contributions, the accuracy and completeness of information may vary.


  "
  />

  <Section
    sectionBigText="Dispute Resolution"
    sectionSmallText="
  Any disputes will be resolved through arbitration or mediation in accordance with EU legislation.

  "
  />

  <Section
    sectionBigText="Changes to Terms"
    sectionSmallText="
We periodically review and update these Terms of Service to reflect new Services or changes to our practices. You can determine when these Terms were last revised by referring to the 'Last Updated' date at the bottom of this document. We encourage you to review the Terms whenever you interact with us to stay informed about our practices and the ways you can help protect your privacy.

"
  />
  <Section
    sectionBigText="Contact Us"
    sectionSmallText="
If you have any questions about this Notice or our privacy practices, <a class='text-saffron-400' href='/paperwork/contact-us'>please contact us</a>.
"
  />

  <Section
    sectionBigText=""
    sectionSmallText="
    <i>These terms were last updated on 19.05.2024.</i>
    "
  />
</div>
