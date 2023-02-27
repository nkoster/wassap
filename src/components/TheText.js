import React from 'react';
import { Text } from 'react-native';

const codeString = "Dit is een voorbeeld van een `code block` dat is ingesloten door backticks.";

const regex = /`([^`]+)`/g;
const codeBlocks = codeString.match(regex);

const boldPreformattedStyle = {
  fontFamily: 'monospace',
  fontWeight: 'bold',
  backgroundColor: '#f2f2f2',
  padding: 8,
};

const TheTest = () => {
  return (
    <Text>
      {codeString.split(regex).map((item, index) => {
        if (codeBlocks && codeBlocks.includes('`' + item + '`')) {
          return (
            <Text key={index} style={boldPreformattedStyle}>
              {item}
            </Text>
          );
        } else {
          return <Text key={index}>{item}</Text>;
        }
      })}
    </Text>
  );
};

export default TheTest;
