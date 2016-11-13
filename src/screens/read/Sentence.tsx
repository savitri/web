import * as React from "react";
import { observer } from "mobx-react";

import { Line } from "./Line";

interface SentenceProps {
    sentence: string[];
    sectionRunningNo: number;
    sentenceNo: number;
}

interface InjectedProps extends SentenceProps { }

@observer
export class Sentence extends React.Component<SentenceProps, {}> {
    get linesWithBreaks() {

        const sentence = this.props.sentence;

        const sentenceLength = sentence.length;

        return sentence.map((line, lineIndex) => {

            if (lineIndex < sentenceLength - 1) {

                return React.Children.toArray([
                    <Line line={line} key={lineIndex} />,
                    <br />
                ]);
            }

            return <Line line={line} key={lineIndex} />;
        });
    }

    get reference() {

        return `||${this.props.sectionRunningNo}.${this.props.sentenceNo}||`;
    }

    render() {

        return (
            <div className="row" style={{ display: "flex", marginBottom: -15 }}>
                <p className="col-lg-10">{this.linesWithBreaks}</p>
                <div className="col-lg-2" style={{ alignSelf: "flex-end", marginBottom: 16 }}>{this.reference}</div>
            </div>
        );
    }
}
