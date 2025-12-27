import { connectDB } from "./config/db";

import bcrypt from "bcrypt"
import { User } from "./models/user";
import { Course } from "./models/course";
import { Enrollment } from "./models/enrollment";
import { Review } from "./models/review";
async function seed(){
    try{
        await connectDB();

        // clear existing data optional
        await User.deleteMany({});
        await Course.deleteMany({});

        // create user first (instructor and students)
        const instructors = await createInstructors();
        const students = await createStudens();

        // create courses(need instructor IDs)
        const courses = await createCourses(instructors);

        // create enrollments (need user and courseIDs)
        await createEnrollments(students, instructors);

        // create reviews (need user and courseIDs)
        await createReviews(students, courses)

        console.log("Seed data created successfully");
        process.exit(0);
    }catch(error){
        console.error("Error seeding data", error)
    }
}

async function createInstructors(){
    const hashedPassword = await bcrypt.hash("password123", 10)
    const instructors = await User.insertMany([
        {
            email: 'instructor1@gmail.com',
            password: hashedPassword,
            name: 'John Instructor',
            role: 'instructor'
        },
        {
            email: 'instructor2@gmail.com',
            password: hashedPassword,
            name: 'Jane Teacher',
            role: 'instructor'
        }
    ])
    return instructors;
}

async function createStudens(){
    const hashedPassword = await bcrypt.hash("password123", 10);
    const users = await User.insertMany([
        {
            email: 'student1@gmail.com',
            password: hashedPassword,
            role: 'student',
            name: 'Alice student'
        },
        {
            email: 'student2@gmail.com',
            password: hashedPassword,
            role: 'student',
            name: 'Bob student'
        }
    ])
    return users;
}

async function createCourses(instructors: any[]){
    const courses = await Course.insertMany([
        {
            category: 'programming',
            description: 'Learn typesciprt fundaments ',
            title: 'Introduction to Typescript',
            price: 5000,
            instructorId: instructors[0]._id
        },
        {
            category: 'web development',
            description: 'Master HTML, CSS and Javascript',
            title: 'Introduction to Web dev',
            price: 4000,
            instructorId: instructors[1]._id
        },
    ])
    return courses
}

async function createEnrollments(students: any[], courses: any[]){
    await Enrollment.insertMany([
        {
            userId: students[0]._id,
            courseId: courses[0]._id
        },
        {
            userId: students[1]._id,
            courseId: courses[0]._id
        }
    ])
}

async function createReviews(students: any[], courses: any[]){
    await Review.insertMany([
        {
            userId: students[0]._id,
            courseId: courses[0]._id,
            comment: "Great course!",
            rating: 5,
        },
        {
            userId: students[0]._id,
            courseId: courses[1]._id,
            comment: "Great course!",
            rating: 5,
        }
    ])
}

seed();