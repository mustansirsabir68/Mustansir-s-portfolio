//////////////////////////////////////// ** HEADER / HERO SECTION **///////////////////////////////////////////

// your_info.jsx

import fmbProjectImage from './assets/images/fmb-project.webp';
import portfolioProjectVideo from './assets/images/portfolio-preview-web.mp4';
import portfolioProjectImage from './assets/images/portfolio-preview.jpg';


// Enter here your first and last name
const name = {
  firstname: 'Mustansir',
  lastname: 'Sabir',
// Enter as url a link where your resume can be downloaded ( dropbox, OneDrive, ect )
  url: 'https://drive.google.com/file/d/1Bv8H_sXpvH7pASD0-GZH3Du1uk29VvYe/view?usp=sharing',
};

// Social media profiles buttons
const socialProfiles = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/mustansir-sabir-139495206',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/mustansirsabir68',
  },
  //   Add more social profiles here, it will automatically add more link-buttons with icons (if available)
  //   {
  //     name: 'Twitter',
  //     url: 'https://twitter.com/your-username',
  //   },
];

//////////////////////////////////////// ** CONTENT SECTION **//////////////////////////////////////////////////


const categories = [
  {
    name: 'Web Development',
    title: 'Full‑Stack .NET Development',
    description:
      "Built scalable RESTful APIs, responsive Blazor/Telerik UI components, and customized DNN CMS modules. Demonstrated versatility across backend, frontend, and enterprise integrations with consistent on‑time delivery.",
    skills: [
      {
        title: 'Web Development',
      },
      {
        title: 'Frontend Design',
      },
      {
        title: 'Backend API',
      },
    ],
  },
  {
    name: 'Software',
    title: 'Performance Optimization',
    description:
    "Delivered measurable speed gains by reducing query execution time up to 73% and sustaining 99.9% uptime for high‑volume enterprise applications. Specialized in SQL tuning, caching strategies, and API performance improvements.",
    skills: [
      {
        title: 'Performance Metrics',
      },
      {
        title: 'Speed Optimization',
      },
      {
        title: 'Measurable Improvements'
      },
     
      
    ],
  },
  {
    name: 'brands',
    title: 'Enterprise Security Solutions',
    description:
    "Engineered secure modules and applied OWASP best practices to remediate vulnerabilities, strengthen CSP compliance, and safeguard enterprise systems against XSS, CSRF, and unauthorized access attempts.",
    skills: [
      {
        title: 'Security',
      },
      {
        title: 'Authentication',
      },
      {
        title: 'Enterprise‑grade Defense',
      },
      
    ],
  },
  
];

// If you already have some projects, fill the url 
const projectData = [
  {
    title: 'FMB Malegaon',
    description: 'A meal-count system that keeps daily food preparation matched to who is actually eating. Blazor and SQL Server handle stop/start Thaali management, conditional adult and child counts, and PDF reports of daily participation, replacing manual tallies with numbers the kitchen can plan against.',
    category: 'OPERATIONS PLATFORM',
    technologies: ['Blazor', 'C#', 'SQL Server', 'Reporting'],
    githubUrl: 'https://github.com/mustansirsabir68/FMBMalegaonJamaat',
    demoUrl: fmbProjectImage
  },
  {
    title: "Mustansir's Portfolio",
    description: 'This site: a React and Vite portfolio built around a draggable 3D ID card, an assistant that answers questions about my work, and a résumé match tool. Built for fast loads and keyboard access, and wired to the same API that powers the assistant.',
    category: 'PERSONAL BRAND',
    technologies: ['React', 'Vite', 'Responsive UI', 'UX'],
    githubUrl: 'https://github.com/mustansirsabir68/Mustansir-s-portfolio',
    demoUrl: portfolioProjectImage,
    demoVideo: portfolioProjectVideo
  },
  
];


//////////////////////////////////////// ** FOOTER SECTION **//////////////////////////////////////////////////



// You can tell something about yourself in the infotext.
const aboutMeText = {
  infotext: `Software engineer with four years building scalable, secure enterprise applications on the Microsoft .NET stack. My work sits in performance optimization, REST APIs and security remediation: a 73% cut in query execution time, 99.9% uptime on high-volume systems, and 95% on-time delivery in Agile teams. I write C#, ASP.NET, Blazor and SQL, and I care most about systems that stay fast and predictable under real load.
    `,
  power_slogan: `Building fast, secure, and reliable systems that scale with confidence.`,
};

export {
  name,
  socialProfiles,
  categories,
  projectData,
  aboutMeText,
};
