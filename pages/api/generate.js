import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const story = req.body.story || '';
  if (story.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid prompt",
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(story),
      temperature: 0.7,
      max_tokens: 2048,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(story) {
  const capitalizedStory =
    story[0].toUpperCase() + story.slice(1).toLowerCase();
  return `Write me a creative story using this input.

Story: Write me a humorous story
Output: Once upon a time, in a far-off kingdom, there lived a young prince who had an unusual obsession - collecting socks. He had every type of sock imaginable - from plain white cotton to fancy, sequined numbers. His royal sock collection was the talk of the land and many people came from far and wide to see it.

One day, the prince heard of a magical, one-of-a-kind sock that was said to bring good luck to whoever owned it. The prince was determined to add this sock to his collection, so he set off on a journey to find it.

After many days of traveling, the prince finally came across a wise old wizard who claimed to know the whereabouts of the magical sock. But the wizard had a condition - the prince had to perform three tasks before he would reveal the location of the sock.

The first task was to climb a tall, treacherous mountain and bring back a feather from the top. The prince set off early the next day and after many hours of climbing, he finally reached the summit. As he reached for the feather, he slipped and fell, tumbling all the way down the mountain.

The second task was to swim across a lake filled with giant, man-eating fish and bring back a pearl from the bottom. The prince set off early the next day and after many hours of swimming, he finally reached the bottom of the lake. As he reached for the pearl, he was attacked by a giant fish and barely made it back to shore.

The third task was to outsmart a group of bandits and bring back their treasure. The prince set off early the next day and after many hours of planning, he finally succeeded in outsmarting the bandits and making off with their treasure.

Exhausted but victorious, the prince returned to the wizard with the feather, pearl, and treasure. The wizard was impressed and revealed the location of the magical sock - it was in the prince's own kingdom all along, hidden in a secret compartment in his own sock collection.

The prince was overjoyed to finally have the magical sock in his collection and he lived happily ever after. But he never went on another quest again, as he realized the true value of what he already had.

The end.
Story: Write me a serious story
Output: There was once a young woman named Sarah who lived in a small village at the foot of a mountain. She had always dreamed of climbing the mountain and seeing what lay beyond, but her father had always told her it was too dangerous.

One day, Sarah decided to take matters into her own hands and set out on her journey. She packed a small bag with some food and water, and set off early in the morning.

The climb was harder than she had imagined. The path was steep and rocky, and she had to scramble over boulders and clamber up narrow ledges. But she kept going, determined to reach the top.

As she climbed higher and higher, the air grew colder and the wind began to howl. But Sarah kept going, her eyes fixed on the summit above.

Finally, after hours of climbing, she reached the top. The view was breathtaking. She could see for miles and miles, and the whole world seemed to lay out before her. She felt like she was on top of the world.

But as she was taking in the view, a storm rolled in. The winds grew stronger, and soon Sarah was fighting to stay on her feet. She knew she had to get back down the mountain as quickly as possible.

With the storm raging around her, Sarah began to make her way down. The descent was even harder than the climb up, and she slipped and stumbled many times. But she kept going, her eyes fixed on the village below.

Finally, after hours of battling the storm, Sarah reached the bottom. She was cold, wet, and bruised, but she was alive. She had conquered the mountain and seen the world beyond.

As she walked back to her village, Sarah realized that sometimes the greatest accomplishments come with the greatest risks. She had taken a chance and it had paid off, and she knew that she would always be proud of what she had achieved.
Story: ${capitalizedStory}
Names:`;
}
