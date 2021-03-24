import React, { FC, useEffect, useRef, useState } from "react";
import useTyping from "react-typing-game-hook";

const TypeInput: FC<{ text: string }> = ({ text }) => {
    const lyricsContainerRef = useRef<HTMLDivElement>(null)

    const [duration, setDuration] = useState(0);
    const [typingInput, setTypingInput] = useState("");
    const [typedWrong, setTypeWrong] = useState(false);
    const inputRef = useRef<any>(null);

    const {
        states: {
            charsState,
            currIndex,
            phase,
            correctChar,
            errorChar,
            startTime,
            endTime
        },
        actions: { insertTyping, resetTyping, getDuration }
    } = useTyping(text, {
        skipCurrentWordOnSpace: false
    });

    const [currWordPos, setCurrWordPos] = useState([-1, -1]);

    //checks whether the word is correct while the user is typing
    useEffect(() => {
        setTypeWrong((prev: boolean): boolean => {
            let hasError = false;
            for (let i = 0; i < typingInput.length; i++) {
                let char = typingInput[i];
                let correctChar = text[currWordPos[0] + i];
                let diff = char !== correctChar;
                if (diff) {
                    hasError = true;
                    break;
                }
            }
            if (hasError !== prev) {
                return !prev;
            } else {
                return prev;
            }
        });
    }, [typingInput, currWordPos, text]);

    // Set the start and end index of the next word
    useEffect(() => {
        let tempCurrIndex = text[currIndex] === " " || text[currIndex] === "\n" ? currIndex + 1 : currIndex;
        if (tempCurrIndex === -1) {
            tempCurrIndex = 0
        }
        let startIndex = Math.max(text.lastIndexOf(" ", tempCurrIndex), text.lastIndexOf("\n", tempCurrIndex))
        startIndex = startIndex < 0 ? 0 : startIndex + 1;
        
        let nextSpace = text.indexOf(" ", tempCurrIndex)
        if (nextSpace === -1) {
            nextSpace = text.length
        }
        let nextBreak = text.indexOf("\n", tempCurrIndex)
        if (nextBreak === -1) {
            nextBreak = text.length
        }
        const nextSep = Math.min(nextSpace, nextBreak);
        const endIndex = nextSep - 1;

        setCurrWordPos((oldcurrWordPos) => {
            if (startIndex !== oldcurrWordPos[0] || endIndex !== oldcurrWordPos[1]) {
                if (text[startIndex - 1] === "\n") {
                    lyricsContainerRef.current?.scrollBy(0, 28)
                }
                return [startIndex, endIndex];
            }
            return oldcurrWordPos;
        });
    }, [currIndex, text]);

    //Reset
    const reset = () => {
        resetTyping();
        // insertTyping();
        setTypingInput("");
    };

    //Submit inputted word
    const submitWord = () => {
        for (let i = currWordPos[0]; i <= currWordPos[1]; i++) {
            let index = i - currIndex - 1;
            if (index > typingInput.length - 1) {
                insertTyping(' ');
            } else {
                insertTyping(typingInput[index]);
            }
        }
        // if (lyricsContainerRef.current?.scrollTop)
        insertTyping(" ");
        setTypingInput("");
        setTypeWrong(false);
    };

    // set WPM
    useEffect(() => {
        if (phase === 2 && endTime && startTime) {
            setDuration(Math.floor((endTime - startTime) / 1000));
            setCurrWordPos([-1, -1]);
        } else {
            setDuration(0);
        }
    }, [phase, startTime, endTime]);

    useEffect(() => {
        const timerId = setInterval(() => {
            setDuration(parseFloat((getDuration() / 1000).toFixed(2)))
        }, 100);
        return () => clearInterval(timerId);
    }, [phase])
    return (
        <div>

            <div
                className={`text-xl select-none  `}
                onClick={() => {
                    inputRef.current.focus();
                }}
            >
                <div ref={lyricsContainerRef} className="border-2 border-purple-500 p-4 rounded-lg  tracking-wide mb-2 h-48 overflow-y-scroll overflow-x-hidden">
                    {text.split("").map((letter, index) => {
                        let shouldHightlight =
                            index >= currWordPos[0] && index <= currWordPos[1];
                        let state = charsState[index];
                        let styling = "text-red-500";

                        const INIT = 0
                        const CORRECT = 1
                        const WRONG = 2

                        if (shouldHightlight) {
                            styling = "text-black bg-purple-200";
                        } else if (state === INIT) {
                            styling = "text-gray-700";
                        } else if (state === CORRECT) {
                            styling = "text-green-400";
                        } else if (state === WRONG) {

                        }

                        if (letter === '\n') {
                            return <br key={letter + index} />
                        }
                        return (
                            <span key={letter + index} className={`${styling}`}>
                                {letter}
                            </span>
                        );
                    })}
                </div>
                <div className="mb-2">
                    <input
                        type="text"
                        ref={inputRef}
                        onKeyDown={(e) => {
                            if (e.key === "Escape") {
                                e.preventDefault();
                                reset();
                            } else if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                submitWord();
                            }
                        }}
                        onChange={(e) => {
                            setTypingInput(e.target.value);
                        }}
                        value={typingInput}
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        className={`focus:outline-none bg-black text-gray-400 border-b-2 p-1 w-full border-${
                            !typingInput.length ? "gray" : typedWrong ? "red" : "green"
                            }-500`}
                        placeholder={
                            phase !== 1
                                ? "Type here... (Press enter or space to submit word)"
                                : ""
                        }
                    />
                </div>
            </div>
            <div className="flex justify-between">
                <span>Time: {duration}s</span>
                <button onClick={() => reset()} >Reset</button>
            </div>
            <p className="text-sm">
                {phase === 2 && startTime && endTime ? (
                    <ul>
                        <li className="text-green-500 mr-4">
                            WPM: {Math.round(((60 / duration) * correctChar) / 5)}
                        </li>
                        <li className="text-blue-500 mr-4">
                            Accuracy: {((correctChar / text.length) * 100).toFixed(2)}%
                        </li>
                        <li className="text-yellow-500 mr-4">Duration: {duration}s</li>
                        {/* <li className="mr-4"> Current Index: {currIndex}</li> */}
                        <li className="mr-4"> Correct Characters: {correctChar}</li>
                        <li className="mr-4"> Error Characters: {errorChar}</li>
                    </ul>
                ) : null}


            </p>

            {/* Debug */}
            {true &&
                <pre>
                    {JSON.stringify({ currWordPos }, null, 2)}
                    {JSON.stringify({
                        charsState,
                        currIndex,
                        phase,
                        correctChar,
                        errorChar,
                        startTime,
                        endTime
                    }, null, 2)}
                </pre>
            }
        </div>

    );
};

export default TypeInput;
