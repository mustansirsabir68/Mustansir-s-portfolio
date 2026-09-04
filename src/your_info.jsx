//////////////////////////////////////// ** HEADER / HERO SECTION **///////////////////////////////////////////

// your_info.jsx

const backgroundImageUrl = 'src/assets/images/developer.jpg';


// Enter here your first and last name
const name = {
  firstname: 'Mustansir',
  lastname: 'Sabir',
// Enter as url a link where your resume can be downloaded ( dropbox, OneDrive, ect )
  url: 'https://drive.google.com/file/d/1Bv8H_sXpvH7pASD0-GZH3Du1uk29VvYe/view?usp=sharing',
};

// Display your job title or skills or whatever you want in the typewriter
const typeWriterText = [
  'Full‑stack Dev...',
  'AI Fan...',
  'Cool dude...'  
];

// Social media profiles buttons
const socialProfiles = [
  {
    name: 'LinkedIn',
    icon: 'lni lni-linkedin',
    url: 'https://www.linkedin.com/in/mustansir-sabir-139495206',
  },
  {
    name: 'GitHub',
    icon: 'lni lni-github',
    url: 'https://github.com/mustansirsabir68',
  },
  //   Add more social profiles here, it will automatically add more link-buttons with icons (if available)
  //   {
  //     name: 'Twitter',
  //     icon: 'lni lni-twitter',
  //     url: 'https://twitter.com/your-username',
  //   },
  //   {
  //     name: 'Facebook',
  //     icon: 'lni lni-facebook',
  //     url: 'https://facebook.com/your-username',
  //   },
];

//////////////////////////////////////// ** CONTENT SECTION **//////////////////////////////////////////////////


const categories = [
  {
    name: 'Web Development',
    icon: 'lni lni-code',
    title: 'Full‑Stack .NET Development',
    description:
      "Built scalable RESTful APIs, responsive Blazor/Telerik UI components, and customized DNN CMS modules. Demonstrated versatility across backend, frontend, and enterprise integrations with consistent on‑time delivery.",
    skills: [
      {
        icon: 'lni lni-code',
        title: 'Web Development',
      },
      {
        icon: 'lni lni-layout',
        title: 'Frontend Design',
      },
      {
        icon: 'lni lni-laptop',
        title: 'Backend API',
      },
    ],
  },
  {
    name: 'Software',
    icon: 'lni lni-code',
    title: 'Performance Optimization',
    description:
    "Delivered measurable speed gains by reducing query execution time up to 73% and sustaining 99.9% uptime for high‑volume enterprise applications. Specialized in SQL tuning, caching strategies, and API performance improvements.",
    skills: [
      {
        icon: 'lni lni-dashboard',
        title: 'Performance Metrics',
      },
      {
        icon: 'lni lni-timer',
        title: 'Speed Optimization',
      },
      {
        icon: 'lni lni-stats-up',
        title: 'Measurable Improvements'
      },
     
      
    ],
  },
  {
    name: 'brands',
    icon: 'lni lni-code',
    title: 'Enterprise Security Solutions',
    description:
    "Engineered secure modules and applied OWASP best practices to remediate vulnerabilities, strengthen CSP compliance, and safeguard enterprise systems against XSS, CSRF, and unauthorized access attempts.",
    skills: [
      {
        icon: 'lni lni-shield',
        title: 'Security',
      },
      {
        icon: 'lni lni-lock',
        title: 'Authentication',
      },
      {
        icon: 'lni lni-protection',
        title: 'Enterprise‑grade Defense',
      },
      
    ],
  },
  
];

// Here you can give in your achiements in a number counter animation
const achievements = [
  { word: 'On‑time Delivery', value: 95, unit: '%' },
  { word: 'Database Response Optimization', value: '73', unit: '%' },
  { word: 'experience', value: 4, unit: ' years' },
];



// If you already have some projects, fill the url 
const projectData = [
  {
    title: 'FMB Malegaon',
    description: 'Designed and implemented a system to manage meal counts for adults and children, ensuring accurate food preparation and minimizing wastage. Built using Blazor, SQL Server, HTML, JavaScript, and C#, the project included features such as stop/start Thaali management, conditional count logic, and PDF report generation. Reports tracked daily participation, highlighting how many users opted in or out, enabling precise meal planning. The solution demonstrated expertise in full‑stack development, database optimization, and reporting automation for real‑world operational efficiency',
    category: 'OPERATIONS PLATFORM',
    technologies: ['Blazor', 'C#', 'SQL Server', 'Reporting'],
    githubUrl: 'https://github.com/mustansirsabir68/FMBMalegaonJamaat',
    demoUrl: 'src/assets/images/fmb-project.png' 
  },
  {
    title: 'Mustansir\'s Portfolio Website ',
    description: 'Designed and developed a personal portfolio website to showcase projects, skills, and achievements with a clean, responsive UI. Built using modern web technologies and optimized for performance, accessibility, and scalability, the site highlights expertise in .NET, SQL, and security practices while providing an engaging user experience.',
    category: 'PERSONAL BRAND',
    technologies: ['React', 'Vite', 'Responsive UI', 'UX'],
    githubUrl: 'https://github.com/mustansirsabir68/Mustansir-s-portfolio',
    demoUrl: 'src/assets/images/Mustansir Sabir Template.gif' 
  },
  
];


//////////////////////////////////////// ** FOOTER SECTION **//////////////////////////////////////////////////



// You can tell something about yourself in the infotext.
const aboutMeText = {
  infotext: `Hi, I am Mustansir Sabir, a Software Engineer with 4 years of experience delivering scalable, secure enterprise applications across the Microsoft .NET ecosystem. My expertise spans performance optimization, RESTful API development, and enterprise security remediation, with proven results such as reducing query execution time by 73% and sustaining a 95% on‑time delivery rate in Agile teams. Skilled in C#, ASP.NET, Blazor, SQL, and microservices, I focus on building solutions that balance speed, security, and reliability while enhancing user experience. Passionate about continuous learning, I bring a pragmatic approach to solving complex problems and driving impactful results.
    `,
  power_slogan: `Building fast, secure, and reliable systems that scale with confidence.`,
};

// For contact form: You need to make an account on emailjs.com
// There you can choose a free tier ( 200 emails per month )
// In your account settings you can see 'serviceID, templateID and userID. 
// Fill them here and it will automatically work. 

const emailConfig = {
  serviceID: 'service_XXXXXXX',
  templateID: 'template_XXXXXXXX',
  userID: 'XXXXXXXXXXXX',
};

export {
  backgroundImageUrl,
  name,
  typeWriterText,
  socialProfiles,
  categories,
  achievements,
  projectData,
  aboutMeText,
  emailConfig,
};
