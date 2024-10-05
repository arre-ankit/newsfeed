import { Hono } from 'hono'
import { cors } from 'hono/cors'

type Bindings = {
  [key in keyof CloudflareBindings]: CloudflareBindings[key]
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(
  '*', 
  cors({
    origin: '*',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type']
  })
);

app.get('/', async (c) => {
  return c.json({ message: 'Hello, World!' })
})

let audioAnalysisResult = '';

app.get('/analysis', async (c) => {

  const articles = [
    {
      "id": "1",
      "title": "External Affairs Minister S Jaishankar to Visit Pakistan for SCO Meeting",
      "content": "External Affairs Minister S Jaishankar will represent India at the Shanghai Cooperation Organisation (SCO) summit in Pakistan on October 15-16. Pakistan, holding the rotating chair of the Council of Heads of Government, invited PM Modi, but due to strained relations, Jaishankar will attend instead. Despite the hostile bilateral relations between India and Pakistan, the SCO remains one of the few forums where both nations engage. The SCO is an international organization aiming to counterbalance NATO, with member states working cooperatively on non-bilateral issues."
    },
    {
      "id": "2",
      "title": "ReMarkable's Paper Pro Brings a Color Screen to Its Focus-Friendly Tablet Lineup",
      "content": "The ReMarkable Paper Pro is the latest iteration in ReMarkable's distraction-free tablet lineup, featuring a color e-ink display and larger 11.8-inch screen. This Pro model improves upon the ReMarkable 2 with color and a front light system, designed to better mimic the feel of color on paper. It offers a distraction-free digital writing experience, with features like note-taking, PDF markup, and stylus input. At a higher price starting at $579, the Paper Pro aims to provide a superior writing and reading experience while maintaining its focus-first ethos."
    }
  ]
  

  let summaries = [];
  
  for (let article of articles) {

    const summary = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { 
          role: "system", 
          content: `You are an AI language analysis assistant. Your task is to analyze news articles and provide a summary in a conversational style and fun engaging way. 
            Use a friendly and slightly humorous tone to engage the lisners.
            

            Remove any emojis and return the result

            Instructions for output:
            - Ensure the output is properly structured without escape characters or unnecessary formatting.
            - The summary should be concise and engaging.
            - Use a conversational, friendly tone.
            - Avoid using emojis.
            - No \n" '\n' +" or \n" '\n' +"
            - Just simple sentences.
            - Use a friendly and slightly humorous tone to engage the lisners.
            - The summary should be concise and engaging and humorous.
            - Add umm,hmm,etc based on the context to feel like real human conversation.
          `
        },
        { 
          role: "user", 
          content: `Article content: ${article.content}`
        }
      ]
    });

    console.log(summary);
    console.log(typeof(summary));

    summaries.push({
      articleId: article.id,
      summary: summary.response
    });
    

    console.log("Summary for article", article.id, ":", summary);
    console.log("Summaries so far:", summaries);

    // Add a delay of 1 second to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return c.json({
    summaries,
  });
});


export default app