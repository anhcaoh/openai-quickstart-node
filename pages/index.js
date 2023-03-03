import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "./index.module.scss";
export default function Home() {
  const [formInfo, setFormInfo] = useState("");
  const [results, setResults] = useState();
  const [fields, setFields] = useState();
  const [committed, setCommit] = useState(false);
  async function onCommit(event) {
    event.preventDefault();
    console.log(fields);
    setCommit(true);
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
      setFields(data.results?.fields);
      console.log(data.results);
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }
  
  const onChangeContentEditable = (e) => {
    const name = e.target.id;
    const index = e.target.getAttribute('index');
    const value = e.target.innerHTML;
    const _newFields = [...fields];
    _newFields[index] = [name, value];
    setFields(_newFields);
  }

  useEffect(() => {
    if(fields?.length) { 
      setTimeout(() =>{
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); 
      });
    }   
  }, [fields, committed]);

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
          {results?.fields?.length && (<>
          <h3>Is <span className={styles.contentEditable}>this</span> correct?</h3>
          <div className={styles.fields}>
            {results?.fields.map((field, index) => {
            const name = field[0];
            const value = field[1];
            return (
            <div key={name + index} id={name+index} 
              className={styles.result}>
              <span className={styles.fieldName}>{name}</span>
              <span id={name} index={index} 
              className={styles.contentEditable}
              onInput={onChangeContentEditable} contentEditable 
              >{value}</span>
            </div>
            )
          })}
          </div>
          <button type="button" className={styles.buttonPrimary} 
          onClick={onCommit}>{committed ? 'Submitted' :'Looks good!' }</button>
          </>
          )}
        </div>
        {committed && (
        <div className={styles.outputContainer}>
          <h3>JSON</h3>
          <code>{JSON.stringify(fields, null, 4)}</code>
        </div>
        )}
      </main>
    </div>
  );
}
