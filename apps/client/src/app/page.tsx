'use client';

import { Button } from '@/components/ui/button';
import { APP_NAME } from '@/lib/constants';
import { motion } from 'framer-motion';
import { CheckCircle, Github, List } from 'lucide-react';
import { Aubrey } from 'next/font/google';
import Link from 'next/link';

const aubrey = Aubrey({
  weight: '400',
  subsets: ['latin'],
});

/**
 * Renders the landing page of the application
 */
export default function LanderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800 flex flex-col justify-center items-center p-8 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="max-w-4xl mx-auto text-center mb-16"
      >
        <h1
          className={`${aubrey.className} font-bold text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-6`}
        >
          {APP_NAME}
        </h1>
        <h2 className="text-4xl font-light text-gray-700 mb-8">
          Streamline your workflow. Manage projects. Conquer tasks.
        </h2>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.5,
            type: 'spring',
            stiffness: 260,
            damping: 20,
          }}
        >
          <Button
            asChild
            className="px-8 py-6 text-lg rounded-full shadow-lg"
            variant="default"
          >
            <Link
              href="/projects"
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
            >
              Get Started
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 1, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16"
      >
        <FeatureItem
          icon={<List className="w-12 h-12 text-blue-500" />}
          title="Organize Projects"
          description="Create and manage multiple projects with ease. Keep all your tasks organized in one place."
        />
        <FeatureItem
          icon={<CheckCircle className="w-12 h-12 text-green-500" />}
          title="Track Todos"
          description="Add, edit, and complete todos within your projects. Stay on top of your tasks and boost productivity."
        />
        <FeatureItem
          icon={<Github className="w-12 h-12 text-purple-500" />}
          title="Export to GitHub"
          description="Generate secret gists for project summaries. Share your progress or backup your data effortlessly."
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 1 }}
        className="text-center"
      >
        <p className="text-gray-600 mb-4">
          Join thousands of satisfied users today!
        </p>
        <div className="flex justify-center space-x-4">
          {['Trusted', 'Secure', 'Efficient'].map((tag, index) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 + index * 0.1, duration: 0.5 }}
              className="bg-white bg-opacity-50 px-4 py-2 rounded-full text-sm font-medium text-gray-700"
            >
              {tag}
            </motion.span>
          ))}
        </div>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
    </div>
  );
}

type FeatureItemProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-white bg-opacity-50 backdrop-filter backdrop-blur-lg rounded-xl p-6 shadow-lg"
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 bg-white rounded-full shadow-md">{icon}</div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
}
