import { useEffect, useState, useRef } from "react";
import * as esbuild from "esbuild-wasm";
import ReactDOM from "react-dom";
import { unpkgPathPlugin } from "./unpkg-path-plugin";

const App = () => {
  const [input, setInput] = useState("");
  const [code, setCode] = useState("");
  const ref = useRef<any>();

  const startService = async () => {
    ref.current = await esbuild.startService({
      worker: true,
      wasmURL: "/esbuild.wasm",
    });
  };

  useEffect(() => {
    startService();
  }, []);

  const onClick = async () => {
    if (!ref) {
      return;
    }
    const result = await ref.current.build({
      entryPoints: ["index.js"],
      bundle: true,
      write: false,
      plugins: [unpkgPathPlugin()],
    });
    console.log(result);
    setCode(result.outputFiles[0].text);
  };

  return (
    <div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
      ></textarea>
      <div>
        <button onClick={onClick}>Submit</button>
      </div>
      <pre style={{ color: "black" }}>{code}</pre>
    </div>
  );
};

ReactDOM.render(<App />, document.querySelector("#root"));
