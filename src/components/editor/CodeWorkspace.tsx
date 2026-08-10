"use client";

import { CHALLENGE_LIST, EDITOR_LANGUAGES } from "@/constants/sessionConfig";
import { useState, useCallback, useEffect, useRef } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { AlertCircle, FileText, Play, Radio, Sparkles, Terminal } from "lucide-react";
import dynamic from "next/dynamic";
const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import Image from "next/image";

type SupportedLanguage = "javascript" | "python" | "java";

interface CodeWorkspaceProps {
  /** Stream call ID used as the shared document key for real-time sync */
  callId?: string;
}

// Debounce helper — delays execution until `ms` ms have elapsed since the last call
function useDebouncedCallback<T extends unknown[]>(
  fn: (...args: T) => void,
  ms: number
) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  return useCallback(
    (...args: T) => {
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => fn(...args), ms);
    },
    [fn, ms]
  );
}

// Coding challenges workspace — editor content is synced in real time across
// all participants in the same call via Convex live queries when `callId` is provided.
export function CodeWorkspace({ callId }: CodeWorkspaceProps) {
  const { user: clerkUser } = useUser();

  const [currentChallenge, setCurrentChallenge] = useState(CHALLENGE_LIST[0]);
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(
    EDITOR_LANGUAGES[0].id
  );
  const [codeContent, setCodeContent] = useState(
    currentChallenge.templates[EDITOR_LANGUAGES[0].id]
  );
  
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState("");

  // Track whether the most recent content change originated locally so we can
  // skip applying our own echo back from Convex (prevents cursor jumping).
  const lastLocalWriteBy = useRef<string | null>(null);

  // --- Real-time sync via Convex ---
  const remoteState = useQuery(
    api.codeSync.getEditorState,
    callId ? { callId } : "skip"
  );
  const upsertEditorState = useMutation(api.codeSync.upsertEditorState);
  const executeCode = useAction(api.codeExecution.executeCode);

  // Apply incoming remote state changes.
  // Skip if `lastUpdatedBy` matches our own Clerk ID — that's our own echo.
  useEffect(() => {
    if (!remoteState) return;

    const isOwnEcho = remoteState.lastUpdatedBy === clerkUser?.id;
    if (isOwnEcho) return;

    // Sync challenge selection
    const remoteChallenge = CHALLENGE_LIST.find(
      (c) => c.id === remoteState.challengeId
    );
    if (remoteChallenge && remoteChallenge.id !== currentChallenge.id) {
      setCurrentChallenge(remoteChallenge);
    }

    // Sync language selection
    if (
      remoteState.language !== currentLanguage &&
      EDITOR_LANGUAGES.some((l) => l.id === remoteState.language)
    ) {
      setCurrentLanguage(remoteState.language as SupportedLanguage);
    }

    // Sync editor content
    setCodeContent(remoteState.content);

    // Sync execution output
    if (remoteState.executionOutput !== undefined) {
      setOutput(remoteState.executionOutput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteState]);

  // Debounced write to Convex — fires 300 ms after the user stops typing
  const pushToConvex = useDebouncedCallback(
    useCallback(
      (content: string, language: string, challengeId: string) => {
        if (!callId || !clerkUser) return;
        lastLocalWriteBy.current = clerkUser.id;
        upsertEditorState({ callId, content, language, challengeId }).catch(
          (err) => console.error("Editor sync write failed:", err)
        );
      },
      [callId, clerkUser, upsertEditorState]
    ),
    300
  );

  const switchChallenge = useCallback(
    (challengeId: string) => {
      const found = CHALLENGE_LIST.find((c) => c.id === challengeId);
      if (found) {
        setCurrentChallenge(found);
        const template = found.templates[currentLanguage];
        setCodeContent(template);
        pushToConvex(template, currentLanguage, found.id);
      }
    },
    [currentLanguage, pushToConvex]
  );

  const switchLanguage = useCallback(
    (langId: SupportedLanguage) => {
      setCurrentLanguage(langId);
      const template = currentChallenge.templates[langId];
      setCodeContent(template);
      pushToConvex(template, langId, currentChallenge.id);
    },
    [currentChallenge, pushToConvex]
  );

  const handleEditorChange = useCallback(
    (val: string | undefined) => {
      const newContent = val || "";
      setCodeContent(newContent);
      pushToConvex(newContent, currentLanguage, currentChallenge.id);
    },
    [currentLanguage, currentChallenge, pushToConvex]
  );

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput("Executing code...");
    try {
      const result = await executeCode({
        language: currentLanguage,
        code: codeContent,
      });

      let newOutput = "";
      if (result.run && result.run.output) {
        newOutput = result.run.output;
      } else if (result.compile && result.compile.output) {
        newOutput = `Compilation Error:\n${result.compile.output}`;
      } else {
        newOutput = "Program exited with no output.";
      }

      setOutput(newOutput);

      // Sync the execution output to the room
      if (callId && clerkUser) {
        upsertEditorState({
          callId,
          content: codeContent,
          language: currentLanguage,
          challengeId: currentChallenge.id,
          executionOutput: newOutput,
        }).catch((err) => console.error("Failed to sync execution output:", err));
      }
    } catch (err: any) {
      const errOutput = `Error: ${err.message || "Failed to execute code"}`;
      setOutput(errOutput);
      toast.error("Execution failed");
      
      if (callId && clerkUser) {
        upsertEditorState({
          callId,
          content: codeContent,
          language: currentLanguage,
          challengeId: currentChallenge.id,
          executionOutput: errOutput,
        }).catch(console.error);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const isLive = !!callId;

  return (
    <ResizablePanelGroup
      direction="vertical"
      className="min-h-[calc(100vh-4rem-1px)] bg-background"
    >
      <ResizablePanel defaultSize={50} minSize={30}>
        <ScrollArea className="h-full border-b">
          <div className="p-5 space-y-6 max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {currentChallenge.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Read instructions carefully and construct your function below.
                </p>
              </div>

              <div className="flex items-center gap-2">
                {/* Live sync indicator */}
                {isLive && (
                  <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    <Radio className="h-3 w-3 animate-pulse" />
                    Live
                  </div>
                )}

                <Select
                  value={currentChallenge.id}
                  onValueChange={switchChallenge}
                >
                  <SelectTrigger className="w-[170px] h-9 text-xs">
                    <SelectValue placeholder="Select challenge" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHALLENGE_LIST.map((prob) => (
                      <SelectItem key={prob.id} value={prob.id} className="text-xs cursor-pointer">
                        {prob.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={currentLanguage} onValueChange={switchLanguage}>
                  <SelectTrigger className="w-[140px] h-9 text-xs">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        <Image
                          src={`/${currentLanguage}.png`}
                          alt={currentLanguage}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                        <span className="capitalize">{currentLanguage}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {EDITOR_LANGUAGES.map((lang) => (
                      <SelectItem key={lang.id} value={lang.id} className="text-xs cursor-pointer">
                        <div className="flex items-center gap-2">
                          <Image
                            src={`/${lang.id}.png`}
                            alt={lang.label}
                            width={16}
                            height={16}
                            className="object-contain"
                          />
                          <span>{lang.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 bg-muted/20 border-b">
                <FileText className="h-4 w-4 text-primary" />
                <CardTitle className="text-sm font-semibold">Problem Statement</CardTitle>
              </CardHeader>
              <CardContent className="text-sm leading-relaxed p-4 prose prose-sm dark:prose-invert">
                <p className="whitespace-pre-line text-foreground/90 font-sans">
                  {currentChallenge.instructions}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/80 shadow-sm">
              <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 bg-muted/20 border-b">
                <Sparkles className="h-4 w-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold">Test Cases</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {currentChallenge.testCases.map((tc, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <p className="text-xs font-semibold text-muted-foreground">
                      Example {idx + 1}:
                    </p>
                    <pre className="bg-muted/50 border p-3 rounded-lg text-xs font-mono select-all overflow-x-auto">
                      <div>Input: {tc.input}</div>
                      <div>Output: {tc.output}</div>
                      {tc.explanation && (
                        <div className="pt-2 mt-2 border-t border-dashed text-muted-foreground">
                          Explanation: {tc.explanation}
                        </div>
                      )}
                    </pre>
                  </div>
                ))}
              </CardContent>
            </Card>

            {currentChallenge.limits && (
              <Card className="border border-border/80 shadow-sm">
                <CardHeader className="flex flex-row items-center gap-2 py-3 px-4 bg-muted/20 border-b">
                  <AlertCircle className="h-4 w-4 text-blue-500" />
                  <CardTitle className="text-sm font-semibold">Constraints</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {currentChallenge.limits.map((rule, idx) => (
                      <li key={idx} className="marker:text-primary">
                        {rule}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle className="bg-border/60 hover:bg-primary/50 transition-colors" />

      <ResizablePanel defaultSize={50} minSize={30}>
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={70} minSize={30}>
            <div className="h-full w-full relative flex flex-col">
              <div className="flex justify-end p-2 bg-muted/20 border-b">
                <Button 
                  size="sm" 
                  onClick={handleRunCode} 
                  disabled={isRunning}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? "Running..." : "Run Code"}
                </Button>
              </div>
              <div className="flex-1">
                {/* Use `language` (not `defaultLanguage`) so Monaco re-highlights when
                    the user switches languages from the dropdown. Track the current
                    value explicitly so the editor stays in sync. */}
                <Editor
                  height="100%"
                  language={currentLanguage}
                  theme="vs-dark"
                  value={codeContent}
                  onChange={handleEditorChange}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 12, bottom: 12 },
                    wordWrap: "on",
                    wrappingIndent: "indent",
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          </ResizablePanel>
          
          <ResizableHandle withHandle className="bg-border/60 hover:bg-primary/50 transition-colors" />
          
          <ResizablePanel defaultSize={30} minSize={20}>
            <div className="h-full flex flex-col bg-[#1e1e1e] border-t border-[#333]">
              <div className="flex items-center px-4 py-2 border-b border-[#333] bg-[#252526]">
                <Terminal className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Terminal Output
                </span>
              </div>
              <ScrollArea className="flex-1 p-4">
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                  {output || "Output will appear here..."}
                </pre>
                <ScrollBar />
              </ScrollArea>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

export default CodeWorkspace;
