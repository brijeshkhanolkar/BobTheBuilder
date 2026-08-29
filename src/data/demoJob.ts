import { Job } from '../types'

export const demoJob: Job = {
  title: 'Frontend Developer',
  company: 'Infosys Digital',
  description: `We are looking for an experienced frontend developer to join our product team.

Responsibilities include building responsive UIs, integrating REST APIs, writing unit tests, and working with cloud deployments on AWS.

Required: React, JavaScript, TypeScript, REST APIs, Git, Testing, AWS, Performance optimization.

Experience: 2+ years of frontend development.`,
  requiredSkills: ['React', 'JavaScript', 'TypeScript', 'REST APIs', 'Git', 'Testing', 'AWS', 'Performance optimization'],
  responsibilities: [
    'build responsive UIs',
    'integrate REST APIs',
    'write unit tests',
    'deploy to AWS',
    'optimize performance',
  ],
}
