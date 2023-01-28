import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [storyInput, setStoryInput] = useState("");
  const [result, setResult] = useState();

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story: storyInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setStoryInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>Story Generator</title>
        <link rel="icon" href="/halcyonic.png" />
      </Head>

      <main className={styles.main}>
        <img src="/halcyonic.png" className={styles.icon} />
        <h3>Tell me a Story!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="story"
            placeholder="Enter a Story Prompt here!"
            value={storyInput}
            onChange={(e) => setStoryInput(e.target.value)}
          />
          <input type="submit" value="Generate Story" />
        </form>
        <div className={styles.result}>{result}</div>
      </main>
    </div>
  );
}
