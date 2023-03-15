import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import styles from "./index.module.scss";
export default function Home() {
  const [formInfo, setFormInfo] = useState("");
  const [results, setResults] = useState();
  const [json, setJson] = useState(null);
  const [committed, setCommit] = useState(false);
  async function onCommit(event) {
    event.preventDefault();
    setCommit(true);
    console.log(json);
  }
  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: formInfo }),
      });
      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResults(data.results);
      setJson(data.results);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  
  const onChangeContentEditable = (e) => {
    const name = e.target.id;
    const value = e.target.innerHTML;
    setJson({
      ...results,
      [name]:value
    });
  }

  useEffect(() => {
    if(results) { 
      setTimeout(() =>{
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); 
      });
    }   
  }, [results]);

  return (
    <div>
      <Head>
        <title>Formless powered by GPT-3.5</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <h3> 
          <img src="/dog.png" alt="A dog" 
          className={styles.icon} />
          Leave your feedbacks with contact info. We'll do the rest.
        </h3>
      
        <form onSubmit={onSubmit}>
          <label htmlFor="fields" className={styles.instructions}>
            <div>Your full name, e-mail address, phone number, and feedbacks.</div>
            <div>Seperate fields by comma or enter into the new lines.</div>
          </label>
          <textarea
            type="text"
            autoFocus
            name="fields"
            rows={5}
            placeholder="e.g. John Doe, email@address.com, 6780291543, It is very user friendly!"
            value={formInfo}
            onChange={(e) => setFormInfo(e.target.value)}
          />
          <button type="submit" className={styles.buttonSubmit}>Feeling motivated!</button>
        </form>
        <div className={styles.typingContainer} arial-label={results?.text}>
          {results && (<>
          <h3>Is <span className={styles.contentEditable}>this</span> correct?</h3>
          <div className={styles.fields}>
            {Object.entries(results)?.map((entry, index) => {
            const name = entry[0],
            value = entry[1];
            return (
            <div key={name + index } id={name + index} 
              className={styles.result}>
              <span className={styles.fieldName}>{name}</span>
              <span id={name}
              className={styles.contentEditable}
              onInput={onChangeContentEditable} contentEditable 
              >{value}</span>
            </div>
            )
          })}
          </div>
          <button type="button" className={styles.buttonPrimary} 
          disabled={committed}
          onClick={onCommit}>{committed ? 'Submitted' :'Looks good!' }</button>
          </>
          )}
        </div>
        {json && (
        <div className={styles.outputContainer}>
          <h3>JSON</h3>
          <code>{JSON.stringify(json, null, 4)}</code>
        </div>
        )}
      </main>
    </div>
  );
}
