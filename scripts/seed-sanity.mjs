import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !token) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN are required.",
  );
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2026-07-31",
  useCdn: false,
});

const listings = {
  "latest-jobs": [
    [
      "Rajasthan State Eligibility Test SET Online Form 2026 | Date Extended",
      "https://example.com/2026/rajasthan-set-jun/",
    ],
    [
      "Rajasthan RVUNL Junior Engineer & Other Post Online Form 2026",
      "https://example.com/2026/rvunl-june26/",
    ],
    [
      "JSSC JILCCE Inter Level Online Form 2026",
      "https://example.com/2026/jssc-jilcce-inter-level-july26/",
    ],
    [
      "Patna High Court Assistant Online Form 2026",
      "https://example.com/2026/patna-high-court-july26/",
    ],
    [
      "UP Anganwadi Worker Bharti Online Form 2026",
      "https://example.com/2026/up-anganwadi-worker/",
    ],
    [
      "CCRUM Various Post Online Form 2026",
      "https://example.com/2026/ccrum-various-post-jul26/",
    ],
  ],
  results: [
    [
      "UP DELED 2022, 2024 Semester Exam Result 2026",
      "https://example.com/2021/up-btc-deled-result/",
    ],
    [
      "DSSSB PGT Math Cutoff and Marks 2026",
      "https://example.com/delhi/dsssb-latest-result/",
    ],
    [
      "UP Police Constable Result 2026",
      "https://example.com/2026/up-police-constable-jan26/",
    ],
    [
      "UPPSC GIC Lecturer Result 2026 Update",
      "https://example.com/2025/uppsc-gic-lecturer-2025/",
    ],
    [
      "SWD UP IAS PCS Free Coaching Admissions 2026 Result",
      "https://example.com/2026/swd-up-free-coaching-2/",
    ],
    [
      "UP PGT 2022 Final Result with Institute Details",
      "https://example.com/2022/up-pgt-02-2022/",
    ],
  ],
  "admit-cards": [
    [
      "MPESB Group 2 Sub Group 1 Exam Date Revised 2026",
      "https://example.com/2026/mpesb-group2-sub1-krashi-vistar/",
    ],
    [
      "UPSSSC Technical Assistant AGTA Exam City Details 2026",
      "https://example.com/upsssc/upsssc-technical-06-exam-2026/",
    ],
    [
      "BPSSC Havildar Instructor Exam Postponed 2026",
      "https://example.com/bihar/bpssc-havildar-05-2026/",
    ],
    [
      "Bihar Police BPSSC ASI Technical Exam Postponed 2026",
      "https://example.com/bihar/bpssc-asi-technical-07-2026/",
    ],
    [
      "Railway RRB Group D 09/2025 Revised Exam Notice 2026",
      "https://example.com/railway/rrb-group-d-cen-09-2025/",
    ],
    [
      "SSB Constable HC ASI SI PET PST Exam Date 2026",
      "https://example.com/2026/ssb-various-post-all-march/",
    ],
  ],
  "answer-keys": [
    [
      "Railway RRB Isolated Various Post Answer Key 2026",
      "https://example.com/railway/rrb-isolated-cen-08-2025/",
    ],
    [
      "UP Police Constable Final Answer Key 2026",
      "https://example.com/2026/up-police-constable-jan26/",
    ],
    [
      "Patna High Court Computer Operator Answer Key 2026",
      "https://example.com/bihar/patna-hc-computer-operator-2026/",
    ],
    [
      "Delhi High Court Higher Judicial Service Answer Key 2026",
      "https://example.com/2026/delhi-hc-hjs-july26/",
    ],
    [
      "RPSC Senior Teacher Grade II Answer Key 2026",
      "https://example.com/2026/rajasthan-rpsc-senior-teacher-07-2025/",
    ],
    [
      "UPSSSC Assistant Statistical Officer Answer Key 2026",
      "https://example.com/upsssc/upsssc-aso-05-exam-2026/",
    ],
  ],
  syllabus: [
    [
      "UPESSC Principal Syllabus 2026",
      "https://example.com/2026/upessc-principal-02-2026/",
    ],
    [
      "UPSSSC Moharir 2022 Exam Syllabus",
      "https://example.com/upsssc/upsssc-moharir-07-2022/",
    ],
    [
      "RSSB Graduate Level CET Syllabus 2026",
      "https://example.com/2026/rssb-cet-graduate-level-july26/",
    ],
    [
      "UPSSSC Pharmacist Ayurvedic 2024 Syllabus",
      "https://example.com/upsssc/upsssc-pharmaceutical-01-2024/",
    ],
    [
      "Rajasthan RSSB Senior Secondary CET Syllabus 2026",
      "https://example.com/2026/rssb-cet-june26/",
    ],
    [
      "UPSSSC Auditor and Assistant Accountant Syllabus 2026",
      "https://example.com/2026/upsssc-14-exam-2026/",
    ],
  ],
  admissions: [
    [
      "NVS Class 6 Admissions Online Form 2027 | Date Extended",
      "https://example.com/2026/nvs-class-6th-admission-july26/",
    ],
    [
      "UP DELED Admissions Online Form 2026 | Date Extended",
      "https://example.com/2026/updeled-admissions-2/",
    ],
    [
      "CLAT 2027 Admission Online Form",
      "https://example.com/2026/clat-admission-jul26/",
    ],
    [
      "IIM CAT Admission Online Form 2026",
      "https://example.com/2026/iim-cat-jul26/",
    ],
    [
      "UP Scholarship Online Form 2026-2027",
      "https://example.com/2026/up-scholarship-postmatric-jul26/",
    ],
    [
      "IIT GATE 2027 Online Form",
      "https://example.com/2027/gate-2027/",
    ],
  ],
  scholarships: [
    [
      "E Shram Card Online Registration 2022",
      "https://example.com/2022/e-sharam-uan-card/",
    ],
    [
      "UP Dashmottar Scholarship 2021 Online Form",
      "https://example.com/2021/up-scholarship-2021/",
    ],
    [
      "UP Class 11th and 12th Scholarship 2021 Online Form",
      "https://example.com/2021/up-scholarship-2021/",
    ],
    [
      "UP Scholarship 2021 Online Form",
      "https://example.com/2021/up-scholarship-2021/",
    ],
    [
      "UP Scholarship Class 9 to 12 Online Form",
      "https://example.com/2020/up-scholarship-pre-post/",
    ],
    [
      "UP Free Coaching Waiting List 2019",
      "https://example.com/page/swdcoaching/",
    ],
  ],
};

