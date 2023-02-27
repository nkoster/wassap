import React, { Text, StyleSheet, View } from 'react-native'
import Clipper from './Clipper'

function TheAnswer({ data }) {

  console.log('DATA', data)

  const regexCode = /`([\s\S]+?)`/g
  const codes = data.match(regexCode)
  const regexCodeBlock = /```([\s\S]+?)```/g
  const codeBlocks = data.match(regexCodeBlock)
  const regexBold = /\*\*([\s\S]+?)\*\*/g
  const bolds = data.match(regexBold)

  // console.log('CODE', codeBlocks)

  return (
    <Text>
      {data.split(regexCodeBlock).map((item, index) => {
        if (codeBlocks && codeBlocks.includes('```' + item + '```')) {
          const code = item.split('\n').slice(1).join('\n').trim()
          console.log('CODE BLOCK', code)
          return (
            <View key={index} style={styles.codeBlock}>
              <Text style={styles.codeBlockText}>
                {code}
              </Text>
              <Clipper data={code} color={'#666'} />
            </View>
          )
        } else {
          if (item.length > 0) {
            return <Text key={index}>{item.split(regexCode).map((item, index) => {
              if (codes && codes.includes('`' + item + '`')) {
                console.log('CODEE', item)
                return (
                  <Text key={index} style={{ fontFamily: 'Courier New', fontWeight: 'bold' }}>
                    {item}
                  </Text>
                )
              } else {
                return <Text key={index}>{item.split(regexBold).map((item, index) => {
                  if (bolds && bolds.includes('**' + item + '**')) {
                    console.log('BOLD', item)
                    return (
                      <Text key={index} style={{ fontWeight: 'bold' }}>
                        {item}
                      </Text>
                    )
                  } else {
                    return <Text key={index}>{item}</Text>
                  }
                } )}</Text>
              }
            })}</Text>
          }
        }
      })}
    </Text>
  )
}

export default TheAnswer

const styles = StyleSheet.create({
  codeBlock: {
    backgroundColor: '#f8f8f8',
    borderRadius: 3,
    width: '100%',
    padding: 8,
    paddingRight: 30,
  },
  codeBlockText: {
    fontFamily: 'Courier New',
    fontWeight: 'bold',
  }
})
