
import { User, Post, Comment } from '../types';

export const dummyUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    imageUrl: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: "2",
    name: "Michael Chen",
    imageUrl: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: "3",
    name: "Emma Wilson",
    imageUrl: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: "4",
    name: "David Brown",
    imageUrl: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: "5",
    name: "Lisa Anderson",
    imageUrl: "https://randomuser.me/api/portraits/women/5.jpg"
  }
];

export const dummyPosts: Post[] = [
  {
    id: "1",
    userId: "1",
    title: "The Future of AI in Social Media",
    content: "Artificial Intelligence is revolutionizing how we interact on social platforms. From personalized content recommendations to automated moderation, AI is shaping our digital social experiences in unprecedented ways.",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    imageUrl: "https://picsum.photos/seed/ai/600/400",
    commentCount: 45
  },
  {
    id: "2",
    userId: "2",
    title: "Sustainable Living Tips",
    content: "Small changes in our daily lives can make a big impact on our planet. Here are some easy-to-implement sustainable living practices that everyone can adopt.",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    imageUrl: "https://picsum.photos/seed/eco/600/400",
    commentCount: 32
  },
  {
    id: "3",
    userId: "3",
    title: "Remote Work Best Practices",
    content: "Working remotely requires a different approach to productivity and team collaboration. These best practices will help you stay productive and connected with your team.",
    createdAt: new Date(Date.now() - 10800000).toISOString(),
    imageUrl: "https://picsum.photos/seed/work/600/400",
    commentCount: 28
  }
];

export const dummyComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    content: "This is really insightful! AI's impact on social media is fascinating."
  },
  {
    id: "2",
    postId: "1",
    content: "Great analysis of the current trends in AI and social platforms."
  },
  {
    id: "3",
    postId: "2",
    content: "These sustainable living tips are exactly what I needed!"
  }
];