const categoryLabels = {
  "latest-jobs": "Recruitment update",
  results: "Result released",
  "admit-cards": "Exam update",
  "answer-keys": "Answer key released",
  syllabus: "Syllabus available",
  admissions: "Admission update",
  scholarships: "Scholarship update",
};

const linkTypes = {
  "latest-jobs": "apply",
  results: "result",
  "admit-cards": "admit-card",
  "answer-keys": "answer-key",
  syllabus: "syllabus",
  admissions: "apply",
  scholarships: "apply",
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 88);
}

const organisation = {
  _id: "sample-organisation-various-authorities",
  _type: "organisation",
  name: "Various Government and Educational Authorities",
  shortName: "Issuing Authorities",
  slug: { _type: "slug", current: "various-issuing-authorities" },
  governmentLevel: "other",
  officialWebsite: "https://www.india.gov.in/",
  description:
    "Placeholder organisation for imported sample listings. Replace it with the applicable issuing authority before production use.",
};

const now = new Date().toISOString();
const documents = Object.entries(listings).flatMap(([category, items]) =>
  items.map(([title, sourceUrl], index) => {
    const slug = slugify(title);
    const key = `${category}-${index + 1}`;
    return {
      _id: `sample-notification-${slug}`,
      _type: "notification",
      title,
      slug: { _type: "slug", current: slug },
      category,
      organisation: {
        _type: "reference",
        _ref: organisation._id,
      },
      updateMetadata: {
        referenceNumber: "Sample import",
        updateLabel: categoryLabels[category],
        publishedAt: now,
        updatedAt: now,
        sourceVerified: true,
      },
      shortInformation: `${title} is a sample listing prepared for portal testing. Confirm all dates, fees, eligibility requirements, vacancies and official links with the issuing authority before relying on this record.`,
      importantDates: [
        {
          _key: `${key}-date`,
          _type: "importantDate",
          label: "Current schedule",
          displayText:
            "Refer to the linked source and issuing authority notice",
          isTentative: false,
        },
      ],
      applicationFees: [],
      feePaymentMethods: [],
      ageLimits: [],
      eligibility: [
        {
          _key: `${key}-eligibility`,
          _type: "eligibilityRule",
          title: "Eligibility requirements",
          details:
            "Requirements vary by post, examination, course or scheme. Read the issuing authority's current notification before applying or checking this update.",
        },
      ],
      vacancies: [
        {
          _key: `${key}-vacancy`,
          _type: "vacancy",
          postName: title,
          totalDisplay: "See issuing authority notice",
          eligibilitySummary: "Refer to the current official notification.",
        },
      ],
      instructionsTitle: "How to use this update",
      instructions: [
        {
          _key: `${key}-step-1`,
          _type: "instruction",
          title: "Review the source listing",
          details:
            "Open the source page below and identify the latest notice or action link for this update.",
        },
        {
          _key: `${key}-step-2`,
          _type: "instruction",
          title: "Verify with the issuing authority",
          details:
            "Confirm dates, eligibility, fees and instructions on the linked authority website before taking action.",
        },
      ],
      officialLinks: [
        {
          _key: `${key}-source`,
          _type: "officialLink",
          label: "Source listing",
          linkType: linkTypes[category],
          url: sourceUrl,
          note: "Secondary source; follow its authority links and verify details.",
        },
      ],
      faqs: [
        {
          _key: `${key}-faq-1`,
          _type: "faq",
          question: "Is this the issuing authority's official notification?",
          answer:
            "No. This is a sample record. Verify every important detail on the issuing authority's website.",
        },
        {
          _key: `${key}-faq-2`,
          _type: "faq",
          question: "Can I apply or check the update from this portal?",
          answer:
            "This portal provides information and links only. Complete applications or result checks through the applicable authority website.",
        },
      ],
      editorialStatus: "published",
      featured: index === 0,
      seo: {
        title: title.slice(0, 65),
        description:
          `See the latest information and source links for ${title}. Verify details with the issuing authority.`.slice(
            0,
            160,
          ),
        noIndex: true,
      },
    };
  }),
);

let transaction = client.transaction().createOrReplace(organisation);
for (const document of documents) {
  transaction = transaction.createOrReplace(document);
}

const result = await transaction.commit({ visibility: "sync" });
console.log(
  `Published ${documents.length} sample notifications and 1 organisation to ${projectId}/${dataset}. Transaction: ${result.transactionId}`,
);
