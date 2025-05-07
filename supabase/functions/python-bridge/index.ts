
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

// This function acts as a bridge between your React app and a Python backend
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { endpoint, data } = await req.json();
    
    // Replace with your Python backend URL when you have it deployed
    const PYTHON_API_URL = Deno.env.get('PYTHON_API_URL') || "https://your-python-api.example.com";
    
    // Forward the request to your Python backend
    const response = await fetch(`${PYTHON_API_URL}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('PYTHON_API_KEY') || ''}`
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`Python API responded with status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log("Successfully processed data with Python backend");

    // Return the result from Python to your React app
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in Python bridge function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
