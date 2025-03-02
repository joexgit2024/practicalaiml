
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function generateEmbedding(text: string) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  try {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: text,
        model: 'text-embedding-ada-002'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw error;
  }
}

async function generateResponse(question: string, context: string[]) {
  const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
  if (!OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not set');
  }

  try {
    // Check if the context is empty or just contains whitespace
    const isContextEmpty = !context || context.length === 0 || context.every(item => !item || item.trim() === '');
    console.log("Context status - isEmpty:", isContextEmpty, "Context:", context);
    
    // Create the system message with appropriate fallback content
    const systemContent = `You are a helpful assistant for the company website. Answer the question based on the context provided. ${isContextEmpty ? 'Using the following information about our company:' : ''}`;
    
    // Prepare default company information for empty contexts
    const defaultContext = `
      Comprehensive AI Solutions for Business Needs
      Providing enterprise and small business solutions, including AI & ML services, full-stack web development with enterprise security, and data services.

      AI & ML Services
      Strategy & Consulting: AI readiness assessment, custom AI roadmap, industry use case identification.
      ML Model Development: Custom ML models, predictive analytics, NLP (chatbots, sentiment analysis), computer vision.
      AI Integration: AI/ML in CRM/ERP, API development, cloud-based AI (AWS, Azure, GCP).
      Automation: AI-powered process automation, RPA.
      Training & Support: AI tool training, model maintenance & optimization.
      Full-Stack Web Development with Enterprise Security
      Custom Web Development: Responsive websites, AI-powered e-commerce, CMS integration.
      Enterprise Security: SSL/TLS encryption, MFA, security audits, GDPR/HIPAA compliance.
      Hosting & Domain: Secure hosting (AWS, Azure, GCP), DNS management.
      Best Practices: SEO, performance optimization, mobile-first design.
      Data Services
      Engineering: Data pipelines, ETL solutions.
      Analytics & Visualization: BI dashboards (Power BI, Tableau), AI-driven insights.
      Security & Governance: Data encryption, governance frameworks.
      Industry-Specific AI Solutions
      Retail & E-commerce: Personalized recommendations, inventory forecasting.
      Healthcare: AI diagnostics, predictive patient analytics.
      Finance: Fraud detection, AI-based risk assessment.
      Manufacturing: Predictive maintenance, AI-powered quality control.
      Supply Chain: NLP-based data queries, AI-driven scenario planning, demand forecasting, route optimization.
      Emerging AI Technologies
      Generative AI: Custom ChatGPT-like models, AI-generated content.
      AI for IoT: Smart device management, predictive maintenance.
      Blockchain & AI: Secure AI model training, decentralized AI solutions.
      Additional Services
      Project Management: Agile/Scrum-based AI & web development.
      Post-Launch Support: Maintenance, feature updates.
      Training & Workshops: AI, ML, and web development training.
      Why Choose Us?
      Tailored AI Solutions: Customized for your business needs.
      End-to-End Expertise: Strategy to implementation & support.
      Industry Experience: Proven success in retail, healthcare, finance, and more.
      Future-Ready Tech: Generative AI, NLP, computer vision, IoT.
      Enterprise-Grade Security: Compliance & best practices.
      Seamless Integration: Works with existing systems, maximizing ROI.
      Cost-Effective & Scalable: Solutions that grow with your business.
      Dedicated Partnership: Continuous support & collaboration.
      Our Full-Stack Development Process
      Requirement Gathering: Define scope, goals, and tech stack.
      Prototype Development: Functional prototype with agile updates.
      Customer Review & Sign-Off: Feedback-based refinements.
      Code Ownership Transfer: Private GitHub repo & documentation.
      Production Development: Scaling to full enterprise-grade app.
      Post-Launch Support: Maintenance, security updates, new features.
      Benefits of the Prototype-First Approach:
      Transparency & collaboration
      Reduced risk with early feedback
      Full ownership of codebase
      Faster time-to-market

      Ready to Transform Your Business with AI?
      Let's build the future together. Schedule a free consultation today!
      
      Contact Information:
      Email: support@practicalaiml.com.au
      Phone: 0437 443 634
      Business Hours: Monday - Friday: 9:00 AM - 5:00 PM, Saturday - Sunday: Closed
    `;
    
    // Use the provided context if available, otherwise use default content
    const combinedContext = isContextEmpty 
      ? defaultContext 
      : context.join('\n\n');
    
    console.log(`Making OpenAI request with context length: ${combinedContext.length} characters`);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemContent
          },
          {
            role: 'user',
            content: `${isContextEmpty ? defaultContext : `Context information is below.\n---------------------\n${combinedContext}\n---------------------`}\n\nGiven the context information and not prior knowledge, answer the question: ${question}`
          }
        ],
        temperature: 0.5,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error response:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { question } = await req.json();

    if (!question) {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate embedding for the question
    const questionEmbedding = await generateEmbedding(question);

    // Search for relevant document chunks using vector similarity
    const { data: chunks, error: searchError } = await supabase.rpc(
      'match_document_chunks', 
      { 
        query_embedding: questionEmbedding,
        match_threshold: 0.5,
        match_count: 5
      }
    );

    if (searchError) {
      console.error('Search error:', searchError);
      return new Response(
        JSON.stringify({ error: 'Failed to search documents', details: searchError }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Extract context from chunks or use empty array if no chunks found
    const context = chunks && chunks.length > 0 
      ? chunks.map(chunk => chunk.content) 
      : [];
    
    console.log(`Found ${context.length} relevant document chunks`);
    
    // Generate response using context (which might be empty)
    const answer = await generateResponse(question, context);

    // Log the query for analytics
    await supabase
      .from('chat_queries')
      .insert({
        question,
        answer,
        chunks_used: chunks?.length || 0
      });

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
    
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
