import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js"; // Assuming you have a User model
import { Company } from "../models/company.model.js"; // Assuming you have a Company model

// Database connection configuration
const MONGODB_URI = "mongodb+srv://nagpalyashika9:f31Q0imCmQDv0zIM@cluster0.hr3wk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Predefined locations and job details
const LOCATIONS = [
  'Delhi NCR', 'Bangalore', 'Hyderabad', 
  'Pune', 'Mumbai'
];

const JOB_TITLES = {
  'Frontend Developer': [
    'React Frontend Developer',
    'Angular UI Developer',
    'Vue.js Frontend Engineer',
    'Senior Frontend Architect',
    'Frontend Web Developer'
  ],
  'Backend Developer': [
    'Node.js Backend Developer',
    'Java Backend Engineer',
    'Python Backend Developer', 
    '.NET Backend Specialist',
    'Senior Backend Architect'
  ],
  'FullStack Developer': [
    'Full Stack Web Developer',
    'MERN Stack Developer',
    'Full Stack JavaScript Engineer',
    'Senior Full Stack Developer',
    'Cloud Full Stack Developer'
  ]
};

const SALARY_RANGES = {
  '0-40k': { min: 10000, max: 40000 },
  '42-1lakh': { min: 42000, max: 100000 },
  '1lakh to 5lakh': { min: 100000, max: 500000 }
};

// Function to generate and insert fake jobs
const insertFakeJobs = async (count = 50) => {
  try {
    // First, find or create a default user and company
    let defaultUser = await User.findOne();
    if (!defaultUser) {
      defaultUser = new User({
        username: 'admin',
        email: 'admin@example.com',
        password: 'password123' // Note: Use proper password hashing in production
      });
      await defaultUser.save();
    }

    let defaultCompany = await Company.findOne();
    if (!defaultCompany) {
      defaultCompany = new Company({
        name: 'Default Tech Company',
        description: faker.company.catchPhrase(),
        location: faker.location.city()
      });
      await defaultCompany.save();
    }

    // Generate fake jobs
    const fakeJobs = Array.from({ length: count }, () => {
      // Randomly select job type and related details
      const jobType = faker.helpers.arrayElement(Object.keys(JOB_TITLES));
      const title = faker.helpers.arrayElement(JOB_TITLES[jobType]);
      const location = faker.helpers.arrayElement(LOCATIONS);
      
      // Select salary range based on job type
      const salaryRangeKey = faker.helpers.arrayElement(Object.keys(SALARY_RANGES));
      const { min, max } = SALARY_RANGES[salaryRangeKey];
      
      return {
        title: title,
        description: faker.lorem.paragraph(3),
        requirements: [
          `Proficient in ${title.split(' ')[0]} technologies`,
          `${faker.number.int({ min: 1, max: 5 })}+ years of experience`,
          faker.lorem.sentence()
        ],
        salary: faker.number.int({ min, max }),
        salaryRange: salaryRangeKey,
        experienceLevel: faker.number.int({ min: 0, max: 10 }),
        location: location,
        jobType: faker.helpers.arrayElement(["Full-time", "Part-time", "Contract"]),
        industry: jobType,
        position: faker.number.int({ min: 1, max: 10 }),
        company: defaultCompany._id,
        created_by: defaultUser._id,
        skills: [
          faker.helpers.arrayElement(['React', 'Node.js', 'Python', 'Java', 'AWS']),
          faker.helpers.arrayElement(['MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes']),
          faker.helpers.arrayElement(['GraphQL', 'TypeScript', 'CI/CD', 'Microservices'])
        ],
        applications: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    const result = await Job.insertMany(fakeJobs);
    console.log(`${result.length} fake job records inserted successfully!`);
  } catch (error) {
    console.error("Error inserting fake jobs:", error);
  }
};

// Connect to MongoDB and seed jobs
const main = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected successfully");
    
    // Clear existing jobs first
    await Job.deleteMany({});
    
    // Insert new fake jobs
    await insertFakeJobs(50); // Insert 50 fake job entries
  } catch (error) {
    console.error("Seeding process failed:", error);
  } finally {
    await mongoose.connection.close();
  }
};

// Execute the main function
main().catch(console.error);