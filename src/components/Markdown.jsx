import { memo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "base",
  flowchart: { useMaxWidth: true, htmlLabels: false },
  themeVariables: {
    fontFamily: "inherit",
    fontSize: "14px",
    background: "transparent",
    primaryColor: "#2f2f34",
    primaryBorderColor: "#8f8f95",
    primaryTextColor: "#f5f5f5",
    lineColor: "#8f8f95",
    clusterBkg: "transparent",
    clusterBorder: "#8f8f95",
  },
});

function Mermaid({ chart }) {
  const containerRef = useRef(null);
  const idRef = useRef(`mermaid-${crypto.randomUUID()}`);

  useEffect(() => {
    let mounted = true;

    async function renderDiagram() {
      try {
        const { svg } = await mermaid.render(idRef.current, chart.trim());
        if (!mounted || !containerRef.current) return;

        containerRef.current.innerHTML = svg;
        const svgEl = containerRef.current.querySelector("svg");
        if (!svgEl) return;

        const MIN_WIDTH = 300;
        const MAX_WIDTH = 900;

        const { width, height } = svgEl.viewBox.baseVal;
        const isTallDiagram = width / height < 1;
        const clampedWidth = Math.min(Math.max(width, MIN_WIDTH), MAX_WIDTH);

        Object.assign(svgEl.style, {
          width: `${isTallDiagram ? width : clampedWidth}px`,
          maxWidth: "100%",
          height: "auto",
          display: "block",
          margin: "0 auto",
        });
      } catch {
        if (containerRef.current) {
          containerRef.current.innerHTML = "<p>Invalid Mermaid diagram.</p>";
        }
      }
    }

    renderDiagram();
    return () => {
      mounted = false;
    };
  }, [chart]);

  return (
    <div className="my-6 flex justify-center overflow-x-auto">
      <div ref={containerRef} />
    </div>
  );
}

const components = {
  h1: ({ children }) => (
    <h1 className="font-bold text-3xl mt-10 mb-3 tracking-[0.03em]">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="font-bold text-2xl mt-8 mb-2 tracking-[0.03em]">
      {children}
    </h2>
  ),
  p: ({ children }) => (
    <p className="my-2 leading-7 tracking-[0.03em]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="list-disc ml-6 my-3 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal ml-6 my-3 space-y-1">{children}</ol>
  ),
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  code({ className, children, ...props }) {
    const raw = Array.isArray(children) ? children.join("") : String(children);

    if (className === "language-mermaid") {
      return <Mermaid chart={raw.trim()} />;
    }

    const isBlock = !!className || raw.includes("\n");

    if (isBlock) {
      const codeString = raw.replace(/\s+$/, "");
      const language = className?.replace("language-", "") || "";

      return (
        <pre className="my-4 p-4 bg-[#1e1e24] text-[#f5f5f5] rounded-lg overflow-x-auto text-sm leading-relaxed font-mono whitespace-pre">
          <code className={language ? `language-${language}` : ""}>
            {codeString}
          </code>
        </pre>
      );
    }

    return (
      <code
        className="bg-[var(--color-bg-secondary)] px-1.5 py-0.5 rounded"
        {...props}
      >
        {raw.trim()}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
};

function MarkdownRenderer({ children }) {
  const markdown = typeof children === "string" ? children : String(children);
  return <ReactMarkdown components={components}>{markdown}</ReactMarkdown>;
}

export default memo(MarkdownRenderer);
