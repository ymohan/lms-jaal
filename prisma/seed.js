// prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('password', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@lms.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@lms.com',
      password: adminPassword,
      role: 'admin',
      isActive: true,
      lastLogin: new Date(),
      profile: {
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'System administrator',
      },
      preferences: {
        language: 'en',
        theme: 'light',
      }
    }
  });

  // Create teacher user
  const teacherPassword = await bcrypt.hash('password', 12);
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@lms.com' },
    update: {},
    create: {
      name: 'Teacher User',
      email: 'teacher@lms.com',
      password: teacherPassword,
      role: 'teacher',
      isActive: true,
      lastLogin: new Date(),
      profile: {
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Experienced language teacher',
      },
      preferences: {
        language: 'en',
        theme: 'light',
      }
    }
  });

  // Create student user
  const studentPassword = await bcrypt.hash('password', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@lms.com' },
    update: {},
    create: {
      name: 'Student User',
      email: 'student@lms.com',
      password: studentPassword,
      role: 'student',
      isActive: true,
      lastLogin: new Date(),
      profile: {
        avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100',
        bio: 'Eager language learner',
      },
      preferences: {
        language: 'en',
        theme: 'light',
      }
    }
  });

  // Create sample course
  const course = await prisma.course.upsert({
    where: { id: uuidv4() },
    update: {},
    create: {
      title: 'English for Beginners - स्वागत है',
      description: 'Learn English through Total Physical Response and Natural Reading methods with interactive storytelling',
      language: 'en',
      teacherId: teacher.id,
      teacherName: teacher.name,
      level: 'beginner',
      thumbnail: 'https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=400',
      duration: 120,
      methodology: ['tpr', 'natural-reading', 'joyful-learning', 'immersive-storytelling'],
      isPublished: true,
      tags: ['beginner', 'english', 'interactive'],
      prerequisites: [],
      learningObjectives: [
        'Master basic English greetings and introductions',
        'Understand simple conversations',
        'Learn through physical movement and gestures',
        'Build confidence in speaking English'
      ],
      lessons: [
        {
          id: uuidv4(),
          title: 'Greetings and Introductions',
          order: 1,
          duration: 30,
          type: 'mixed',
          isPublished: true,
          prerequisites: [],
          content: [
            {
              id: uuidv4(),
              type: 'text',
              content: 'Welcome to your first English lesson! Today we will learn basic greetings.',
              order: 1,
            },
            {
              id: uuidv4(),
              type: 'audio',
              content: 'Listen and repeat: Hello, How are you?',
              audioUrl: '/audio/greetings.mp3',
              order: 2,
            },
            {
              id: uuidv4(),
              type: 'tpr-activity',
              content: 'TPR Activity: Stand up and wave when you hear "Hello"',
              metadata: { tprAction: 'wave', difficulty: 'easy' },
              order: 3,
            },
          ],
          quiz: {
            id: uuidv4(),
            title: 'Greetings Quiz',
            description: 'Test your knowledge of basic English greetings',
            timeLimit: 300,
            passingScore: 70,
            attempts: 3,
            isRandomized: false,
            showResults: true,
            questions: [
              {
                id: uuidv4(),
                type: 'mcq',
                question: 'How do you greet someone in English?',
                options: ['Hello', 'Goodbye', 'Thank you', 'Sorry'],
                correctAnswer: 'Hello',
                explanation: 'Hello is the most common greeting in English.',
                points: 10,
                difficulty: 'easy',
                tags: ['greetings'],
                order: 1,
              },
              {
                id: uuidv4(),
                type: 'tpr',
                question: 'Show the action for greeting someone',
                correctAnswer: 'wave',
                explanation: 'Waving is a common gesture when greeting someone.',
                points: 15,
                difficulty: 'easy',
                tags: ['tpr', 'gestures'],
                metadata: { tprAction: 'wave' },
                order: 2,
              },
            ],
          },
        },
      ],
    }
  });

  // Create enrollment
  await prisma.enrollment.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course.id
      }
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
      status: 'active',
    }
  });

  // Create completion
  await prisma.completion.upsert({
    where: {
      userId_courseId: {
        userId: student.id,
        courseId: course.id
      }
    },
    update: {},
    create: {
      userId: student.id,
      courseId: course.id,
      lessonId: course.lessons[0].id,
      progress: 25,
      timeSpent: 900,
      lastAccessed: new Date(),
    }
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
