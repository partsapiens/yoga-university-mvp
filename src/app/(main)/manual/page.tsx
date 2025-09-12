import Link from 'next/link';
import { getManifest } from '@/lib/manual';
import ManualSearch from './search';
import ManualAssistant from '@/components/manual/ManualAssistant';
import QuizGenerator from '@/components/manual/QuizGenerator';
import ConceptExplainer from '@/components/manual/ConceptExplainer';
import { BookOpen, FileText, Sparkles, Brain, Lightbulb } from 'lucide-react';

export default function ManualPage() {
  const manifest = getManifest();
  const groups = Array.from(new Set(manifest.chapters.map((c) => c.group)));

  return (
    <div className="mx-auto p-4 max-w-7xl">
      <div className="prose max-w-none mb-8">
        <h1>{manifest.title}</h1>
      </div>
      
      {/* Manual Access Options */}
      <div className="grid md:grid-cols-2 gap-6 mb-8 not-prose">
        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <FileText className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold m-0">Page-by-Page Manual</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Enhanced reader with page navigation, dark mode, bookmarks, and table of contents.
          </p>
          <Link
            href="/manual/page/1"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors no-underline"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Reading
          </Link>
        </div>

        <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <BookOpen className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-xl font-semibold m-0">Chapter-Based View</h2>
          </div>
          <p className="text-gray-600 mb-4">
            Browse by topics and chapters for quick access to specific content.
          </p>
          <div className="text-green-600 font-medium">Browse below ↓</div>
        </div>
      </div>

      {/* Learning 🤖 Section */}
      <div className="mb-8 not-prose">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-2">
            <Sparkles className="w-6 h-6 text-purple-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">🤖 Learning Assistant</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Enhance your learning with intelligent tools designed to help you master yoga philosophy, 
            understand complex concepts, and test your knowledge.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Chatbot */}
          <div className="lg:col-span-1">
            <div className="mb-3 flex items-center">
              <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">🤖 Ask Questions</h3>
            </div>
            <ManualAssistant />
          </div>

          {/* Quiz Generator */}
          <div className="lg:col-span-1">
            <div className="mb-3 flex items-center">
              <Brain className="w-5 h-5 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Practice Quiz</h3>
            </div>
            <QuizGenerator />
          </div>

          {/* Concept Explainer */}
          <div className="lg:col-span-1">
            <div className="mb-3 flex items-center">
              <Lightbulb className="w-5 h-5 text-orange-500 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Concept Explainer</h3>
            </div>
            <ConceptExplainer />
          </div>
        </div>
      </div>
      
      <div className="prose max-w-none">
        <ManualSearch />
        
        {groups.map((g) => (
          <div key={g}>
            <h2>{g}</h2>
            <ul>
              {manifest.chapters
                .filter((c) => c.group === g)
                .map((c) => (
                  <li key={c.slug}>
                    <Link href={`/manual/${c.slug}`}>{c.title}</Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

